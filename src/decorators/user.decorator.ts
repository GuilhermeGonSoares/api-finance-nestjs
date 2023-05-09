import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
export const UserDecorator = createParamDecorator(
  (filter: Exclude<keyof User, 'finances'>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException(
        'it is necessary to use the Guard AuthGuard to be able to access the decorator @UserDecorator',
      );
    }

    if (!filter) {
      return user;
    }

    return user[filter];
  },
);
