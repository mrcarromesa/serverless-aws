import ListTasksByCategoryService from '@modules/task/services/query/ListTasksByCategory.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TasksFilteredByCategoryController {
  async index(req: Request, res: Response): Promise<Response> {
    const { category } = req.params;
    const listTask = container.resolve(ListTasksByCategoryService);
    const result = await listTask.execute(category);
    return res.json(result);
  }
}

export default new TasksFilteredByCategoryController();
