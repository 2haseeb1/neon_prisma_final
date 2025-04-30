import { z } from 'zod';

export const createCustomerValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'), // Ensures valid email format
    phone: z
      .string({ required_error: 'Phone is required' })
      .regex(
        /^[0-9+\-()\s]+$/,
        'Invalid phone number format' // Ensures valid phone number format
      ),
  }),
});

// ⭐ Add this new validation for ID param
export const getCustomerByIdValidation = z.object({
  params: z.object({
    id: z.string({ required_error: 'Customer ID is required' }).uuid('Invalid UUID format'),
  }),
});

// (Optional) Your getAllCustomersValidation (if you have filters later)
export const getAllCustomersValidation = z.object({
  query: z.object({}), // No specific query params right now
});

export const updateCustomerValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z
      .string()
      .email('Invalid email format')
      .optional(), // Ensures valid email format, optional for updates
    phone: z
      .string()
      .regex(
        /^[0-9+\-()\s]+$/,
        'Invalid phone number format'
      )
      .optional(), // Ensures valid phone number format, optional for updates
  }),
});
