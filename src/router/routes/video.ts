import { Response } from 'express';
import UserRequest from '../../interfaces/UserRequest';
import PeerTube from '../../utils/peertube';

export default async function videoRoute(req: UserRequest, res: Response) {
  const videoId: string = req.params.id;
  const data = await new PeerTube().video(videoId);

  res.render('video', { video: data });
}
