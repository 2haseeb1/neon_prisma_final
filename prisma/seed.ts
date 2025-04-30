import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const oldService = await prisma.serviceRecord.create({
    data: {
      serviceId: 'test-old-001', // Optional if UUID is auto-generated
      bikeId: '2f624d25-afd5-4f7d-b8d5-76077b0c61d4', // Use a valid bikeId from your DB
      serviceDate: new Date('2025-04-15'), // More than 7 days ago
      description: 'Test overdue service record',
      status: 'pending',
    },
  });

  console.log('✅ Test overdue record inserted:', oldService);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
