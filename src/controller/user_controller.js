// Models
const User = require('../models/user_model');
const Session = require('../models/user_sessions');
const AppError = require('../utils/app_error');

// Utils
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
    device_name: req.body.device_name,
    device_manufacturer: req.body.device_manufacturer,
    os_version: req.body.os_version,
  });
  await session.save();

  res.status(201).send({
    status: 'success',
    data: { user, token },
  });
});

const logout = catchAsync(async (req, res, next) => {
  await Session.findOneAndDelete({ ip_address: req.ip, user: req.user._id });
  res.status(205).send({
    status: 'success',
    user: req.user,
  });
});

const me = catchAsync(async (req, res, next) => {
  res.send({
    status: 'success',
    data: { user: req.user },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password'];

  const isValidUpdate = updates.every((e) => allowedUpdates.includes(e));
  if (!isValidUpdate) {
    throw new AppError(
      400,
      `Invalid update data. You can only update ${allowedUpdates}`
    );
  }
  const user = req.user;
  updates.forEach((update) => (user[update] = req.body[update]));
  await user.save();

  res.send({
    status: 'success',
    data: { user },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await req.user.remove();
  res.status(204).send();
});

const checkavailabilty = catchAsync(async (req, res, next) => {
  if (!req.body.email) throw new AppError(400, 'Please provide an email');

  const user = await User.findOne({ email: req.body.email });

  if (!user) throw new AppError(404, `No user found with ${req.body.email}`);

  res.send({
    status: 'success',
    data: { user },
  });
});

module.exports = {
  login,
  signup,
  logout,
  me,
  updateMe,
  deleteMe,
  checkavailabilty,
};
