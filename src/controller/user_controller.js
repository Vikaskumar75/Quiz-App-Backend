const User = require('../models/user_model');
const AppError = require('../utils/app_error');
const catchAsync = require('../utils/catch_async');

const login = (req, res) => {
  res.send({
    message: 'You are logged in 😌',
  });
};

const signup = catchAsync(async (req, res, next) => {
  const user = new User(req.body);
  const token = user.createJwtToken();
  await user.save();
  res.send({
    status: true,
    data: { user, token },
  });
});

const me = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError(404, 'User not found');

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

module.exports = { login, signup, me };
