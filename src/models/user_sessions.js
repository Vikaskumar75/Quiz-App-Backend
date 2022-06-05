const mongoose = require('mongoose');

const schemaOptions = { timeStamps: true };

const schema = {
  ip: String,
  device_name: String,
  device_manufacturer: String,
  android_version: String,
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
};

const sessionSchema = mongoose.Schema(schema, schemaOptions);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
