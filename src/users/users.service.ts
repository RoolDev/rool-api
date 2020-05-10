/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  NotFoundException,
  Logger,
  UseInterceptors,
  CacheInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { CreateUserSSODTO } from './dto/create-user-sso.dto';
import { Users } from 'src/auth/entities/users.entity';
import { IJWTRecoverEmailPayload } from './models/IJWTRecoverEmailPayload';

import * as uuid from 'uuid';
import { IUpdateUserSSO } from './models/IUpdateUserSSO';
import { RecoverPasswordDTO } from './dto/recover-dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import recoverApi from '../config/api-recover-password';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  private logger: Logger = new Logger('UsersService');

  /**
   * Retrieve an user information from a given id
   * @param id User id
   */
  async getUserById(id: number): Promise<UserEntity> {
    this.logger.log(`Searching for user with id ${id}...`);

    const user = await this.usersRepository.findOne(id, {
      relations: ['currencies'],
    });

    if (!user) {
      throw new NotFoundException(`User not found with id ${id}`);
    }

    this.logger.log(`Found user ${user.username} (${user.id}).`);

    return user;
  }

  /**
   *
   */
  async updateUserSSO(
    userDTO: Users,
    createUserSSO: CreateUserSSODTO,
  ): Promise<IUpdateUserSSO> {
    const { ip } = createUserSSO;

    this.logger.log(
      `Creating SSO ticket for user ${userDTO.username} (${userDTO.mail}) ip ${ip}`,
    );

    const user = await this.usersRepository.findOne(userDTO.id);
    const sso = uuid.v4();

    user.auth_ticket = sso;
    user.ip_current = ip;

    await user.save();

    this.logger.log(
      `Updated SSO ticket for user ${userDTO.username} (${userDTO.mail}) ip ${ip}`,
    );

    return {
      auth_ticket: sso,
    };
  }

  /**
   * Check if a given username or mail already exist
   *
   * @param username
   * @param mail
   *
   * @returns Boolean if user already exist
   */
  async checkIfUserOrEmailExist(
    username: string,
    mail: string,
  ): Promise<boolean> {
    const queryBuilder = this.usersRepository.createQueryBuilder();

    const result = await queryBuilder
      .where('username = :username OR mail = :mail', {
        username,
        mail,
      })
      .getManyAndCount();

    return result[1] > 0;
  }

  async checkIfEmailExist(recoverPassword: RecoverPasswordDTO) {
    const mail = await this.usersRepository.getUserMail(recoverPassword.mail);

    if (mail === undefined) {
      throw new NotFoundException(
        'Não foi encontrado nenhum usuário com este email',
      );
      return;
    }

    try {
      this.recoverPassword(recoverPassword, mail);
    } catch (err) {
      console.log(err);
    }
  }

  async getUsersOnline(): Promise<{ usersOnline: number }> {
    const total = await this.usersRepository.findAndCount({ online: '1' });

    return {
      usersOnline: total[1],
    };
  }

  async generateJWTPayload(mail: string): Promise<IJWTRecoverEmailPayload> {
    return {
      mail,
    };
  }

  async generateJWT(payload: IJWTRecoverEmailPayload) {
    return this.jwtService.sign(payload);
  }

  async validateJWT(token: string): Promise<IJWTRecoverEmailPayload> {
    try {
      this.logger.log(`Validating token ${token}`);

      const decoded = await this.jwtService.verifyAsync<
        IJWTRecoverEmailPayload
      >(token);

      this.logger.log(`Token valid for email (${decoded.mail})`);

      return decoded;
    } catch (e) {
      this.logger.log(`Invalid token ${token}`);
      throw new BadRequestException('Invalid token');
    }
  }

  async recoverPassword(recoverPassword: RecoverPasswordDTO, user: UserEntity) {
    const payload = await this.generateJWTPayload(recoverPassword.mail);
    const token = await this.generateJWT(payload);
    const data = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      service_id: process.env.RECOVER_SERVICE_SERVICE_ID,
      // eslint-disable-next-line @typescript-eslint/camelcase
      template_id: process.env.RECOVER_SERVICE_TEMPLATE_ID,
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_id: process.env.RECOVER_SERVICE_USER_ID,
      // eslint-disable-next-line @typescript-eslint/camelcase
      template_params: {
        username: user.username,
        mailto: recoverPassword.mail,
        topic: 'Esqueci minha senha',
        token,
      },
    };

    try {
      await recoverApi.post('/send', data);
    } catch (err) {
      throw new BadRequestException(
        'Erro ao enviar e-mail. Verifique os dados e tente novamente!',
      );
    }
  }

  async changePassword(changePassword: ChangePasswordDTO) {
    const payload = await this.validateJWT(changePassword.token);

    try {
      await this.usersRepository.changePassword(changePassword, payload.mail);
      return {
        message: `Senha para o email ${payload.mail}' alterada com sucesso!`,
      };
    } catch (err) {
      throw new BadRequestException(
        'Falha ao atualizar senha, tente novamente.',
      );
    }
  }
}
