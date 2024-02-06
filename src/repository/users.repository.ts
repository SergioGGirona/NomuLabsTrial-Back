import { User } from '../entities/user';
import { UserModel } from '../entities/users.model';
import { HttpError } from '../types/error';
import { Repository } from './repository';

export class UsersRepository implements Repository<User> {
  async getAll(): Promise<User[]> {
    const data = await UserModel.find()
      .populate('followers', { userName: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('followers', { userName: 1 })
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not found', 'User not found', {
        cause: 'Trying getByID method',
      });
    }

    return data;
  }

  async create(newData: Omit<User, 'id'>): Promise<User> {
    const data = await UserModel.create(newData);
    return data;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, { new: true })
      .populate('followers', { userName: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found', {
        cause: 'Trying update method',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await UserModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'User not found', {
        cause: 'Trying delete method',
      });
  }

  async search({ key, value }: { key: string; value: string }): Promise<User> {
    const data = await UserModel.findOne({ [key]: value })
      .populate('followers', { userName: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found', {
        cause: 'Trying search method',
      });
    return data;
  }
}
