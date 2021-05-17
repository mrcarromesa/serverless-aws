import ITaskRepository, {
  IResultRegisterPartial,
} from '@modules/task/repositories/ITaskRepository';
import AppError from '@shared/erros/AppError';
import lodash from 'lodash';
import { inject, injectable } from 'tsyringe';

interface IListTasksProps {
  attrs: string[];
  limit: number;
  start_key?: Record<string, unknown>;
}

interface IListTasksResult {
  items: IResultRegisterPartial;
  pagination: Record<string, unknown>;
}

@injectable()
export default class ListTasksWithAttrsPaginatedService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({
    attrs,
    limit,
    start_key = undefined,
  }: IListTasksProps): Promise<IListTasksResult> {
    const items = await this.taskRepository.findAllTasksPaginatedWithAttr({
      attrs,
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
