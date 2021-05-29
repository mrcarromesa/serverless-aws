import ITaskSaveDTO from '@modules/task/dtos/props/ITaskSaveDTO';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { container, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

@injectable()
export default class AddTasksService {
  async execute(tasks: Omit<ITaskSaveDTO, 'id'>[]): Promise<void> {
    const tasksWithIds = tasks.map(item => ({
      ...item,
      id: uuid(),
    }));

    const taskStr = tasksWithIds
      .map(item => {
        const text = JSON.stringify(item);
        return text;
      })
      .join('\n');
    const tasksBuffer = Buffer.from(taskStr, 'utf8').toString('base64');

    const s3Select = container.resolve<IStorageProvider>('StorageProvider');
    await s3Select.saveTextToS3InGzip({
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      key: 'tmp/tasks',
      body: tasksBuffer,
    });
  }
}
