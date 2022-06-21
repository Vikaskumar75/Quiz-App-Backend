const mongoose = require('mongoose');
const AppError = require('../utils/app_error');
const catchAsync = require('../utils/catch_async');

const schemaOptions = { timeStamps: true };

const schema = {
  name: {
    type: String,
    required: [true, 'name is required to create a quiz.'],
    unique: [true, 'this name is already taken.'],
  },
  avg_time_per_question: {
    type: Number,
    required: [true, 'avg_time_per_question is required.'],
  },
  points_for_correct_answer: {
    type: Number,
    required: [true, 'please provide points_for_correct_answer.'],
  },
  points_to_win: {
    type: Number,
    required: [true, 'points_to_win is a required field'],
  },
  no_of_questions: {
    type: Number,
    default: 0,
  },
  warnings: [String],
  rating: {
    type: Number,
    default: 4.5,
  },
  categories: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    validate(value) {
      if (value === undefined || value.length === 0) {
        throw new Error('quiz must fall under one of the categories');
      }
    },
  },
};

const quizSchema = mongoose.Schema(schema, { virtuals: true }, schemaOptions);

quizSchema.virtual('total_time').get(function () {
  return this.avg_time_per_question * this.no_of_questions;
});
quizSchema.virtual('total_points').get(function () {
  return this.points_for_correct_answer * this.no_of_questions;
});

quizSchema.set('toJSON', { getters: true });

quizSchema.pre('validate', function (next) {
  const isValid = this.points_to_win <= this.points_for_correct_answer * this.no_of_questions;

  if (!isValid) throw new AppError(400, 'Invalid winning criteria');
  next();
});

const quiz = mongoose.model('Quiz', quizSchema);

module.exports = quiz;
