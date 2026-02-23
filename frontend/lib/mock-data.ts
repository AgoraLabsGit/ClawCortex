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

export const mockWorkflows = [
  {
    id: '1',
    name: 'Feature Development',
    category: 'Development',
    description: 'Build and test new features',
    steps: 4,
    avgDuration: '45 min',
    successRate: 92,
    runs: 12,
  },
  {
    id: '2',
    name: 'Bug Fix',
    category: 'Development',
    description: 'Identify, fix, and verify bug resolutions',
    steps: 5,
    avgDuration: '20 min',
    successRate: 100,
    runs: 8,
  },
  {
    id: '3',
    name: 'BMAD Planning',
    category: 'Development',
    description: 'Build-measure-analyze-decide workflow',
    steps: 6,
    avgDuration: '2 hours',
    successRate: 85,
    runs: 3,
  },
];

export const mockAgents = [
  {
    id: '1',
    name: 'Henry',
    type: 'Master Agent',
    model: 'Claude Sonnet 4.5',
    status: 'active',
    projects: ['ClawCortex', 'Localist'],
    tasks: 45,
    uptime: '99.8%',
  },
  {
    id: '2',
    name: 'Builder',
    type: 'Development',
    model: 'Claude Sonnet',
    status: 'active',
    projects: ['ClawCortex'],
    tasks: 12,
    uptime: '100%',
  },
  {
    id: '3',
    name: 'Review',
    type: 'Development',
    model: 'Claude Sonnet',
    status: 'idle',
    projects: ['ClawCortex'],
    tasks: 8,
    uptime: '100%',
  },
];

export const mockActivityItems = [
  {
    id: '1',
    type: 'task_completed',
    message: 'Navigation UI component created',
    project: 'ClawCortex',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    agent: 'Henry',
  },
  {
    id: '2',
    type: 'deployment',
    message: 'Deployed to Vercel',
    project: 'ClawCortex',
    timestamp: new Date(Date.now() - 15 * 60000),
    agent: 'Builder',
  },
  {
    id: '3',
    type: 'task_completed',
    message: 'Database schema finalized',
    project: 'Localist',
    timestamp: new Date(Date.now() - 30 * 60000),
    agent: 'Henry',
  },
  {
    id: '4',
    type: 'test_pass',
    message: 'All unit tests passing',
    project: 'ClawCortex',
    timestamp: new Date(Date.now() - 45 * 60000),
    agent: 'Review',
  },
];

export const mockDocs = [
  { name: 'PRD.md', path: '/docs/PRD.md', updated: '2026-02-22' },
  { name: 'ARCHITECTURE-V2.md', path: '/docs/ARCHITECTURE-V2.md', updated: '2026-02-22' },
  { name: 'API-SPEC.md', path: '/docs/API-SPEC.md', updated: '2026-02-20' },
];
