import { IsOptional, IsString } from 'class-validator';

export class UpdateUserSelfDto {
  @IsOptional()
  @IsString()
  readonly password: string;
}
