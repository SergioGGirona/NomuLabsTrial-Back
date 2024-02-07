import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { FilesInterceptor } from './files.interceptor';

jest.mock('multer');

describe('Given the class FilesInterceptor', () => {
  describe('When we instantiate it', () => {
    const filesInterceptor = new FilesInterceptor();
    test('Then, method singleFileStore should be called without error', () => {
      const mockMiddleware = jest.fn();
      multer.diskStorage = jest.fn().mockImplementation(({ filename }) =>
        // eslint-disable-next-line max-nested-callbacks
        filename('', '', () => {})
      );
      (multer as unknown as jest.Mock).mockReturnValue({
        single: jest.fn().mockReturnValue(mockMiddleware),
      });

      const mockResponse = {} as Response;
      const mockRequest = {} as Request;
      const mockNext = jest.fn() as NextFunction;

      filesInterceptor.singleFileStore('')(mockRequest, mockResponse, mockNext);

      expect(mockMiddleware).toHaveBeenCalled();
    });
  });
});
