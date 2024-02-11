import { ImageData } from '../types/image';
import { Comment } from './comments';
import { Post } from './posts';

export type UserLogin = {
  userName: string;
  password: string;
};

export type UserNoID = UserLogin & {
  email: string;
  nickName: string;
  followers: User[];
  usersFollowed: User[];
  bio: string;
  isPrivate: boolean;
  bornDate: Date;
  avatar: ImageData;
  posts: Post[];
  comments: Comment[];
};

export type WithID = {
  id: string;
};

export type User = UserNoID & WithID;
