import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserSSO {
  @IsString()
  @IsNotEmpty()
  ip: string;
}
