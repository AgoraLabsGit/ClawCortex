"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { Project, Activity } from "@/types";
import { ActivityFeed } from "@/components/ActivityFeed";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetchAPI<Project[]>("/projects")
      .then(setProjects)
      .catch((e) => console.error("Failed to load projects:", e))
      .finally(() => setLoading(false));
  }, [router]);

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
        <h1 className="text-2xl font-bold">🧠 ClawCortex Command Center</h1>
        <p className="text-sm text-gray-500">Real-time AI agent orchestration</p>
      </header>

      {/* Main Content - 3-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Activity Feed */}
        <div className="w-1/4 border-r bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-4 border-b font-semibold">📊 Activity Feed</div>
          <ActivityFeed />
        </div>

        {/* Center: Sprint Board */}
        <div className="flex-1 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-4 border-b font-semibold">📋 Current Sprint</div>
          <div className="p-4 space-y-2">
            {projects.length === 0 ? (
              <p className="text-gray-500">
                No projects yet. Create one to get started!
              </p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    {project.github_repo || "No repo linked"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Project Health */}
        <div className="w-1/4 border-l bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-4 border-b font-semibold">💚 Project Health</div>
          <div className="p-4 space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{project.name}</span>
                  <span className="text-lg">🟢</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Last sync: {project.last_sync ? new Date(project.last_sync).toLocaleTimeString() : "Never"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 border-t p-4 text-xs text-gray-500">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/auth/login");
          }}
          className="text-red-500 hover:underline"
        >
          Logout
        </button>
      </footer>
    </div>
  );
}
