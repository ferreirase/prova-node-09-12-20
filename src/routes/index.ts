import { Router } from 'express';
import usersRouter from './users.routes';
import sessionsRoutes from './sessions.routes';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();

routes.use('/users', ensureAuthenticated, usersRouter);
routes.use('/sessions', sessionsRoutes);

export default routes;
