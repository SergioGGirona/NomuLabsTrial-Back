import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { mockUser } from '../mocks/mocks.js';
import { UsersRepository } from '../repository/users.repository.js';
import { Auth } from '../services/auth.js';
import { CloudinaryService } from '../services/media.files.js';
import { UserController } from './user.controller.js';

describe('Given the class UserController', () => {
  describe('When we instantiate it', () => {
    const mockRepo: UsersRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
    } as unknown as UsersRepository;
    let userController: UserController;
    beforeEach(() => {
      userController = new UserController(mockRepo);
    });
    test('should call getAll from father and return data', async () => {
      (mockRepo.getAll as jest.Mock).mockResolvedValueOnce(mockUser);

      const mockRequest = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalledWith();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    test('Then, you should call getbyID from father', async () => {
      const mockRequest = { params: { id: '1' } } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await userController.getById(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getById).toHaveBeenCalled();
    });

    test('Then, you should call update from father and return data', async () => {
      (mockRepo.update as jest.Mock).mockResolvedValueOnce(mockUser);

      const mockRequest = {
        params: { id: '1' },
        body: { name: 'Luffy' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await userController.update(mockRequest, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    test('Then, you should call delete from father and return data', async () => {
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(mockUser);

      const mockCloudinaryService = {
        deletePhoto: jest.fn().mockResolvedValue(true),
      } as unknown as CloudinaryService;
      userController.cloudinary = mockCloudinaryService;

      const mockRequest = { params: { id: mockUser.id } } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await userController.delete(mockRequest, mockResponse, mockNext);

      expect(mockCloudinaryService.deletePhoto).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then, you should call login with no errors', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValueOnce([mockUser]);

      const mockRequest = {
        params: { id: '1' },
        body: { userName: 'Luffy', password: '1234' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn().mockResolvedValueOnce(mockUser),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;
      Auth.compare = jest.fn().mockResolvedValueOnce(true);
      Auth.signToken = jest.fn().mockResolvedValueOnce('token');
      await userController.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(mockRepo.search).toBeCalledWith({
        key: 'userName',
        value: 'Luffy',
      });
    });

    test('Then, you should call create', async () => {
      Auth.hash = jest.fn().mockResolvedValueOnce(mockUser.password);
      (mockRepo.create as jest.Mock).mockResolvedValueOnce(mockUser);

      const mockCloudinaryService = {
        uploadPhoto: jest.fn().mockResolvedValue(true),
      } as unknown as CloudinaryService;

      userController.cloudinary = mockCloudinaryService;

      const mockRequest = {
        body: { id: '01', userName: 'Luffy', password: '1234' },
        file: { destination: '', filename: '' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn().mockResolvedValueOnce(mockUser),
        status: jest.fn().mockResolvedValueOnce(201),
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await userController.register(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    test('Then, you should call updateProfilePhoto', async () => {
      (mockRepo.update as jest.Mock).mockResolvedValueOnce(mockUser);

      const mockRequest = {
        file: { url: '01', filename: 'avatar' },
        body: { avatar: 'Luffy', id: '01' },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn().mockResolvedValueOnce(mockUser),
        status: jest.fn().mockResolvedValueOnce(201),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;
      const mockCloudinaryService = {
        uploadPhoto: jest.fn().mockResolvedValue(true),
      } as unknown as CloudinaryService;

      userController.cloudinary = mockCloudinaryService;
      await userController.updateProfilePhoto(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockRepo.update).toHaveBeenCalled();
    });

    test('Then, you should call search with no errors', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValueOnce([mockUser]);

      const mockRequest = {
        params: { userName: 'Luffy' },
        body: { key: 'userName', value: 'Luffy' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn().mockResolvedValueOnce(mockUser),
        status: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;

      await userController.search(mockRequest, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(mockRepo.search).toBeCalledWith({
        key: 'userName',
        value: 'Luffy',
      });
    });

    test('Then, you should call follow', async () => {
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(mockUser);
      (mockRepo.update as jest.Mock).mockResolvedValueOnce(mockUser);

      const mockRequest = {
        params: { id: '02' },
        body: { name: 'Zoro', validatedId: '02', id: '03' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await userController.follow(mockRequest, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
    });

    test('Then, you should call unfollow', async () => {
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(mockUser);
      (mockRepo.update as jest.Mock).mockResolvedValueOnce(mockUser);

      const mockRequest = {
        params: { id: '02' },
        body: { name: 'Zoro', validatedId: '02', id: '03' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await userController.unfollow(mockRequest, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
    });
  });

  describe('when we instantiate it with errors', () => {
    const mockRepo: UsersRepository = {
      getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
      getById: jest.fn().mockRejectedValueOnce(new Error('getById Error')),
      create: jest.fn().mockRejectedValueOnce(new Error('create Error')),
      update: jest.fn().mockRejectedValueOnce(new Error('update Error')),
      delete: jest.fn().mockRejectedValueOnce(new Error('delete Error')),
      search: jest.fn().mockRejectedValueOnce(new Error('search Error')),
    } as unknown as UsersRepository;

    const userController = new UserController(mockRepo);
    const mockData = {
      id: '1',
      userName: 'Luffy',
      password: '1234',
    } as unknown as User;

    const mockRequest = {
      params: { id: '1' },
      body: { userName: 'Luffy', password: '1234' },
    } as unknown as Request;
    const mockResponse = {
      json: jest.fn(),
    } as unknown as Response;

    test('should call the next error function of getAll', async () => {
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalledWith();
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });
    test('should call the next error function of getById', async () => {
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await userController.getById(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
    test('should catch the error of login', async () => {
      (mockRepo.search as jest.Mock).mockRejectedValueOnce(mockData);

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest
        .fn()
        .mockResolvedValueOnce(new Error('search Error'));
      Auth.compare = jest.fn().mockResolvedValueOnce(false);

      await userController.login(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
    test('should call the next error function of update', async () => {
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await userController.update(mockRequest, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('update Error'));
    });

    test('should call the next error function of register', async () => {
      const mockNext = jest.fn();

      await userController.register(mockRequest, mockResponse, mockNext);

      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    test('should call the next error function of updateProfilePhoto', async () => {
      const mockNext = jest.fn();

      await userController.updateProfilePhoto(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    test('should call the next error function of search', async () => {
      const mockNext = jest.fn();

      await userController.search(mockRequest, mockResponse, mockNext);

      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    test('should call the next error function of follow and unfollow', async () => {
      const mockNext = jest.fn();

      await userController.follow(mockRequest, mockResponse, mockNext);
      await userController.unfollow(mockRequest, mockResponse, mockNext);

      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
