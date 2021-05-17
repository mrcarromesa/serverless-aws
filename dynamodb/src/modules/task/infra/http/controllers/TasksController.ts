import AddTaskService from '@modules/task/services/create/AddTask.service';
import DeleteTaskService from '@modules/task/services/delete/DeleteTask.service';
import GetTaskService from '@modules/task/services/query/GetTask.service';
import ListTasksPaginatedService from '@modules/task/services/query/ListTasksPaginated.service';
import SaveTaskService from '@modules/task/services/update/SaveTask.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TasksController {
  async index(req: Request, res: Response): Promise<Response> {
    const { last_key, limit = 20 } = req.query;
    const parseLimit = !Number.isNaN(Number(limit)) ? Number(limit) : 20;
    const parseLasKey = last_key ? JSON.parse(String(last_key)) : undefined;
    const listTask = container.resolve(ListTasksPaginatedService);
    const result = await listTask.execute({
      limit: parseLimit,
      start_key: parseLasKey,
    });
    return res.json(result);
  }

  async read(req: Request, res: Response): Promise<Response> {
    const { category, id } = req.params;
    const getTask = container.resolve(GetTaskService);
    const result = await getTask.execute({
      category,
      id,
    });
    return res.json(result);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const {
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      attachments = [],
      description = '',
    } = req.body;
    const addTask = container.resolve(AddTaskService);
    const result = await addTask.execute({
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      attachments,
      description,
    });
    return res.json(result);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const {
      created_by_user_id,
      designated_to_user_id,
      title,
      attachments = [],
      description = '',
    } = req.body;

    const { category, id } = req.params;

    const updateTask = container.resolve(SaveTaskService);
    const result = await updateTask.execute({
      id,
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      attachments,
      description,
    });
    return res.json(result);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { category, id } = req.params;

    const deleteTask = container.resolve(DeleteTaskService);
    await deleteTask.execute({
      id,
      category,
    });
    return res.status(204).json();
  }
}

export default new TasksController();
