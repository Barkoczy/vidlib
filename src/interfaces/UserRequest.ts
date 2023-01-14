import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export default interface UserRequest extends Request {
  user?: JwtPayload;
}
