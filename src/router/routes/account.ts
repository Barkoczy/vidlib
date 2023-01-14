import { Response } from 'express';
import UserRequest from '../../interfaces/UserRequest';

export default async function accountRoute(req: UserRequest, res: Response) {
  const { user } = req;
  res.render('account', { user });
}
