import ListTasksWithAttrsPaginatedService from '@modules/task/services/query/ListTasksWithAttrsPaginated.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TasksListWithAttrsController {
  async index(req: Request, res: Response): Promise<Response> {
    const { last_key, limit = 20, attrs } = req.query;

    const parseLimit = !Number.isNaN(Number(limit)) ? Number(limit) : 20;
    const parseLasKey = last_key ? JSON.parse(String(last_key)) : undefined;
    const parseAttrs = attrs ? JSON.parse(String(attrs)) : ['title'];
    const listTask = container.resolve(ListTasksWithAttrsPaginatedService);
    const result = await listTask.execute({
      attrs: parseAttrs,
      limit: parseLimit,
      start_key: parseLasKey,
    });
    return res.json(result);
  }
}

export default new TasksListWithAttrsController();
