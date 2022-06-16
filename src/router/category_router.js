const express = require('express');
const controller = require('../controller/category_controller');
const auth = require('../middleware/auth_middleware');

const router = express.Router();

router
  .route('/categories')
  .get(auth, controller.read)
  .post(auth, controller.create);

router
  .route('/categories/:id').get(auth,controller.readOne)
  .patch(auth, controller.update)
  .delete(auth, controller.deleteCategory);

module.exports = router;
