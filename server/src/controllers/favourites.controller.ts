import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { getCharacterByIdNameFromMongo } from '../models/character';
import {
  addFavouritesToMongo,
  getFavouriteFromMongo,
  removeFavouriteFromMongo,
} from '../models/favourites';

export const addFavourites = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {id} = req.user;
        const {favourites} = req.body;
        const addedFavourites = await addFavouritesToMongo(id,favourites);
        res.json(addedFavourites);
    } catch (error) {
        next(error);
    }
}

export const removeFavourites = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const {id} = req.user;
        const {favourites} = req.body;
        const removedFavourites = await removeFavouriteFromMongo(id,favourites);
        res.json(removedFavourites);
    } catch (error){
        next(error);
    }
}
const getFavouritesbyUser = async (id: string) => {
    const favourites = await getFavouriteFromMongo(id);
        if(!favourites || favourites.characters.length === 0){
            return {favourites,characterResult: []}
        }
        const characterResult = await Promise.all(
            favourites.characters.map(async (characterIdName) => {
                return getCharacterByIdNameFromMongo(characterIdName);
            })
        );
        return {favourites,characterResult}
}
export const getFavourites = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const {id} = req.user;
        if(!id){
            throw createHttpError(400, 'No Attributes Provided');
        }
        const result = await getFavouritesbyUser(id);
        res.json(result);
    } catch (error){
        next(error);
    }
}

export const getFavouritesAs = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const id = req.query.id as string;
        if(!id){
            throw createHttpError(400, 'No Attributes Provided');
        }
        const result = await getFavouritesbyUser(id);
        res.json(result);
    } catch (error){
        next(error);
    }
}

export const isFavourite = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.user;
        const { characterId } = req.query as { characterId: string };

        const favourites = await getFavouriteFromMongo(id) || { characters: [] };

        res.json({ isFavourite: favourites.characters.includes(characterId) });
    } catch (error) {
        next(error);
    }
}

function createHttpError(arg0: number, arg1: string) {
    throw new Error('Function not implemented.');
}
