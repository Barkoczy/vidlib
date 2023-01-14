import { Response } from 'express';
import UserRequest from '../../interfaces/UserRequest';

export default async function indexRoute(_: UserRequest, res: Response) {
  res.render('index');
}
