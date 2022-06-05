const express = require('express');
const controller = require('../controller/user_controller');
const auth = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/users/:id', controller.me);
router.post('/users/login', controller.login);
router.post('/users/logout', auth, controller.logout);
router.post('/users/signup', controller.signup);

module.exports = router;
