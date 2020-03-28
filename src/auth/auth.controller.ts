import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordValidationPipe } from './pipes/passwordValidation.pipe';
import { AuthService } from './auth.service';
import { SignInUserDTO } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger: Logger = new Logger('AuthController');

  /**
   * Create a new user
   * @param createUserDto user object from the client
   */
  @Post('signup')
  async createUser(
    @Body(ValidationPipe, PasswordValidationPipe) createUserDto: CreateUserDto,
  ) {
    return await this.authService.createUser(createUserDto);
  }

  @Post('signin')
  async signInUser(@Body(ValidationPipe) signInUserDTO: SignInUserDTO) {
    return this.authService.signInUser(signInUserDTO);
  }
}
