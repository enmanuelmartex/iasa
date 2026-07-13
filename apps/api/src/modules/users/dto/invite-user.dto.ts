import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['ANALYST', 'VIEWER'])
  role?: string;
}
