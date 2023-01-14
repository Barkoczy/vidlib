import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { URLSearchParams } from 'url';
import { AuthMode } from '../../enums';
import UserRequest from '../../interfaces/UserRequest';
import PeerTube from '../../utils/peertube';
import ErrorURLParams from '../../types/ErrorURLParams';

// @env
dotenv.config();

export default async function signinRoute(req: UserRequest, res: Response) {
  const { username, password } = req.body;
  const availableAutModes: string[] = Object.values(AuthMode);
  const currentAuthMode: string = process.env.AUTH_MODE || '';

  // @valid
  if (!availableAutModes.includes(currentAuthMode)) {
    throw new Error('Authorization mode not defined');
  }

  // @strict
  if (AuthMode.STRICT === process.env.AUTH_MODE) {
    if (
      process.env.PEERTUBE_USERNAME &&
      process.env.PEERTUBE_USERNAME.length === 0
    ) {
      throw new Error('PEERTUBE_USERNAME is not defined');
    }
    if (
      process.env.PEERTUBE_PASSWORD &&
      process.env.PEERTUBE_PASSWORD.length === 0
    ) {
      throw new Error('PEERTUBE_PASSWORD is not defined');
    }
    if (username !== process.env.PEERTUBE_USERNAME) {
      const params = new URLSearchParams({ error: 'Username not match' });
      res.redirect(`/signin?${params.toString()}`);
      return;
    }
    if (password !== process.env.PEERTUBE_PASSWORD) {
      const params = new URLSearchParams({ error: 'Password not match' });
      res.redirect(`/signin?${params.toString()}`);
      return;
    }

    const data = await new PeerTube().login(username, password);

    if (Object.prototype.hasOwnProperty.call(data, 'error')) {
      const error = { error: data.error } as ErrorURLParams;
      const params = new URLSearchParams(error).toString();
      res.redirect(`/signin?${params}`);
      return;
    }

    const secret: string = process.env.JWT_SECRET || '';
    const token = jwt.sign(data.user, secret, { expiresIn: data.expiresIn });

    res.cookie('_secure', token, {
      maxAge: data.expiresIn,
      httpOnly: true,
      secure: true,
      signed: true,
    });

    res.redirect('/');
    return;
  }

  // @credentials
  if (AuthMode.CREDENTIALS === process.env.AUTH_MODE) {
    /* TODO */
  }

  // @peertube
  if (AuthMode.PEERTUBE === process.env.AUTH_MODE) {
    const data = await new PeerTube().login(username, password);

    if (Object.prototype.hasOwnProperty.call(data, 'error')) {
      const error = { error: data.error } as ErrorURLParams;
      const params = new URLSearchParams(error).toString();
      res.redirect(`/signin?${params}`);
      return;
    }
  }

  // @mixed
  if (AuthMode.MIXED === process.env.AUTH_MODE) {
    /* TODO */
  }
}
