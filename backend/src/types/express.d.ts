/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@prisma/client';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: User;
    isFileTypeValid: boolean;
  }
}
