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
