import { Comment } from '../entities/comments.js';
import { CommentModel } from '../entities/comments.model.js';
import { HttpError } from '../types/error.js';
import { Repository } from './repository.js';

export class CommentsRepository implements Repository<Comment> {
  async getAll(): Promise<Comment[]> {
    const data = await CommentModel.find()
      .populate('owner', { userName: 1 })
      .populate('isResponseTo', { author: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<Comment> {
    const data = await CommentModel.findById(id)
      .populate('owner', { userName: 1 })
      .populate('isResponseTo', { author: 1 })
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not found', 'Comment not found.', {
        cause: 'Trying getByID method',
      });
    }

    return data;
  }

  async create(newComment: Omit<Comment, 'id'>): Promise<Comment> {
    const data = await CommentModel.create(newComment);
    return data;
  }

  async update(id: string, newData: Partial<Comment>): Promise<Comment> {
    const data = await CommentModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('owner', { userName: 1 })
      .populate('isResponseTo', { author: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Comment not found', {
        cause: 'Trying update method',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await CommentModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Comment not found in system', {
        cause: 'Trying delete method',
      });
  }
}
