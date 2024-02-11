import { PostModel } from '../entities/posts.model';
import { mockPost } from '../mocks/mocks';
import { PostsRepository } from './posts.repository';

jest.mock('../entities/posts.model.js');

describe('Given the class PostsRepository', () => {
  describe('When we instantiate it without errors', () => {
    let repository: PostsRepository;
    beforeEach(() => {
      repository = new PostsRepository();
    });

    test('Then, method getAll should be called', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);

      PostModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: mockExec,
          }),
        }),
      });
      const result = await repository.getAll();
      expect(result).toEqual([]);
      expect(mockExec).toHaveBeenCalled();
    });
    test('Then method getById should return data', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce(mockPost);

      PostModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: mockExec,
          }),
        }),
      });

      const result = await repository.getById(mockPost.id);

      expect(result).toEqual(mockPost);
      expect(PostModel.findById).toHaveBeenCalledWith(mockPost.id);
    });

    test('Then method create should return data', async () => {
      PostModel.create = jest.fn().mockReturnValue(mockPost);

      const result = await repository.create(mockPost);

      expect(result).toEqual(mockPost);
      expect(PostModel.create).toHaveBeenCalledWith(mockPost);
    });
    test('Then method update should return data', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce(mockPost);

      PostModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: mockExec,
          }),
        }),
      });

      const result = await repository.update(mockPost.id, mockPost);

      expect(result).toEqual(mockPost);
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalled();
    });
    test('Then method delete should return any data', async () => {
      const mockPost = { id: '1', firstName: 'Luffy' };
      PostModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPost),
      });

      const result = await repository.delete(mockPost.id);

      expect(result).toEqual(undefined);
      expect(PostModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
  describe('When we instantiate it with errors', () => {
    let repository: PostsRepository;
    beforeEach(() => {
      repository = new PostsRepository();
    });
    test('Then getById with no data should return an error', async () => {
      PostModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.getById('')).rejects.toThrow();
    });
    test('Then update with no data should return an error', async () => {
      const mockData = {};
      PostModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.update('', mockData)).rejects.toThrow();
    });
    test('Then delete with no data should return an error', async () => {
      PostModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      expect(repository.delete('')).rejects.toThrow();
    });
  });
});
