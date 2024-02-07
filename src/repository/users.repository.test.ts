import { UserModel } from '../entities/users.model';
import { mockUser } from '../mocks/mocks';
import { UsersRepository } from './users.repository';

jest.mock('../entities/users.model');

describe('Given the class UsersRepository', () => {
  describe('When we instantiate it without errors', () => {
    let repository: UsersRepository;
    beforeEach(() => {
      repository = new UsersRepository();
    });

    test('Then, method getAll should be called', async () => {
      const mockExec = jest.fn().mockReturnValueOnce([mockUser]);

      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      await repository.getAll();
      expect(mockExec).toHaveBeenCalled();
    });

    test('Then method getById should return data', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce(mockUser);

      UserModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });

      const result = await repository.getById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(UserModel.findById).toHaveBeenCalledWith(mockUser.id);
    });

    test('Then method create should return data', async () => {
      UserModel.create = jest.fn().mockReturnValue(mockUser);
      const result = await repository.create(mockUser);
      expect(result).toEqual(mockUser);
      expect(UserModel.create).toHaveBeenCalledWith(mockUser);
    });

    test('Then method update should return data', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce(mockUser);

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });

      const result = await repository.update(mockUser.id, mockUser);

      expect(result).toEqual(mockUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    test('Then method delete should return any data', async () => {
      UserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      });

      const result = await repository.delete(mockUser.id);

      expect(result).toEqual(undefined);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then, method search should be called and return data', async () => {
      const mockExec = jest.fn().mockReturnValueOnce([mockUser]);

      UserModel.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });
      await repository.search({ key: 'userName', value: 'Luffy' });
      expect(mockExec).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with errors', () => {
    let repository: UsersRepository;
    beforeEach(() => {
      repository = new UsersRepository();
    });
    test('Then getById with no data should return an error', async () => {
      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.getById('')).rejects.toThrow();
    });
    test('Then update with no data should return an error', async () => {
      const mockData = {};
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.update('', mockData)).rejects.toThrow();
    });

    test('Then delete with no data should return an error', async () => {
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      expect(repository.delete('')).rejects.toThrow();
    });

    test('Then method search with no data should return an error', async () => {
      UserModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.search({ key: '', value: '' })).rejects.toThrow();
    });
  });
});
