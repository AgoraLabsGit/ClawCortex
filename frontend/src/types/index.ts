// User & Auth
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Projects & Tasks
export interface Project {
  id: string;
  name: string;
  description?: string;
  github_repo?: string;
  last_sync?: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "ready-review" | "done";
  owner?: string;
  due_date?: string;
}

// Activity Log
export interface Activity {
  id: string;
  project_id: string;
  agent_name: string;
  action: string;
  task_id?: string;
  metadata?: {
    duration_ms?: number;
    tokens_used?: number;
    cost?: number;
  };
  created_at: string;
}

// Integration Status
export interface IntegrationStatus {
  [key: string]: {
    status: "connected" | "expired" | "error";
    last_sync?: string;
    error?: string;
  };
}
