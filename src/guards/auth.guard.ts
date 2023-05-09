import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    const [, token] = authorization
      ? authorization.split(' ')
      : ['Bearer', undefined];

    try {
      const payload = this.authService.checkToken(token);
      const user = await this.userService.findOne(payload.sub);

      request.tokenPayload = payload;
      request.user = user;

      return true;
    } catch (error) {
      return false;
    }
  }
}
