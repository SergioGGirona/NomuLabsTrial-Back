import { NextFunction, Request, Response } from 'express';
import { User, UserLogin } from '../entities/user';
import { UsersRepository } from '../repository/users.repository';
import { Auth } from '../services/auth';
import { CloudinaryService } from '../services/media.files';
import { HttpError } from '../types/error';
import { TokenPayload } from '../types/token';
import { Controller } from './controller';

export class UserController extends Controller<User> {
  cloudinary: CloudinaryService;

  constructor(protected repository: UsersRepository) {
    super(repository);
    this.cloudinary = new CloudinaryService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        req.body.avatar =
          'https://res.cloudinary.com/dn5pxi50z/image/upload/v1707304852/rez0ca29trmyzbyg55ow.png';
      }

      req.body.password = await Auth.hash(req.body.password);
      const newPath = req.file!.destination + '/' + req.file!.filename;
      const photoData = await this.cloudinary.uploadPhoto(newPath);
      req.body.avatar = photoData;

      const newUser = await this.repository.create(req.body);
      res.status(201);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body as unknown as UserLogin;
    const error = new HttpError(401, 'Unauthorized', 'Login unauthorized');
    try {
      if (!this.repository.search) return;
      const data = await this.repository.search({
        key: 'userName',
        value: userName,
      });
      if (data.length) throw error;

      const user = data[0];
      if (!(await Auth.compare(password, user.password))) {
        throw error;
      }

      const payload: TokenPayload = {
        id: user.id,
        userName: user.userName,
        userNickname: user.nickName,
      };
      const token = Auth.signToken(payload);
      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await this.repository.getById(id);
      await this.cloudinary.deletePhoto(user.avatar.publicId);
      await this.repository.delete(id);
      res.status(204);
      res.json({});
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password &&= await Auth.hash(req.body.password);
      const finalItem = await this.repository.update(req.params.id, req.body);

      res.json(finalItem);
    } catch (error) {
      next(error);
    }
  }

  async updateProfilePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        req.body.avatar =
          'https://res.cloudinary.com/dn5pxi50z/image/upload/v1707304852/rez0ca29trmyzbyg55ow.png';
      }

      const newPath = req.file!.destination + '/' + req.file!.filename;
      const photoData = await this.cloudinary.uploadPhoto(newPath);
      req.body.avatar = photoData;
      const updatedUser = await this.repository.update(req.body.id, req.body);
      res.status(201);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}