import { Router } from 'express';

import TasksController from '../controllers/TasksController';

const tasksRoutes = Router();

tasksRoutes.post('/task-proccess', TasksController.create);

export default tasksRoutes;
