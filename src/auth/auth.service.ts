import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserCreateConfirmation } from './models/IUserCreateConfirmation';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Create a new user into the database
   * @param createUserDto User DTO
   * @returns IUserCreateConfirmation
   */
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<IUserCreateConfirmation> {
    const newUser = await this.authRepository.createUser(createUserDto);
    return newUser;
  }
}
