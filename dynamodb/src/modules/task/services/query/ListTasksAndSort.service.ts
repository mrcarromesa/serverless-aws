import ITaskRepository, {
  IResultRegister,
} from '@modules/task/repositories/ITaskRepository';
import AppError from '@shared/erros/AppError';
import lodash from 'lodash';
import { inject, injectable } from 'tsyringe';

interface IListTasksProps {
  category: string;
  limit: number;
  start_key?: Record<string, unknown>;
}

interface IListTasksResult {
  items: IResultRegister;
  pagination: Record<string, unknown>;
}

@injectable()
export default class ListTasksAndSortService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({
    category,
    limit,
    start_key = undefined,
  }: IListTasksProps): Promise<IListTasksResult> {
    const items = await this.taskRepository.findTasksByCategoryAndDateAndSort(
      category,
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
