import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/mysql.config';

@Module({
  imports: [TypeOrmModule.forRoot(config), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
