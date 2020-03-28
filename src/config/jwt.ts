import { JwtModuleOptions } from '@nestjs/jwt';

const { JWT_SECRET, JWT_EXPIRE } = process.env;

export default {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: +JWT_EXPIRE,
  },
} as JwtModuleOptions;
