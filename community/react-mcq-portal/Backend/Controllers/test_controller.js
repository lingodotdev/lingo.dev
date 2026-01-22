const AppError = require(`../utils/appErrors`);
const catchAsync = require(`../utils/catchAsync`);
const Test = require(`../Models/test_model`);
const { toUTCFromISTInput, getEndOfISTDay, getISTDayBounds, formatToIST } = require(`../utils/timeUtils`);
const { validateTestInput } = require(`../utils/validateTest`);
const Attempt = require(`../Models/attempt_model`);
const SimplePaginationFilteration = require(`../utils/pagging_filtering`);

// CREATE TEST (admin/teacher)
exports.createTest = catchAsync(async (req, res, next) => {
  try {
    validateTestInput(req.body);
  } catch (err) {
    return next(err);
  }

  const start = toUTCFromISTInput(req.body.startTime);
  if (start < new Date()) {
    return next(new AppError('Start time cannot be in the past', 400));
  }

  const endTime = getEndOfISTDay(start);

  const payload = {
    ...req.body,
    createdBy: req.user._id,
    startTime: start,
    endTime
  };

  const newTest = await Test.create(payload);

  const responseTest = {
    ...newTest.toObject(),
    startTimeIST: formatToIST(newTest.startTime),
    endTimeIST: formatToIST(newTest.endTime)
  };

  res.status(201).json({
    status: 'success',
    data: { test: responseTest }
  });
});

// Helper: remove correctAnswer for students
const sanitizeTestForStudents = (testDoc) => {
  const obj = testDoc.toObject();
  if (obj.questions && Array.isArray(obj.questions)) {
    obj.questions = obj.questions.map(({ correctAnswer, ...rest }) => rest);
  }
  return obj;
};

// Get Ongoing Tests (role-aware)
exports.getTodayTests = catchAsync(async (req, res, next) => {
  const { dayStart, dayEnd } = getISTDayBounds();

  const tests = await Test.find({
    startTime: { $gte: dayStart, $lte: dayEnd }
  })
    .populate('createdBy', 'name email role')
    .sort({ startTime: 1 });

  const formattedTests = tests.map(t => {
    const obj = req.user.role === 'student' ? sanitizeTestForStudents(t) : t.toObject();
    obj.startTimeIST = formatToIST(t.startTime);
    obj.endTimeIST = formatToIST(t.endTime);
    return obj;
  });

  res.status(200).json({
    status: 'success',
    results: formattedTests.length,
    data: { tests: formattedTests }
  });
});

// Get All Tests (admin/teacher)
exports.getAllTests = catchAsync(async (req, res, next) => {
  // Initialize pagination with date filter
  const pagination = new SimplePaginationFilteration(Test, req.query); 

  // Override to use 'startTime' as date field
  pagination.buildDateFilter = function(dateField = 'startTime') {
    const { startDate, endDate } = this.queryString;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter[dateField] = {};
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter[dateField].$gte = start;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter[dateField].$lte = end;
      }
    }
    return dateFilter;
  };

  // Execute pagination
  pagination.sortField = '-startTime';
  await pagination.paginate();
  const tests = pagination.getData();

  const populatedTests = await Test.populate(tests, {
    path: 'createdBy',
    select: 'name email role'
  });

  const formattedTests = populatedTests.map(t => {
    const obj = t.toObject();
    obj.startTimeIST = formatToIST(t.startTime);
    obj.endTimeIST = formatToIST(t.endTime);
    
    // Add status for frontend
    const now = new Date();
    if (now < t.startTime) {
      obj.status = 'upcoming';
    } else if (now >= t.startTime && now <= t.endTime) {
      obj.status = 'active';
    } else {
      obj.status = 'past';
    }
    
    return obj;
  });

  res.status(200).json({
    status: 'success',
    results: formattedTests.length,
    data: { 
      tests: formattedTests,
      pagination: pagination.getPaginationInfo()
    }
  });
});

// Get Single Test (role-aware)
exports.getTest = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id).populate('createdBy', 'name email role');
  if (!test) return next(new AppError('No test found with that ID', 404));

  const obj = req.user.role === 'student' ? sanitizeTestForStudents(test) : test.toObject();
  obj.startTimeIST = formatToIST(test.startTime);
  obj.endTimeIST = formatToIST(test.endTime);

  res.status(200).json({
    status: 'success',
    data: { test: obj }
  });
});

// UPDATE TEST (only before start; only creator or admin)
exports.updateTest = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id);
  if (!test) {
    return next(new AppError('No test found with that ID', 404));
  }

  if (String(test.createdBy) !== String(req.user._id) && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to update this test. Only the teacher who created it or admins are allowed.', 403));
  }

  if (new Date() >= test.startTime) {
    return next(new AppError('Cannot update a test that has already started', 400));
  }

  if (req.body.questions) {
    try {
      validateTestInput({
        title: req.body.title || test.title,
        questions: req.body.questions
      });
    } catch (err) {
      return next(err);
    }
  }

  const allowed = ['title', 'description', 'questions', 'examDuration'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) test[field] = req.body[field];
  });

  await test.save();

  const responseTest = {
    ...test.toObject(),
    startTimeIST: formatToIST(test.startTime),
    endTimeIST: formatToIST(test.endTime)
  };

  res.status(200).json({
    status: 'success',
    data: { test: responseTest }
  });
});

// DELETE TEST (only creator or admin)
exports.deleteTest = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id);
  if (!test) return next(new AppError('No test found with that ID', 404));

  if (String(test.createdBy) !== String(req.user._id) && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this test', 403));
  }

  await test.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get all student attempts and scores for a specific test (admin/teacher)
exports.getTestResults = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id);
  if(!test){
    return next(new AppError('No test found with that ID', 404))
  }

  const attempts = await Attempt.find({ test: test._id })
    .select('student score attemptedAt')
    .populate('student', 'name email _id') // 2. For each attempt, fetch the student's name and email
    .sort({ score: -1 }); // 3. Sort the results to show the highest score first

  const results = attempts.map(attempt => {
    // Return a new, flat object for each attempt
    return {
      studentId: attempt.student._id,
      name: attempt.student.name,
      email: attempt.student.email,
      score: attempt.score,
      //totalMarks: 
    };
  });

  res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      results
    }
  });
});