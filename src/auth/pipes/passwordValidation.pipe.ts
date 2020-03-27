import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(value: CreateUserDto) {
    const { password, confirmationPassword } = value;

    if (confirmationPassword !== password) {
      throw new BadRequestException(`As senhas não se coincidem.`);
    }

    return value;
  }
}
