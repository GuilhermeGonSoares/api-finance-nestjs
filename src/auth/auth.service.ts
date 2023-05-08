import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private issuer = 'API - Finance Control';
  private expiresIn = '1 days';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  createToken(user: User) {
    const token = this.jwtService.sign(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: this.expiresIn,
        issuer: this.expiresIn,
      },
    );

    return { token };
  }

  checkToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        issuer: this.expiresIn,
      });
      return payload;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException(
        'Not found user with this combination email and password',
      );
    }

    const passwordValid = await this.compareHash(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Not found user with this combination email and password',
      );
    }

    return this.createToken(user);
  }

  async regiter(registerDto: AuthRegisterDto) {
    const user = await this.userService.create(registerDto);

    return this.createToken(user);
  }

  async forget(email: string) {
    const existUser = await this.userRepo.exist({ where: { email } });
    if (!existUser) {
      throw new UnauthorizedException(`Not found user with this ${email}`);
    }

    return existUser;
  }

  async reset(token: string, password: string) {
    return 'Precisa ser implementado';
  }

  private async compareHash(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
}
