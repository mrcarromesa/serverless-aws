import ITaskKeysDTO from '@modules/task/dtos/props/ITaskKeysDTO';
import ITaskRepository from '@modules/task/repositories/ITaskRepository';
import AppError from '@shared/erros/AppError';
import lodash from 'lodash';
import { inject, injectable } from 'tsyringe';

import ITaskSchemaDTO from '../../dtos/schemas/ITaskSchemaDTO';

@injectable()
export default class GetTaskService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({ category, id }: ITaskKeysDTO): Promise<ITaskSchemaDTO> {
    const item = await this.taskRepository.findTaskByKeys({
      category,
      id,
    });

    if (lodash.isEmpty(item)) {
      throw new AppError({
        category: 'ITEM_NOT_FOUND',
        message: 'Item not found',
      });
    }

    return item;
  }
}
