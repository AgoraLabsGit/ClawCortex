import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { activityRoutes } from "./routes/activity";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3001");
const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

const fastify = Fastify({
  logger: true, // Use Fastify's built-in logger instead of custom Pino
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

// WebSocket setup (use Fastify's server directly)
const wss = new WebSocketServer({ server: fastify.server });

wss.on("connection", (ws) => {
  fastify.log.info("WebSocket connected");

  ws.on("message", (data: string) => {
    try {
      const message = JSON.parse(data);

      if (message.type === "auth") {
        // Validate token and set user context
        fastify.log.info("WebSocket authenticated");
      }

      if (message.type === "subscribe") {
        // Subscribe to specific events
        fastify.log.info("Subscribed to events:", message.events);
      }
    } catch (error) {
      fastify.log.error("WebSocket message error:", error);
    }
  });

  ws.on("close", () => {
    fastify.log.info("WebSocket disconnected");
  });

  ws.on("error", (error) => {
    fastify.log.error("WebSocket error:", error);
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    fastify.log.info(`Server running at http://0.0.0.0:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
