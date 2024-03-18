import { NextFunction, Request, Response } from 'express';
import { Post } from '../entities/posts.js';
import { PostsRepository } from '../repository/posts.repository.js';
import { UsersRepository } from '../repository/users.repository.js';
import { CloudinaryService } from '../services/media.files.js';
import { HttpError } from '../types/error.js';
import { Controller } from './controller.js';

export class PostsController extends Controller<Post> {
  cloudinary: CloudinaryService;
  constructor(protected repository: PostsRepository) {
    super(repository);
    this.cloudinary = new CloudinaryService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.images ||= [];

      if (req.files instanceof Array && req.files.length > 0) {
        const { files } = req;
        for (const file of files) {
          const newPath = file.destination + '/' + file.filename;
          // eslint-disable-next-line no-await-in-loop
          const postPhoto = await this.cloudinary.uploadPhoto(newPath);
          console.log('primer push antes');
          req.body.images.push(postPhoto);
        }
      } else {
        req.body.images = [];
      }

      const { validatedId } = req.body;
      const userRepo = new UsersRepository();
      const user = await userRepo.getById(validatedId);
      req.body.author = user.id;

      const date = new Date();
      req.body.createdAt = date;

      const newPost = await this.repository.create(req.body);
      user.posts.push(newPost);

      userRepo.update(user.id, user);

      res.status(201);
      res.json(newPost);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params) throw new HttpError(404, 'Bad request', 'Not id found');
      const updatedPost = await this.repository.update(req.params.id, req.body);
      res.status(200);
      res.json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { validatedId } = req.body;

      const userRepo = new UsersRepository();
      const user = await userRepo.getById(validatedId);
      const newUserPosts = user.posts.filter((post) => post.id !== id);
      user.posts = newUserPosts;
      userRepo.update(user.id, user);

      await this.repository.delete(id);

      res.status(204);
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
