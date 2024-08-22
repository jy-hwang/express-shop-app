const express = require('express');
const { checkAdmin } = require('../middleware/auth');
const Category = require('../models/categories.model');
const Product = require('../models/products.model');
const fs = require('fs-extra');
const ResizeImg = require('resize-img');
const router = express.Router();

router.get('/', checkAdmin, async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.render('admin/products', {
      products,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/add-product', checkAdmin, async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.render('admin/add-product', { categories });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/', checkAdmin, async (req, res, next) => {
  const imageFile = Buffer.from(req.files.image.name, 'binary').toString(
    'utf-8',
  );
  const { title, desc, price, category } = req.body;
  const slug = title.replace(/\s+/g, '-').toLowerCase();

  try {
    // 데이터를  데이터베이스에 저장하기
    const newProduct = new Product({
      title,
      desc,
      price,
      category: category,
      slug,
      image: imageFile,
    });
    console.log(newProduct);
    await newProduct.save();

    // 폴더만들기
    await fs.mkdirp('upload-files/product-images/' + newProduct.id);
    await fs.mkdirp(
      'upload-files/product-images/' + newProduct.id + '/gallery',
    );
    await fs.mkdirp(
      'upload-files/product-images/' + newProduct.id + '/gallery/thumbs',
    );

    // 이미지 파일을 폴더에 넣어주기
    const productImage = req.files.image;
    const path =
      'upload-files/product-images/' + newProduct.id + '/' + imageFile;
    await productImage.mv(path);
    req.flash('success', '상품이 추가되었습니다.');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id', checkAdmin, async (req, res, next) => {
  const id = req.params.id;
  const path = 'upload-files/product-images/' + id;

  try {
    await fs.remove(path);
    await Product.findByIdAndDelete(id);
    req.flash('success', '상품이 삭제되었습니다.');
    res.redirect('back');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:id/edit', checkAdmin, async (req, res, next) => {
  try {
    const categories = await Category.find();

    const { _id, title, desc, category, price, image } = await Product.findById(
      req.params.id,
    );
    const galleryDir = 'upload-files/product-images/' + _id + '/gallery/';
    const galleryImages = fs.readdirSync(galleryDir);
    res.render('admin/edit-product', {
      title,
      desc,
      category,
      category: category.replace(/\s+/g, '-').toLowerCase(),
      price,
      image,
      galleryImages,
      id: _id,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/product-gallery/:id', async (req, res, next) => {
  const productImage = req.files.file;
  const id = req.params.id;
  const path =
    'upload-files/product-images/' + id + '/gallery/' + req.files.file.name;
  const thumbsPath =
    'upload-files/product-images/' +
    id +
    '/gallery/thumbs/' +
    req.files.file.name;

  try {
    // 원본 이미지를 gallery 폴더에 넣어주기
    await productImage.mv(path);

    // 이미지 resize
    const buf = await ResizeImg(fs.readFileSync(path), {
      width: 100,
      height: 100,
    });

    fs.writeFileSync(thumbsPath, buf);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
