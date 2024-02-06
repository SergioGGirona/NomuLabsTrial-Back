import mongoose from 'mongoose';
import { dataBaseConnect } from './database.connect';
jest.mock('mongoose');

describe('Given dbConnect Function', () => {
  describe('When we run it', () => {
    test('It should call mongoose.connect', () => {
      mongoose.connect = jest.fn();
      dataBaseConnect();
      expect(mongoose.connect).toHaveBeenCalled();
    });
  });
});
