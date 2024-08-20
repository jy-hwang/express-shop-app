const express = require('express');
const { checkAdmin } = require('../middleware/auth');
const Category = require('../models/categories.model');
const router = express.Router();

router.get('/add-category', checkAdmin, function (req, res) {
  res.render('admin/add-category');
});

router.post('/add-category', checkAdmin, async (req, res, next) => {
  try {
    const title = req.body.title;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const category = await Category.findOne({ slug: slug });

    if (category) {
      req.flash(
        'error',
        '카테고리 제목이 이미 존재합니다. 다른 제목을 사용해주세요',
      );
      res.redirect('back');
    }

    const newCategory = new Category({
      title: title,
      slug: slug,
    });

    await newCategory.save();
    req.flash('success', '카테고리가 추가되었습니다.');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
