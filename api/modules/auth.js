import passport from 'passport';
import LocalPassStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import {
  findByEmail,
  findById,
  getPassword
} from '../../models/dao/user.dao';

const LocalStrategy = LocalPassStrategy.Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  /* TODO: find a better way to do this */
  findById(id).then((userObj) => {
    done(null, userObj);
  });
});

/**
* Sign in using Email and Password.
*/
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  findByEmail(email).then((userObj) => {
    if (!userObj) {
      return done(null, false, { msg: 'Invalid email or password.' });
    }

    getPassword(userObj.id).then((userPass) => {
      bcrypt.compare(password, userPass.password, (err, isMatch) => {
        if (isMatch) {
          if (!userObj.isEmailVerified) {
            return done(null, false, { notverified: true });
          }
          if (!userObj.isActive) {
            return done(null, false, { inactive: true });
          }
          return done(null, userObj);
        }
        // password not matching
        return done(null, false, { msg: 'Invalid email or password' });
      });
    });
  })
  .catch(() => (
    done(null, false, { msg: 'Something went wrong! Please get in touch with us at: ' })
  ));
}));

module.exports = {
  initialize: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },
  localAuthenticate: (req, res, next, cb) => {
    passport.authenticate('local', cb)(req, res, next);
  },
  logOut: (req, res, cb) => {
    req.logout();
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    cb();
  },
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  },
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send();
  }
};
