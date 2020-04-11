import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  JoinColumn,
} from 'typeorm';

/**
 * Models
 */
import { UserEntity } from './user.entity';

@Entity({
  name: 'users_badges',
})
export class UserBadgeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  slot_id: number;

  @Column()
  badge_code: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
