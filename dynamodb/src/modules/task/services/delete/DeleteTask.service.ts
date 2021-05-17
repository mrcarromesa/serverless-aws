import ITaskRepository from '@modules/task/repositories/ITaskRepository';
import { inject, injectable } from 'tsyringe';

interface ITaskDeleteProps {
  id: string;
  category: string;
}

@injectable()
export default class DeleteTaskService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({ id, category }: ITaskDeleteProps): Promise<void> {
    await this.taskRepository.delete({
      id,
      category,
    });
  }
}
