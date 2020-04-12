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

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

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
