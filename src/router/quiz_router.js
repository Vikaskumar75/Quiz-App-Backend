const express = require('express');
const controller = require('../controller/quiz_controller');
const auth = require('../middleware/auth_middleware');
const { setNoOfQuestions } = require('../middleware/quiz_middleware');

const router = express.Router();

router.route('/quizzes').post(auth, setNoOfQuestions, controller.createQuiz).get(auth, controller.getQuizzes);

module.exports = router;
