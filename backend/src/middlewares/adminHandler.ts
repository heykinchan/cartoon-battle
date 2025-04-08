import {
  NextFunction,
  Request,
  Response,
} from 'express';
import createHttpError from 'http-errors';

import { isUserAdmin } from '../models/admin';

export const adminHandler = async (
    req: Request,
    _: Response,
    next: NextFunction,
) => {
    try {
        const actionPerformer = req.user.id as string;
        const isAdmin = await isUserAdmin(actionPerformer);
        if(isAdmin == false){
            throw createHttpError(403, 'Unauthorized');
        }
        next();
    } catch (error) {
        next(error);
    }
};