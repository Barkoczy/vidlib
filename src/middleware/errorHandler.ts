import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { Env } from '../enums';
import ErrorResponse from '../interfaces/ErrorResponse';

// @env
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: Env.PRODUCTION === process.env.NODE_ENV ? '' : err.stack,
  });
}
