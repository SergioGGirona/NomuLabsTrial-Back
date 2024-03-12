import { Router as createRouter } from 'express';
import { PostsController } from '../controller/post.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { PostsRepository } from '../repository/posts.repository.js';

const repository = new PostsRepository();
const postsController = new PostsController(repository);
const authInterceptor = new AuthInterceptor();
const interceptor = new FilesInterceptor();

export const postRouter = createRouter();

postRouter.get('/', postsController.getAll.bind(postsController));
postRouter.get('/:id', postsController.getById.bind(postsController));

postRouter.post(
  '/add',
  authInterceptor.authorization.bind(authInterceptor),
  interceptor.noFileStore().bind(interceptor),
  postsController.create.bind(postsController)
);

postRouter.patch(
  '/update/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  postsController.update.bind(postsController)
);

postRouter.delete(
  '/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  postsController.delete.bind(postsController)
);
