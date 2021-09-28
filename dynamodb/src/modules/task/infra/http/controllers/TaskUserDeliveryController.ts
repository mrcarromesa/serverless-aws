import ListTaskByUserDeliveredSorteredService from '@modules/task/services/query/ListTaskByUserDeliveredSortered.service';
import UpdateDeliveryTaskService from '@modules/task/services/update/UpdateDeliveryTask.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class TaskUserDeliveryController {
  async index(req: Request, res: Response): Promise<Response> {
    const { user_delivered = '', last_key, limit = 2 } = req.body;
    const parseLimit = !Number.isNaN(Number(limit)) ? Number(limit) : 2;
    const listTask = container.resolve(ListTaskByUserDeliveredSorteredService);
    const result = await listTask.execute({
      user_delivered,
      limit: parseLimit,
      start_key: last_key,
    });
    return res.json(result);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { user_delivered, delivery_date } = req.body;
    const { category, id } = req.params;
    const updateDelivery = container.resolve(UpdateDeliveryTaskService);
    const result = await updateDelivery.execute({
      id,
      category,
      user_delivered,
      delivery_date,
    });
    return res.json(result);
  }
}

export default new TaskUserDeliveryController();
