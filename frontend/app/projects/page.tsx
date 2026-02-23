'use client';

import Link from 'next/link';
import { ProjectCard } from '@/components/project-card';
import { mockProjects } from '@/lib/mock-data';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-2">Manage all projects and teams</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="h-full">
              <ProjectCard project={project} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
