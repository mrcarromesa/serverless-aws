import ITaskUserDeliveryDTO from '@modules/task/dtos/props/ITaskUserDeliveryDTO';
import ITaskSchemaDTO from '@modules/task/dtos/schemas/ITaskSchemaDTO';
import ITaskRepository from '@modules/task/repositories/ITaskRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class UpdateDeliveryTaskService {
  constructor(
    @inject('TaskRepository')
    private taskRepository: ITaskRepository,
  ) {}

  async execute({
    id,
    category,
    user_delivered,
    delivery_date,
  }: ITaskUserDeliveryDTO): Promise<ITaskSchemaDTO> {
    return this.taskRepository.updateUserDelivery({
      id,
      category,
      user_delivered,
      delivery_date,
    });
  }
}
