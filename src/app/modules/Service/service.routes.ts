import express from 'express';
import prisma from '../../../prisma';
import {
  completeService,
  createServiceRecord,
  getAllServiceRecords,
  getOverdueServices,
  getServiceRecordById,
 
   updateServiceRecord
} from './service.controller';

const router = express.Router();

router.post('/', createServiceRecord);
router.get('/', getAllServiceRecords);
router.get('/status', getOverdueServices);
router.put('/:id/complete', completeService);
router.get('/:id', getServiceRecordById);
router.put('/:id', updateServiceRecord);



export const ServiceRoutes = router;
