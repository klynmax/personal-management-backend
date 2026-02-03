import { Request } from 'express';
import IJwtPayload from './IJwtPayload';

export interface AuthenticatedRequest extends Request {
  user: IJwtPayload;
}
