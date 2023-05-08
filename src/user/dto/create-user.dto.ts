import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RoleUser } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @IsOptional()
  @IsIn([RoleUser.USER, RoleUser.ADMIN])
  role?: number;
}
