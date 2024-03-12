import { NextFunction, Request, Response } from 'express';
import { Post } from '../entities/posts.js';
import { mockPost, mockUser } from '../mocks/mocks.js';
import { PostsRepository } from '../repository/posts.repository.js';
import { UsersRepository } from '../repository/users.repository.js';
import { HttpError } from '../types/error.js';
import { PostsController } from './post.controller.js';

describe('Given the class PostsController', () => {
  describe('When we instantiate it with no errors', () => {
    UsersRepository.prototype.update = jest.fn().mockReturnValue(mockUser);

    const mockRepo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as unknown as PostsRepository;

    let postsController: PostsController;
    beforeEach(() => {
      postsController = new PostsController(mockRepo);
    });
    const mockRequest = {
      params: { id: '01' },
      body: { validatedId: '01', userName: 'Luffy', author: '01' },
    } as unknown as Request;
    const mockNext = jest.fn() as NextFunction;

    test('Then, it should call getAll method from father and return data', async () => {
      (mockRepo.getAll as jest.Mock).mockResolvedValueOnce([mockPost]);
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockPost),
      } as unknown as Response;
      await postsController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([mockPost]);
    });

    test('Then, it should call create method and return new data', async () => {
      UsersRepository.prototype.getById = jest.fn().mockReturnValue(mockUser);

      (mockRepo.create as jest.Mock).mockResolvedValueOnce(mockPost);

      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockPost),
        status: jest.fn().mockReturnValue(201),
      } as unknown as Response;

      await postsController.create(mockRequest, mockResponse, mockNext);

      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockPost);
    });

    test('Then, it should call delete method and return data', async () => {
      UsersRepository.prototype.getById = jest.fn().mockReturnValue(mockUser);

      (mockRepo.delete as jest.Mock).mockResolvedValueOnce({});
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockResolvedValueOnce(204),
      } as unknown as Response;

      await postsController.delete(mockRequest, mockResponse, mockNext);

      expect(mockRepo.delete).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Then, it should call update method and return data', async () => {
      (mockRepo.delete as jest.Mock).mockResolvedValueOnce(mockPost);
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockPost),
        status: jest.fn().mockReturnValue(200),
      } as unknown as Response;

      await postsController.update(mockRequest, mockResponse, mockNext);

      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
  describe('When we instanciate it with errors', () => {
    const error1 = new HttpError(
      417,
      'Expectation failed',
      'Not received a photo'
    );
    const error2 = new HttpError(
      404,
      'Bad request',
      'Not conextion with repository'
    );

    let mockRepo: PostsRepository;

    let postsController: PostsController;

    beforeEach(() => {
      mockRepo = {
        update: jest.fn().mockRejectedValue(error2),
        create: jest.fn().mockRejectedValueOnce(error1),
      } as unknown as PostsRepository;
      postsController = new PostsController(mockRepo);
    });
    const mockNext = jest.fn() as NextFunction;

    test('Then, it should call update method and return error', async () => {
      const mockRequest = { file: {} } as Request;
      const mockData = {} as unknown as Post;
      const mockResponse = {
        json: jest.fn().mockRejectedValue(mockData),
      } as unknown as Response;

      await postsController.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('Then, it should call delete method and return error', async () => {
      const requestMock = {} as Request;

      const mockResponse = {} as unknown as Response;

      await postsController.delete(requestMock, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(error1).toBeInstanceOf(HttpError);
    });

    test('Then, it should call create method and return error', async () => {
      const mockRequest = {} as Request;
      const mockData = {} as unknown as Post;
      const mockResponse = {
        json: jest.fn().mockRejectedValue(mockData),
      } as unknown as Response;

      await postsController.create(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
