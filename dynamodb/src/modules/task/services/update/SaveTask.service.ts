import ITaskSaveDTO from '@modules/task/dtos/props/ITaskSaveDTO';
import ITaskSchemaDTO from '@modules/task/dtos/schemas/ITaskSchemaDTO';
import ITaskRepository from '@modules/task/repositories/ITaskRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class SaveTaskService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({
    id,
    category,
    created_by_user_id,
    designated_to_user_id,
    title,
    attachments = [],
    description = '',
  }: ITaskSaveDTO): Promise<ITaskSchemaDTO> {
    return this.taskRepository.update({
      id,
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      attachments,
      description,
    });
  }
}
