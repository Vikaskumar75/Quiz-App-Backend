const express = require('express');
const controller = require('../controller/email_controller');

const router = express.Router();

router.post('/emails/sendotp', controller.sendOtpEmail);
module.exports = router;
