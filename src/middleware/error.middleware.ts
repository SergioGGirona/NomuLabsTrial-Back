import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../types/error.js';

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let typeError = '';
  if (error instanceof HttpError) {
    res.status(400);
    res.statusMessage = 'Not accepted';
    typeError = 'Error Http';
  } else if (error instanceof mongoose.Error.ValidationError) {
    res.status(400);
    res.statusMessage = 'Bad request';
    typeError = 'Validation http';
  } else if (error instanceof mongoose.Error.CastError) {
    res.status(400);
    res.statusMessage = 'Not accepted';
    typeError = 'Casting error';
  } else if (error instanceof mongoose.mongo.MongoServerError) {
    res.status(406);
    res.statusMessage = 'Not accepted';
    typeError = 'Non unique error';
  } else {
    res.status(500);
    typeError = 'Server error';
  }

  res.json({
    typeError,
    status: res.statusCode,
    errorName: error.name,
    statusMessage: res.statusMessage,
    message: error.message,
  });
};
