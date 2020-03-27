import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordValidationPipe } from './pipes/passwordValidation.pipe';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Create a new user
   * @param createUserDto user object from the client
   */
  @Post()
  async createUser(
    @Body(ValidationPipe, PasswordValidationPipe) createUserDto: CreateUserDto,
  ) {
    return await this.usersService.createUser(createUserDto);
  }

  /**
   * Retrieve an user information by a given id
   * @param id userId
   */
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }
}
