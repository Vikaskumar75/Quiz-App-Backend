const Quiz = require('../models/quiz_model');
const Question = require('../models/question_model');
const AppError = require('../utils/app_error');
const catchAsync = require('../utils/catch_async');

const createQuiz = catchAsync(async (req, res, next) => {
  const quiz = new Quiz(req.body);
  const questionSet = await new Question({
    questions: req.body.questions,
    quiz: quiz._id,
  });

  await questionSet.validate();
  await quiz.validate();

  await questionSet.save();
  await quiz.save();
  console.log(req);
  res.status(201).send({
    status: 'success',
    data: {
      quiz,
      questions: `${req.baseUrl}/questions/${quiz._id}`,
    },
  });
});

const getQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find().populate('categories');
  res.send({
    status: 'success',
    total: quizzes.length,
    data: { quizzes },
  });
});

module.exports = { createQuiz, getQuizzes };
