import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';

import { logger } from '@config/logger';
import { DynamoDBStreamHandler } from 'aws-lambda';

export const process: DynamoDBStreamHandler = async event => {
  logger('trigger_called: =>', event);
};
