import {
  createParamDecorator,
  BadRequestException,
  ExecutionContext,
} from '@nestjs/common';

export const Month = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { month } = req.query;
    if (!month) {
      throw new BadRequestException('Month parameter is required');
    }
    return month;
  },
);
