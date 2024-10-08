const express = require('express');
const app = express();
const path = require('path');
const flash = require('connect-flash');

const passport = require('passport');
const connect = require('./config');
const cookieSession = require('cookie-session');

const config = require('config');
const serverConfig = config.get('server');

const mainRouter = require('./routes/main.router');
const usersRouter = require('./routes/users.router');
const productsRouter = require('./routes/products.router');
const cartRouter = require('./routes/cart.router');
const adminCategoriesRouter = require('./routes/admin-categories.router');
const adminProductsRouter = require('./routes/admin-products.router');

const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');

require('dotenv').config();

//process.env
app.use(
  cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY],
  }),
);
// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = cb => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = cb => {
      cb();
    };
  }
  next();
});

app.use(flash());
app.use(methodOverride('_method'));

app.use(
  fileUpload({
    charset: 'utf-8',
  }),
);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// mongodb connection
connect();

app.use(express.static(path.join(__dirname, 'public')));
// 파일 업로드 위치 변경
app.use(
  '/upload-files',
  express.static(path.join(__dirname, '..', 'upload-files')),
);
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.currentUser = req.user;
  next();
});

app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/products', adminProductsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || '에러가 났습니다.');
});

const port = serverConfig.port;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
