import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserSSODTO {
  @IsString()
  @IsNotEmpty()
  ip: string;
}
