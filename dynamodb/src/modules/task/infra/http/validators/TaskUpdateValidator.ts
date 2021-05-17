import AppError from '@shared/erros/AppError';
import { NextFunction, Request, Response } from 'express';
import * as Yup from 'yup';

export const schema = Yup.object().shape({
  created_by_user_id: Yup.string().required(),
  designated_to_user_id: Yup.string().required(),
  title: Yup.string().required(),
  description: Yup.string(),
  attachments: Yup.array().of(
    Yup.object().shape({
      file_name: Yup.string().required(),
    }),
  ),
});

export default async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await schema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    throw new AppError({
      message: 'Validation failed',
      category: 'TASK_UPDATE_VALIDATION_FAILURE',
      messages: err.inner,
    });
  }
};
