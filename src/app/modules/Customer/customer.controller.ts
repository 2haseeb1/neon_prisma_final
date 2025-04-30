import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../../../prisma';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

// Create Customer
const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  const existingCustomer = await prisma.customer.findUnique({
    where: { email },
  });

  if (existingCustomer) {
    const error = new Error('Email already in use. Please use a different email address.');
    (error as any).statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const newCustomer = await prisma.customer.create({
    data: { name, email, phone },
  });

  // here statusCode is used only in res.status(), not in the response body
  sendResponse(res, {
    
    success: true,
    message: 'Customer created successfully',
    data: {
      customerId: newCustomer.customerId,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      createdAt: newCustomer.createdAt,
    },
  });
});

// Get All Customers
const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const customers = await prisma.customer.findMany();

  sendResponse(res, {
   
    success: true,
    message: 'Customers fetched successfully',
    data: customers,
  });
});

// Get Customer By ID
const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await prisma.customer.findUnique({
    where: { customerId: id },
  });

  if (!customer) {
    const error = new Error('Customer not found');
    (error as any).statusCode = httpStatus.NOT_FOUND;
    throw error;
  }

  sendResponse(res, {
   
    success: true,
    message: 'Customer fetched successfully',
    data: {
      customerId: customer.customerId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
    },
  });
});

// Update Customer
const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const existingCustomer = await prisma.customer.findUnique({
    where: { customerId: id },
  });

  if (!existingCustomer) {
    const error = new Error('Customer not found');
    (error as any).statusCode = httpStatus.NOT_FOUND;
    throw error;
  }

  const updatedCustomer = await prisma.customer.update({
    where: { customerId: id },
    data: updateData,
  });

  sendResponse(res, {
    
    success: true,
    message: 'Customer updated successfully',
    data: {
      customerId: updatedCustomer.customerId,
      name: updatedCustomer.name,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      createdAt: updatedCustomer.createdAt,
    },
  });
});

// Delete Customer
const deleteCustomerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingCustomer = await prisma.customer.findUnique({
    where: { customerId: id },
  });

  if (!existingCustomer) {
    const error = new Error('Customer not found');
    (error as any).statusCode = httpStatus.NOT_FOUND;
    throw error;
  }

  await prisma.customer.delete({
    where: { customerId: id },
  });

  sendResponse(res, {
   
    success: true,
    message: 'Customer deleted successfully',
    data: null,
  });
});

// Export all
export const customerController = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomerById,
};
