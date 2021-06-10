import AddTaskService from '@modules/task/services/create/AddTasks.service';
import RemoveTaskByIdService from '@modules/task/services/delete/RemoveTaskById.service';
import GetTasksByIdService from '@modules/task/services/query/GetTasksById.service';
import ListTaskPaginatedService from '@modules/task/services/query/ListTaskPaginated.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TasksController {
  async create(req: Request, res: Response): Promise<Response> {
    const param = req.body;
    const addTask = container.resolve(AddTaskService);
    const result = await addTask.execute(param);
    return res.json(result);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { limit, last_key } = req.query;

    const listTask = container.resolve(ListTaskPaginatedService);
    const result = await listTask.execute({
      limit: Number(limit),
      last_key: Number(last_key),
    });
    return res.json(result);
  }

  async read(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const taskById = container.resolve(GetTasksByIdService);
    const result = await taskById.execute(id);
    return res.json(result);
  }

  async delete(_req: Request, res: Response): Promise<Response> {
    const taskById = container.resolve(RemoveTaskByIdService);
    const result = await taskById.execute();
    return res.json(result);
  }
}

export default new TasksController();
