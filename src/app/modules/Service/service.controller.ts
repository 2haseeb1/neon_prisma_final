import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { subDays, startOfDay } from 'date-fns';
import { serviceService } from './service.service';
import { mapStatusFromApi, mapStatusToApi } from '../../utils/statusMapping';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';


export const createServiceRecord = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    status: mapStatusFromApi(req.body.status),
  };

  const service = await serviceService.createServiceRecordInDB(payload);

  sendResponse(res, {
    success: true,
    message: 'Service record created successfully',
    data: {
      ...service,
      status: mapStatusToApi(service.status),
    },
  });
});


export const getAllServiceRecords = catchAsync(async (_req: Request, res: Response) => {
  const services = await serviceService.getAllServiceRecordsFromDB();

  const mappedServices = services.map(service => ({
    ...service,
    status: mapStatusToApi(service.status),
  }));

  sendResponse(res, {
    success: true,
    message: 'Service records fetched successfully',
    data: mappedServices,
  });
});


export const getServiceRecordById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await serviceService.getServiceRecordByIdFromDB(id);

  if (!service) {
    const error = new Error('Service record not found');
    (error as any).statusCode = httpStatus.NOT_FOUND;
    throw error;
  }

  sendResponse(res, {
    success: true,
    message: 'Service record fetched successfully',
    data: {
      ...service,
      status: mapStatusToApi(service.status),
    },
  });
});


export const completeService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completionDate } = req.body;

  const updatedService = await serviceService.completeServiceInDB(
    id,
    completionDate ? new Date(completionDate) : undefined
  );

  sendResponse(res, {
    success: true,
    message: 'Service marked as completed',
    data: {
      ...updatedService,
      status: mapStatusToApi(updatedService.status),
    },
  });
});


export const getOverdueServices = catchAsync(async (_req: Request, res: Response) => {
  const sevenDaysAgo = startOfDay(subDays(new Date(), 7));

  const services = await serviceService.getOverdueOrPendingServicesFromDB();
  ;

  const mappedServices = services.map(service => ({
    ...service,
    status: mapStatusToApi(service.status),
  }));

  sendResponse(res, {
    success: true,
    message: 'Overdue or pending services fetched successfully',
    data: mappedServices,
  });
});


export const updateServiceRecord = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completionDate } = req.body;

  const updatedService = await serviceService.updateServiceRecordInDB(id, completionDate);

  sendResponse(res, {
    success: true,
    message: 'Service record updated successfully',
    data: {
      ...updatedService,
      status: mapStatusToApi(updatedService.status),
    },
  });
});
