import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { container, injectable } from 'tsyringe';

@injectable()
export default class RemoveTaskByIdService {
  async execute(): Promise<void> {
    const s3Select = container.resolve<IStorageProvider>('StorageProvider');
    await s3Select.removeFile({
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      file_path: 'tmp/tasks',
    });
  }
}
