const mongoose = require('mongoose');

const schemaOptions = { timeStamps: true };

const schema = {
  ip_address: {
    type: String,
    required: [true, 'Please provide an ip_address'],
  },
  device_name: String,
  device_manufacturer: String,
  os_version: String,
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
