'use client';

import { ExternalLink, GitBranch } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  github_repo: string;
  status: string;
  tasks_done: number;
  tasks_total: number;
}

export function ProjectCard({ project }: { project: Project }) {
  const progress = (project.tasks_done / project.tasks_total) * 100;

  return (
    <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {project.description}
          </p>
        </div>
        <a
          href={`https://github.com/${project.github_repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <GitBranch className="w-3 h-3" />
        <span className="font-mono text-xs">{project.github_repo}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {project.tasks_done} / {project.tasks_total}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
