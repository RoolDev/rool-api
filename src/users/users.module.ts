import { Module, CacheModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'nestjs-config';



@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    CacheModule.register({
      ttl: 120,
    }),
    AuthModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => config.get('jwt'),
      inject: [ConfigService],
    })
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
