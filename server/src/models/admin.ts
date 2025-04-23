import createHttpError from 'http-errors';

import { Admin } from '@prisma/client';

import { prisma } from '../utils/prismaClient';

export async function isUserAdmin(id: string): Promise<boolean> {
    try {
        const adminUser = await prisma.admin.findUnique({
            where: {
                id
            }
        });
        return !!adminUser;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function addAdminToMongo(admin: string): Promise<Admin> {
    try {
        const addedAdmin = await prisma.admin.upsert({
            where: {
                id: admin
            },
            update: {
            },
            create: {
                id: admin
            }
        });
        return addedAdmin;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function removeAdminFromMongo(admin: string): Promise<{count:number}> {
    try {
        if(!admin){
            throw Promise.reject(createHttpError(400, 'No Attributes Provided'));
        }
        const deletedAdmin = await prisma.admin.deleteMany({
            where: {
                id: admin
            },
        });
        return deletedAdmin;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}


export async function getAllAdminsFromMongo(): Promise<Admin[]> {
    try {
        const admins = await prisma.admin.findMany();
        return admins;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}