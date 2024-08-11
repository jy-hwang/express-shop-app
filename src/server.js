const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const connect = require('./config');
const cookieSession = require('cookie-session');
const mainRouter = require('./routes/main.router');
const usersRouter = require('./routes/users.router');
const productsRouter = require('./routes/products.router');
const cartRouter = require('./routes/cart.router');
const adminCategoriesRouter = require('./routes/admin-categories.router');
const adminProductsRouter = require('./routes/admin-products.router');

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

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/products', adminProductsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);

const config = require('config');
const serverConfig = config.get('server');

const port = serverConfig.port;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
