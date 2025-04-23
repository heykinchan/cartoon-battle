import createHttpError from 'http-errors';

import { User } from '@prisma/client';

import { prisma } from '../utils/prismaClient';

export async function addUserToMongo(firstname, lastname, email, hashedPassword): Promise<User> {
    try {
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password : hashedPassword,
            },
        });
        return user;
    } catch (error) {
      return Promise.reject(createHttpError(500, error));
    }
}

export async function getUserByEmail(email: string): Promise<User> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function getUserById(id): Promise<User> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id : id,
            },
        });
        if (user) {
            user.password = "secret";
        }
        return user;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function deleteUserByEmail(email: string): Promise<User> {
    try {
        const user = await prisma.user.delete({
            where: {
                email,
            },
        });
        return user;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}
