import { IsString } from 'class-validator';

export class TokenRequestDto {
  @IsString()
  token: string;

  @IsString()
  refreshToken: string;
}
