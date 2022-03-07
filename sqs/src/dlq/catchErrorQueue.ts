import 'reflect-metadata';
import 'dotenv/config';

import { logger } from '@config/logger';
import { SQSHandler } from 'aws-lambda';

export const process: SQSHandler = async event => {
  if (event.Records) {
    logger('DeadLetterQueue', event.Records);
  }
};
