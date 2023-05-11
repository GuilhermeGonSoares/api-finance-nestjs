import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new BadRequestException(
        'It is necessary to use AuthGuard, since it passes the logged in user to the request.',
      );
    }

    //  Preciso verificar se a minha classe ou função que eu apliquei esse Guard possui
    //o decorator Role.

    // Aqui retornar as Roles que são requiridas para o método ou para a classe.
    // podendo ser: undefined, user, admin ou user e admin.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const isRoleAccepted = requiredRoles.includes(user.role);

    if (!isRoleAccepted) {
      throw new ForbiddenException(
        'Access denied, route only available to admin',
      );
    }

    return isRoleAccepted;
  }
}
