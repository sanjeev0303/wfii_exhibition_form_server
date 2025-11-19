import "dotenv/config";
import { createApp } from "./app";
import { prisma } from "./lib/prisma";

const PORT = Number(process.env.PORT ?? 4000);

async function bootstrap() {
  try {
    await prisma.$connect();
    console.info("✅ Connected to PostgreSQL via Prisma");
  } catch (error) {
    console.error("❌ Failed to connect to the database", error);
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.info(`🚀 Server listening on http://localhost:${PORT}`);
  });

  const shutdown = async (signal: NodeJS.Signals) => {
    console.info(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async (closeError) => {
      if (closeError) {
        console.error("Error while closing the server", closeError);
      }
      await prisma.$disconnect();
      process.exit(closeError ? 1 : 0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap();
