import TaskRepository from '@modules/task/infra/dynamoose/repositories/TaskRepository';
import ITaskRepository from '@modules/task/repositories/ITaskRepository';
import { container } from 'tsyringe';

container.registerSingleton<ITaskRepository>('TaskRepository', TaskRepository);
