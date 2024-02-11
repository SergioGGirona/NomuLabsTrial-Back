import { Comment } from './comments';
import { User, WithID } from './user';

export type Post = WithID & {
  author: User;
  overview: string;
  createdAt: Date;
  likes: User[];
  ingredients: string[];
  referenceUrl: string;
  steps: {
    arrange: string;
    boarding: string;
    complete: string;
  };
  comments: Comment[];
};
