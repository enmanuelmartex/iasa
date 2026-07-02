import { IsBoolean } from 'class-validator';

export class SetStatusDto {
  @IsBoolean()
  isActive: boolean;
}
