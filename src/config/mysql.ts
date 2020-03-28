import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;
// console.log('process.env: ', process.env);

export default {
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: +DB_PORT || 3306,
  type: 'mysql',
  retryAttempts: 10,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
} as TypeOrmModuleOptions;
