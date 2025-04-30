import { CreateServiceBody } from "../../types/serviceTypes";

export const validateCreateService = (data: CreateServiceBody) => {
  const { bikeId, serviceDate, description, status } = data;

  if (!bikeId || !serviceDate || !description || !status) {
    return "All fields are required: bikeId, serviceDate, description, status.";
  }

  return null;
};
