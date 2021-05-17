import ITaskRepository, {
  IResultRegister,
} from '@modules/task/repositories/ITaskRepository';
import AppError from '@shared/erros/AppError';
import lodash from 'lodash';
import { inject, injectable } from 'tsyringe';

interface IListTasksResult {
  items: IResultRegister;
  pagination: Record<string, unknown>;
}

@injectable()
export default class ListTasksByCategoryService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute(category: string): Promise<IListTasksResult> {
    const items = await this.taskRepository.findTasksByCategory(category);

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
