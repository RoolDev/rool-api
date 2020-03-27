import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordValidationPipe } from './pipes/passwordValidation.pipe';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Create a new user
   * @param createUserDto user object from the client
   */
  @Post()
  async createUser(
    @Body(ValidationPipe, PasswordValidationPipe) createUserDto: CreateUserDto,
  ) {
    return await this.authService.createUser(createUserDto);
  }
}
