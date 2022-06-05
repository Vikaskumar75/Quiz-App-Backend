const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Session = require('./user_sessions');

const schemaOptions = { timeStamps: true };

const schema = {
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    unique: [true, 'This email is already taken'],
    required: [true, 'Please provide an email'],
    trim: true,
    lowercase: true,
    validator(value) {
      if (!validator.isEmail(value)) throw Error('Invaid email');
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  avatar: {
    type: Buffer,
  },
};
const userSchema = mongoose.Schema(schema, schemaOptions);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

userSchema.methods.createJwtToken = function () {
  const token = jwt.sign(this._id.toString(), process.env.JWT_SECRET);
  console.log(token);
  const session = new Session({
    token,
    user: this._id,
  });
  session.save();
  return token;
};

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
