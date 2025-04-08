import express from 'express';

import {
  deleteCharacter,
  getAllCharacters,
  getCharacterByIdName,
  getCharactersByRule,
} from '../../controllers/character.controller';
import { adminHandler } from '../../middlewares/adminHandler';
import { authHandler } from '../../middlewares/authHandler';

export const charactersRouter = express.Router();

//get all characters
charactersRouter.get('/allCharacters',authHandler,adminHandler,getAllCharacters);

//get characters by filter rule
charactersRouter.post('/ruledCharacters',authHandler,getCharactersByRule);

//get character by idname
charactersRouter.get('/idName',authHandler,getCharacterByIdName);

//remove a character
charactersRouter.delete('/character',authHandler,adminHandler,deleteCharacter);