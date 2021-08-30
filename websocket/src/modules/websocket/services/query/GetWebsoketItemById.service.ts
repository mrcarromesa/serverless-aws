import IWebsocketSchemaDTO from '@modules/websocket/dtos/schemas/IWebsocketSchemaDTO';
import IWebsocketRepository from '@modules/websocket/repositories/IWebsocketRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class GetWebsocketItemById {
  constructor(
    @inject('WebsocketRepository')
    private websocketRepository: IWebsocketRepository,
  ) {}

  async execute(id: string): Promise<IWebsocketSchemaDTO> {
    return this.websocketRepository.findId(id);
  }
}
