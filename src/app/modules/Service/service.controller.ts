import { Request, Response, NextFunction } from 'express';
import { serviceService } from './service.service';
import { mapStatusFromApi, mapStatusToApi } from '../../utils/statusMapping';
import httpStatus from 'http-status';
import { subDays, startOfDay } from 'date-fns';


export const createServiceRecord = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Received status from request body:', req.body.status);
  try {
    const payload = {
      ...req.body,
      status: mapStatusFromApi(req.body.status),
    };

    const service = await serviceService.createServiceRecordInDB(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Service record created successfully',
      data: {
        ...service,
        status: mapStatusToApi(service.status),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: (error as Error).message,
      ...(process.env.NODE_ENV === 'development' && { stack: (error as Error).stack }),
    });
  }
};


export const getAllServiceRecords = async (req: Request, res: Response) => {
  try {
    const services = await serviceService.getAllServiceRecordsFromDB();

    const mappedServices = services.map(service => ({
      ...service,
      status: mapStatusToApi(service.status),
    }));

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Service records fetched successfully',
      data: mappedServices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: (error as Error).message,
      ...(process.env.NODE_ENV === 'development' && { stack: (error as Error).stack }),
    });
  }
};


export const getServiceRecordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceRecordByIdFromDB(id);

    if (!service) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'Service record not found',
      });
      return;
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Service record fetched successfully',
      data: {
        ...service,
        status: mapStatusToApi(service.status),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: (error as Error).message,
      ...(process.env.NODE_ENV === 'development' && { stack: (error as Error).stack }),
    });
  }
};

export const completeService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completionDate } = req.body;

    const updatedService = await serviceService.completeServiceInDB(
      id,
      completionDate ? new Date(completionDate) : undefined
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Service marked as completed',
      data: {
        ...updatedService,
        status: mapStatusToApi(updatedService.status),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: (error as Error).message,
      ...(process.env.NODE_ENV === 'development' && { stack: (error as Error).stack }),
    });
  }
};


export const getOverdueServices = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = startOfDay(subDays(new Date(), 7));

    const services = await serviceService.getOverdueOrPendingServicesFromDB(sevenDaysAgo);

    const mappedServices = services.map(service => ({
      ...service,
      status: mapStatusToApi(service.status),
    }));

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Overdue or pending services fetched successfully',
      data: mappedServices.length > 0 ? mappedServices : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: (error as Error).message,
      ...(process.env.NODE_ENV === 'development' && { stack: (error as Error).stack }),
    });
  }
};

export const updateServiceRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completionDate } = req.body;

    const updatedService = await serviceService.updateServiceRecordInDB(id, completionDate);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Service record updated successfully',
      data: {
        ...updatedService,
        status: mapStatusToApi(updatedService.status),
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: 404,
      message: (error as Error).message,
      ...(process.env.NODE_ENV === 'development' && { stack: (error as Error).stack }),
    });
  }
};
