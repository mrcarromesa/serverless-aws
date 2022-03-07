import SendMessageToQueue from '@shared/libs/SendMessageToQueue';
import { Request, Response } from 'express';

class TasksController {
  async create(_req: Request, res: Response): Promise<Response> {
    // generate array of numbers
    const numbers = Array.from(Array(51).keys());

    const rows = numbers;
    // eslint-disable-next-line no-console
    console.log(rows);

    await Promise.all(
      rows.map(async item => {
        return SendMessageToQueue.execute({
          queue_name: 'SQSExampleProcessTasksQueue',
          payload: JSON.stringify({ item }),
        });
      }),
    );

    return res.status(204).json();
  }
}

export default new TasksController();
