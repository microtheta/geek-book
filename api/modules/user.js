import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mailHelper from '../utils/mailhelper';
import auth from './auth';

import {
  create as createUser,
  saveCredentials,
  findByEmail,
  validateActivationToken,
  activateAccount,
  findById
} from '../../models/dao/user.dao';

const saltRounds = 10;

export const postSignup = (req, res) => {
  const userValidatorSchema = {
    firstName: {
      notEmpty: true,
      errorMessage: 'First Name Required'
    },
    lastName: {
      notEmpty: true,
      errorMessage: 'Last Name Required'
    },
    email: {
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    password: {
      notEmpty: true,
      errorMessage: 'Password Required'
    },
    password_confirmation: {
      notEmpty: true,
      errorMessage: 'Confirm Password Required'
    }
  };

  // Validate user request
  req.checkBody(userValidatorSchema);
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).send({ success: false, errors });
    return;
  }
  if (req.body.password !== req.body.password_confirmation) {
    res.status(400).send({ success: false,
      errors: [{ param: 'password', msg: 'Password and Confirm password is not matching' }] 
    });
    return;
  }
  const userObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };

  findByEmail(userObj.email).then((existingUser) => {
    if (!existingUser) {
      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        createUser(userObj).then((newUser) => {
          crypto.randomBytes(16, (e, buf) => {
            const token = buf.toString('hex');
            const credentialsObj = {
              userId: newUser.id,
              password: hash,
              activationToken: token
            };
            saveCredentials(credentialsObj).then(() => {
              userObj.emailVerificationLink =
              `${req.protocol}://${req.get('host')}/api/user/account/${newUser.id}/activate?token=${token}`;
              mailHelper.sendHtmlMail('usersignup', userObj,
              'Welcome To Microtheta! Confirm Your Email', newUser.email);
              res.send({ success: true, user: newUser });
            });
          });
        });
      });
    } else {
      res.status(400).send({ success: false, userExist: true });
    }
  });
};

export const activateUserAccount = (req, res) => {
  if (req.params.userId && req.query.token) {
    validateActivationToken(req.query.token, req.params.userId).then((credentialsObj) => {
      if (credentialsObj) {
        activateAccount(credentialsObj.userId).then((affectedRows) => {
          if (affectedRows) {
            findById(credentialsObj.userId).then((userObj) => {
              req.logIn(userObj, () => {
                res.redirect('/');
              });
            });
          } else {
            res.send('Something went wrong!');
          }
        });
      } else {
        res.send('Activation token is expired or link is invalid.');
      }
    });
  } else {
    res.redirect('/login');
  }
};

export const postLogin = (req, res, next) => {
  const validatorSchema = {
    email: {
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    password: {
      notEmpty: true,
      errorMessage: 'Password Required'
    }
  };

  req.checkBody(validatorSchema);
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({ success: false, errors });
  }

  auth.localAuthenticate(req, res, next, (err, user, info) => {
    if (err) { res.status(500).send(); }

    if (!user) {
      let dataObj = { success: false, errors: [info] };
      if (info.notverified) {
        dataObj = { success: false, email: req.body.email, notverified: true };
      }
      if (info.inactive) {
        dataObj = { success: false, inactive: true };
      }

      return res.status(400).send(dataObj);
    }

    req.logIn(user, (e) => {
      if (e) { return next(e); }
      res.send({ success: true, to: req.session.returnTo || '/' });
    });
  });
};

export const getUserDetails = (req, res) => (
  res.send(req.user)
);
