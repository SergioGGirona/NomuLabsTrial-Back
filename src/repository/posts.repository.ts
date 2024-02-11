import { Post } from '../entities/posts.js';
import { PostModel } from '../entities/posts.model.js';
import { HttpError } from '../types/error.js';
import { Repository } from './repository.js';

export class PostsRepository implements Repository<Post> {
  async getAll(): Promise<Post[]> {
    const data = await PostModel.find()
      .populate('author', { userName: 1 })
      .populate('comments', { owner: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<Post> {
    const data = await PostModel.findById(id)
      .populate('author', { userName: 1 })
      .populate('comments', { owner: 1 })
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not found', 'Post not found.', {
        cause: 'Trying getByID method',
      });
    }

    return data;
  }

  async create(newPost: Omit<Post, 'id'>): Promise<Post> {
    const data = await PostModel.create(newPost);
    return data;
  }

  async update(id: string, newData: Partial<Post>): Promise<Post> {
    const data = await PostModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('author', { userName: 1 })
      .populate('comments', { owner: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Post not found', {
        cause: 'Trying update method',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await PostModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Post not found in system', {
        cause: 'Trying delete method',
      });
  }
}
