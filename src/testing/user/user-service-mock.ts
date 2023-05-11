import { userEntityListMock } from './user-list.mock';

export const userServiceMock = {
  create: jest.fn(() => {
    return userEntityListMock[0];
  }),
  findAll: jest.fn(() => {
    return userEntityListMock;
  }),

  findOne: jest.fn((id) => {
    return {
      ...userEntityListMock[0],
      id,
    };
  }),
};
