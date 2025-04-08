import express from 'express';

import {
  addFavourites,
  getFavourites,
  getFavouritesAs,
  isFavourite,
  removeFavourites,
} from '../../controllers/favourites.controller';
import { adminHandler } from '../../middlewares/adminHandler';
import { authHandler } from '../../middlewares/authHandler';

export const favouritesRouter = express.Router();

//add a favourite to current user
favouritesRouter.post('/',authHandler,addFavourites);
//remove a favourite from current user
favouritesRouter.delete('/',authHandler,removeFavourites);
//get all favourites of current user
favouritesRouter.get('/',authHandler,getFavourites);
//get all favourites of another user by userId
favouritesRouter.get('/as',authHandler,adminHandler,getFavouritesAs);
//check if a character is favourite
favouritesRouter.get('/isFavourite',authHandler,isFavourite)
