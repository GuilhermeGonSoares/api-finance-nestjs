import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { createUserDtoMock } from '../testing/user/create-user-dto.mock';
import { userRepositoyMock } from '../testing/user/user-repository.mock';
import { userEntityListMock } from '../testing/user/user-list.mock';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoyMock],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should verify UserService definition', () => {
    expect(userService).toBeDefined();
  });

  describe('Create', () => {
    it('should create a user', async () => {
      const userMock = createUserDtoMock;
      const result = await userService.create(userMock);

      expect(result).toEqual(userEntityListMock[0]);
    });
    it('should call existUser with the correct email', async () => {
      const userMock = createUserDtoMock;
      const existUserSpy = jest.spyOn(userService, 'existUser');
      await userService.create(userMock);
      expect(existUserSpy).toHaveBeenCalledWith(userMock.email);
    });

    it('should call createPasswordHash with the correct password', async () => {
      const userMock = createUserDtoMock;
      const { password } = userMock;
      const createPasswordHashSpy = jest.spyOn(
        userService,
        'createPasswordHash',
      );
      await userService.create(userMock);
      expect(createPasswordHashSpy).toHaveBeenCalledWith(password);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const userMock = createUserDtoMock;
      const existSpy = jest.spyOn(userRepositoyMock.useValue, 'exist');
      existSpy.mockResolvedValue(true);
      const existUserSpy = jest.spyOn(userService, 'existUser');
      await expect(userService.create(userMock)).rejects.toThrow(
        BadRequestException,
      );
      expect(existUserSpy).toHaveBeenCalledWith(userMock.email);
    });
  });
  // describe('Read', () => {});
  // describe('Update', () => {});
  // describe('Delete', () => {});
});
