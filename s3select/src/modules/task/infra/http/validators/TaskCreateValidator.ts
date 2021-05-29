import AppError from '@shared/erros/AppError';
import { NextFunction, Request, Response } from 'express';
import * as Yup from 'yup';

export const schema = Yup.array()
  .of(
    Yup.object().shape({
      category: Yup.string().required(),
      created_by_user_id: Yup.string().required(),
      designated_to_user_id: Yup.string().required(),
      title: Yup.string().required(),
      description: Yup.string(),
      attachments: Yup.array().of(
        Yup.object().shape({
          file_name: Yup.string().required(),
        }),
      ),
    }),
  )
  .min(1);

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
      category: 'TASK_CREATE_VALIDATION_FAILURE',
      messages: err.inner,
    });
  }
};
