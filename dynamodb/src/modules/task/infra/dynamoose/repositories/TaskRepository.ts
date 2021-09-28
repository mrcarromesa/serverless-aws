import ITaskKeysDTO from '@modules/task/dtos/props/ITaskKeysDTO';
import ITaskPaginatedDTO from '@modules/task/dtos/props/ITaskPaginatedDTO';
import ITaskPaginatedWithAttrsDTO from '@modules/task/dtos/props/ITaskPaginatedWithAttrsDTO';
import ITaskSaveDTO from '@modules/task/dtos/props/ITaskSaveDTO';
import ITaskUserDeliveryDTO from '@modules/task/dtos/props/ITaskUserDeliveryDTO';
import ITaskSchemaDTO from '@modules/task/dtos/schemas/ITaskSchemaDTO';
import ITaskRepository, {
  IResultRegister,
  IResultRegisterPartial,
} from '@modules/task/repositories/ITaskRepository';
import { SortOrder } from 'dynamoose/dist/General';

import Task from '../schemas/Task';

export default class TaskRepository implements ITaskRepository {
  public async findTasksByUserDeliveredSortered(
    user_delivered: string,
    limit: number,
    start_key?: Record<string, unknown>,
  ): Promise<IResultRegister> {
    if (start_key) {
      return Task.query('user_delivered')
        .eq(user_delivered)
        .sort(SortOrder.ascending)
        .using('idx_key_of_user_delivered')
        .limit(limit)
        .startAt(start_key)
        .exec();
    }

    return Task.query('user_delivered')
      .eq(user_delivered)
      .sort(SortOrder.ascending)
      .using('idx_key_of_user_delivered')
      .limit(limit)
      .exec();
  }

  public async updateUserDelivery({
    id,
    category,
    user_delivered,
    delivery_date,
  }: ITaskUserDeliveryDTO): Promise<ITaskSchemaDTO> {
    return Task.update({
      id,
      category,
      user_delivered,
      delivery_date: new Date(String(delivery_date)),
    });
  }

  public async create({
    id,
    category,
    created_by_user_id,
    designated_to_user_id,
    title,
    date,
    description,
    attachments,
  }: ITaskSaveDTO): Promise<ITaskSchemaDTO> {
    return Task.create({
      id,
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      delivery_date: new Date(String(date)),
      description: description || '',
      attachments: attachments || [],
    });
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
    return Task.update({
      id,
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      description,
      attachments,
    });
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

  public async findTasksByCategoryAndDateAndSort(
    category: string,
    limit: number,
    start_key?: Record<string, unknown>,
  ): Promise<IResultRegister> {
    if (start_key) {
      return Task.query('category')
        .eq(category)
        .sort(SortOrder.descending)
        .limit(limit)
        .startAt(start_key)
        .exec();
    }
    return Task.query('category')
      .eq(category)
      .sort(SortOrder.descending)
      .limit(limit)
      .exec();
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
