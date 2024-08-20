function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/products');
  }
  next();
}

function checkAdmin(req, res, next) {
  console.log(req.isAuthenticated(), res.locals.currentUser.admin);
  if (req.isAuthenticated() && res.locals.currentUser.admin == 1) {
    next();
  } else {
    req.flash('error', 'Unauthorized Access');
    res.redirect('back');
  }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdmin,
};
