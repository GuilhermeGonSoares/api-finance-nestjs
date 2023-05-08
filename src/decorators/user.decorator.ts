import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

interface ITokenPayload {
  id: number;
  name: string;
  email: string;
  role: number;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { tokenPayload } = request;

    if (!tokenPayload) {
      throw new ForbiddenException('Forbidden resource');
    }
    const token: ITokenPayload = { ...tokenPayload };
    return {
      id: token.id,
      name: token.name,
      email: token.email,
      role: token.role,
    };
  },
);
