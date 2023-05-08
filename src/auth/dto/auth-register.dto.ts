import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class AuthRegisterDto {
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
}
