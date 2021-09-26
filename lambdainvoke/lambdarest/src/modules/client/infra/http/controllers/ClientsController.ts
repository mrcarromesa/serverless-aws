import GetMsgFromClient from '@modules/client/services/query/GetMsgFromClient.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ClientsController {
  async read(_req: Request, res: Response): Promise<Response> {
    const getMsgFromClient = container.resolve(GetMsgFromClient);
    const result = await getMsgFromClient.execute('msg here');
    return res.json(result);
  }
}

export default new ClientsController();
