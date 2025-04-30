import { Request, Response } from 'express';
import { BikeService } from './bike.service';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export const BikeController = {
  createBike: catchAsync(async (req: Request, res: Response) => {
    const bikeData = req.body;
    const result = await BikeService.createBike(bikeData);

    sendResponse(res, {
      success: true,
      message: 'Bike added successfully',
      data: result,
    }, httpStatus.CREATED); 
  }),

  getAllBikes: catchAsync(async (req: Request, res: Response) => {
    const result = await BikeService.getAllBikes();

    sendResponse(res, {
      success: true,
      message: 'Bikes fetched successfully',
      data: result,
    }, httpStatus.OK);
  }),

  getSingleBike: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BikeService.getSingleBike(id);

    if (!result) {
      const error = new Error('Bike not found');
      (error as any).statusCode = httpStatus.NOT_FOUND;
      throw error;
    }

    sendResponse(res, {
      success: true,
      message: 'Bike fetched successfully',
      data: result,
    }, httpStatus.OK);
  }),
};
