import { Response } from 'express';
import UserRequest from '../../interfaces/UserRequest';

export default async function searchRoute(req: UserRequest, res: Response) {
  const query = req.query.q;
  const videos: any[] = [];

  res.render('search', { query, videos });
}
