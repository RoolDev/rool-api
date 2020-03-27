import { IsString, IsNotEmpty } from 'class-validator';

export class SignInUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
