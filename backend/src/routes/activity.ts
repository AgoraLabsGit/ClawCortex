import { FastifyInstance } from "fastify";
import { supabase } from "../lib/supabase";

export async function activityRoutes(fastify: FastifyInstance) {
  // Get activity for project
  fastify.get(
    "/projects/:projectId",
    async (request, reply) => {
      try {
        await request.jwtVerify();
        const { projectId } = request.params as { projectId: string };
        const { limit = "20", offset = "0", agent_name } = request.query as any;

        let query = supabase
          .from("activity_log")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })
          .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (agent_name) query = query.eq("agent_name", agent_name);

        const { data, error } = await query;

        if (error) throw error;

        return reply.send(data || []);
      } catch (err) {
        return reply.code(401).send({ error: "Unauthorized" });
      }
    }
  );

  // Log activity (called by agents)
  fastify.post("/", async (request, reply) => {
    try {
      const { project_id, agent_name, action, task_id, metadata } =
        request.body as any;

      const { error } = await supabase.from("activity_log").insert([
        {
          project_id,
          agent_name,
          action,
          task_id,
          metadata,
          created_at: new Date(),
        },
      ]);

      if (error) throw error;

      return reply.code(201).send({ status: "logged" });
    } catch (err) {
      return reply.code(500).send({ error: "Failed to log activity" });
    }
  });
}
