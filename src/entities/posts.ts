import { Comment } from './comments';
import { User, WithID } from './user';

export type Post = WithID & {
  author: User;
  overview: string;
  createdAt: Date;
  likes: User[];
  ingredients: string[];
  referenceUrl: string;
  aproxTime: number;
  steps: {
    arrange: string;
    boarding: string;
    complete: string;
  };
  comments: Comment[];
  images: ImageData[];
};
