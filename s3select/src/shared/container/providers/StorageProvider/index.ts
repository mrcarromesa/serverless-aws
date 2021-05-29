import { container } from 'tsyringe';

import S3Provider from './implementations/S3Provider';
import IStorageProvider from './models/IStorageProvider';

const provider = {
  s3Storage: S3Provider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  provider.s3Storage,
);
