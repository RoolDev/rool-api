import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthRepository } from './auth.repository';
import { SignInUserDTO } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IUserSignInToken } from './models/IUserSignInToken';
import { IUserRanks } from './models/IUserRanks';
import { IJwtPayload } from './models/IJwtPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { ValidateTokenDTO } from './dto/validate-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  private logger: Logger = new Logger('AuthService');

  /**
   * Create a new user into the database
   * @param createUserDto User DTO
   * @returns IUserCreateConfirmation
   */
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    this.logger.log(
      `Creating new user '${createUserDto.username}' with ip '${createUserDto.ip}'`,
    );

    const newUser = await this.authRepository.createUser(createUserDto);
    const user = await this.authRepository.getUser(newUser.id);

    const payload = await this.generateJWTPayload(user);
    const accessToken = await this.generateJWT(payload);

    this.logger.log(
      `User '${createUserDto.username} (${createUserDto.mail})' have been created.`,
    );

    return {
      accessToken,
    };
  }

  async signInUser(signInUserDTO: SignInUserDTO): Promise<IUserSignInToken> {
    this.logger.log(`Trying to sign in user: '${signInUserDTO.mail}'.`);

    const user = await this.authRepository.signInUser(signInUserDTO);
    const payload = await this.generateJWTPayload(user);

    const accessToken = await this.generateJWT(payload);

    this.logger.log(`User '${user.username} (${user.mail})' signed in.`);

    return {
      accessToken,
    };
  }

  async generateJWTPayload(user: Users): Promise<IJwtPayload> {
    const {
      id,
      username,
      mail,
      rank,
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_created,
      isAdmin,
    } = user;

    return {
      id,
      username,
      mail,
      rank,
      namedRank: IUserRanks[rank],
      isAdmin,
      // eslint-disable-next-line @typescript-eslint/camelcase
      account_created,
    };
  }

  async generateJWT(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }

  async validateJWT(token: ValidateTokenDTO): Promise<IJwtPayload> {
    try {
      this.logger.log(`Validating token ${token.accessToken}`);

      const decoded = await this.jwtService.verifyAsync<IJwtPayload>(
        token.accessToken,
      );

      this.logger.log(
        `Token valid for user ${decoded.username} (${decoded.mail})`,
      );

      return decoded;
    } catch (e) {
      this.logger.log(`Invalid token ${token.accessToken}`);
      throw new BadRequestException('Invalid token');
    }
  }
}
