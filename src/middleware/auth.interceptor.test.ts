import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from '../repository/users.repository';
import { Auth } from '../services/auth';
import { HttpError } from '../types/error';
import { AuthInterceptor } from './auth.interceptor';

jest.mock('../services/auth.js');

describe('Given the class AuthInterceptor', () => {
  let testInterceptor: AuthInterceptor;
  beforeEach(() => {
    testInterceptor = new AuthInterceptor();
  });
  describe('When we intantiate authorization without error', () => {
    const mockRequest = {
      get: jest.fn().mockReturnValue('Test Token'),
      body: { id: '01' },
    } as unknown as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn();
    test('Authorization should be used without errors', () => {
      Auth.verifyToken = jest.fn().mockReturnValueOnce({ id: '01' });
      testInterceptor.authorization(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('When we intantiate authorization with no token', () => {
    const mockError = new HttpError(498, 'Invalid token', 'No token provided');
    const mockRequest = {
      get: jest.fn().mockReturnValue(''),
      body: { id: '01' },
    } as unknown as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    test('Authorization should be used without errors', () => {
      Auth.verifyToken = jest.fn().mockReturnValueOnce({ id: '01' });
      testInterceptor.authorization(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('When we intantiate usersAuthentication without error', () => {
    const mockRepo = new UsersRepository();
    const mockUser = { validatedId: '01' };
    mockRepo.getById = jest.fn().mockResolvedValueOnce(mockUser);

    const mockRequest = {
      body: { id: '01', validatedId: '01' },
    } as unknown as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    test('Authorization should catch with error', async () => {
      await testInterceptor.usersAuthentication(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('When we intantiate usersAuthentication', () => {
    const mockError = new HttpError(403, 'Forbidden', 'Not owner');
    const mockRequest = {
      body: { validatedId: '01' },
    } as unknown as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    test('Then with no user Authorization should throw error ', async () => {
      UsersRepository.prototype.getById = jest.fn().mockResolvedValue(null);

      await testInterceptor.usersAuthentication(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then with wrong user Authorization should throw error ', async () => {
      await testInterceptor.usersAuthentication(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
