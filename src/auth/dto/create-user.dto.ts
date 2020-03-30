import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsIP,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { CompareClassProperties } from '../decorators/compare-class-properties.decorator';
import { StringNotContains } from '../decorators/string-not-contains.decorator';

export class CreateUserDto {
  @IsString()
  @Length(2, 20, {
    message:
      'O nome do seu usuário deve ter no mínimo 2 caracteres e no máximo 20.',
  })
  @Matches(/^[a-z0-9@_-]{2,20}$/i, {
    message: 'Seu usuário contém caracteres inválidos.',
  })
  @StringNotContains(['mod_', 'adm_', 'm0d_'], {
    message: 'O nome do seu usuário contém palavras bloqueadas.',
  })
  username: string;

  @IsNotEmpty({ message: 'Seu e-mail não pode estar vazio.' })
  @IsEmail({}, { message: 'Seu e-mail não é válido' })
  @MaxLength(25, {
    message: 'E-mail não pode conter mais que 25 caracteres.',
  })
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
  @CompareClassProperties('password', { message: 'Senhas não se coincidem.' })
  passwordConfirmation: string;

  @IsIP(4, {
    message: 'IP inválido.',
  })
  ip: string;
}
