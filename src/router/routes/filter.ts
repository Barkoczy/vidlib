import { Response } from 'express';
import UserRequest from '../../interfaces/UserRequest';
import PeerTube from '../../utils/peertube';

export default async function filterRoute(req: UserRequest, res: Response) {
  const { user } = req;
  const { include, privacyOneOf, count, sort } = req.body;
  const data = await new PeerTube().feeds(
    user?.name,
    include,
    privacyOneOf,
    count,
    sort
  );
  res.render('components/video/list', data);
}
