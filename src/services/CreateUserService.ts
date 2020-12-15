import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

class CreateUserService {
  public async execute({
    name,
    username,
    email,
    password,
    isAdmin,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    if (
      await usersRepository.findOne({
        where: {
          email,
        },
      })
    ) {
      throw new AppError({
        message: 'Email address already used',
        statusCode: 400,
      });
    }

    if (
      await usersRepository.findOne({
        where: {
          username,
        },
      })
    ) {
      throw new AppError({
        message: 'Username already used',
        statusCode: 400,
      });
    }

    const newUser = usersRepository.create({
      name,
      username,
      email,
      password: await hash(password, 8),
      isAdmin,
    });

    await usersRepository.save(newUser);

    return newUser;
  }
}

export default CreateUserService;
