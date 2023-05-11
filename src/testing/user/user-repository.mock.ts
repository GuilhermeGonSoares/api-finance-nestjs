import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { userEntityListMock } from './user-list.mock';

export const userRepositoyMock = {
  provide: getRepositoryToken(User),
  useValue: {
    create: jest.fn(),
    save: jest.fn().mockResolvedValue(userEntityListMock[0]),
    find: jest.fn().mockResolvedValue(userEntityListMock[0]),
    findOneBy: jest.fn().mockResolvedValue(userEntityListMock[0]),
    exist: jest.fn().mockResolvedValue(false),
    remove: jest.fn().mockResolvedValue(userEntityListMock[0]),
  },
};
// Preciso definir o que eu espero que cada função MOCADA acima me retorne
// por exemplo eu espero que save() me retorne um valor resolvido de uma promisse e que ele seja igual
// ao primeiro elemento que eu defini na lista userEntityListMock.
