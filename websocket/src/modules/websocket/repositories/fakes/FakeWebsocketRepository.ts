import IWebsoketSaveDTO from '@modules/websocket/dtos/props/IWebsoketSaveDTO';
import IWebsocketSchemaDTO from '@modules/websocket/dtos/schemas/IWebsocketSchemaDTO';
import IWebsocketRepository, {
  IResultRegister,
} from '@modules/websocket/repositories/IWebsocketRepository';

export default class WebsocketRepository implements IWebsocketRepository {
  private websocket: IWebsocketSchemaDTO[] = [];

  public async findAllExceptID(id: string): Promise<IResultRegister> {
    return this.websocket.filter(item => item.id !== id) as IResultRegister;
  }

  public async create({
    id,
    msg,
  }: IWebsoketSaveDTO): Promise<IWebsocketSchemaDTO> {
    const now = new Date();
    const row = {
      id,
      msg,
      created_at: now,
      updated_at: now,
    };
    this.websocket.push(row);

    return row;
  }

  public async update({
    id,
    msg,
  }: IWebsoketSaveDTO): Promise<IWebsocketSchemaDTO> {
    const index = this.websocket.findIndex(item => item.id === id);
    if (index >= 0) {
      this.websocket[index].msg = msg;
      this.websocket[index].updated_at = new Date();

      return this.websocket[index];
    }

    return this.create({ id, msg });
  }

  public async findId(id: string): Promise<IWebsocketSchemaDTO> {
    const index = this.websocket.findIndex(item => item.id === id);
    if (index >= 0) {
      this.websocket[index].updated_at = new Date();

      return this.websocket[index];
    }

    return {} as IWebsocketSchemaDTO;
  }

  public async delete(id: string): Promise<void> {
    const index = this.websocket.findIndex(item => item.id === id);
    if (index >= 0) {
      this.websocket.splice(index, 1);
    }
  }
}
