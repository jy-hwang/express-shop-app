const express = require('express');
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require('../middleware/auth');
const passport = require('passport');
const User = require('../models/users.model');
const usersRouter = express.Router();

usersRouter.post('/login', async (req, res, next) => {
  console.log('1');
  passport.authenticate('local', (err, user, info) => {
    console.log('3'); //왜 두번 찍히는 거지?
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      //res.status(200).json({ message: 'Authorized', token: req.user.token });
      res.redirect('/');
    });
  })(req, res, next); //middleware 안에 middleware 를 실행하려고 할때.
});

usersRouter.post('/logout', async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.redirect('/login'); // 로그아웃 성공시 로그인 페이지로 이동.
  });
});

usersRouter.post('/signup', async (req, res) => {
  console.log('signup post 호출');
  // user 객체 생성
  const user = new User(req.body);
  try {
    // user 컬렉션에 유저를 저장.
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
  }
});

module.exports = usersRouter;
