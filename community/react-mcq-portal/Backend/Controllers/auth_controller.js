const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require(`../Models/user_Model`);
const catchAsync = require(`../utils/catchAsync`);
const AppError = require(`../utils/appErrors`);
const { promisify } = require('util');
const sendEmail = require(`../utils/email`);

// helper to create token
const signToken = (id, sessionId) => {
    return jwt.sign({ id, session: sessionId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// send token + user
const createSendToken = async (user, statusCode, res) => {
    const sessionId = user.currentSession;
    const token = signToken(user._id, sessionId);

    // remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// Create User
exports.createUser = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword, role } = req.body;
    if(role === 'admin'){
        return next("You don't have permission to create an admin!");
    }
    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword,
        role
    });

    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        data: {
        user: newUser
        }
    });
});

// Login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. check email & password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2. find user & include password
    const user = await User.findOne({ email }).select('+password +currentSession');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3. create a new session id and store it on the user to enforce single device
    const sessionId = crypto.randomBytes(16).toString('hex');
    user.currentSession = sessionId;
    // save without running full validation (safe if no schema changes needed)
    await user.save({ validateBeforeSave: false });

    // 4. send token
    await createSendToken(user, 200, res);
});

// protect routes
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please login to get access to this route', 401));
    }

    // verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // find user
    const currentUser = await User.findById(decoded.id).select('+password +currentSession');
    if (!currentUser) {
        return next(new AppError('User no longer exists', 401));
    }

    // check that session in token matches the server-side current session
    if (!decoded.session || currentUser.currentSession !== decoded.session) {
      return next(new AppError('Session invalid or expired (login detected from another device)', 401));
    }

    //check whether the user has chaneged their password currently and someone's trying to login with previous token
    if(currentUser.passwordChangedAfter(decoded.iat)){
        return next(new AppError('User has changed their password recently. Please login again', 401));
    };

    req.user = currentUser;
    next();
});

// Logout
exports.logout = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.currentSession = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ 
    status: 'success', 
    message: 'Logged out' 
  });
});

// Logout-Beacon
exports.logoutBeacon = catchAsync(async (req, res, next) => {
  const token = req.body?.token;
  if (!token) return res.status(200).json({ status: 'success', message: 'No token' });

  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(200).json({ status: 'success', message: 'Token invalid/expired' });
  }

  const user = await User.findById(decoded.id).select('+currentSession');
  if (!user) return res.status(200).json({ status: 'success', message: 'User not found' });

  if (decoded.session && user.currentSession === decoded.session) {
    user.currentSession = undefined;
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({ status: 'success', message: 'Logged out (beacon)' });
});

// restrict roles
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }
    
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            resetURL,
        });

        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent to email!',
        });
    } catch (err) {
        // If sending email fails, undo the changes to the user document
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        // Pass the AppError from sendEmail (or a new one) to the global handler
        return next(err); 
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired and there is a user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.currentSession = undefined;
    await user.save();

    // 3) Return success response without logging in
    res.status(200).json({
        status: 'success',
        message: 'Password has been reset successfully! Please login with your new password.'
    });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //get user from collection
    const user = await User.findById(req.user.id).select('+password');
    //we will not write an if statement whether user found or not bcz it is comming from protect middleware, so if user was not there it would have given an error long before

    //Check if posted Current password is correct
    if(!(await user.correctPassword(req.body.currentPassword, user.password))){
        return next(new AppError('Incorrect current password', 401));
    }

    // if so update the password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    //user.findByIdAndUpdate(password); //you should never use it here because it won't trigger the document middlewares.

    //log the user in, send JWT
    createSendToken(user, 200, res);
});