const mongoose = require('mongoose');
const AppError = require('../utils/app_error');

const schemaOptions = { timeStamps: true };

const schema = {
  questions: {
    type: [
      {
        title: {
          type: String,
          required: [true, 'title is required for the question.'],
        },
        options: {
          type: [
            {
              answer: { type: String, required: true },
              is_correct: { type: Boolean, default: false },
            },
          ],
          validate(value) {
            if (value.length < 2) {
              throw new Error('you need to provide at least two options.');
            } else if (value.length > 5) {
              throw new Error('you cannot have more than 5 options');
            }
          },
        },
      },
    ],
    validate(value) {
      if (value.length > 10) throw new AppError('A quiz cannot have more than 10 questions.');
    },
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
};

const questionSchema = mongoose.Schema(schema, schemaOptions);

const question = mongoose.model('Question', questionSchema);

module.exports = question;
