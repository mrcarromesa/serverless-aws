import ICommonPagination from '@shared/container/repositories/ICommonPagination';

import ITaskKeysDTO from '../dtos/props/ITaskKeysDTO';
import ITaskPaginatedDTO from '../dtos/props/ITaskPaginatedDTO';
import ITaskPaginatedWithAttrsDTO from '../dtos/props/ITaskPaginatedWithAttrsDTO';
import ITaskSaveDTO from '../dtos/props/ITaskSaveDTO';
import ITaskSchemaDTO from '../dtos/schemas/ITaskSchemaDTO';

type IResultRegister = ITaskSchemaDTO[] & ICommonPagination;
type IResultRegisterPartial = Partial<ITaskSchemaDTO>[] & ICommonPagination;
export { IResultRegister, IResultRegisterPartial };

export default interface ITaskRepository {
  create(data: ITaskSaveDTO): Promise<ITaskSchemaDTO>;
  update(data: ITaskSaveDTO): Promise<ITaskSchemaDTO>;
  findTaskByKeys(data: ITaskKeysDTO): Promise<ITaskSchemaDTO>;
  delete(data: ITaskKeysDTO): Promise<void>;
  batchDelete(data: ITaskKeysDTO[]): Promise<void>;
  findTasksByCategory(category: string): Promise<IResultRegister>;
  findTasksByUserCreatedId(user_id: string): Promise<IResultRegister>;
  findTasksByUserDesignatedId(user_id: string): Promise<IResultRegister>;
  findAllTasksPaginated(data: ITaskPaginatedDTO): Promise<IResultRegister>;
  findAllTasksPaginatedWithAttr(
    data: ITaskPaginatedWithAttrsDTO,
  ): Promise<IResultRegisterPartial>;
}
