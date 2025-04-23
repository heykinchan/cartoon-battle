import express from 'express';

import {
  addAdmin,
  getAdmins,
  isAdmin,
  removeAdmin,
} from '../../controllers/admin.controller';
import { adminHandler } from '../../middlewares/adminHandler';
import { authHandler } from '../../middlewares/authHandler';

export const adminRouter = express.Router();

//check if user is admin
adminRouter.get('/isAdmin',authHandler,isAdmin);
//add admin
adminRouter.post('/admin',authHandler,adminHandler,addAdmin);
//delete admin
adminRouter.delete('/admin',authHandler,adminHandler,removeAdmin);
//get all admins
adminRouter.get('/admins',authHandler,adminHandler,getAdmins)
