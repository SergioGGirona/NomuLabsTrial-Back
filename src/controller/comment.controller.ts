import { NextFunction, Request, Response } from 'express';
import { Comment } from '../entities/comments.js';
import { CommentsRepository } from '../repository/comments.repository.js';
import { PostsRepository } from '../repository/posts.repository.js';
import { UsersRepository } from '../repository/users.repository.js';
import { HttpError } from '../types/error.js';
import { Controller } from './controller.js';

export class CommentsController extends Controller<Comment> {
  constructor(protected repository: CommentsRepository) {
    super(repository);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userRepo = new UsersRepository();
      const postRepo = new PostsRepository();
      const user = await userRepo.getById(req.body.validatedId);
      const post = await postRepo.getById(req.params.id);

      const newCommentData = {
        content: req.body.content,
        createdAt: new Date(),
        likes: [],
        owner: req.body.validatedId,
      };

      const newComment = await this.repository.create(newCommentData);
      user.comments.push(newComment);
      post.comments.push(newComment);

      userRepo.update(user.id, user);
      postRepo.update(post.id, post);

      res.status(201);
      res.json(newComment);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params) throw new HttpError(404, 'Bad request', 'Not id found');
      const updatedComment = await this.repository.update(
        req.params.id,
        req.body
      );
      res.status(200);
      res.json(updatedComment);
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
      const newUserComments = user.comments.filter(
        (comment) => comment.id !== id
      );
      user.comments = newUserComments;
      userRepo.update(user.id, user);
      await this.repository.delete(id);

      res.json({});
      res.status(204);
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const error = new HttpError(401, 'No post id', 'Search error');
    try {
      if (!this.repository.searchCommentsByPost) throw error;
      const data = await this.repository.searchCommentsByPost(id);

      if (!data) {
        throw new HttpError(
          404,
          'No comments found',
          'Comments not found for the specified post id'
        );
      }

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
