'use client';

import { mockAgents } from '@/lib/mock-data';
import { Badge, AlertCircle } from 'lucide-react';

export default function AgentsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Agents</h1>
        <p className="text-slate-400 mt-2">AI team management</p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-lg bg-slate-800 p-6 hover:bg-slate-700 transition-colors"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{agent.type}</p>
              </div>
              <div
                className={`h-3 w-3 rounded-full ${
                  agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
            </div>

            {/* Model */}
            <div className="mb-4">
              <p className="text-xs text-slate-400">Model</p>
              <p className="text-sm text-slate-200 mt-1">{agent.model}</p>
            </div>

            {/* Projects */}
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2">Projects</p>
              <div className="flex flex-wrap gap-2">
                {agent.projects.map((project) => (
                  <span
                    key={project}
                    className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-slate-300"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-slate-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tasks</span>
                <span className="text-white font-medium">{agent.tasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uptime</span>
                <span className="text-white font-medium">{agent.uptime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
