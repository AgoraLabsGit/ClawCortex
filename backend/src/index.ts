import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import dotenv from "dotenv";
import { logger } from "./lib/logger";
import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { activityRoutes } from "./routes/activity";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3001");
const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

const fastify = Fastify({
  logger: logger,
});

// Middleware
await fastify.register(fastifyCors, {
  origin: true,
  credentials: true,
});

await fastify.register(fastifyJwt, {
  secret: JWT_SECRET,
});

// Routes
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(projectRoutes, { prefix: "/projects" });
fastify.register(activityRoutes, { prefix: "/activity" });

// Health check
fastify.get("/health", async () => {
  return { status: "ok" };
});

// WebSocket setup
const server = createServer(fastify.server);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  logger.info("WebSocket connected");

  ws.on("message", (data: string) => {
    try {
      const message = JSON.parse(data);

      if (message.type === "auth") {
        // Validate token and set user context
        logger.info("WebSocket authenticated");
      }

      if (message.type === "subscribe") {
        // Subscribe to specific events
        logger.info("Subscribed to events:", message.events);
      }
    } catch (error) {
      logger.error("WebSocket message error:", error);
    }
  });

  ws.on("close", () => {
    logger.info("WebSocket disconnected");
  });

  ws.on("error", (error) => {
    logger.error("WebSocket error:", error);
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    logger.info(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
