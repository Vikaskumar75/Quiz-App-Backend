const mongoose = require('mongoose');
const validator = require('validator');

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
  meta_data: {
    device_name: String,
    device_manufacturer: String,
    android_version: String,
    app_version: String,
  },
  avatar: {
    type: Buffer,
  },
};

const userSchema = mongoose.Schema(schema, schemaOptions);

const User = mongoose.model('User', userSchema);
module.exports = User;

// tokens: [
//     {
//       token: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
