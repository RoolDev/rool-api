import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserCreateConfirmation } from './models/IUserCreateConfirmation';
import { AuthRepository } from './auth.repository';
import { SignInUserDTO } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IUserSignInToken } from './models/IUserSignInToken';
import { IUserRanks } from './models/IUserRanks';
import { IJwtPayload } from './models/IJwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

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

  async signInUser(signInUserDTO: SignInUserDTO): Promise<IUserSignInToken> {
    const {
      username,
      mail,
      rank,
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_created,
      isAdmin,
    } = await this.authRepository.signInUser(signInUserDTO);

    const payload: IJwtPayload = {
      username,
      mail,
      rank,
      namedRank: IUserRanks[rank],
      isAdmin,
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_created,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }
}
