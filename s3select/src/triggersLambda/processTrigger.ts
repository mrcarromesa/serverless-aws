import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';

import { logger } from '@config/logger';
import { S3Handler } from 'aws-lambda';

export const process: S3Handler = async event => {
  logger('trigger_called: =>', event);
};
