const Category = require('../models/Categories');
const slugify = require('slugify');

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const slug = slugify(name, { lower: true, strict: true });
    const cat = await Category.create({ name, slug });
    res.status(201).json(cat);
  } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (err) { next(err); }
};
