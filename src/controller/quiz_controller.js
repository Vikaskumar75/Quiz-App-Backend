const _ = require('lodash');
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

  const questionSetValidate = questionSet.validateSync();
  if (questionSetValidate) throw questionSetValidate;

  await quiz.save();
  await questionSet.save();

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

const updateQuiz = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'name',
    'avg_time_per_question',
    'points_for_correct_answer',
    'points_to_win',
    'categories',
    'questions',
  ];

  const isValidUpdate = updates.every((e) => allowedUpdates.includes(e));
  if (!isValidUpdate) throw new AppError(400, `Invalid Update, Allowed Update fields ${allowedUpdates}`);

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new AppError(404, 'Quiz not found');

  updates.forEach((el) => {
    if (el === 'questions') return;
    quiz[el] = req.body[el];
  });

  const quizValidate = quiz.validateSync();
  if (quizValidate) throw quizValidate;

  if (updates.includes('questions')) {
    const questionSet = await Question.findOne({ quiz: quiz._id });
    questionSet.questions = req.body['questions'];
    quiz.no_of_questions = questionSet.questions.length;

    await questionSet.save();
  }

  await quiz.save();

  res.send({
    status: 'success',
    data: { quiz, questions: `${req.baseUrl}/questions/${quiz._id}` },
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

module.exports = { createQuiz, getQuizzes, getQuiz, deleteQuiz, updateQuiz };
