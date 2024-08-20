const express = require('express');
const { checkAdmin } = require('../middleware/auth');
const Category = require('../models/categories.model');

const router = express.Router();

router.get('/add-product', checkAdmin, async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.render('admin/add-product', { categories });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
