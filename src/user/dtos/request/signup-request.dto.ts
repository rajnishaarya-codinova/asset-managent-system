import { IsEmail, IsString } from 'class-validator';

export class SignupRequestDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  company: string;
}
