import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userRepositoyMock } from '../testing/user/user-repository.mock';
import { authServiceMock } from '../testing/auth/auth-repository.mock';
import { createUserDtoMock } from '../testing/user/create-user-dto.mock';
import { userServiceMock } from '../testing/user/user-service-mock';
import { userEntityListMock } from '../testing/user/user-list.mock';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, userRepositoyMock, authServiceMock],
    })
      .overrideProvider(UserService)
      .useValue(userServiceMock)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', () => {
      expect(controller.create(createUserDtoMock)).toEqual(
        userEntityListMock[0],
      );
      expect(userServiceMock.create).toHaveBeenCalledWith(createUserDtoMock);
    });
  });

  describe('findAll', () => {
    it('should list users', () => {
      expect(controller.findAll()).toHaveLength(4);
    });
  });

  describe('findOne', () => {
    it('should find one user', () => {
      const id = '1';
      expect(controller.findOne(id)).toEqual(userEntityListMock[0]);
      expect(userServiceMock.findOne).toHaveBeenCalledWith(Number(id));
    });
  });
});
