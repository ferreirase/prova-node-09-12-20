import { Router } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';
import CreateUserService from '../services/CreateUserService';
import User from '../models/User';
import onlyAdministrators from '../middlewares/onlyAdministrators';
import AppError from '../errors/AppError';

const usersRouter = Router();

usersRouter.get('/', async (_, res) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find({
    select: ['id', 'name', 'email', 'username', 'isAdmin'],
  });

  if (!users || users.length === 0) {
    return res.status(200).json({
      message: 'No users found',
    });
  }

  return res.json(users);
});

// rota de criação de novo usuário
usersRouter.post('/', onlyAdministrators, async (request, response) => {
  const schema = Yup.object().shape({
    email: Yup.string().required('E-mail is missing').email('Invalid E-mail'),
    name: Yup.string().required('Name is missing'),
    username: Yup.string().required('Username is missing'),
    password: Yup.string().required('Password is missing'),
  });

  if (!(await schema.isValid(request.body))) {
    throw new AppError({
      message: 'Validation fails',
      statusCode: 400,
    });
  }

  const createUser = new CreateUserService();

  const newUser = await createUser.execute({
    name: request.body.name,
    username: request.body.username,
    email: request.body.email,
    password: request.body.password,
    isAdmin: request.body.isAdmin || false,
  });

  return response.status(201).json({
    id: newUser.id,
    name: newUser.name,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

export default usersRouter;
