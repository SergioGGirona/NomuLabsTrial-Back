import { User, WithID } from './user';

export type Comment = WithID & {
  content: string;
  createdAt: Date;
  likes: User[];
};
