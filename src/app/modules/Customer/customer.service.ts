import { PrismaClient, Bike } from '@prisma/client'; 
const prisma = new PrismaClient();


const createBike = async (bikeData: {
  brand: string;
  model: string;
  price: number;
  year: number;
  customerId: string;
}) => {
  const newBike = await prisma.bike.create({
    data: bikeData,
  });
  return newBike;
};


const getAllBikes = async () => {
  const bikes = await prisma.bike.findMany();
  return bikes;
};


const getSingleBike = async (bikeId: string) => {
  const bike = await prisma.bike.findUnique({
    where: {
      bikeId: bikeId,
    },
  });
  return bike;
};


const updateBike = async (bikeId: string, updateData: Partial<Bike>) => {
  const bike = await prisma.bike.update({
    where: { bikeId },
    data: updateData,
  });
  return bike;
};


const deleteBike = async (bikeId: string) => {
  await prisma.bike.delete({
    where: { bikeId },
  });
};

export const BikeService = {
  createBike,
  getAllBikes,
  getSingleBike,
  updateBike,
  deleteBike
};
