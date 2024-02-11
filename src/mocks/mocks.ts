import { Comment } from '../entities/comments';
import { Post } from '../entities/posts';
import { User } from '../entities/user';

export const mockUser = {
  userName: 'luffy',
  password: 'luffy',
  email: 'luffy@nomulabs.com',
  nickName: 'luffy',
  followers: [],
  bio: 'Test for an user',
  isPrivate: true,
  avatar: {},
  id: '01',
} as unknown as User;

export const mockPost = {
  author: {
    userName: 'Luffy',
  },
  content: 'Test for a post',
  likes: [],
  ingredients: ['test', 'testb'],
  referenceUrl: 'Shonen',
  steps: {
    arrange: 'Test a',
    boarding: 'Test b',
    complete: 'Test c',
  },
  comments: [{ owner: 'Zoro' }],
  id: '001',
} as unknown as Post;

export const mockComment = {
  isResponseTo: { author: 'Zoro' },
  owner: { userName: 'Luffy' },
  content: 'Test for a comment',
  likes: [],
} as unknown as Comment;
