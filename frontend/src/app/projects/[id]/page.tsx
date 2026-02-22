"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { Task, Activity } from "@/types";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    Promise.all([
      fetchAPI<Task[]>(`/projects/${projectId}/tasks`),
      fetchAPI<Activity[]>(`/projects/${projectId}/activity`),
    ])
      .then(([tasks, activities]) => {
        setTasks(tasks);
        setActivities(activities);
      })
      .catch((e) => console.error("Failed to load project:", e))
      .finally(() => setLoading(false));
  }, [projectId, router]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b p-4 shadow">
        <button
          onClick={() => router.back()}
          className="mb-2 text-blue-600 hover:underline"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Project Details</h1>
      </header>

      {/* Main Content - 2-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Task List */}
        <div className="w-1/2 border-r bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-4 border-b font-semibold">📝 Tasks</div>
          <div className="space-y-2 p-4">
            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 rounded cursor-pointer transition ${
                    selectedTask?.id === task.id
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{task.title}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded">
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Owner: {task.owner || "Unassigned"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Task Detail + Execution Logs */}
        <div className="w-1/2 bg-white dark:bg-gray-800 overflow-y-auto">
          {selectedTask ? (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">{selectedTask.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {selectedTask.description || "No description"}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Status</h3>
                <p className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded inline-block">
                  {selectedTask.status}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Execution Logs</h3>
                <div className="space-y-2">
                  {activities
                    .filter((a) => a.task_id === selectedTask.id)
                    .map((activity) => (
                      <div
                        key={activity.id}
                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">{activity.agent_name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {activity.action}
                        </p>
                        {activity.metadata && (
                          <p className="text-xs text-gray-500 mt-1">
                            ⏱️ {activity.metadata.duration_ms}ms | 🔑{" "}
                            {activity.metadata.tokens_used} tokens | 💰 $
                            {activity.metadata.cost?.toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-gray-500">
              Select a task to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
