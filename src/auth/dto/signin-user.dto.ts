import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SignInUserDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}
