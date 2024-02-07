/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { NextFunction, Request, Response } from 'express';
import { Repository } from '../repository/repository.js';

export abstract class Controller<N extends { id: string }> {
  constructor(protected repository: Repository<N>) {}
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repository.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repository.getById(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
