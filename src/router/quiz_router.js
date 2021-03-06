const express = require('express');
const controller = require('../controller/quiz_controller');
const auth = require('../middleware/auth_middleware');
const { setNoOfQuestions, setNoOfQuestionsWhileUpdating } = require('../middleware/quiz_middleware');

const router = express.Router();

router.route('/quizzes').post(auth, setNoOfQuestions, controller.createQuiz).get(auth, controller.getQuizzes);

router
  .route('/quizzes/:id')
  .get(auth, controller.getQuiz)
  .delete(auth, controller.deleteQuiz)
  .patch(auth, setNoOfQuestionsWhileUpdating, controller.updateQuiz);

module.exports = router;
