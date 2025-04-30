import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prismaClient = new PrismaClient();
app.use(express.json());

// Helper function to format error responses
const sendErrorResponse = (
  res: Response,
  status: number,
  message: string,
  error?: unknown
) => {
  const response: {
    success: boolean;
    status: number;
    message: string;
    stack?: string;
  } = {
    success: false,
    status,
    message,
  };

  if (process.env.NODE_ENV === 'development' && error instanceof Error) {
    response.stack = error.stack;
  }

  res.status(status).json(response);
};

// 1. POST /api/customers - Create a new customer
app.post('/api/customers', async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  // Validate input
  if (!name || !email || !phone) {
    sendErrorResponse(res, 400, 'Missing required fields: name, email, or phone');
    return;
  }

  try {
    const newCustomer = await prismaClient.customer.create({
      data: {
        name,
        email,
        phone,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: newCustomer,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to create customer', error);
  }
});

// 2. GET /api/customers - Get all customers
app.get('/api/customers', async (req: Request, res: Response) => {
  try {
    const customers = await prismaClient.customer.findMany();
    res.status(200).json({
      success: true,
      message: 'Customers fetched successfully',
      data: customers,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to fetch customers', error);
  }
});

// 3. GET /api/customers/:id - Get a specific customer by ID
app.get('/api/customers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customer = await prismaClient.customer.findUnique({
      where: { customerId: id },
    });

    if (customer) {
      res.status(200).json({
        success: true,
        message: 'Customer fetched successfully',
        data: customer,
      });
    } else {
      sendErrorResponse(res, 404, 'Customer not found');
    }
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to fetch customer', error);
  }
});

// 4. PUT /api/customers/:id - Update customer details
app.put('/api/customers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone } = req.body;

  try {
    const updatedCustomer = await prismaClient.customer.update({
      where: { customerId: id },
      data: {
        name,
        phone,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to update customer', error);
  }
});

// 5. DELETE /api/customers/:id - Delete a customer
app.delete('/api/customers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customer = await prismaClient.customer.findUnique({
      where: { customerId: id },
    });

    if (!customer) {
      sendErrorResponse(res, 404, 'Customer not found');
      return;
    }

    await prismaClient.customer.delete({
      where: { customerId: id },
    });

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to delete customer', error);
  }
});

// 6. POST /api/bikes - Add a new bike
app.post('/api/bikes', async (req: Request, res: Response) => {
  const { brand, model, year, customerId } = req.body;

  // Validate input
  if (!brand || !model || !year || !customerId) {
    sendErrorResponse(res, 400, 'Missing required fields: brand, model, year, or customerId');
    return;
  }

  if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
    sendErrorResponse(res, 400, 'Invalid year: must be a number between 1900 and next year');
    return;
  }

  try {
    const customer = await prismaClient.customer.findUnique({
      where: { customerId },
    });

    if (!customer) {
      sendErrorResponse(res, 404, 'Customer not found');
      return;
    }

    const newBike = await prismaClient.bike.create({
      data: {
        brand,
        model,
        year,
        customerId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Bike added successfully',
      data: newBike,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to create bike', error);
  }
});

// 7. GET /api/bikes - Get all bikes
app.get('/api/bikes', async (req: Request, res: Response) => {
  try {
    const bikes = await prismaClient.bike.findMany();
    res.status(200).json({
      success: true,
      message: 'Bikes fetched successfully',
      data: bikes,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to fetch bikes', error);
  }
});

// 8. GET /api/bikes/:id - Get a specific bike by ID
app.get('/api/bikes/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const bike = await prismaClient.bike.findUnique({
      where: { bikeId: id },
    });

    if (bike) {
      res.status(200).json({
        success: true,
        message: 'Bike fetched successfully',
        data: bike,
      });
    } else {
      sendErrorResponse(res, 404, 'Bike not found');
    }
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to fetch bike', error);
  }
});

// 9. POST /api/services - Create a service record
app.post('/api/services', async (req: Request, res: Response) => {
  const { bikeId, serviceDate, description, status } = req.body;

  // Validate input
  if (!bikeId || !serviceDate || !description || !status) {
    sendErrorResponse(res, 400, 'Missing required fields: bikeId, serviceDate, description, or status');
    return;
  }

  const parsedServiceDate = new Date(serviceDate);
  if (isNaN(parsedServiceDate.getTime())) {
    sendErrorResponse(res, 400, 'Invalid serviceDate: must be a valid ISO 8601 date string');
    return;
  }

  const validStatuses = ['pending', 'in-progress', 'done'];
  if (!validStatuses.includes(status)) {
    sendErrorResponse(res, 400, `Invalid status: must be one of ${validStatuses.join(', ')}`);
    return;
  }

  try {
    const bike = await prismaClient.bike.findUnique({
      where: { bikeId },
    });

    if (!bike) {
      sendErrorResponse(res, 404, 'Bike not found');
      return;
    }

    const newService = await prismaClient.serviceRecord.create({
      data: {
        bikeId,
        serviceDate: parsedServiceDate,
        description,
        status,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Service record created successfully',
      data: newService,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to create service record', error);
  }
});

// 10. GET /api/services - Get all service records
app.get('/api/services', async (req: Request, res: Response) => {
  try {
    const services = await prismaClient.serviceRecord.findMany();
    res.status(200).json({
      success: true,
      message: 'Service records fetched successfully',
      data: services,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to fetch service records', error);
  }
});

// 11. GET /api/services/:id - Get a specific service record by ID
app.get('/api/services/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const service = await prismaClient.serviceRecord.findUnique({
      where: { serviceId: id },
    });

    if (service) {
      res.status(200).json({
        success: true,
        message: 'Service record fetched successfully',
        data: service,
      });
    } else {
      sendErrorResponse(res, 404, 'Service record not found');
    }
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to fetch service record', error);
  }
});

// 12. PUT /api/services/:id/complete - Mark a service as completed
app.put('/api/services/:id/complete', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completionDate } = req.body;

  try {
    const service = await prismaClient.serviceRecord.findUnique({
      where: { serviceId: id },
    });

    if (!service) {
      sendErrorResponse(res, 404, 'Service record not found');
      return;
    }

    if (service.status === 'done') {
      sendErrorResponse(res, 400, 'Service is already marked as completed');
      return;
    }

    let parsedCompletionDate: Date;
    if (completionDate) {
      parsedCompletionDate = new Date(completionDate);
      if (isNaN(parsedCompletionDate.getTime())) {
        sendErrorResponse(res, 400, 'Invalid completionDate: must be a valid ISO 8601 date string');
        return;
      }
    } else {
      parsedCompletionDate = new Date();
    }

    const updatedService = await prismaClient.serviceRecord.update({
      where: { serviceId: id },
      data: {
        status: 'done',
        completionDate: parsedCompletionDate,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Service marked as completed',
      data: updatedService,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to mark service as completed', error);
  }
});

// 13. GET /api/services/status - Get pending or overdue services (Bonus)
app.get('/api/services/status', async (req: Request, res: Response) => {
  try {
    const overdueThreshold = new Date();
    overdueThreshold.setDate(overdueThreshold.getDate() - 7); // Services older than 7 days

    const services = await prismaClient.serviceRecord.findMany({
      where: {
        OR: [
          { status: 'pending' },
          { status: 'in_progress' },
        ],
        serviceDate: {
          lte: overdueThreshold,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Pending or overdue services fetched successfully',
      data: services,
    });
  } catch (error: unknown) {
    sendErrorResponse(res, 500, 'Failed to fetch pending or overdue services', error);
  }
});

// Start server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});