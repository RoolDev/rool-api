import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserCreateConfirmation } from './models/IUserCreateConfirmation';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  /**
   * Create a new user into the database
   * @param createUserDto User DTO
   * @returns IUserCreateConfirmation
   */
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<IUserCreateConfirmation> {
    const { username, mail } = createUserDto;

    const exist = await this.checkIfUserOrEmailExist(username, mail);

    if (exist) {
      throw new BadRequestException('Nome ou e-mail já cadastrados.');
    }

    const newUser = await this.usersRepository.createUser(createUserDto);
    return newUser;
  }

  /**
   * Retrieve an user information from a given id
   * @param id User id
   */
  async getUserById(id: number): Promise<Users> {
    const found = await this.usersRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`User not found with id ${id}`);
    }

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
