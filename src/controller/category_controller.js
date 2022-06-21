const Category = require('../models/category_model');
const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_error');
const { findByIdAndDelete } = require('../models/category_model');

const create = catchAsync(async (req, res, next) => {
  const category = new Category(req.body);
  const newCategory = await category.save();
  res.status(201).send({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

const read = catchAsync(async (req, res, next) => {
  const categories = await Category.find({});
  res.send({
    status: 'success',
    total: categories.length,
    data: { categories },
  });
});

const readOne = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError(404, 'Category not found.');

  res.send({
    status: 'success',
    data: { category },
  });
});

const update = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name'];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    throw new AppError(
      400,
      `Invalid update data. Allowed Updates ${allowedUpdates}`
    );
  }

  const category = await Category.findOne({ _id: req.params.id });
  if (!category) throw new AppError(404, 'Category not found.');

  updates.forEach((update) => (category[update] = req.body[update]));
  await category.save();

  res.send({
    status: 'success',
    data: { category },
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError(404, 'Category not found.');

  res.status(204).send({
    status: 'success',
    data: { category },
  });
});

module.exports = { create, read, update, deleteCategory, readOne };
