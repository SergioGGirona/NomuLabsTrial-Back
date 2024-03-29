import { NextFunction, Request, Response } from 'express';
import { User, UserLogin } from '../entities/user.js';
import { UsersRepository } from '../repository/users.repository.js';
import { Auth } from '../services/auth.js';
import { CloudinaryService, defaultAvatar } from '../services/media.files.js';
import { HttpError } from '../types/error.js';
import { TokenPayload } from '../types/token.js';
import { Controller } from './controller.js';

export class UserController extends Controller<User> {
  cloudinary: CloudinaryService;

  constructor(protected repository: UsersRepository) {
    super(repository);
    this.cloudinary = new CloudinaryService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        const newPath = req.file!.destination + '/' + req.file!.filename;
        const photoData = await this.cloudinary.uploadPhoto(newPath);
        req.body.avatar = photoData;
      } else {
        req.body.avatar = defaultAvatar;
      }

      req.body.password = await Auth.hash(req.body.password);
      const newUser = await this.repository.create(req.body);
      res.status(201);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body as UserLogin;
    const error = new HttpError(401, 'Unauthorized', 'Login unauthorized');
    try {
      if (!this.repository.search) throw error;
      const data = await this.repository.search({
        key: 'userName',
        value: userName,
      });
      if (!data) throw error;

      const user = data[0];

      if (!(await Auth.compare(password, user.password))) throw error;

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

  async search(req: Request, res: Response, next: NextFunction) {
    const { userName } = req.params;
    const error = new HttpError(401, 'Unauthorized', 'Search error');
    try {
      if (!this.repository.search) throw error;
      const data = await this.repository.search({
        key: 'userName',
        value: userName,
      });
      if (!data) throw error;
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async follow(request: Request, response: Response, next: NextFunction) {
    try {
      const { validatedId } = request.body;
      const newFollowingUserId = request.body.id;

      if (validatedId === newFollowingUserId) {
        throw new Error("You can't add yourself");
      }

      const currentUser = await this.repository.getById(validatedId);
      const newFollowingUser = await this.repository.getById(
        newFollowingUserId
      );

      const currentFollow = currentUser.usersFollowed.find(
        (item) => item.id === newFollowingUserId
      );
      if (currentFollow) {
        throw new Error('This user is already in your usersToFollow list');
      }

      await newFollowingUser.followers.push(currentUser);
      await currentUser.usersFollowed.push(newFollowingUser);

      await this.repository.update(currentUser.id, currentUser);
      await this.repository.update(newFollowingUser.id, newFollowingUser);

      response.json(currentUser);
      response.status(201);
    } catch (error) {
      next(error);
    }
  }

  async unfollow(request: Request, response: Response, next: NextFunction) {
    try {
      const { validatedId } = request.body;
      const userIdToUnfollow = request.body.id;

      if (validatedId === userIdToUnfollow) {
        throw new Error('You cant unfollow yourself');
      }

      const currentUser = await this.repository.getById(validatedId);
      const userToUnfollow = await this.repository.getById(userIdToUnfollow);

      const currentUnfollow = currentUser.usersFollowed.find(
        (item) => item.id === userIdToUnfollow
      );
      if (currentUnfollow) {
        throw new Error('This user is already in your usersToFollow list');
      }

      currentUser.usersFollowed.filter((user) => user.id !== userIdToUnfollow);
      userToUnfollow.followers.filter((user) => user.id !== validatedId);

      await this.repository.update(currentUser.id, currentUser);
      await this.repository.update(userToUnfollow.id, userToUnfollow);

      response.json(currentUser);
      response.status(201);
    } catch (error) {
      next(error);
    }
  }
}
