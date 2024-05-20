import {
  IsEmail,
  IsNumberString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class SignInDto {
  username: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}
