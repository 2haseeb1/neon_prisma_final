import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        (error as any).statusCode = 400; // 👈 type assertion
        throw error;
      }
      next(error);
    }
  };
};
