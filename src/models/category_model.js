const mongoose = require('mongoose');

const schemaOptions = { timeStamps: true };

const schema = {
  name: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, 'name of the category is required'],
  },
};

const categorySchema = mongoose.Schema(schema, schemaOptions);

categorySchema.methods.toJSON = function () {
  const categoryObject = this.toObject();

  delete categoryObject.__v;

  return categoryObject;
};

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
