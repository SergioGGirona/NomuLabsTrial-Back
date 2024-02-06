import { ImageData } from '../types/image';

export type UserLogin = {
  userName: string;
  password: string;
  email: string;
};

export type UserNoID = UserLogin & {
  nickName: string;
  followers: User[];
  bio: string;
  isPrivate: boolean;
  bornDate: Date;
  avatar: ImageData;
};

export type WithID = {
  id: string;
};

export type User = UserNoID & WithID;
