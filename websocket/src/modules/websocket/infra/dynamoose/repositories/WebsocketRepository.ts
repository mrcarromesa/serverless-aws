import IWebsoketSaveDTO from '@modules/websocket/dtos/props/IWebsoketSaveDTO';
import IWebsocketSchemaDTO from '@modules/websocket/dtos/schemas/IWebsocketSchemaDTO';
import IWebsocketRepository, {
  IResultRegister,
} from '@modules/websocket/repositories/IWebsocketRepository';

import Websocket from '../schemas/Websocket';

export default class WebsocketRepository implements IWebsocketRepository {
  public async findAllExceptID(id: string): Promise<IResultRegister> {
    return Websocket.scan().where('id').not().eq(id).all().exec();
  }

  public async create({
    id,
    msg,
  }: IWebsoketSaveDTO): Promise<IWebsocketSchemaDTO> {
    return Websocket.create({
      id,
      msg,
    }) as unknown as IWebsocketSchemaDTO;
  }

  public async update({
    id,
    msg,
  }: IWebsoketSaveDTO): Promise<IWebsocketSchemaDTO> {
    return Websocket.update({
      id,
      msg,
    }) as unknown as IWebsocketSchemaDTO;
  }

  public async findId(id: string): Promise<IWebsocketSchemaDTO> {
    return Websocket.get({
      id,
    });
  }

  public async delete(id: string): Promise<void> {
    await Websocket.delete({
      id,
    });
  }
}
