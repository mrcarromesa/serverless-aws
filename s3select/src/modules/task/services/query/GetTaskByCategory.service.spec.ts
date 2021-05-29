import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { container } from 'tsyringe';

import GetTaskByCategoryService from './GetTaskByCategory.service';

let fakeStorageProvider: FakeStorageProvider;

describe('GetTaskByCategory', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    fakeStorageProvider = new FakeStorageProvider();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('shold be able to get task', async () => {
    await fakeStorageProvider.saveTextToS3InGzip({
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      key: 'tmp/tasks',
      body: '[{"task": "1", "category": "category-1"}]',
    });

    container.registerInstance<IStorageProvider>(
      'StorageProvider',
      fakeStorageProvider,
    );

    const service = new GetTaskByCategoryService();
    const result = await service.execute('category-1');

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: 'category-1' }),
      ]),
    );
  });

  it('shold be able to get task same when env is empty', async () => {
    process.env.S3_BUCKET_S3_SELECT = undefined;
    await fakeStorageProvider.saveTextToS3InGzip({
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      key: 'tmp/tasks',
      body: '[{"task": "1", "category": "category-1"}]',
    });

    container.registerInstance<IStorageProvider>(
      'StorageProvider',
      fakeStorageProvider,
    );

    const service = new GetTaskByCategoryService();
    const result = await service.execute('category-1');

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: 'category-1' }),
      ]),
    );
  });
});
