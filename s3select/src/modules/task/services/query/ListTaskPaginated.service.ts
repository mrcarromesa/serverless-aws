import ITaskSaveDTO from '@modules/task/dtos/props/ITaskSaveDTO';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { container, injectable } from 'tsyringe';

interface IListTaskPaginatedProps {
  last_key: number;
  limit: number;
}

interface ICountResult {
  _1: number;
}

interface TaskResult {
  items: ITaskSaveDTO[];
  total_rows: number;
}

@injectable()
export default class ListTaskPaginatedService {
  async execute({
    last_key,
    limit,
  }: IListTaskPaginatedProps): Promise<TaskResult> {
    const s3Select = container.resolve<IStorageProvider>('StorageProvider');
    const result = await s3Select.selectFileContent<ITaskSaveDTO>({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: `select s.* from s3object s WHERE s.last_key > ${last_key} LIMIT ${limit} `,
    });

    const count = await s3Select.selectFileContent<ICountResult>({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: `SELECT count(*) FROM s3object s WHERE s IS NOT MISSING`,
    });

    return {
      items: result,
      total_rows: count[0]._1,
    };
  }
}
