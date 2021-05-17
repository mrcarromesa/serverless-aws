import BatchDeleteTasksService from '@modules/task/services/delete/BatchDeleteTasks.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class DeleteTasksController {
  async delete(req: Request, res: Response): Promise<Response> {
    const { deleteItems } = req.body;

    const deleteTask = container.resolve(BatchDeleteTasksService);
    await deleteTask.execute(deleteItems);
    return res.status(204).json();
  }
}

export default new DeleteTasksController();
