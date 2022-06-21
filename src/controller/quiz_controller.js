const Quiz = require('../models/quiz_model');
const Question = require('../models/question_model');
const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_error');

const createQuiz = catchAsync(async (req, res, next) => {
  const quiz = new Quiz({
    ...req.body,
    meta_data: {
      createdBy: req.user._id,
    },
  });

  const questionSet = await new Question({
    questions: req.body.questions,
    quiz: quiz._id,
  });

  await questionSet.validate();
  await quiz.validate();

  await questionSet.save();
  await quiz.save();

  res.status(201).send({
    status: 'success',
    data: { quiz, questions: `${req.baseUrl}/questions/${quiz._id}` },
  });
});

const getQuizzes = catchAsync(async (req, res, next) => {
  let query = {};
  if (req.query.user) {
    query = { 'meta_data.createdBy': req.query.user };
  }

  const quizzes = await Quiz.find(query).populate(['categories', 'meta_data.createdBy']);
  res.send({
    status: 'success',
    total: quizzes.length,
    data: { quizzes },
  });
});

const getQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate(['categories', 'meta_data.createdBy']);

  if (!quiz) throw new AppError(404, 'Quiz not found');

  res.send({
    status: 'success',
    data: { quiz },
  });
});

const deleteQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, 'meta_data.createdBy': req.user._id });

  if (!quiz) throw new AppError(404, 'Quiz not found by this user.');

  await quiz.remove();

  res.status(204).send({
    status: 'success',
    data: { quiz },
  });
});

module.exports = { createQuiz, getQuizzes, getQuiz, deleteQuiz };
