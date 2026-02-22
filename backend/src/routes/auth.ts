import { FastifyInstance } from "fastify";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

export async function authRoutes(fastify: FastifyInstance) {
  // Signup
  fastify.post("/signup", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password required" });
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return reply.code(400).send({ error: error.message });
      }

      const token = await fastify.jwt.sign({ user_id: data.user?.id });

      return reply.code(201).send({
        user_id: data.user?.id,
        token,
      });
    } catch (err) {
      logger.error(err);
      return reply.code(500).send({ error: "Signup failed" });
    }
  });

  // Login
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password required" });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return reply.code(401).send({ error: "Invalid credentials" });
      }

      const token = await fastify.jwt.sign({ user_id: data.user?.id });

      return reply.send({
        user_id: data.user?.id,
        token,
      });
    } catch (err) {
      logger.error(err);
      return reply.code(500).send({ error: "Login failed" });
    }
  });

  // Get current user
  fastify.get("/user", async (request, reply) => {
    try {
      await request.jwtVerify();
      const token = request.headers.authorization?.split(" ")[1];
      const { data, error } = await supabase.auth.getUser(token);

      if (error) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      return reply.send({
        user_id: data.user?.id,
        email: data.user?.email,
      });
    } catch (err) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });
}
