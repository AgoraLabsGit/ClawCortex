export const mockProjects = [
  {
    id: '1',
    name: 'ClawCortex',
    description: 'AI Agent Workspace SaaS',
    github_repo: 'AgoraLabsGit/ClawCortex',
    status: 'active',
    tasks_done: 12,
    tasks_total: 45,
  },
  {
    id: '2',
    name: 'Localist',
    description: 'Local business discovery platform',
    github_repo: 'AgoraLabsGit/Localist',
    status: 'active',
    tasks_done: 8,
    tasks_total: 20,
  },
];

export const mockActivity = [
  {
    id: '1',
    agent: 'Builder',
    action: 'Completed task E1.1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    project: 'ClawCortex',
    duration: '15 min',
    status: 'success' as const,
  },
  {
    id: '2',
    agent: 'Review',
    action: 'Code review requested',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    project: 'ClawCortex',
    duration: '3 min',
    status: 'pending' as const,
  },
  {
    id: '3',
    agent: 'Sync',
    action: 'Workspace synced to GitHub',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    project: 'System',
    duration: '2 min',
    status: 'success' as const,
  },
  {
    id: '4',
    agent: 'Builder',
    action: 'Started task E1.2',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    project: 'Localist',
    duration: '8 min',
    status: 'in-progress' as const,
  },
];
