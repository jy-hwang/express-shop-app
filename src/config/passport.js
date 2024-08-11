const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users.model');

// req.login(user)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      console.log('Local strategy executed');
      User.findOne({ email: email.toLocaleLowerCase() })
        .then(user => {
          if (!user)
            return done(null, false, { message: `Email ${email} not found` });

          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            }

            return done(null, false, { message: 'Invalid password.' });
          });
        })
        .catch(error => {
          return done(error);
        });
    },
  ),
);
