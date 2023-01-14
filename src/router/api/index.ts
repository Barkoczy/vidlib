import dotenv from 'dotenv';
import express from 'express';
import auth from '../../middleware/auth';

// @routes
import videoFilterRoute from './routes/video/filter';

// @env
dotenv.config();

// @router
const router = express.Router();

router.post('/video/filter', auth, videoFilterRoute);

// @exports
export default router;
