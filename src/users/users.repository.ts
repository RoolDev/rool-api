import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Repository, EntityRepository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ChangePassword } from './dto/change-password.dto';


import * as crypto from 'crypto';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  
  async getUserMail(email: string): Promise<UserEntity> {
    try {
      const user = await this.findOne({ mail: email });
      return user;

    } catch (err){
      return null;
    }
  }

  saltPassword(password: string) {
    const hash = crypto.createHash('sha512');
    return hash.update(password, 'utf8').digest('hex');
  }

  async changePassword(payload: ChangePassword, mail: string):Promise<string> {
    try {
      const user = await this.findOne({ mail });
      user.password = this.saltPassword(payload.password);

      const { username } = await user.save();

      return(`Senha do usuário ${username} alterada com sucesso!`);
   
    } catch (e) {
      console.log(e);
      if (e.code === 'ER_DUP_ENTRY') {

        throw new ConflictException(
          [
            {
              property: 'mail',
            },
          ],
          'E-mail já utilizado.',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
