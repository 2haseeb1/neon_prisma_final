import { z } from 'zod';

export const createCustomerValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'), 
    phone: z
      .string({ required_error: 'Phone is required' })
      .regex(
        /^[0-9+\-()\s]+$/,
        'Invalid phone number format' 
      ),
  }),
});


export const getCustomerByIdValidation = z.object({
  params: z.object({
    id: z.string({ required_error: 'Customer ID is required' }).uuid('Invalid UUID format'),
  }),
});


export const getAllCustomersValidation = z.object({
  query: z.object({}), 
});

export const updateCustomerValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z
      .string()
      .email('Invalid email format')
      .optional(), 
    phone: z
      .string()
      .regex(
        /^[0-9+\-()\s]+$/,
        'Invalid phone number format'
      )
      .optional(), 
  }),
});
