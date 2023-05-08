import { IsJWT, IsStrongPassword } from 'class-validator';

export class AuthResetDto {
  @IsJWT()
  token: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;
}
