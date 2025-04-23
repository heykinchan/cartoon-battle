import express from 'express';

import {
  addContribution,
  getAllContributionByUserId,
  getAllContributions,
  getContributionById,
  getContributionByReviewerId,
  getContributionsByCharacterId,
  getPendingContributions,
  resolveContribution,
} from '../../controllers/contribution.controller';
import { adminHandler } from '../../middlewares/adminHandler';
import { authHandler } from '../../middlewares/authHandler';

export const contributionRouter = express.Router();

//add a contribution
contributionRouter.post('/contribution',
    authHandler,
    addContribution
);

//get all contributions by character idName
contributionRouter.get('/characterIdName',
    authHandler,
    adminHandler,
    getContributionsByCharacterId
)
contributionRouter.get('/contributions',
    authHandler,
    adminHandler,
    getAllContributions
)
//get all contributions by user id
contributionRouter.get('/userId',
    authHandler,
    getAllContributionByUserId
);

//get contributions by Contiribution id
contributionRouter.get('/id',
    authHandler,
    getContributionById
);

//get contributions by reviewer id
contributionRouter.get('/reviewerId',
    authHandler,
    adminHandler,
    getContributionByReviewerId
);

//resolve a contribution
contributionRouter.post('/resolve',
    authHandler,
    resolveContribution
)
//get all pending contributions
contributionRouter.get('/pending',authHandler,adminHandler,getPendingContributions)