import IWebsocketRepository, {
  IResultRegister,
} from '@modules/websocket/repositories/IWebsocketRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class ListWebsocketItemsService {
  constructor(
    @inject('WebsocketRepository')
    private websocketRepository: IWebsocketRepository,
  ) {}

  async execute(id: string): Promise<IResultRegister> {
    return this.websocketRepository.findAllExceptID(id);
  }
}
