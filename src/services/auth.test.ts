import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/token.js';
import { Auth } from './auth.js';

describe('Given the class Auth', () => {
  describe('When we use their bcrypt methods', () => {
    bcrypt.hash = jest.fn().mockResolvedValue('hash');
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    test('Then its method hash should have been used', async () => {
      const result = await Auth.hash('');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toBe('hash');
    });
    test('Then its method compare should have been used', async () => {
      const result = await Auth.compare('', '');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('When we use jwt methods', () => {
    jwt.sign = jest.fn().mockReturnValue('token');

    test('Then its signToken method should be used', () => {
      const result = Auth.signToken({} as TokenPayload);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toBe('token');
    });

    test('Then its verifyToken method should be called without errors', () => {
      jwt.verify = jest.fn().mockReturnValueOnce({});

      const result = Auth.verifyToken('');
      expect(jwt.verify).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
});
