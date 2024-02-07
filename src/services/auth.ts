import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types/error';
import { TokenPayload } from '../types/token';
export class Auth {
  private static secret = process.env.AUTH_Token!;

  static hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static signToken(payload: TokenPayload): string {
    const token = jwt.sign(payload, Auth.secret);
    return token;
  }

  static verifyToken(token: string): TokenPayload {
    try {
      const result = jwt.verify(token, Auth.secret);
      if (result === 'string') {
        throw new HttpError(498, 'Invalid Token', result);
      }

      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(498, 'Invalid Token', (error as Error).message);
    }
  }
}
