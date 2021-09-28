import ITaskSaveDTO from '@modules/task/dtos/props/ITaskSaveDTO';
import ITaskSchemaDTO from '@modules/task/dtos/schemas/ITaskSchemaDTO';
import ITaskRepository from '@modules/task/repositories/ITaskRepository';
import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

@injectable()
export default class AddTaskService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({
    category,
    created_by_user_id,
    designated_to_user_id,
    title,
    date,
    attachments = [],
    description = '',
  }: Omit<ITaskSaveDTO, 'id'>): Promise<ITaskSchemaDTO> {
    return this.taskRepository.create({
      id: `${new Date(String(date)).getTime()}|${uuid()}`,
      category,
      created_by_user_id,
      designated_to_user_id,
      title,
      date,
      attachments,
      description,
    });
  }
}
