'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ActivityFeed } from '@/components/activity-feed';
import { ProjectCard } from '@/components/project-card';
import { mockProjects, mockActivityItems } from '@/lib/mock-data';

export default function Dashboard() {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'dev', label: 'Development' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Activity across all projects</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={mockActivityItems} />
        </div>

        {/* Right: Projects */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          {mockProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
