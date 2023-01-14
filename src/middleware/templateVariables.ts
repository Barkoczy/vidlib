import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// @env
dotenv.config();

export default function templateVariables(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.signedCookies._secure;
  const secret: string = process.env.JWT_SECRET || '';
  const user = typeof token === 'undefined' ? null : jwt.verify(token, secret);

  res.locals.user = user;
  res.locals.locale = process.env.LOCALE || '';
  res.locals.appname = process.env.APP_NAME || '';
  res.locals.authmode = process.env.AUTH_MODE || '';
  res.locals.playermode = process.env.PLAYER_MODE || '';
  res.locals.domain = process.env.PEERTUBE_DOMAIN || '';

  next();
}
