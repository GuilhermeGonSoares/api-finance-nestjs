import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private issuer = 'API - Finance Control';
  private expiresIn = '1 days';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly mailer: MailerService,
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
        issuer: this.issuer,
      },
    );

    return { token };
  }

  checkToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        issuer: this.issuer,
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
    const user = await this.userService.findUserByEmail(email);

    const token = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: this.issuer,
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de Senha',
      to: email,
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });

    return true;
  }

  async reset(token: string, password: string) {
    const { id } = this.checkToken(token);
    const user = await this.userService.findOne(id);
    user.password = await this.userService.createPasswordHash(password);

    const updatedUser = await this.userRepo.save(user);
    return this.createToken(updatedUser);
  }

  private async compareHash(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
}
