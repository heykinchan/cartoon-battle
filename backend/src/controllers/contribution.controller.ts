import {
  NextFunction,
  Request,
  Response,
} from 'express';
import createHttpError from 'http-errors';

import {
  Character,
  ContributionActions,
  ContributionStatus,
} from '@prisma/client';

import { isUserAdmin } from '../models/admin';
import {
  addCharacterToMongo,
  getCharacterByIdNameFromMongo,
  updateCharacterByIdFromMongo,
} from '../models/character';
import {
  addContributionToMongo,
  getAllContributionByReviewerIdFromMongo,
  getAllContributionByUserIdFromMongo,
  getAllContributionsFromMongo,
  getApprovedContributionByCharacterIdNameFromMongo,
  getContributionByIdFromMongo,
  getPendingContributionsByCharacterIdNameFromMongo,
  getPendingContributionsFromMongo,
  updateContributionByIdFromMongo,
} from '../models/contribution';
import { getUserById } from '../models/user';

//const _ = require('lodash');

const getRandomId = (): number => {
    return Date.now() + Math.floor(Math.random() * 1000);
}
const { ObjectId } = require('mongodb');

async function checkPendingContributions(CharacteridName) {
    const contributions = await getPendingContributionsByCharacterIdNameFromMongo(CharacteridName);
    contributions.forEach(current => {
        if (current.status === ContributionStatus.Pending) {
            throw createHttpError(400, 'Character already has an active contribution');
        }
    });
}

function checkCharacterAction(character, action) {
    if (character && action === ContributionActions.AddCharacter) {
        throw createHttpError(400, 'Character already exists');
    }
    if (!character && (action === ContributionActions.EditCharacter || action === ContributionActions.DeleteCharacter)) {
        throw createHttpError(400, 'Character does not exist');
    }
}

export const addContribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const CharacteridName = req.body.data.data.id;
        if (!CharacteridName) {
            throw createHttpError(400, 'No Character ID Provided');
        }

        await checkPendingContributions(CharacteridName);
        const character = await getCharacterByIdNameFromMongo(CharacteridName);
        checkCharacterAction(character, req.body.data.action);

        const contribution = {
            ...req.body.data,
            contribution_id: getRandomId().toString(),
            status: ContributionStatus.Pending,
            user_id: { _id: { $oid: new ObjectId(req.user.id).toString() } },
            date: new Date().toISOString(),
            reviewed_by: null
        };
        const addedContribution = await addContributionToMongo(contribution);

        //admins can auto approve their own contributions
        if (await isUserAdmin(req.user.id)) {
            await handleApproved(contribution, req.user);
            await updateContributionByIdFromMongo(
                addedContribution.contribution_id, 
                {status: ContributionStatus.Approved, reviewed_by:{ _id: { $oid: new ObjectId(req.user.id).toString()}}});
        }

        res.json(addedContribution);
    } catch (error) {
        next(error);
    }
};

export const getSelfContribution = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const contributions = await getAllContributionByUserIdFromMongo(req.user.id as string);
        res.json(contributions);
    } catch (error) {
        next(error);
    }
}

export const getAllContributionByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {userId} = req.query;
        if (!userId) {
            throw createHttpError(400, 'No Attributes Provided');
        }
        const contributions = await getAllContributionByUserIdFromMongo(userId as string) as any;
        
        await Promise.all(contributions.map(async (contribution) => {
            const character = await getCharacterByIdNameFromMongo(contribution.data.id);
            const reviewerId = contribution.reviewed_by as any;
            if(reviewerId){
                const reviewer = await getUserById(reviewerId._id.$oid);
                contribution.reviewer = reviewer;
                contribution.character = character;
            }else{
                contribution.reviewer = null;
                contribution.character = null;
            }
        }));

        res.json(contributions);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getContributionById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const contribution = await getContributionByIdFromMongo(req.query.id as string) as any;
        res.json(contribution);
    } catch (error) {
        next(error);
    }
};

export const getContributionByReviewerId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {reviewerId} = req.query;
        const reviewer = {_id: { $oid: new ObjectId(reviewerId).toString() }};
        const contributions = await getAllContributionByReviewerIdFromMongo(reviewer);
        res.json(contributions);
    } catch (error) {
        next(error);
    }
}

function updateCharacter(original, updates) {
    const updatedCharacter = {...original};
    for (const key in updates) {
        if (key !== 'id') {
            updatedCharacter[key] = updates[key];
        }
    }
    return updatedCharacter;
}

async function checkContributionValidity(contribution) {
    if (!contribution) {
        throw createHttpError(404, 'Contribution not found');
    }
    if (contribution.status !== ContributionStatus.Pending) {
        throw createHttpError(400, 'Contribution already resolved');
    }
}

async function updateCharacterStatus(contribution) {
    const oldCharacter = await getCharacterByIdNameFromMongo(contribution.data.idName);
    let newCharacter;
    if (contribution.action === ContributionActions.EditCharacter) {
        newCharacter = updateCharacter(oldCharacter, contribution.data);
    } else if (contribution.action === ContributionActions.DeleteCharacter) {
        newCharacter = updateCharacter(oldCharacter, { active: false });
    }


    await updateCharacterByIdFromMongo(newCharacter);
}

async function checkAdminPermission(user) {
    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
        throw createHttpError(403, 'Unauthorized');
    }
}

async function handleApproved(contribution, user) {
    await checkAdminPermission(user);
    contribution.data.idName = contribution.data.id;
    delete contribution.data.id;

    if (contribution.action === ContributionActions.AddCharacter) {
        contribution.data.active = true;
        await addCharacterToMongo(contribution.data as Character);
    } else {
        const old_data = await getCharacterByIdNameFromMongo(contribution.data.idName);
        await updateCharacterStatus(contribution);
        //update contribution changelog
        const new_data = await getCharacterByIdNameFromMongo(contribution.data.idName);
        await updateContributionByIdFromMongo(contribution.contribution_id,{old_data,new_data})
    }
}

async function handleRejected(user) {
    await checkAdminPermission(user);
}

async function handleCancelled(contribution, user) {
    if (contribution.user_id._id.$oid !== user.id) {
        throw createHttpError(403, 'you do not own this contribution');
    }
}

export const resolveContribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contributionid, status } = req.body;
        if (!contributionid || !status) {
            throw createHttpError(400, 'No Attributes Provided');
        }

        const contribution = await getContributionByIdFromMongo(contributionid);
        await checkContributionValidity(contribution);
        switch (status) {
            case ContributionStatus.Approved:
                await handleApproved(contribution, req.user);
                break;
            case ContributionStatus.Rejected:
                await handleRejected(req.user);
                break;
            case ContributionStatus.Cancelled:
                await handleCancelled(contribution, req.user);
                break;
            default:
                throw createHttpError(400, 'Invalid status');
        }

        const updatedContribution = await updateContributionByIdFromMongo(contributionid, {status, reviewed_by:{ _id: { $oid: new ObjectId(req.user.id).toString()}}});
        res.json(updatedContribution);
    } catch (error) {
        next(error);
    }
};


export const getContributionsByCharacterId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const characterName = req.query.characterName as string;
        if(!characterName){
            throw createHttpError(400, 'No Attributes Provided');
        }
        const contributions = await getApprovedContributionByCharacterIdNameFromMongo(characterName) as any[];
        if(contributions.length === 0){
            throw createHttpError(404, 'No Contributions Found');
        }
        const contributionsWithUser = await Promise.all(contributions.map(async (contribution) => {
            const user = await getUserById(contribution.user_id._id.$oid);

            return { ...contribution, user};
        }));
        res.json(contributionsWithUser);
    } catch (error) {
        next(error);
    }
}

export const getPendingContributions = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const contributions = await getPendingContributionsFromMongo() as any[];
        const contributionsWithUser = await Promise.all(contributions.map(async (contribution) => {
            const user = await getUserById(contribution.user_id._id.$oid);
            const character = await getCharacterByIdNameFromMongo(contribution.data.id);
            return { ...contribution, user, character};
        }));
        
        res.json(contributionsWithUser);
    } catch (error){
        next(error);
    }
}


export const getAllContributions = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const contributions = await getAllContributionsFromMongo() as any[];
        const contributionsWithUser = await Promise.all(contributions.map(async (contribution) => {
            const user = await getUserById(contribution.user_id._id.$oid);
            const character = await getCharacterByIdNameFromMongo(contribution.data.id);
            return { ...contribution, user, character};
        }));
        
        res.json(contributionsWithUser);
    } catch (error){
        next(error);
    }
}