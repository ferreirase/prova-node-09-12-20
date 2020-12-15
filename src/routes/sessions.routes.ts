/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionsRoutes = Router();

// rota de login
sessionsRoutes.post('/', async (request, response) => {
  const { email, password } = request.body;

  const createSessionService = new CreateSessionService();

  const { user, token } = await createSessionService.execute({
    email,
    password,
  });

  return response.json({
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
    token,
  });
});

export default sessionsRoutes;
