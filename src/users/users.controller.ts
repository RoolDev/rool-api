import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from 'src/auth/entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Retrieve an user information by a given id
   * @param id userId
   */
  @Get('/:id')
  @UseGuards(AuthGuard())
  getUserById(@Param('id', ParseIntPipe) id: number, @GetUser() user: Users) {
    if (!user.isAdmin && id !== user.id) {
      throw new UnauthorizedException(
        'O usuário requisitado difere do usuário autenticado.',
      );
    }

    return this.usersService.getUserById(id);
  }
}
