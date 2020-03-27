import { IsNotEmpty, IsEmail, Length, IsIP, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 20, {
    message:
      'O nome do seu usuário deve ter no mínimo 2 caracteres e no máximo 20.',
  })
  username: string;

  @IsNotEmpty({ message: 'Seu e-mail não pode estar vazio.' })
  @IsEmail({}, { message: 'Seu e-mail não é válido' })
  mail: string;

  @IsString()
  @Length(6, 30, {
    message: 'A senha deve ter no mínimo 6 caracteres e no máximo 30.',
  })
  password: string;

  @IsString()
  @Length(6, 30, {
    message:
      'A confirmação da senha deve ter no mínimo 6 caracteres e no máximo 30.',
  })
  confirmationPassword: string;

  @IsIP(4, {
    message: 'IP inválido.',
  })
  ip: string;
}
