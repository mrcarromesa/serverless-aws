import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { container } from 'tsyringe';

import RemoveTaskByIdService from './RemoveTaskById.service';

let fakeStorageProvider: FakeStorageProvider;

describe('RemoveTaskById', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    fakeStorageProvider = new FakeStorageProvider();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('shold be able to remove a task', async () => {
    await fakeStorageProvider.saveTextToS3InGzip({
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      key: 'tmp/tasks',
      body: '[{"task": "1"}]',
    });

    container.registerInstance<IStorageProvider>(
      'StorageProvider',
      fakeStorageProvider,
    );

    const itemBeforeRemove = await fakeStorageProvider.selectFileContent({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: 'select * from s3',
    });

    expect(itemBeforeRemove).toEqual(
      expect.arrayContaining([expect.objectContaining({ task: '1' })]),
    );

    const service = new RemoveTaskByIdService();
    const result = await service.execute();

    const itemAfterRemove = await fakeStorageProvider.selectFileContent({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: 'select * from s3',
    });

    expect(itemAfterRemove).toEqual([]);
    expect(result).toBeUndefined();
  });

  it('shold be able to remove a task same when env is empty', async () => {
    process.env.S3_BUCKET_S3_SELECT = undefined;
    await fakeStorageProvider.saveTextToS3InGzip({
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      key: 'tmp/tasks',
      body: '[{"task": "1"}]',
    });

    container.registerInstance<IStorageProvider>(
      'StorageProvider',
      fakeStorageProvider,
    );

    const itemBeforeRemove = await fakeStorageProvider.selectFileContent({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: 'select * from s3',
    });

    expect(itemBeforeRemove).toEqual(
      expect.arrayContaining([expect.objectContaining({ task: '1' })]),
    );

    const service = new RemoveTaskByIdService();
    const result = await service.execute();

    const itemAfterRemove = await fakeStorageProvider.selectFileContent({
      file_path: 'tmp/tasks',
      bucket: process.env.S3_BUCKET_S3_SELECT || '',
      query: 'select * from s3',
    });

    expect(itemAfterRemove).toEqual([]);
    expect(result).toBeUndefined();
  });
});
