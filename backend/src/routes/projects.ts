import { FastifyInstance } from "fastify";
import { supabase } from "../lib/supabase";

export async function projectRoutes(fastify: FastifyInstance) {
  // Get user projects
  fastify.get("/", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).user_id;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      return reply.send(data || []);
    } catch (err) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });

  // Get project by ID
  fastify.get("/:id", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).user_id;
      const { id } = request.params as { id: string };

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return reply.send(data);
    } catch (err) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });

  // Get project tasks
  fastify.get("/:id/tasks", async (request, reply) => {
    try {
      await request.jwtVerify();
      const { id } = request.params as { id: string };
      const { status, owner, limit = "20", offset = "0" } = request.query as any;

      let query = supabase
        .from("tasks")
        .select("*")
        .eq("project_id", id)
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      if (status) query = query.eq("status", status);
      if (owner) query = query.eq("owner", owner);

      const { data, error } = await query;

      if (error) throw error;

      return reply.send(data || []);
    } catch (err) {
      return reply.code(500).send({ error: "Failed to load tasks" });
    }
  });
}
