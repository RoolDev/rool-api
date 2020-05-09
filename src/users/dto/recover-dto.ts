import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MaxLength
} from 'class-validator';

export class RecoverPassword {
  @IsNotEmpty({ message: 'Seu e-mail não pode estar vazio.' })
  @IsEmail({}, { message: 'Seu e-mail não é válido' })
  @IsString()
  @MaxLength(64, {
    message: 'E-mail não pode conter mais que 25 caracteres.',
  })
  mail: string;
}

