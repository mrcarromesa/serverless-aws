import AppError from '@shared/erros/AppError';
import { NextFunction, Request, Response } from 'express';
import * as Yup from 'yup';

export const schema = Yup.object().shape({
  limit: Yup.number().min(1),
  last_key: Yup.number().min(0),
});

export default async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await schema.validate(req.query, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    throw new AppError({
      message: 'Validation failed',
      category: 'TASK_LIST_VALIDATION_FAILURE',
      messages: err.inner,
    });
  }
};
