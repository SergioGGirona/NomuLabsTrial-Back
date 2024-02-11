import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const debug = createDebug('NomuLabs: Files interceptor');
export class FilesInterceptor {
  singleFileStore(fileName: string) {
    debug('Called multer');
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
}
