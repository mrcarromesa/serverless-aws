import GetTaskByCategoryService from '@modules/task/services/query/GetTaskByCategory.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TasksCategoryController {
  async read(req: Request, res: Response): Promise<Response> {
    const { category } = req.params;

    const taskByCategory = container.resolve(GetTaskByCategoryService);
    const result = await taskByCategory.execute(category);
    return res.json(result);
  }
}

export default new TasksCategoryController();
