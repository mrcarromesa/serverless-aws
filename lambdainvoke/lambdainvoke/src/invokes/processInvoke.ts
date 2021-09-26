import 'reflect-metadata';
import 'dotenv/config';

import { logger } from '@config/logger';
import { Handler } from 'aws-lambda';

export const process: Handler = async (event, _context, callback) => {
  if (event.Records) {
    logger('Lambda called');
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: `${event} - from the other function`,
    }),
  });
};
