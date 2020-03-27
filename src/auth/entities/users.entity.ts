import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
} from 'typeorm';
import { IUserRanks } from '../models/IUserRanks';

@Entity()
@Unique(['username', 'mail'])
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  mail: string;

  @Column()
  rank: IUserRanks;

  @Column()
  account_created: number;

  @Column()
  auth_ticket: string;

  @Column()
  ip_register: string;

  @Column()
  ip_current: string;

  validatePassword(password: string) {
    return this.password === password;
  }

  get isAdmin() {
    return this.rank >= 5;
  }
}
