import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth, TokenPayload } from '../helpers/auth';
import { RequestPlus } from './logged.js';

export function authorized(
  req: RequestPlus,
  resp: Response,
  next: NextFunction
) {
  try {
    next();
  } catch (error) {
    next(error);
  }
}
