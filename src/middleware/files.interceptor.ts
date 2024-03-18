import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const debug = createDebug('NomuLabs: Files interceptor');
export class FilesInterceptor {
  singleFileStore(fileName: string) {
    debug('Called singleFileStore');
    const storage = multer.diskStorage({
      destination: './uploads',
      filename(req, file, callback) {
        callback(null, 'Cookbook_' + file.originalname);
      },
    });

    const upload = multer({ storage });
    const middleware = upload.single(fileName);
    return (req: Request, res: Response, next: NextFunction) => {
      const previousFile = req.body;
      middleware(req, res, next);
      req.body = { ...previousFile, ...req.body };
    };
  }

  noFileStore() {
    debug('Called multer with no file storage');
    const upload = multer();

    return (req: Request, res: Response, next: NextFunction) => {
      const previousFile = req.body;
      upload.none()(req, res, (err: any) => {
        if (err) {
          return next(err);
        }

        req.body = { ...previousFile, ...req.body };
        next();
      });
    };
  }

  multiFilesStore(filesName: string) {
    debug('Called MultiFilesStore');

    const storage = multer.diskStorage({
      destination: './uploads',
      filename(req, file, callback) {
        callback(null, 'Cookbook_recipe' + file.originalname);
      },
    });

    const upload = multer({ storage });
    const middleware = upload.array(filesName, 3);

    return (req: Request, res: Response, next: NextFunction) => {
      const previousFile = req.body;
      middleware(req, res, next);
      req.body = { ...previousFile, ...req.body };
    };
  }
}
