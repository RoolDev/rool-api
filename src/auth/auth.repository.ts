import { Repository, EntityRepository } from 'typeorm';
import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

import { IUserCreateConfirmation } from '../auth/models/IUserCreateConfirmation';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

import * as uuid from 'uuid';
import * as crypto from 'crypto';
import { SignInUserDTO } from './dto/signin-user.dto';

@EntityRepository(Users)
export class AuthRepository extends Repository<Users> {
  private logger: Logger = new Logger('AuthRepository');

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<IUserCreateConfirmation> {
    const { username, mail, password, ip } = createUserDto;

    const user = new Users();
    user.username = username;
    user.mail = mail;
    user.password = this.saltPassword(password);

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
      const { id } = await user.save();

      return {
        id,
        username,
        message: `Usuário criado com sucesso.`,
      };
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        this.logger.log(
          `Username or e-mail already exist. ${user.username} (${user.mail})`,
        );

        throw new ConflictException('Nome ou e-mail já cadastrados.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signInUser(signInUserDto: SignInUserDTO): Promise<Users> {
    const { mail, password } = signInUserDto;

    const saltedPassword = this.saltPassword(password);

    const user = await this.findOne({ mail });

    if (user && user.validatePassword(saltedPassword)) {
      return user;
    } else {
      this.logger.error(`Invalid credentials for user ${user.username}`);
      throw new UnauthorizedException('Credenciais inválidas.');
    }
  }

  saltPassword(password: string) {
    const hash = crypto.createHash('sha512');
    return hash.update(password, 'utf8').digest('hex');
  }

  async getUser(id: number): Promise<Users> {
    const user = await this.findOne({ id });

    return user;
  }
}
