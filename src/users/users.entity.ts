import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
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
  account_created: number;

  @Column()
  auth_ticket: string;

  @Column()
  ip_register: string;

  @Column()
  ip_current: string;
}
