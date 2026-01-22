const Attempt = require(`../Models/attempt_model`);
const Test = require(`../Models/test_model`);
const AppError = require(`../utils/appErrors`);
const catchAsync = require(`../utils/catchAsync`);
const { getEndOfISTDay, formatToIST } = require(`../utils/timeUtils`);
const SimplePaginationFilteration = require(`../utils/pagging_filtering`);

// Start Attempt
exports.startAttempt = catchAsync(async (req, res, next) => {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) return next(new AppError('Test not found', 404));

    const now = new Date();

    // Must be within test window
    if (now < test.startTime || now > test.endTime) {
        return next(new AppError('Test is not available right now', 400));
    }

    // Prevent duplicate attempts
    // Find any existing attempt for this test and delete them
     await Attempt.findOneAndDelete({ student: req.user._id, test: testId });
    
    // Always create a new attempt record.
    const newAttempt = await Attempt.create({
        student: req.user._id,
        test: testId,
        startedAt: now
    });

    res.status(201).json({
        status: 'success',
        data: { 
            attemptId: newAttempt._id, 
            startedAt: newAttempt.startedAt,
            startedAtIST: formatToIST(newAttempt.startedAt)
        }
    });
});

// Submit Attempt
exports.submitAttempt = catchAsync(async (req, res, next) => {
    const { testId } = req.params;
    const { answers } = req.body;

    const attempt = await Attempt.findOne({ student: req.user._id, test: testId });
    if (!attempt) return next(new AppError('Start the test before submitting', 404));

    if (attempt.completed) {
        return next(new AppError('You have already submitted this test', 400));
    }

    const test = await Test.findById(testId);
    if (!test) return next(new AppError('Test not found', 404));

    // Enforce exam duration
    const expiresAt = new Date(attempt.startedAt.getTime() + test.examDuration * 60 * 1000);
    if (Date.now() > expiresAt) {
        return next(new AppError('Time is up! Cannot submit.', 400));
    }

    // ✅ Validate answers
    if (!Array.isArray(answers)) {
        return next(new AppError('Answers must be an array', 400));
    }

    const seen = new Set();
    for (const ans of answers) {
        if (typeof ans.questionId !== 'number' || ans.questionId < 0 || ans.questionId >= test.questions.length) {
            return next(new AppError(`Invalid questionId: ${ans.questionId}`, 400));
        }

        if (seen.has(ans.questionId)) {
            return next(new AppError(`Duplicate answer for question ${ans.questionId}`, 400));
        }
        seen.add(ans.questionId);

        if (ans.selectedOption !== null && ans.selectedOption !== undefined) {
            if (
                typeof ans.selectedOption !== 'number' ||
                ans.selectedOption < 0 ||
                ans.selectedOption >= test.questions[ans.questionId].options.length
            ) {
                return next(new AppError(`Invalid option for question ${ans.questionId}`, 400));
            }
        }
    }

    // Score calculation
    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let attemptedQuestions = 0;
    const totalMarks = test.questions.length * 4;
    const totalQuestions = test.questions.length;

    // Use a Map for efficient lookup of student's answers
    const answerMap = new Map(answers.map(a => [a.questionId, a.selectedOption]));

    test.questions.forEach((question, index) => {
        const studentAnswer = answerMap.get(index);

        if (studentAnswer !== undefined && studentAnswer !== null) {
            // Question was attempted
            attemptedQuestions++;
            if (question.correctAnswer === studentAnswer) {
                score += 4;
                correctAnswers++;
            } else {
                score -= 1;
                incorrectAnswers++;
            }
        }
        // If unattempted, score remains 0 for this question
    });

    attempt.answers = answers;
    attempt.score = score;
    attempt.summary = {
        score,
        totalMarks,
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        incorrectAnswers,   
        unattemptedQuestions: totalQuestions - attemptedQuestions,
    };
    attempt.attemptedAt = new Date();
    attempt.completed = true;
    await attempt.save();

    // Prepare the detailed question breakdown for the response
    const questionsWithAnswers = test.questions.map((q, idx) => ({
        ...q.toObject(),
        studentAnswer: answerMap.get(idx) ?? null
    }));

    res.status(200).json({
        status: 'success',
        data: { 
            // Add the new summary data to the response
            summary: attempt.summary,
            questions: questionsWithAnswers,
            submittedAt: attempt.attemptedAt,
            submittedAtIST: formatToIST(attempt.attemptedAt),
            title: test.title
        }
    });
});

// Past Attempts
exports.getPastAttempts = catchAsync(async (req, res, next) => {

  // Base filter for past attempts
  const baseFilter = {
    student: req.user._id,
    completed: true
  };

  // Initialize pagination with base filter
  const pagination = new SimplePaginationFilteration(Attempt, req.query, baseFilter);

  pagination.buildDateFilter = function(dateField = 'attemptedAt') {
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
  pagination.sortField = '-attemptedAt';
  await pagination.paginate();
  const attempts = pagination.getData();


  // Populate test data and process results
  const populatedAttempts = await Attempt.populate(attempts, {
    path: 'test',
    select: 'title questions'
  });

  const pastTests = populatedAttempts.map(a => {
    if (!a.test) {
      return null; // skip if test was deleted
    }

    // ✅ Use Map for efficiency
    const answerMap = new Map(a.answers.map(ans => [ans.questionId, ans.selectedOption]));

    const questionsWithAnswers = a.test.questions.map((q, idx) => ({
      ...q.toObject(),
      studentAnswer: answerMap.get(idx) ?? null
    }));

    return {
      summary: a.summary|| { score: a.score, totalMarks: a.test.questions.length * 4 }, // Retrieve the stored summary
      questions: questionsWithAnswers,
      submittedAt: a.attemptedAt,
      title: a.test.title
    };
  }).filter(Boolean); // remove nulls if test was deleted

  res.status(200).json({
    status: 'success',
    results: pastTests.length,
    data: { 
      pastTests,
      pagination: pagination.getPaginationInfo()
    }
  });
});


// exports.checkAttempt.js (add in your attempts controller file)
exports.checkAttempt = catchAsync(async (req, res, next) => {
  const { testId } = req.params;
  // find the most recent completed attempt (if any) for this user & test
  const attempt = await Attempt.findOne({ student: req.user._id, test: testId, completed: true })
    .sort({ attemptedAt: -1 }) // latest first
    .select('attemptedAt score _id summary'); // pick only needed fields

  if (!attempt) {
    return res.status(200).json({
      status: 'success',
      data: { attempted: false }
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      attempted: true,
      lastAttempt: {
        attemptId: attempt._id,
        attemptedAt: attempt.attemptedAt,
        score: attempt.score ?? attempt.summary?.score ?? null,
        summary: attempt.summary ?? null
      }
    }
  });
});
