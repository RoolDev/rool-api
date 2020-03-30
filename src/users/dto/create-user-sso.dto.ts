import { IsIP } from 'class-validator';

export class CreateUserSSO {
  @IsIP(4)
  ip: string;
}
