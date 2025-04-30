import express from 'express';
import { BikeController } from './bike.controller';

const router = express.Router();

// No need to write `/bikes` here
router.post('/', BikeController.createBike);
router.get('/', BikeController.getAllBikes);
router.get('/:id', BikeController.getSingleBike);

export const BikeRoutes = router;

