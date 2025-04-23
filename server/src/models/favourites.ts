import createHttpError from 'http-errors';

import { FavoriteCharacters } from '@prisma/client';

import { getCharacterByIdNameFromMongo } from '../models/character';
import { prisma } from '../utils/prismaClient';

const {ObjectId} = require('mongodb');
export async function addFavouritesToMongo(user_id: string, character: string): Promise<FavoriteCharacters> {
    try {
        const favourite = await prisma.favoriteCharacters.findUnique({
            where: { 
                user_id:{_id:{"$oid" :new ObjectId(user_id)}}
             }
        });
        if (favourite && favourite.characters.includes(character)) {
            throw createHttpError(400, 'Character already in favourites');
        }
        const ch = await getCharacterByIdNameFromMongo(character);
        if (!ch) {
            throw createHttpError(404, 'Character not found');
        }
        const favourites = await prisma.favoriteCharacters.upsert({
            where: { user_id:{_id:{"$oid" :new ObjectId(user_id)}}},
            update: {
                characters: {
                    push: character
                }
            },
            create: {
                user_id: {_id:{"$oid" :new ObjectId(user_id)}},
                characters: [character]
            },
        });
        return favourites;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function removeFavouriteFromMongo(user_id: string, character: string): Promise<FavoriteCharacters> {
    try {
        const favourite = await prisma.favoriteCharacters.findUnique({
            where: { user_id:{_id:{"$oid" :new ObjectId(user_id)}} }
        });

        if (!favourite) {
            throw createHttpError(404, 'Character not found');
        }

        const updatedCharacters = favourite.characters.filter(ch => ch !== character);
        const updatedFavourite = await prisma.favoriteCharacters.update({
            where: { user_id:{_id:{"$oid" :new ObjectId(user_id)}} },
            data: {
                characters: updatedCharacters
            }
        });
    
        return updatedFavourite;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}


export async function getFavouriteFromMongo(user_id: string): Promise<FavoriteCharacters> {
    try {
        const favourite = await prisma.favoriteCharacters.findUnique({
            where: { user_id:{_id:{"$oid" :new ObjectId(user_id)}} }
        });
        if (!favourite) {
            return null;
        }
        return favourite;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}