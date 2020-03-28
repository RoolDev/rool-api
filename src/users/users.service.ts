import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
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

    const found = await this.usersRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`User not found with id ${id}`);
    }

    this.logger.log(`Found user ${found.username} (${found.id}).`);

    return found;
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
}
