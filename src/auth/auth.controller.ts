import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Logger,
  Get,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInUserDTO } from './dto/signin-user.dto';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger: Logger = new Logger('AuthController');

  /**
   * Create a new user
   * @param createUserDto user object from the client
   */
  @Post('signup')
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Post('signin')
  async signInUser(@Body(ValidationPipe) signInUserDTO: SignInUserDTO) {
    return this.authService.signInUser(signInUserDTO);
  }

  @Post('validate')
  async validateToken(@Body() token: ValidateTokenDTO) {
    return this.authService.validateJWT(token);
  }

  @Get('ip')
  async getIp(@Req() request: Request) {
    return this.authService.getIP(request);
  }
}
