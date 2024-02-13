import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { UserController } from '../controller/user.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { UsersRepository } from '../repository/users.repository.js';

const debug = createDebug('NomuLabs: Router');

const repository = new UsersRepository();
const userController = new UserController(repository);
const filesInterceptor = new FilesInterceptor();
const interceptor = new AuthInterceptor();

export const userRouter = createRouter();

debug('Instantiated');

userRouter.patch('/login', userController.login.bind(userController));

userRouter.get('/search/:userName', userController.search.bind(userController));

userRouter.get(
  '/users',
  interceptor.authorization.bind(interceptor),
  userController.getAll.bind(userController)
);

userRouter.get(
  '/:id',
  interceptor.authorization.bind(interceptor),
  userController.getById.bind(userController)
);

userRouter.post(
  '/register',
  filesInterceptor.singleFileStore('avatar').bind(filesInterceptor),
  userController.register.bind(userController),
  (req, res, _Next) => {
    res.json(req.body);
  }
);

userRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  userController.update.bind(userController)
);

userRouter.patch(
  '/profile:id',
  interceptor.authorization.bind(interceptor),
  interceptor.usersAuthentication.bind(interceptor),
  userController.update.bind(userController)
);

userRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.usersAuthentication.bind(interceptor),
  userController.delete.bind(userController)
);
