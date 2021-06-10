import { Router } from 'express';

import TasksCategoryController from '../controllers/TasksCategoryController';
import TasksController from '../controllers/TasksController';
import TaskCreateValidator from '../validators/TaskCreateValidator';
import TaskListValidator from '../validators/TaskListValidator';

const tasksRoutes = Router();

tasksRoutes.post('/task', TaskCreateValidator, TasksController.create);
tasksRoutes.delete('/task', TasksController.delete);
tasksRoutes.get('/task/:id', TasksController.read);
tasksRoutes.get('/task/category/:category', TasksCategoryController.read);
tasksRoutes.get('/task', TaskListValidator, TasksController.index);
export default tasksRoutes;
