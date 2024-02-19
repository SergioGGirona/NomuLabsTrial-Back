import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from '../repository/users.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/error.js';

const debug = createDebug('NomuLabs: Interceptor');

export class AuthInterceptor {
  authorization(req: Request, res: Response, next: NextFunction) {
    debug('Called authorization');

    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token) {
        throw new HttpError(498, 'Invalid token', 'No token provided');
      }

      const formData = { validatedId: Auth.verifyToken(token).id, ...req.body };
      req.body = formData;
      next();
    } catch (error) {
      next(error);
    }
  }

  async usersAuthentication(req: Request, res: Response, next: NextFunction) {
    const userId = req.body.validatedId;
    try {
      const usersRepository = new UsersRepository();
      const user = await usersRepository.getById(userId);
      if (!user) {
        const error = new HttpError(403, 'Forbidden', 'Not owner');
        next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
