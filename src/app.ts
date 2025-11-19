import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import exhibitionRouter from "./routes/exhibition.routes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // API Routes
  app.use("/api/exhibitions", exhibitionRouter);

  app.get("/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        status: "ok",
        service: "openx-backend",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(503).json({
        status: "degraded",
        service: "openx-backend",
        timestamp: new Date().toISOString(),
        error: message,
      });
    }
  });

  return app;
}
