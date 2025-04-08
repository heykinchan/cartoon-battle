import createHttpError from 'http-errors';

import {
  Character,
  Prisma,
} from '@prisma/client';

import { prisma } from '../utils/prismaClient';

export async function getAllCharactersFromMongo(): Promise<Character[]> {
    try {
        const characters = await prisma.character.findMany();
        return characters;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function getCharacterByIdFromMongo(idName:string): Promise<Character> {
    try {
        const character = await prisma.character.findUnique({
            where: {
                idName
            }
        });
        return character;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}
export async function getCharacterByIdNameFromMongo(idName:string): Promise<Character> {
    try {
        const character = await prisma.character.findUnique({
            where: {
                idName
            }
        });
        return character;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

function getAttributeRange(attribute, defaultValue = {min: 0, max: 100}) {
    return {
        min: attribute?.min || defaultValue.min,
        max: attribute?.max || defaultValue.max
    };
}

export async function getCharacterByRuleFromMongo(rules): Promise<Character[]> {

    const strength = getAttributeRange(rules.strength);
    const speed = getAttributeRange(rules.speed);
    const skill = getAttributeRange(rules.skill);
    const fear_factor = getAttributeRange(rules.fear_factor);
    const power = getAttributeRange(rules.power);
    const intelligence = getAttributeRange(rules.intelligence);
    const wealth = getAttributeRange(rules.wealth);

    try {
        const characters = await prisma.character.findMany({
            where: {
                AND: [
                    { active: true},
                    { strength: { gte: strength.min, lte: strength.max } },
                    { speed: { gte: speed.min, lte: speed.max } },
                    { skill: { gte: skill.min, lte: skill.max } },
                    { fear_factor: { gte: fear_factor.min, lte: fear_factor.max } },
                    { power: { gte: power.min, lte: power.max } },
                    { intelligence: { gte: intelligence.min, lte: intelligence.max } },
                    { wealth: { gte: wealth.min, lte: wealth.max } },
                ]
            },
        });

        return characters;
        
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function addCharacterToMongo(character: Character): Promise<Character> {
    try {
        const addedCharacter = await prisma.character.create({
            data: {
                ...character
            },
        });
        return addedCharacter;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function deleteCharacterByIdFromMongo(idName: string): Promise<Character> {
    try {
        const character = await prisma.character.update({
            where: {
                idName
            },
            data: {
                active: false
            }
        });
        
        return character;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw createHttpError(404, 'Character not found');
            }
        }
        return Promise.reject(createHttpError(500, error));
    }
}

export async function updateCharacterByIdFromMongo(character: Character): Promise<Character> {
    try {
        const { idName, fakeId, ...updateData } = character;

        const updatedCharacter = await prisma.character.update({
            where: { idName, fakeId },
            data: updateData
        });
        return updatedCharacter;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}