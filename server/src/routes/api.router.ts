import express from 'express';

import { adminRouter } from './api/admin.router';
import { charactersRouter } from './api/characters.router';
import { contributionRouter } from './api/contribution.router';
import { favouritesRouter } from './api/favourites.router';
import { userRouter } from './api/user.router';

export const apiRouter = express.Router();

apiRouter.use('/admin',adminRouter)
apiRouter.use('/characters',charactersRouter)
apiRouter.use('/contributions',contributionRouter)
apiRouter.use('/users',userRouter)
apiRouter.use('/favourites',favouritesRouter)