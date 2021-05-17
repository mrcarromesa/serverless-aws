import ListTasksByUserCreatedService from '@modules/task/services/query/ListTaskByUserCreated.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TasksFilteredByUserCreatedController {
  async index(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;

    const listTask = container.resolve(ListTasksByUserCreatedService);
    const result = await listTask.execute(user_id);
    return res.json(result);
  }
}

export default new TasksFilteredByUserCreatedController();
