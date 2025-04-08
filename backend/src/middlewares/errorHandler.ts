import { NextFunction, Request, Response } from 'express';
import { isHttpError } from 'http-errors';

/**
 * Middleware that act at the last line of defense against error.
 * @param {unknown} error - the error passed to the error handler
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {NextFunction} next - The Express NextFunction object
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  error: unknown,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  let errorMessage = 'An unknown error occured';
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
};