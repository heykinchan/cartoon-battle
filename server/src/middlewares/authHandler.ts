import {
  NextFunction,
  Request,
  Response,
} from 'express';
import createHttpError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { getUserByEmail } from '../models/user';

function validateAuthorizationHeader(header: string): string {
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw createHttpError(400, 'Authorization header format is incorrect');
  }
  return parts[1];
}
export const authHandler = async (
    req: Request,
    _: Response,
    next: NextFunction,
  ) => {
    try {
        if (!req.headers.authorization) {
            throw createHttpError(400, 'Request does not have authorization');
        }

        const tokenString = validateAuthorizationHeader(req.headers.authorization);
        req.body.token = tokenString;

        const decoded = jwt.decode(tokenString) as JwtPayload | null;
        console.log("<-----------\n",decoded,"\nthis log is from <middlewares><authHandler.ts>\n----------->");

        if (!decoded) {
            throw createHttpError(400, 'Token is invalid');
        }

        const user = await getUserByEmail(decoded.user.email);
        if(!user){
            throw createHttpError(401, 'Unauthorized');
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};