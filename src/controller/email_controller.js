const validator = require('validator');
const catchAsync = require('../utils/catch_async');
const { sendOtp } = require('../utils/email');
const AppError = require('../utils/app_error');

const sendOtpEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  
  if (!email) throw new AppError(400, 'Please provide an email');
  if (!validator.isEmail(email)) {
    throw new AppError(400, 'Make sure the email is valid');
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  await sendOtp(req.body.email, otp);
  res.send({
    status: 'success',
    data: { otp },
  });
});

module.exports = { sendOtpEmail };
