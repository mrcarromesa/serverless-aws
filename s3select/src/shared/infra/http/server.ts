import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import '@shared/container';

import AppError from '@shared/erros/AppError';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import routes from './routes';

const app = express();
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '6mb' }));
app.use(express.urlencoded({ limit: '6mb' }));

if (process.env.STAGE === 'local') {
  app.use('/', routes);
} else {
  app.use('/', routes);
}

app.use(
  (error: Error, _request: Request, response: Response, _: NextFunction) => {
    console.error(error);
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        category: error.category,
        messages: error.messages,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal server  error: ${error}`,
      category: 'INTERNAL_ERROR',
    });
  },
);

export default app;
