import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { container } from 'tsyringe';

import AddTasksService from './AddTasks.service';

let fakeStorageProvider: FakeStorageProvider;

describe('AddTasks', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    fakeStorageProvider = new FakeStorageProvider();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('shold be able to add a new task', async () => {
    container.registerInstance<IStorageProvider>(
      'StorageProvider',
      fakeStorageProvider,
    );

    const service = new AddTasksService();
    const result = await service.execute([
      {
        category: 'Category',
        created_by_user_id: 'user',
        designated_to_user_id: 'user',
        title: 'Task Example',
        description: 'Description from task',
      },
    ]);

    const itemSelected = await fakeStorageProvider.selectFileContent({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: 'select * from s3',
    });

    expect(itemSelected).toMatch(/ey/);
    expect(result).toBeUndefined();
  });

  it('shold be able to add a new task same when env is empty', async () => {
    process.env.S3_BUCKET_S3_SELECT = undefined;
    container.registerInstance<IStorageProvider>(
      'StorageProvider',
      fakeStorageProvider,
    );

    const service = new AddTasksService();
    const result = await service.execute([
      {
        category: 'Category',
        created_by_user_id: 'user',
        designated_to_user_id: 'user',
        title: 'Task Example',
        description: 'Description from task',
      },
    ]);

    const itemSelected = await fakeStorageProvider.selectFileContent({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: 'select * from s3',
    });

    expect(itemSelected).toMatch(/ey/);
    expect(result).toBeUndefined();
  });
});
