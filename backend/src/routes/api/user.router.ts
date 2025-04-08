import express from 'express';

import {
  loginUser,
  registerUser,
} from '../../controllers/user.controller';

export const userRouter = express.Router();

//register a user
userRouter.post('/registerUser',registerUser);
//login a user
userRouter.post('/loginUser',loginUser);