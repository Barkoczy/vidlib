import dotenv from 'dotenv';
import express from 'express';
import { AuthMode } from '../enums';
import PeerTube from '../utils/peertube';
import auth from '../middleware/auth';

// @routes
import signinRoute from './routes/signin';
import indexRoute from './routes/index';
import searchRoute from './routes/search';
import accountRoute from './routes/account';
import videoRoute from './routes/video';

// @env
dotenv.config();

// @router
const router = express.Router();

router.get('/', auth, indexRoute);
router.get('/account', auth, accountRoute);
router.get('/search', auth, searchRoute);
router.get('/video/:id', auth, videoRoute);
router.post('/signin', signinRoute);
router.get('/signin', (req, res) => {
  if (
    AuthMode.STRICT === process.env.AUTH_MODE &&
    typeof req.signedCookies._secure !== 'undefined'
  ) {
    res.redirect('/');
  } else {
    const { error } = req.query;
    res.render('signin', { error });
  }
});
router.get('/signout', async (_, res) => {
  await new PeerTube().logout();
  res.clearCookie('_secure');
  res.redirect('/signin');
});

// @exports
export default router;
