import { Repository, EntityRepository } from 'typeorm';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

import * as uuid from 'uuid';
import { IUserCreateConfirmation } from './models/IUserCreateConfirmation';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<IUserCreateConfirmation> {
    const { username, mail, password, ip } = createUserDto;

    const user = new Users();
    user.username = username;
    user.mail = mail;
    user.password = password;

    // eslint-disable-next-line @typescript-eslint/camelcase
    user.ip_current = ip;

    // eslint-disable-next-line @typescript-eslint/camelcase
    user.ip_register = ip;

    // eslint-disable-next-line @typescript-eslint/camelcase
    user.account_created = Math.floor(Date.now() / 1000);

    // eslint-disable-next-line @typescript-eslint/camelcase
    user.auth_ticket = uuid.v4();

    // Save the user into the database
    try {
      const newUser = await user.save();

      return {
        id: newUser.id,
        username,
        message: `Usuário criado com sucesso.`,
      };
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Nome ou e-mail já cadastrados.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
