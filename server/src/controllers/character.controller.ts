import {
  NextFunction,
  Request,
  Response,
} from 'express';
import createHttpError from 'http-errors';

import {
  addCharacterToMongo,
  deleteCharacterByIdFromMongo,
  getAllCharactersFromMongo,
  getCharacterByIdNameFromMongo,
  getCharacterByRuleFromMongo,
  updateCharacterByIdFromMongo,
} from '../models/character';

export const getAllCharacters = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const characters = await getAllCharactersFromMongo();
        res.json(characters);
    } catch (error) {
        next(error);
    }
};

export const getCharacterByIdName = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {idName} = req.query;
        const character = await getCharacterByIdNameFromMongo(idName as string)
        res.json(character);
    } catch (error) {
        next(error);
    }
};

export const addCharacter = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {character} = req.body;
        if(!character){
            throw createHttpError(403, 'No Attributes Provided');
        }
        const addedCharacter = await addCharacterToMongo(character);
        res.json(addedCharacter);
    } catch (error) {
        next(error);
    }
}

export const deleteCharacter = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {id} = req.body;
        if(!id){
            throw createHttpError(403, 'No Attributes Provided');
        }
        const character = await deleteCharacterByIdFromMongo(id);
        res.json(character);
    } catch (error) {
        next(error);
    }
}

export const updateCharacter = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {id,character} = req.body;
        const updatedCharacter = await updateCharacterByIdFromMongo(character);
        res.json(updatedCharacter);
    } catch (error) {
        next(error);
    }
}

export const getCharactersByRule = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {rule} = req.body;

        if(!rule){
            throw createHttpError(403, 'No Attributes Provided');
        }

        const characters = await getCharacterByRuleFromMongo(rule);
        res.json(characters);
    }catch (error) {
        next(error);
    }
}