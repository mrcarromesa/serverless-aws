import IWebsoketSaveDTO from '@modules/websocket/dtos/props/IWebsoketSaveDTO';
import IWebsocketSchemaDTO from '@modules/websocket/dtos/schemas/IWebsocketSchemaDTO';
import IWebsocketRepository from '@modules/websocket/repositories/IWebsocketRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class UpdateWebsocketItemService {
  constructor(
    @inject('WebsocketRepository')
    private websocketRepository: IWebsocketRepository,
  ) {}

  async execute({ id, msg }: IWebsoketSaveDTO): Promise<IWebsocketSchemaDTO> {
    return this.websocketRepository.update({
      id,
      msg,
    });
  }
}
