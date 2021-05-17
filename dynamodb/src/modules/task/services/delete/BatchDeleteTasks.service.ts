import ITaskRepository from '@modules/task/repositories/ITaskRepository';
import lodash from 'lodash';
import { inject, injectable } from 'tsyringe';

interface ITaskDeleteProps {
  id: string;
  category: string;
  [key: string]: string;
}

@injectable()
export default class BatchDeleteTasksService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute(itemToDelete: ITaskDeleteProps[]): Promise<void> {
    // which can comprise as many as 25 put or delete request
    const keysDelete = lodash.chunk(itemToDelete, 25);
    const promisesDelete = keysDelete.map(itemPromise => {
      return this.taskRepository.batchDelete(itemPromise);
    });

    await Promise.all(promisesDelete);
  }
}
