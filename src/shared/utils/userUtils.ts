import { InternalServerErrorException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = await genSalt(8);
  const hashedPassword = await hash(password, salt);
  if (!hashedPassword) {
    throw new InternalServerErrorException('Something Went Wrong');
  }
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  storedPassword: string,
) => compare(password, storedPassword);
