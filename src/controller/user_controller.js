const User = require('../models/user_model');

const login = (req, res) => {
  res.send({
    message: 'You are logged in 😌',
  });
};

const signup = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send({
      status: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, signup };
