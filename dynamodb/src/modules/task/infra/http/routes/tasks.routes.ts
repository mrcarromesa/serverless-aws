import { Router } from 'express';

import DeleteTasksController from '../controllers/DeleteTasksController';
import TasksController from '../controllers/TasksController';
import TasksFilteredByCategoryController from '../controllers/TasksFilteredByCategoryController';
import TasksFilteredByUserCreatedController from '../controllers/TasksFilteredByUserCreatedController';
import TasksFilteredByUserDesignatedController from '../controllers/TasksFilteredByUserDesignatedController';
import TasksListWithAttrsController from '../controllers/TasksListWithAttrsController';
import TaskCreateValidator from '../validators/TaskCreateValidator';
import TaskUpdateValidator from '../validators/TaskUpdateValidator';

const tasksRoutes = Router();

tasksRoutes.get('/task', TasksController.index);
tasksRoutes.get('/task/with-attrs', TasksListWithAttrsController.index);
tasksRoutes.get('/task/:category/:id', TasksController.read);

tasksRoutes.get(
  '/task/filter/category/:category',
  TasksFilteredByCategoryController.index,
);

tasksRoutes.get(
  '/task/filter/user-created/:user_id',
  TasksFilteredByUserCreatedController.index,
);

tasksRoutes.get(
  '/task/filter/user-designated/:user_id',
  TasksFilteredByUserDesignatedController.index,
);

tasksRoutes.post('/task', TaskCreateValidator, TasksController.create);
tasksRoutes.put(
  '/task/:category/:id',
  TaskUpdateValidator,
  TasksController.update,
);
tasksRoutes.delete('/task/:category/:id', TasksController.delete);
tasksRoutes.delete('/task', DeleteTasksController.delete);
export default tasksRoutes;
