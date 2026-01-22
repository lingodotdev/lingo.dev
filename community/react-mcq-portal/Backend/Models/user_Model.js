const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User must have a name'] 
    },
    email: { 
        type: String, 
        unique: true, 
        required: [true, 'User must have an email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address'] 
    },
    password:{
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8,
        select: false
    },
    confirmPassword:{
        type: String,
        required: [true, 'User must confirm password'],
        //this only works for "create or save" and not for update
        validate:{
            validator: function(val){
                return val === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'student' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    currentSession: {
        type: String,
        default: undefined
    },
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

//method to check if the user has changed their password after a JWT was issued
userSchema.methods.passwordChangedAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        //console.log(passwordChangedTimestamp, JWTTimestamp)
        return JWTTimestamp < passwordChangedTimestamp;
    }
    return false;
}

// Compare entered password with hashed one
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Token expires in 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken; // Return the un-hashed token to send via email
};

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew){
        return next();
    }
    
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

module.exports = mongoose.model('User', userSchema);