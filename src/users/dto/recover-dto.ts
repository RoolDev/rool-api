import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MaxLength
} from 'class-validator';

export class RecoverPasswordDTO {
  @IsNotEmpty({ message: 'Seu e-mail não pode estar vazio.' })
  @IsEmail({}, { message: 'Seu e-mail não é válido' })
  @IsString()
  @MaxLength(64, {
    message: 'E-mail não pode conter mais que 64 caracteres.',
  })
  mail: string;
}

