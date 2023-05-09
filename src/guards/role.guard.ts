import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();

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
        'access denied, route only available to admin',
      );
    }

    return isRoleAccepted;
  }
}
