/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  NotFoundException,
  Logger,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { CreateUserSSO } from './dto/create-user-sso.dto';
import { Users } from 'src/auth/entities/users.entity';
import * as uuid from 'uuid';
import { IUpdateUserSSO } from './models/IUpdateUserSSO';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  private logger: Logger = new Logger('UsersService');

  /**
   * Retrieve an user information from a given id
   * @param id User id
   */
  async getUserById(id: number): Promise<UserEntity> {
    this.logger.log(`Searching for user with id ${id}...`);

    const user = await this.usersRepository.findOne(id);

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
    createUserSSO: CreateUserSSO,
  ): Promise<IUpdateUserSSO> {
    const { ip } = createUserSSO;

    this.logger.log(
      `Creating SSO ticket for user ${userDTO.username} (${userDTO.mail}) ip ${ip}`,
    );

    const user = await this.getUserById(userDTO.id);
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

  async getUsersOnline(): Promise<{ usersOnline: number }> {
    const total = await this.usersRepository.findAndCount({ online: '1' });

    return {
      usersOnline: total[1],
    };
  }
}
