import prisma from '../../../prisma'; // Adjust path as needed
import { ServiceRecord } from '@prisma/client';
import { CreateServiceBody } from '../../types/serviceTypes';
import { subDays, startOfDay } from 'date-fns';
import { mapStatusFromApi } from '../../utils/statusMapping';

// 1. Create a Service Record
const createServiceRecordInDB = async (payload: CreateServiceBody): Promise<ServiceRecord> => {
  if (!payload.bikeId || !payload.serviceDate || !payload.description || !payload.status) {
    throw new Error('All fields (bikeId, serviceDate, description, status) are required');
  }

  // Validate and map status to normalized string
  let statusValue: string;
  try {
    statusValue = mapStatusFromApi(payload.status);
  } catch {
    throw new Error('Invalid status value');
  }

  // Validate date
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

// 2. Get All Service Records
const getAllServiceRecordsFromDB = async (): Promise<ServiceRecord[]> => {
  return await prisma.serviceRecord.findMany();
};

// 3. Get a Specific Service Record by ID
const getServiceRecordByIdFromDB = async (serviceId: string): Promise<ServiceRecord | null> => {
  return await prisma.serviceRecord.findUnique({ where: { serviceId } });
};

// 4. Mark a Service as Completed
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

// 5. Get Pending or Overdue Services (older than 7 days)
const getOverdueOrPendingServicesFromDB = async (sevenDaysAgo: Date): Promise<ServiceRecord[]> => {
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
