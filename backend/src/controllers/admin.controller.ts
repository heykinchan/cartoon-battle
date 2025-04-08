import {
  NextFunction,
  Request,
  Response,
} from 'express';
import createHttpError from 'http-errors';

import {
  addAdminToMongo,
  getAllAdminsFromMongo,
  isUserAdmin,
  removeAdminFromMongo,
} from '../models/admin';
import {
  getUserByEmail,
  getUserById,
} from '../models/user';

export const addAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const {email} = req.body;
        const user = await getUserByEmail(email);
        if(!user){
            throw createHttpError(404, 'User not found');
        }
        const addedAdmin = await addAdminToMongo(user.id);
        res.json(addedAdmin);
    }catch(error){
        next(error);
    }
};

export const removeAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const actionPerformer = req.user.id as string;
        if(actionPerformer == req.body.admin){
            throw createHttpError(403, 'You cannot remove yourself');
        }
        const {admin} = req.body;
        if(!admin){
            throw createHttpError(400, 'No Attributes Provided');
        }
        const result = await removeAdminFromMongo(admin);
        const deletedAdmin = {id: admin};
        res.json({deletedAdmin, message:result.count===0?'Admin not found':'Admin removed successfully'});
    } catch (error) {
        next(error);
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const queryUserId = req.query.userId as string;

        const isAdmin = await isUserAdmin(queryUserId);
        res.json({userid:queryUserId ,isAdmin, message: 'Admin status fetched successfully'});
    } catch (error) {
        next(error);
    }
}

export const getAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const adminIds = await getAllAdminsFromMongo();
        const admins = await Promise.all(adminIds.map(async (adminId) => {

            const user = await getUserById(adminId.id);
            if(!user){
                return {user: adminId.id+" not found"};
            }
            return { user };
        }));
        res.json(admins);
    } catch (error) {
        next(error);
    }
}
