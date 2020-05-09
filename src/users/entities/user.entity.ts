import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';

/**
 * Models
 */
import { UserCurrencyEntity } from './user-currency.entity';
import { UserBadgeEntity } from './user-badge.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Exclude()
  @Column()
  mail: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  rank: number;

  @Column()
  motto: string;

  @Column()
  auth_ticket: string;

  @Column()
  ip_current: string;

  @Column()
  credits: number;

  @Column()
  pixels: number;

  @Column()
  points: number;

  @Column()
  online: '0' | '1';

  @Column()
  look: string;

  @Column()
  last_online: number;

  @OneToMany(
    () => UserCurrencyEntity,
    entity => entity.user,
  )
  currencies: UserCurrencyEntity[];

  @OneToMany(
    () => UserBadgeEntity,
    entity => entity.user,
  )
  badges: UserBadgeEntity[];
}
