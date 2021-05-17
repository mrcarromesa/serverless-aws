import ITaskKeysDTO from '@modules/task/dtos/props/ITaskKeysDTO';
import ITaskPaginatedDTO from '@modules/task/dtos/props/ITaskPaginatedDTO';
import ITaskPaginatedWithAttrsDTO from '@modules/task/dtos/props/ITaskPaginatedWithAttrsDTO';
import ITaskSaveDTO from '@modules/task/dtos/props/ITaskSaveDTO';
import ITaskSchemaDTO from '@modules/task/dtos/schemas/ITaskSchemaDTO';
import ITaskRepository, {
  IResultRegister,
  IResultRegisterPartial,
} from '@modules/task/repositories/ITaskRepository';

import Task from '../schemas/Task';

export default class TaskRepository implements ITaskRepository {
  public async create({
    id,
    category,
    created_by_user_id,
    designated_to_user_id,
    title,
    description,
    attachments,
  }: ITaskSaveDTO): Promise<ITaskSchemaDTO> {
    return (Task.create({
      id,
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      description: description || '',
      attachments: attachments || [],
    }) as unknown) as ITaskSchemaDTO;
  }

  public async update({
    id,
    category,
    created_by_user_id,
    designated_to_user_id,
    title,
    description,
    attachments,
  }: ITaskSaveDTO): Promise<ITaskSchemaDTO> {
    return (Task.update({
      id,
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      description,
      attachments,
    }) as unknown) as ITaskSchemaDTO;
  }

  public async findTaskByKeys({
    category,
    id,
  }: ITaskKeysDTO): Promise<ITaskSchemaDTO> {
    return Task.get({
      category,
      id,
    });
  }

  public async delete({ category, id }: ITaskKeysDTO): Promise<void> {
    await Task.delete({
      category,
      id,
    });
  }

  public async batchDelete(data: ITaskKeysDTO[]): Promise<void> {
    await Task.batchDelete(data);
  }

  public async findTasksByCategory(category: string): Promise<IResultRegister> {
    return Task.query('category').eq(category).all().exec();
  }

  public async findTasksByUserCreatedId(
    user_id: string,
  ): Promise<IResultRegister> {
    return Task.scan()
      .where('created_by_user_id')
      .eq(user_id)
      .using('idx_key_of_created_by_user_id_task')
      .all()
      .exec();
  }

  public async findTasksByUserDesignatedId(
    user_id: string,
  ): Promise<IResultRegister> {
    return Task.scan()
      .where('designated_to_user_id')
      .eq(user_id)
      .using('idx_key_of_designated_to_user_id_task')
      .all()
      .exec();
  }

  public async findAllTasksPaginated({
    start_key,
    limit,
  }: ITaskPaginatedDTO): Promise<IResultRegister> {
    if (start_key) {
      return Task.scan().limit(limit).startAt(start_key).exec();
    }
    return Task.scan().limit(limit).exec();
  }

  public async findAllTasksPaginatedWithAttr({
    start_key,
    limit,
    attrs,
  }: ITaskPaginatedWithAttrsDTO): Promise<IResultRegisterPartial> {
    if (start_key) {
      return Task.scan()
        .attributes(attrs)
        .limit(limit)
        .startAt(start_key)
        .exec();
    }
    return Task.scan().attributes(attrs).limit(limit).exec();
  }
}
