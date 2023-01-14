import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import UserRequest from '../../interfaces/UserRequest';

export default function cookieJwtAuth(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token: string = req.signedCookies._secure;
    const secret: jwt.Secret = process.env.JWT_SECRET || '';
    const user: JwtPayload = jwt.verify(token, secret) as JwtPayload;
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie('_secure');
    res.redirect('/signin');
  }
}
