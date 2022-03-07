import { logger } from '@config/logger';

interface IAppErrorProps {
  message: string;
  category: string;
  messages?: Record<string, unknown>;
  statusCode?: number;
}

class AppError {
  public readonly message: string;

  public readonly category: string;

  public readonly messages: Record<string, unknown>;

  public readonly statusCode: number;

  constructor({
    message,
    category,
    messages = {},
    statusCode = 400,
  }: IAppErrorProps) {
    this.message = message;
    this.category = category;
    this.messages = messages;
    this.statusCode = statusCode;
    logger('AppError: ', {
      message,
      category,
      messages,
      statusCode,
    });
  }
}

export default AppError;
