import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    const [, token] = authorization
      ? authorization.split(' ')
      : ['Bearer', undefined];

    try {
      const payload = this.authService.checkToken(token);
      request.tokenPayload = payload;

      return true;
    } catch (error) {
      return false;
    }
  }
}
