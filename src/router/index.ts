import dotenv from 'dotenv';
import express from 'express';
import { AuthMode } from '../enums';
import PeerTube from '../utils/peertube';
// import sessionAuth from '../middleware/auth/sessionAuth';
import cookieJwtAuth from '../middleware/auth/cookieJWTAuth';

// @routes
import signinRoute from './routes/signin';
import indexRoute from './routes/index';
import searchRoute from './routes/search';
import accountRoute from './routes/account';
import filterRoute from './routes/filter';
import videoRoute from './routes/video';

// @env
dotenv.config();

// @router
const router = express.Router();

router.get('/', cookieJwtAuth, indexRoute);
router.get('/account', cookieJwtAuth, accountRoute);
router.get('/search', cookieJwtAuth, searchRoute);
router.post('/filter', cookieJwtAuth, filterRoute);
router.get('/video/:id', cookieJwtAuth, videoRoute);
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
