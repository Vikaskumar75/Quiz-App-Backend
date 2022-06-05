const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const AppError = require('../utils/app_error');
const catchAsync = require('../utils/catch_async');

module.exports = catchAsync(async (req, res, next) => {
  const bearerToken = req.headers['authorization'];
  if (!bearerToken) {
    throw new AppError(
      401,
      'Invalid Token!. Please check the bearer token Provided'
    );
  }

  const token = bearerToken.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(payload);
  if (!user) throw new AppError(404, 'No user associated with that token');

  req.user = user;
  req.token = token;

  next();
});
