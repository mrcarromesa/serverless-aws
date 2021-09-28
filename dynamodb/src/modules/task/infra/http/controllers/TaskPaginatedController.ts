import ListTasksAndSortService from '@modules/task/services/query/ListTasksAndSort.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TaskPaginatedController {
  async index(req: Request, res: Response): Promise<Response> {
    const { category = '', last_key, limit = 2 } = req.body;
    const parseLimit = !Number.isNaN(Number(limit)) ? Number(limit) : 2;
    const listTask = container.resolve(ListTasksAndSortService);
    const result = await listTask.execute({
      category,
      limit: parseLimit,
      start_key: last_key,
    });
    return res.json(result);
  }
}

export default new TaskPaginatedController();
