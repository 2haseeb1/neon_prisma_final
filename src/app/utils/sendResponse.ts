import { Response } from 'express';

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TResponse<T> = {
  success: boolean;
  message?: string;
  meta?: TMeta;
  data: T;
};

export const sendResponse = <T>(res: Response, payload: TResponse<T>, statusCode: number = 200) => {
  res.status(statusCode).json(payload);
};
