import { User } from './user';

export type Post = {
  author: User;
  content: string;
  createdAt: Date;
  likes: User[];
  comments: Post[];
};
