const express = require('express');
const { getAllCategories } = require('../middleware/product');
const Product = require('../models/products.model');
const router = express.Router();

router.get('/', getAllCategories, async function (req, res) {
  try {
    const products = await Product.find();
    res.render('products', {
      products,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
