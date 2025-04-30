import { IBike } from './bike.interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const BikeService = {
  async createBike(payload: { brand: string; model: string; year: number; customerId: string }) {
    // Check required fields
    if (!payload.brand || !payload.model || !payload.year || !payload.customerId) {
      const error = new Error("brand, model, year, and customerId are required");
      (error as any).statusCode = 400;
      throw error;
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { customerId: payload.customerId },
    });
    if (!customer) {
      const error = new Error("Customer not found");
      (error as any).statusCode = 404;
      throw error;
    }

    // Create the bike
    const newBike = await prisma.bike.create({
      data: {
        brand: payload.brand,
        model: payload.model,
        year: payload.year,
        customerId: payload.customerId,
      },
    });
    return newBike;
  },

  async getAllBikes() {
    try {
      const bikes = await prisma.bike.findMany();
      return bikes;
    } catch (error) {
      throw new Error(`Failed to fetch bikes: ${(error as Error).message}`);
    }
  },

  async getSingleBike(bikeId: string) {
    try {
      const bike = await prisma.bike.findUnique({
        where: { bikeId },
      });
      return bike;
    } catch (error) {
      throw new Error(`Failed to fetch bike: ${(error as Error).message}`);
    }
  },
};
