import express from 'express';
import auth from './auth';
import {
  postSignup,
  activateUserAccount,
  postLogin,
  getUserDetails
} from './user';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('im up!!');
});

router.get('/loadinfo', auth.isAuthenticated, getUserDetails);

router.post('/login', postLogin);
router.post('/user/signup', postSignup);
router.get('/user/account/:userId/activate', activateUserAccount); // link sent to email

export default router;
