import { Comment } from '../entities/comments';
import { Post } from '../entities/posts';
import { User } from '../entities/user';

export const mockUser = {
  userName: 'luffy',
  password: 'luffy',
  email: 'luffy@nomulabs.com',
  nickName: 'luffy',
  followers: [{ id: '02' }, { id: '03' }],
  usersFollowed: [{ id: '02' }, { id: '03' }],
  bio: 'Test for an user',
  isPrivate: true,
  avatar: {},
  id: '01',
  posts: [{ id: '001' }],
  comments: [{ id: '0001' }],
} as unknown as User;
export const mockUser2 = {
  userName: 'zoro',
  password: 'zoro',
  email: 'zoro@nomulabs.com',
  nickName: 'zoro',
  followers: [],
  bio: 'Test for an user',
  isPrivate: false,
  avatar: {},
  id: '02',
  posts: [{ id: '002' }],
  comments: [{ id: '0002' }],
} as unknown as User;

export const mockPost = {
  author: {
    userName: 'Luffy',
  },
  overview: 'Test for a post',
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
  followers: [{ id: '02' }, { id: '03' }],
  usersFollowed: [{ id: '02' }, { id: '03' }],
} as unknown as Post;

export const mockComment = {
  isResponseTo: { author: 'Zoro' },
  owner: { userName: 'Luffy' },
  description: 'Test for a comment',
  ID: '0001',
  likes: [],
} as unknown as Comment;
