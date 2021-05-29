import ITaskSaveDTO from '@modules/task/dtos/props/ITaskSaveDTO';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { container, injectable } from 'tsyringe';

@injectable()
export default class GetTasksByIdService {
  async execute(id: string): Promise<ITaskSaveDTO[]> {
    const s3Select = container.resolve<IStorageProvider>('StorageProvider');
    return s3Select.selectFileContent<ITaskSaveDTO>({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: `select s.* from s3object s WHERE s.id = '${id}' `,
    });
  }
}
