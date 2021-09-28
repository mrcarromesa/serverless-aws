import ITaskRepository, {
  IResultRegister,
} from '@modules/task/repositories/ITaskRepository';
import AppError from '@shared/erros/AppError';
import lodash from 'lodash';
import { inject, injectable } from 'tsyringe';

interface IListTasksProps {
  user_delivered: string;
  limit: number;
  start_key?: Record<string, unknown>;
}

interface IListTasksResult {
  items: IResultRegister;
  pagination: Record<string, unknown>;
}

@injectable()
export default class ListTaskByUserDeliveredSorteredService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({
    user_delivered,
    limit,
    start_key = undefined,
  }: IListTasksProps): Promise<IListTasksResult> {
    const items = await this.taskRepository.findTasksByUserDeliveredSortered(
      user_delivered,
      limit,
      start_key,
    );

    if (lodash.isEmpty(items)) {
      throw new AppError({
        category: 'ITEMS_NOT_FOUND',
        message: 'Items not found',
      });
    }

    const { lastKey, count, queriedCount, timesQueried } = items;

    return {
      items,
      pagination: {
        lastKey,
        count,
        queriedCount,
        timesQueried,
      },
    };
  }
}
