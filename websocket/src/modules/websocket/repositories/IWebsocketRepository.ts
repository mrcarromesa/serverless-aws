import ICommonPagination from '@shared/container/repositories/ICommonPagination';

import IWebsoketSaveDTO from '../dtos/props/IWebsoketSaveDTO';
import IWebsocketSchemaDTO from '../dtos/schemas/IWebsocketSchemaDTO';

type IResultRegister = IWebsocketSchemaDTO[] & ICommonPagination;
type IResultRegisterPartial = Partial<IWebsocketSchemaDTO>[] &
  ICommonPagination;
export { IResultRegister, IResultRegisterPartial };

export default interface IWebsocketRepository {
  create(data: IWebsoketSaveDTO): Promise<IWebsocketSchemaDTO>;
  update(data: IWebsoketSaveDTO): Promise<IWebsocketSchemaDTO>;
  findId(id: string): Promise<IWebsocketSchemaDTO>;
  findAllExceptID(id: string): Promise<IResultRegister>;
  delete(id: string): Promise<void>;
}
