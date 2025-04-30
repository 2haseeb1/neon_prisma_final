import prisma from '../../../prisma'; 
import { ServiceRecord } from '@prisma/client';
import { CreateServiceBody } from '../../types/serviceTypes';
import { subDays, startOfDay } from 'date-fns';
import { mapStatusFromApi } from '../../utils/statusMapping';


const createServiceRecordInDB = async (payload: CreateServiceBody): Promise<ServiceRecord> => {
  if (!payload.bikeId || !payload.serviceDate || !payload.description || !payload.status) {
    throw new Error('All fields (bikeId, serviceDate, description, status) are required');
  }


  let statusValue: string;
  try {
    statusValue = mapStatusFromApi(payload.status);
  } catch {
    throw new Error('Invalid status value');
  }

  if (isNaN(Date.parse(payload.serviceDate))) {
    throw new Error('Invalid serviceDate');
  }

  const bike = await prisma.bike.findUnique({ where: { bikeId: payload.bikeId } });
  if (!bike) {
    throw new Error('Bike not found');
  }

  return await prisma.serviceRecord.create({
    data: {
      bikeId: payload.bikeId,
      serviceDate: new Date(payload.serviceDate),
      description: payload.description,
      status: statusValue,
    },
  });
};


const getAllServiceRecordsFromDB = async (): Promise<ServiceRecord[]> => {
  return await prisma.serviceRecord.findMany();
};


const getServiceRecordByIdFromDB = async (serviceId: string): Promise<ServiceRecord | null> => {
  return await prisma.serviceRecord.findUnique({ where: { serviceId } });
};


const completeServiceInDB = async (id: string, completionDate?: Date): Promise<ServiceRecord> => {
  const service = await prisma.serviceRecord.findUnique({ where: { serviceId: id } });
  if (!service) {
    throw new Error('Service record not found');
  }

  return await prisma.serviceRecord.update({
    where: { serviceId: id },
    data: {
      completionDate: completionDate || new Date(),
      status: 'done',
    },
  });
};

const getOverdueOrPendingServicesFromDB = async (): Promise<ServiceRecord[]> => {
  const sevenDaysAgo = subDays(startOfDay(new Date()), 7);
console.log("sevendaysago",sevenDaysAgo)
  return await prisma.serviceRecord.findMany({
    where: {
      status: { in: ['pending', 'in-progress'] },
      serviceDate: { lt: sevenDaysAgo },
    },
    orderBy: { serviceDate: 'asc' },
  });
};

const updateServiceRecordInDB = async (
  serviceId: string,
  completionDate?: string
): Promise<ServiceRecord> => {
  const existing = await prisma.serviceRecord.findUnique({ where: { serviceId } });
  if (!existing) {
    throw new Error('Service not found');
  }

  return await prisma.serviceRecord.update({
    where: { serviceId },
    data: {
      completionDate: completionDate ? new Date(completionDate) : new Date(),
      status: 'done',
    },
  });
};
export const serviceService = {
  createServiceRecordInDB,
  getAllServiceRecordsFromDB,
  getServiceRecordByIdFromDB,
  completeServiceInDB,
  getOverdueOrPendingServicesFromDB,
  updateServiceRecordInDB 
};
