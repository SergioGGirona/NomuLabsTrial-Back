/* eslint-disable camelcase */
import cloudinaryBase from 'cloudinary';
import createDebug from 'debug';
import { HttpError } from '../types/error.js';
import { CloudinaryError, ImageData } from '../types/image.js';

const debug = createDebug('NomuLabs: Mediafiles');
export const defaultAvatar = {
  publicId: 'cookBook_default_avatar_2024',
  width: 1280,
  height: 1280,
  format: 'PNG',
  url: 'https://res.cloudinary.com/dn5pxi50z/image/upload/v1707321036/cookBook_default_avatar_2024.png',
};
export class CloudinaryService {
  options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };

  private cloudinary: typeof cloudinaryBase.v2;
  constructor() {
    this.cloudinary = cloudinaryBase.v2;
    this.cloudinary.config({ secure: true, sign_url: true });
    debug('Instantiated');
  }

  async uploadPhoto(imagePath: string) {
    try {
      const upload = await this.cloudinary.uploader.upload(
        imagePath,
        this.options
      );
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
