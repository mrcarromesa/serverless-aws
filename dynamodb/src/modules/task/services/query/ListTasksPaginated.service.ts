import ITaskRepository, {
  IResultRegister,
} from '@modules/task/repositories/ITaskRepository';
import AppError from '@shared/erros/AppError';
import lodash from 'lodash';
import { inject, injectable } from 'tsyringe';

interface IListTasksProps {
  limit: number;
  start_key?: Record<string, unknown>;
}

interface IListTasksResult {
  items: IResultRegister;
  pagination: Record<string, unknown>;
}

@injectable()
export default class ListTasksPaginatedService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({
    limit,
    start_key = undefined,
  }: IListTasksProps): Promise<IListTasksResult> {
    const items = await this.taskRepository.findAllTasksPaginated({
      limit,
      start_key,
    });

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
