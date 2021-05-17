import ITaskKeysDTO from '@modules/task/dtos/props/ITaskKeysDTO';
import ITaskPaginatedDTO from '@modules/task/dtos/props/ITaskPaginatedDTO';
import ITaskPaginatedWithAttrsDTO from '@modules/task/dtos/props/ITaskPaginatedWithAttrsDTO';
import ITaskSaveDTO from '@modules/task/dtos/props/ITaskSaveDTO';
import ITaskSchemaDTO from '@modules/task/dtos/schemas/ITaskSchemaDTO';

import ITaskRepository, {
  IResultRegister,
  IResultRegisterPartial,
} from '../ITaskRepository';

export default class TaskRepository implements ITaskRepository {
  private tasks: ITaskSchemaDTO[] = [];

  public async create(data: ITaskSaveDTO): Promise<ITaskSchemaDTO> {
    const taskSchema: ITaskSchemaDTO = {} as ITaskSchemaDTO;
    Object.assign(taskSchema, data);
    this.tasks.push(taskSchema);
    return taskSchema;
  }

  public async update(data: ITaskSaveDTO): Promise<ITaskSchemaDTO> {
    const taskSchema: ITaskSchemaDTO = {} as ITaskSchemaDTO;
    Object.assign(taskSchema, data);
    const indexItem = this.tasks.findIndex(
      item => item.id === data.id && item.category === data.category,
    );

    if (indexItem >= 0) {
      this.tasks[indexItem] = taskSchema;
      return taskSchema;
    }

    throw new Error('Item not found to update task');
  }

  public async findTaskByKeys({
    category,
    id,
  }: ITaskKeysDTO): Promise<ITaskSchemaDTO> {
    return this.tasks.find(
      item => item.id === id && item.category === category,
    ) as ITaskSchemaDTO;
  }

  public async delete({ id, category }: ITaskKeysDTO): Promise<void> {
    const indexItem = this.tasks.findIndex(
      item => item.id === id && item.category === category,
    );

    if (indexItem >= 0) {
      this.tasks.splice(indexItem, 1);
    }
  }

  public async batchDelete(data: ITaskKeysDTO[]): Promise<void> {
    data.map(item => {
      const { id, category } = item;
      return this.delete({ id, category });
    });
  }

  public async findTasksByCategory(category: string): Promise<IResultRegister> {
    const items = this.tasks.filter(
      item => item.category === category,
    ) as ITaskSchemaDTO[];
    const result: IResultRegister = items as IResultRegister;

    result.count = items.length;
    result.lastKey = {};
    result.queriedCount = items.length;
    result.timesQueried = 0;

    return result;
  }

  public async findTasksByUserCreatedId(
    user_id: string,
  ): Promise<IResultRegister> {
    const items = this.tasks.filter(
      item => item.created_by_user_id === user_id,
    ) as ITaskSchemaDTO[];
    const result: IResultRegister = items as IResultRegister;

    result.count = items.length;
    result.lastKey = {};
    result.queriedCount = items.length;
    result.timesQueried = 0;

    return result;
  }

  public async findTasksByUserDesignatedId(
    user_id: string,
  ): Promise<IResultRegister> {
    const items = this.tasks.filter(
      item => item.designated_to_user_id === user_id,
    ) as ITaskSchemaDTO[];
    const result: IResultRegister = items as IResultRegister;

    result.count = items.length;
    result.lastKey = {};
    result.queriedCount = items.length;
    result.timesQueried = 0;

    return result;
  }

  public async findAllTasksPaginated(
    _data: ITaskPaginatedDTO,
  ): Promise<IResultRegister> {
    const items = this.tasks;
    const result: IResultRegister = items as IResultRegister;

    result.count = items.length;
    result.lastKey = {};
    result.queriedCount = items.length;
    result.timesQueried = 0;

    return result;
  }

  public async findAllTasksPaginatedWithAttr(
    _data: ITaskPaginatedWithAttrsDTO,
  ): Promise<IResultRegisterPartial> {
    const items = this.tasks;
    const result: IResultRegister = items as IResultRegister;

    result.count = items.length;
    result.lastKey = {};
    result.queriedCount = items.length;
    result.timesQueried = 0;

    return result;
  }
}
