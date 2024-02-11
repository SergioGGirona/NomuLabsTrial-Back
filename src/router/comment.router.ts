import { Router as createRouter } from 'express';
import { CommentsController } from '../controller/comment.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { CommentsRepository } from '../repository/comments.repository.js';

const repository = new CommentsRepository();
const commentsController = new CommentsController(repository);
const authInterceptor = new AuthInterceptor();

export const commentRouter = createRouter();

commentRouter.get('/', commentsController.getAll.bind(commentsController));
commentRouter.get('/:id', commentsController.getById.bind(commentsController));

commentRouter.post(
  '/add/:id',
  authInterceptor.authorization.bind(authInterceptor),
  commentsController.create.bind(commentsController)
);

commentRouter.patch(
  '/update/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  commentsController.update.bind(commentsController)
);

commentRouter.delete(
  '/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  commentsController.update.bind(commentsController)
);
