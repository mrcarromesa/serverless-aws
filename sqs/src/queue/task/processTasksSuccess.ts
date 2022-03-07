/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';

import { logger } from '@config/logger';
import { sleep } from '@shared/libs/sleep';
import { SQSHandler } from 'aws-lambda';

export const process: SQSHandler = async event => {
  console.time();
  console.log('HERE!', new Date());
  logger('Queue called');
  try {
    logger(event.Records);
    await sleep(5000);
  } catch (err) {
    console.log(err);
  }
  console.timeEnd();
};
