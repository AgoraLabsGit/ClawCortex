"use client";

import { useEffect, useState } from "react";
import { Activity } from "@/types";
import { createWebSocket } from "@/lib/api";

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ws = createWebSocket(token);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "activity:new") {
        setActivities((prev) => [data.data, ...prev].slice(0, 20));
      }
    };

    ws.onerror = () => setError("WebSocket connection failed");

    setLoading(false);

    return () => ws.close();
  }, []);

  if (loading)
    return <div className="p-4 text-gray-500">Loading activity feed...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-2 p-4 max-h-96 overflow-y-auto">
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">No activity yet</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm"
          >
            <div className="flex justify-between">
              <span className="font-semibold">{activity.agent_name}</span>
              <span className="text-xs text-gray-500">
                {new Date(activity.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {activity.action}
              {activity.metadata?.tokens_used && (
                <span className="text-xs text-gray-500 ml-2">
                  ({activity.metadata.tokens_used} tokens, $
                  {activity.metadata.cost?.toFixed(2)})
                </span>
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
