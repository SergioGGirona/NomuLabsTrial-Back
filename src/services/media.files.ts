/* eslint-disable camelcase */
import cloudinaryBase from 'cloudinary';
import createDebug from 'debug';
import { HttpError } from '../types/error';
import { CloudinaryError, ImageData } from '../types/image';

const debug = createDebug('NomuLabs: Mediafiles');

export class CloudinaryService {
  private cloudinary: typeof cloudinaryBase.v2;
  constructor() {
    this.cloudinary = cloudinaryBase.v2;
    this.cloudinary.config({ secure: true, sign_url: true });
    debug('Instantiated');
  }

  async uploadPhoto(imagePath: string) {
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };
    try {
      const upload = await this.cloudinary.uploader.upload(imagePath, options);
      debug('Photo Uploaded');

      const photoData: ImageData = {
        publicId: upload.public_id,
        width: upload.width,
        height: upload.height,
        format: upload.format,
        url: upload.secure_url,
      };
      return photoData;
    } catch (error) {
      const httpError = new HttpError(
        406,
        'Not Acceptable',
        (error as CloudinaryError).error.message
      );
      throw httpError;
    }
  }

  async deletePhoto(imagePublicId: string) {
    try {
      const result = await this.cloudinary.uploader.destroy(imagePublicId);
      if (result.result === true) {
        debug('Photo Deleted');
        return true;
      }
    } catch (error) {
      const httpError = new HttpError(
        500,
        'Internal Server Error',
        (error as CloudinaryError).error.message
      );
      throw httpError;
    }
  }
}
