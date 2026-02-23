'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockProjects, mockDocs } from '@/lib/mock-data';
import { ExternalLink, FileText } from 'lucide-react';
import { ActivityFeed } from '@/components/activity-feed';
import { mockActivityItems } from '@/lib/mock-data';

interface ProjectDetailProps {
  params: {
    id: string;
  };
}

export default function ProjectDetail({ params }: ProjectDetailProps) {
  const project = mockProjects.find((p) => p.id === params.id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Project not found</h2>
        <Link href="/projects" className="text-blue-400 hover:text-blue-300">
          Back to Projects
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'docs', label: 'Docs' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <Link
            href={`https://github.com/${project.github_repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            GitHub
          </Link>
        </div>
        <p className="text-slate-400">{project.description}</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-slate-800">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-800 p-6">
              <p className="text-sm text-slate-400">Tasks Completed</p>
              <p className="text-3xl font-bold text-white mt-2">{project.tasks_done}</p>
            </div>
            <div className="rounded-lg bg-slate-800 p-6">
              <p className="text-sm text-slate-400">Total Tasks</p>
              <p className="text-3xl font-bold text-white mt-2">{project.tasks_total}</p>
            </div>
          </div>

          {/* Docs */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Documentation</h3>
            <div className="space-y-2">
              {mockDocs.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 rounded-lg bg-slate-800 p-4 hover:bg-slate-700 transition-colors">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{doc.name}</p>
                    <p className="text-xs text-slate-400">Updated {doc.updated}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <ActivityFeed activities={mockActivityItems.filter((a) => a.project === project.name)} />
      )}

      {activeTab === 'docs' && (
        <div className="text-center py-12">
          <p className="text-slate-400">Documentation details coming in Phase 2</p>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="text-center py-12">
          <p className="text-slate-400">Task management coming in Phase 2</p>
        </div>
      )}
    </div>
  );
}
