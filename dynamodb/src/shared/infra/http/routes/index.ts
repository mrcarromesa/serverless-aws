import tasksRoutes from '@modules/task/infra/http/routes/tasks.routes';
import { Router } from 'express';

const routes = Router();

routes.use(tasksRoutes);

export default routes;
