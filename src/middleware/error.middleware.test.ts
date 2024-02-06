import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../types/error';
import { errorMiddleware } from './error.middleware';

describe('Given the function errorMiddleware', () => {
  describe('When we call it', () => {
    const mockRequest = {} as unknown as Request;
    const mockNext = jest.fn() as NextFunction;

    test('Then it should return HttpError.status', () => {
      const mockError = new HttpError(400, 'Error Test', 'Error Http');
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(404),
        json: jest.fn().mockResolvedValueOnce(mockError),
        statusMessage: 'Error Test',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.status);
    });

    test('Then validation Error should have been called', () => {
      const mockError = new mongoose.Error.ValidationError();
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn().mockResolvedValueOnce(mockError),
        statusMessage: 'Bad request',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalled();
    });
    test('Then Casting Error should have been called', () => {
      const mockError = new mongoose.Error.CastError(
        '400',
        'Error',
        'Bad request'
      );
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn().mockResolvedValueOnce(mockError),
        statusMessage: 'Bad request',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalled();
    });

    test('Then Non Unique Error should have been called', () => {
      const mockError = new mongoose.mongo.MongoServerError({
        message: 'Non unique error',
      });
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn().mockResolvedValueOnce(mockError),
        statusMessage: 'Non unique error',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalled();
    });

    test('Then it should return a server Error', () => {
      const mockError = {
        status: 500,
        name: 'Error Test',
        message: 'Server error',
      };
      const mockResponse = {
        status: jest.fn().mockResolvedValueOnce(400),
        json: jest.fn().mockResolvedValueOnce(mockError),
        statusMessage: 'Bad request',
      } as unknown as Response;
      errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.status);
    });
  });
});
