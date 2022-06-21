const AppError = require('../utils/app_error');
const catchAsync = require('../utils/catch_async');

const setNoOfQuestions = catchAsync(async (req, res, next) => {
  if (!req.body.questions || req.body.questions.length < 1) {
    throw new AppError(400, 'You cannot create a quiz without questions.');
  }
  req.body.no_of_questions = req.body.questions.length;
  next();
});

module.exports = { setNoOfQuestions };
