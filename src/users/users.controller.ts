import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
  Post,
  Body,
  ValidationPipe,
  CacheKey,
  CacheTTL,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from 'src/auth/entities/users.entity';
import { CreateUserSSO } from './dto/create-user-sso.dto';
import { RecoverPassword } from './dto/recover-dto';
import { ChangePassword } from './dto/change-password.dto';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  @CacheKey('users_online')
  @CacheTTL(120)
  async getUsersOnline() {
    return this.usersService.getUsersOnline();
  }

  /**
   * Retrieve an user information by a given id
   * @param id userId
   */
  @Get('/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  getUserById(@Param('id', ParseIntPipe) id: number, @GetUser() user: Users) {
    if (!user.isAdmin && id !== user.id) {
      throw new UnauthorizedException(
        'O usuário requisitado difere do usuário autenticado.',
      );
    }

    return this.usersService.getUserById(id);
  }

  @Post('/:id/sso')
  @UseGuards(AuthGuard())
  getUserSSO(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Users,
    @Body(ValidationPipe) createUserSSO: CreateUserSSO,
  ) {
    if (!user.isAdmin && id !== user.id) {
      throw new UnauthorizedException(
        'O usuário requisitado difere do usuário autenticado.',
      );
    }

    return this.usersService.updateUserSSO(user, createUserSSO);
  }

  @Post('/recover')
  async recoverPassword(@Body(ValidationPipe) recoverPassword: RecoverPassword, ){
    
    return this.usersService.checkIfEmailExist(recoverPassword);
  }

  @Post('/recover/changePassword')
  async changePassword(@Body(ValidationPipe) changePassword: ChangePassword){
    return this.usersService.changePassword(changePassword);
  }
}
