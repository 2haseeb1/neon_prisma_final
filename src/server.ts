import app from './app';
import { PrismaClient } from '@prisma/client';
import config from './config';

const prisma = new PrismaClient();
const PORT = config.port || 5020; // Fallback to 5020 if config.port is undefined

// Test DB connection and start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL via Prisma');

    // Log a sample record to confirm database access
    const test = await prisma.serviceRecord.findFirst();
    console.log('Sample Record:', test);

    // Start the server with error handling
    app.listen(PORT, () => {
      
console.log(` Environment: ${config.env}`);
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    }).on('error', (err: any) => {
      console.error('❌ Failed to start server:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Server terminated.');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();