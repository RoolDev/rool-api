import {
  IsNotEmpty,
  IsString,
  Length
} from 'class-validator';

import { CompareClassProperties } from '../../auth/decorators/compare-class-properties.decorator';


export class ChangePasswordDTO {
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

  @IsNotEmpty({ message: 'O token não pode estar vazio.'})
  @IsString()
  token: string;
}

