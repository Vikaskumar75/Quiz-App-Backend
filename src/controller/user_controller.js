const User = require('../models/user_model');
const Session = require('../models/user_sessions');
const AppError = require('../utils/app_error');
const catchAsync = require('../utils/catch_async');

const login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    throw new AppError(400, 'Please provide an email/password');
  }

  const user = await User.findByCredentials(email, password);
  const token = user.createJwtToken();

  // Replacing an already existing session on that device
  // If not creating a new one
  await Session.findOneAndUpdate(
    { ip_address: req.ip, user: user._id },
    { token },
    { upsert: true }
  );

  res.send({ status: 'success', data: { user, token } });
});

const signup = catchAsync(async (req, res, next) => {
  // Creating new user
  const user = new User(req.body);
  const token = user.createJwtToken();
  const newUser = await user.save();

  // Creating session using that new user
  const session = new Session({
    ip_address: req.ip,
    token,
    user: newUser._id,
  });
  await session.save();

  res.status(201).send({
    status: 'success',
    data: { user, token },
  });
});

const logout = catchAsync(async (req, res, next) => {

  

});

const me = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError(404, 'User not found');

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

module.exports = { login, signup, logout, me };
