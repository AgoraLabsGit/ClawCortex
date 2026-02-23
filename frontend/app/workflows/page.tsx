'use client';

import { useState } from 'react';
import { mockWorkflows } from '@/lib/mock-data';
import { Play, TrendingUp, Clock, Zap } from 'lucide-react';

export default function WorkflowsPage() {
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'Development', 'Marketing', 'Operations'];

  const filteredWorkflows =
    filter === 'all'
      ? mockWorkflows
      : mockWorkflows.filter((w) => w.category === filter);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Workflows</h1>
        <p className="text-slate-400 mt-2">Reusable automation pipelines</p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === category
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className="rounded-lg bg-slate-800 p-6 hover:bg-slate-700 transition-colors"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{workflow.category}</p>
              </div>
              <button className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors">
                <Play className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-slate-300 mb-4">{workflow.description}</p>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Zap className="h-4 w-4 text-blue-400" />
                <span>{workflow.steps} steps</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>~{workflow.avgDuration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span>{workflow.successRate}% success rate</span>
              </div>
              <p className="text-xs text-slate-500 pt-2">
                {workflow.runs} total runs
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
