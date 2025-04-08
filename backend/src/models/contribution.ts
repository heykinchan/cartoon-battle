import createHttpError from 'http-errors';

import {
  Contribution,
  ContributionStatus,
} from '@prisma/client';

import { ContributionData } from '../types/ContributionData.type';
import { prisma } from '../utils/prismaClient';

const { ObjectId } = require('mongodb');

export async function addContributionToMongo(contribution: Contribution): Promise<Contribution> {
    try {
        const addedContribution = await prisma.contribution.create({
            data: {
                ...contribution
            },
        });
        return addedContribution;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function getContributionByIdFromMongo(contribution_id: string): Promise<Contribution> {
    try {
        const contribution = await prisma.contribution.findUnique({
            where: {
                contribution_id
            }
        });
        return contribution;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

async function getPendingContributions(){
    return await prisma.contribution.findMany({
        where: {
            status: ContributionStatus.Pending
        }
    });
}
export async function getPendingContributionsByCharacterIdNameFromMongo(characterName: string): Promise<Contribution[]> {
    try {
        //bad bad way to do this, but we try to adopt the data schema 
        const contributions = await getPendingContributions(); 
        const filteredContributions = contributions.filter(contribution => {
            const contributionData = contribution.data as unknown as ContributionData;
            return contributionData.id === characterName;
        });
        return filteredContributions;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function getAllContributionByReviewerIdFromMongo(reviewerId): Promise<Contribution[]> {
    try {
        const contributions = await prisma.contribution.findMany({
            where: {
                reviewed_by: { equals: reviewerId }
            }
        });
        return contributions;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function getAllContributionByUserIdFromMongo (UserId: string): Promise<Contribution[]> {
    try {
        const contributions = await prisma.contribution.findMany({
            where: {
                user_id: { equals: {_id:{"$oid" :new ObjectId(UserId)}} }
            }
        });
        return contributions;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }

}

export async function updateContributionByIdFromMongo(contribution_id: string, changes: any): Promise<Contribution> {
    try {

        const updatedContribution = await prisma.contribution.update({
            where: {
                contribution_id
            },
            data: {
                ...changes
            }
        });
        return updatedContribution;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function getApprovedContributionByCharacterIdNameFromMongo(idName: string): Promise<Contribution[]> {
    try {
        const contributions = await prisma.contribution.findMany(); 
        const filteredContributions = contributions.filter(contribution => {
            const data = contribution.data as unknown as ContributionData;
            return data.id === idName && contribution.status === ContributionStatus.Approved;
        });
        return filteredContributions;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function getPendingContributionsFromMongo(): Promise<Contribution[]> {
    try {
        const contributions = await prisma.contribution.findMany({
            where: {
                status: ContributionStatus.Pending
            }
        });
        return contributions;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}

export async function getAllContributionsFromMongo(): Promise<Contribution[]> {
    try {
        const contributions = await prisma.contribution.findMany();
        return contributions;
    } catch (error) {
        return Promise.reject(createHttpError(500, error));
    }
}