import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';

import { CustomerRoutes } from './app/modules/Customer/customer.routes';
import { BikeRoutes } from './app/modules/Bike/bike.routes';
import { ServiceRoutes } from './app/modules/Service/service.routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Application routes
console.log('Mounting CustomerRoutes at /api/customers');
app.use('/api/customers', CustomerRoutes);

console.log('Mounting BikeRoutes at /api/bikes');
app.use('/api/bikes', BikeRoutes);

console.log('Mounting ServiceRoutes at /api/services');
app.use('/api/services', ServiceRoutes);

// Test route
app.get('/', (req: Request, res: Response) => {
  console.log('Root endpoint reached');
  res.send('Welcome to Bike Servicing Management API!');
});

// Global error handler
app.use(globalErrorHandler);

// Handle 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('404 route reached:', req.url);
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    status: httpStatus.NOT_FOUND,
    message: 'API not found',
  });
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;