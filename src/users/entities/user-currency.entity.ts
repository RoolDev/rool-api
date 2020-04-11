import {
  BaseEntity,
  Column,
  ManyToOne,
  Entity,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

/**
 * Models
 */
import { UserEntity } from './user.entity';

@Entity({
  name: 'users_currency',
})
export class UserCurrencyEntity extends BaseEntity {
  @PrimaryColumn()
  @Exclude({ toPlainOnly: true })
  user_id: number;

  @PrimaryColumn({
    type: 'int',
  })
  type: number;

  @Column()
  amount: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
