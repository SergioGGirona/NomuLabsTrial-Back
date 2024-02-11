import { Post } from './posts';
import { User } from './user';

export type Comment = {
  isResponseTo: Post;
  owner: User;
  content: string;
  createdAt: Date;
  likes: User[];
};
