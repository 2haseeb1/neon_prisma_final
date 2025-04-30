import express from 'express';
import { createCustomerValidation, getAllCustomersValidation, getCustomerByIdValidation, updateCustomerValidation } from './customer.validation';


import { validateRequest } from '../../middlewares/validateRequest';
import { customerController } from './customer.controller';

const router = express.Router();


router.post('/', validateRequest(createCustomerValidation), customerController.createCustomer);
router.get('/', validateRequest(getAllCustomersValidation), customerController.getAllCustomers);
router.get('/:id', validateRequest(getCustomerByIdValidation), customerController.getCustomerById);
router.put('/:id', validateRequest(updateCustomerValidation), customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomerById);

export const CustomerRoutes = router;
