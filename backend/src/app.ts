import * as path from 'path';
import cors from 'cors';
import express from 'express';
import createHttpError from 'http-errors';

import { errorHandler } from './middlewares/errorHandler';
import { defaultRouter } from './routes/api/default.router';
import { apiRouter } from './routes/api.router';


const app: express.Express = express();
app.use(cors());

app.use(express.json());

// Sets up base router
app.use('/', defaultRouter);

app.use('/api', apiRouter);



app.use((req, res, next) => {
    next(createHttpError(404, 'Endpoint not found'));
  });

/**
 * Middleware that act at the last line of defense against error.
 * @param {unknown} error - the error passed to the error handler
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {NextFunction} next - The Express NextFunction object
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(errorHandler);

export default app;