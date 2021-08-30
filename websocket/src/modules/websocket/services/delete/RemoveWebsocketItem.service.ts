import IWebsocketRepository from '@modules/websocket/repositories/IWebsocketRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class RemoveWebsocketItemService {
  constructor(
    @inject('WebsocketRepository')
    private websocketRepository: IWebsocketRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.websocketRepository.delete(id);
  }
}
