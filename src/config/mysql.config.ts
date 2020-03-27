import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  host: '7fbrw9.stackhero-network.com',
  username: 'root',
  password: 'JScOGNQlPy81nHKkOKtw39T0OpV4aTW3',
  database: 'rool_dev',
  port: 3306,
  type: 'mysql',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
