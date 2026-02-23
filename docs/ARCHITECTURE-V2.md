# ClawCortex MVP — Architecture Document v2.0

**Version**: 2.0  
**Owner**: Henry (Orchestrator)  
**Status**: 🟢 LOCKED (New Architecture - Railway OpenClaw Template)  
**Date**: 2026-02-22

---

## 1. Tech Stack (LOCKED v2)

### Frontend
| Component | Choice | Version | Rationale |
|-----------|--------|---------|-----------|
| **Framework** | Next.js | 14.2.0 | App Router, edge functions, fastest React framework |
| **Language** | TypeScript | 5.4.0 | Type safety, catches bugs early |
| **UI Library** | Shadcn/ui | latest | Developer-friendly, accessible, consistent |
| **Styling** | Tailwind CSS | 3.4.0 | Utility-first, fast development |
| **State Mgmt** | TanStack Query | 5.x | Server state sync, real-time updates, caching |
| **Real-time** | Supabase Realtime | managed | Native PostgreSQL change streams |
| **PWA** | next-pwa | latest | Service worker, installable, offline support |
| **Testing** | Jest + React Testing Library | latest | Unit + component tests |
| **Linting** | ESLint + Prettier | latest | Code quality, consistency |

### Backend (OpenClaw Gateway)
| Component | Choice | Version | Rationale |
|-----------|--------|---------|-----------|
| **Framework** | OpenClaw Gateway | latest | Built-in agent orchestration, HTTP/WS API, Control UI |
| **Language** | Node.js + TypeScript | 22.x | OpenClaw runtime environment |
| **Agent System** | Built-in | — | Sub-agent spawning, cron jobs, memory system |
| **Database Client** | @supabase/supabase-js | 2.x | Official Supabase SDK for agents |
| **GitHub API** | Octokit | 20.x | Official GitHub SDK for agents |
| **Workspace** | File-based | — | `/data/.openclaw/workspace` (persistent volume) |
| **Control UI** | Built-in | — | Web-based admin panel at `/` |

### Infrastructure & Hosting
| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Backend Hosting** | Railway (OpenClaw Template) | One-click deploy, persistent volumes, Docker-friendly |
| **Frontend Hosting** | Vercel | Native Next.js support, edge functions, instant deploys |
| **Database** | Supabase (PostgreSQL 15) | Managed, free tier sufficient for MVP, real-time built-in |
| **DNS** | Cloudflare (optional) | DDoS protection, faster DNS |
| **Repository** | GitHub | Public (code visible, builds trust) |

### Version Locks (No Changes Until Phase 2)
```json
{
  "nextjs": "14.2.0",
  "react": "18.2.0",
  "typescript": "5.4.0",
  "tailwindcss": "3.4.0",
  "shadcn": "latest",
  "tanstack-query": "5.x",
  "openclaw": "latest",
  "@supabase/supabase-js": "2.x",
  "octokit": "20.x"
}
```

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS (Browser)                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS
                       ▼
        ┌──────────────────────────────────┐
        │   Next.js 14 Frontend (Vercel)   │
        │  ┌─────────────────────────────┐ │
        │  │ Pages (App Router)          │ │
        │  │ • /dashboard (Command Ctr)  │ │
        │  │ • /projects/[id]            │ │
        │  │ • /settings/integrations    │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ Components (Shadcn/ui)      │ │
        │  │ • ActivityFeed (real-time)  │ │
        │  │ • SprintBoard               │ │
        │  │ • TaskDetail                │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ API Clients                 │ │
        │  │ • OpenClaw API (HTTP/WS)    │ │
        │  │ • Supabase client (direct)  │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ Service Worker (PWA)        │ │
        │  │ • Offline support           │ │
        │  │ • Background sync           │ │
        │  └─────────────────────────────┘ │
        └────┬───────────────┬─────────────┘
             │ REST + WS     │ PostgreSQL (direct)
             │               │
    ┌────────▼───────────────┼─────────────┐
    │  OpenClaw Gateway (Railway)          │
    │  ┌────────────────────────────────┐  │
    │  │ Control UI (built-in)          │  │
    │  │ /setup wizard                  │  │
    │  │ /settings (tokens, models)     │  │
    │  └────────────────────────────────┘  │
    │  ┌────────────────────────────────┐  │
    │  │ Agent System                   │  │
    │  │ • Henry (orchestrator)         │  │
    │  │ • Builder (code generation)    │  │
    │  │ • Tester (QA automation)       │  │
    │  │ • Deployer (CI/CD)             │  │
    │  │ • Reporter (analytics)         │  │
    │  └────────────────────────────────┘  │
    │  ┌────────────────────────────────┐  │
    │  │ HTTP/WebSocket API             │  │
    │  │ POST   /api/v1/chat            │  │
    │  │ POST   /api/v1/subagents/spawn │  │
    │  │ GET    /api/v1/status          │  │
    │  │ WS     /ws (real-time)         │  │
    │  └────────────────────────────────┘  │
    │  ┌────────────────────────────────┐  │
    │  │ Services (Agent Tools)         │  │
    │  │ • Supabase client (DB access)  │  │
    │  │ • GitHub API (Octokit)         │  │
    │  │ • Web search (Perplexity)      │  │
    │  │ • Code execution (exec)        │  │
    │  └────────────────────────────────┘  │
    │  ┌────────────────────────────────┐  │
    │  │ Workspace (/data persistent)   │  │
    │  │ • SOUL.md, MEMORY.md           │  │
    │  │ • memory/*.md (daily logs)     │  │
    │  │ • projects/ (context)          │  │
    │  │ • scripts/ (helper tools)      │  │
    │  └────────────────────────────────┘  │
    └────┬──────────────┬────────────────┘
         │ PostgreSQL   │ GitHub API
         │              │
    ┌────▼──────┐  ┌────▼──────────┐
    │ Supabase  │  │ GitHub        │
    │ • users   │  │ • issues      │
    │ • projects│  │ • repos       │
    │ • tasks   │  │ • webhooks    │
    │ • activity│  │ (Octokit)     │
    │ • integr. │  └───────────────┘
    └───────────┘
```

**Key Architecture Principles:**

1. **OpenClaw Gateway IS the Backend**
   - No custom Fastify server needed
   - Agents run inside OpenClaw environment
   - Built-in HTTP + WebSocket server

2. **Dual Database Access**
   - Frontend → Supabase (direct, for real-time UI updates)
   - Agents → Supabase (via OpenClaw workspace scripts)
   - Frontend → OpenClaw API (for agent commands, spawning, status)

3. **Persistent Workspace**
   - Railway volume at `/data` preserves:
     - Agent memory (MEMORY.md, memory/*.md)
     - Configuration (SOUL.md, IDENTITY.md, USER.md)
     - Scripts (helper tools, Supabase client, GitHub wrappers)
     - Project context (task state, decision history)

4. **Real-Time by Default**
   - Supabase Realtime for UI updates (no polling)
   - WebSocket connection to OpenClaw for agent status
   - Activity log auto-updates in dashboard

---

## 3. Component Breakdown

### Frontend Components (React)

```
frontend/src/
├── app/
│   ├── layout.tsx             # Auth wrapper, navigation
│   ├── dashboard/
│   │   └── page.tsx           # Command Center (3-column layout)
│   ├── projects/
│   │   ├── [id]/
│   │   │   └── page.tsx       # Project View
│   │   └── list.tsx           # Project navigation
│   ├── settings/
│   │   └── integrations.tsx   # Integrations Settings
│   └── auth/
│       ├── signup.tsx
│       └── login.tsx
├── components/
│   ├── ActivityFeed.tsx       # Real-time activity (Supabase subscription)
│   ├── SprintBoard.tsx        # Kanban board (drag-drop)
│   ├── ProjectHealth.tsx      # Status indicators
│   ├── TaskDetail.tsx         # Expanded task view
│   ├── AgentStatus.tsx        # OpenClaw agent status (WebSocket)
│   └── common/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase.ts            # Supabase client (direct access)
│   ├── openclaw.ts            # OpenClaw API client (HTTP + WS)
│   ├── hooks.ts               # React hooks (useActivity, useProjects)
│   └── utils.ts               # Formatters, time helpers
├── types/
│   ├── index.ts               # All TypeScript interfaces
└── public/
    ├── manifest.json          # PWA manifest
    └── sw.js                  # Service worker
```

### Backend Services (OpenClaw Agents)

**Henry (Orchestrator Agent)**

Lives in `/data/.openclaw/workspace/`:

```
/data/.openclaw/workspace/
├── SOUL.md                    # Agent personality + operating principles
├── IDENTITY.md                # Name, role, mission
├── USER.md                    # User preferences
├── MEMORY.md                  # Long-term memory (curated)
├── memory/
│   ├── 2026-02-22.md          # Daily logs
│   └── YYYY-MM-DD.md
├── projects/
│   └── ClawCortex/
│       ├── CONTEXT.md         # Current project state
│       └── tasks/             # Task-specific context
├── scripts/
│   ├── supabase-client.mjs    # Supabase helper (log activity, get tasks)
│   ├── github-sync.mjs        # GitHub issue ↔ task sync
│   └── deploy.mjs             # Deployment automation
└── brain/
    ├── routing/
    │   └── ROUTING.md         # Model selection (Haiku/Sonnet/Opus)
    ├── reasoning/
    │   └── DECISION-TREES.md  # Structured reasoning patterns
    └── skills/
        └── SKILL-INVENTORY.md # All available tools + triggers
```

**Sub-Agents (Spawnable via OpenClaw)**

| Agent | Purpose | Model | Trigger |
|-------|---------|-------|---------|
| **Builder** | Code generation, PRs | Sonnet | "Build X feature" |
| **Tester** | Test automation, QA | Haiku | "Test X endpoint" |
| **Deployer** | CI/CD, Railway/Vercel deploys | Haiku | "Deploy to prod" |
| **Reporter** | Analytics, daily briefs | Haiku | Cron (daily 10am) |
| **Optimizer** | Performance analysis | Sonnet | "Analyze latency" |

---

## 4. Data Models & Database Schema

**(Same as v1 — no changes to schema)**

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  auth_provider TEXT DEFAULT 'email',
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  github_repo TEXT,
  github_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_github_repo ON projects(github_repo);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  github_issue_id INT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assigned_to_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

### Activity Log Table
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_name TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_project_id ON activity_log(project_id);
CREATE INDEX idx_activity_timestamp ON activity_log(timestamp DESC);
```

### Task Status Values (Exact - DO NOT MODIFY)

**Inspired by BMAD Method**. These exact values are used across Supabase, GitHub labels, and UI.

| Status | Definition | UI Color | Next Actions |
|--------|------------|----------|--------------| 
| `backlog` | Story exists but not ready | Gray | → Move to `ready-for-dev` when prioritized |
| `ready-for-dev` | Story file created, ready to implement | Blue | → Builder agent picks up |
| `in-progress` | Agent actively working on task | Yellow | → Completes or HALTs |
| `review` | Implementation done, awaiting approval | Orange | → Code review agent |
| `done` | Approved and merged | Green | → Archive |
| `blocked` | Cannot proceed (HALT unresolved) | Red | → User intervention required |

**NEVER use**: "complete", "completed", "finished", "ready", "todo", "wip" - these break UI filters.

**Database Constraint**:

```sql
ALTER TABLE tasks ADD CONSTRAINT valid_status CHECK (status IN ('backlog', 'ready-for-dev', 'in-progress', 'review', 'done', 'blocked'));
```

**GitHub Label Mapping**:
- `status:backlog` → `backlog`
- `status:ready` → `ready-for-dev`
- `status:in-progress` → `in-progress`
- `status:review` → `review`
- `status:done` → `done`
- `status:blocked` → `blocked`

---

## 5. API Endpoints

### OpenClaw Gateway API

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| **POST** | `/api/v1/chat` | Gateway Token | Send message to agent |
| **POST** | `/api/v1/subagents/spawn` | Gateway Token | Spawn isolated sub-agent |
| **GET** | `/api/v1/status` | Gateway Token | Get agent status |
| **GET** | `/api/v1/sessions` | Gateway Token | List active sessions |
| **WS** | `/ws` | Gateway Token | Real-time agent updates |

**Example: Spawn Sub-Agent**

```bash
curl -X POST https://your-railway-url/api/v1/subagents/spawn \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GATEWAY_TOKEN" \
  -d '{
    "task": "Build a GitHub issue sync feature",
    "agentId": "builder",
    "timeoutSeconds": 600
  }'

# Response:
{
  "sessionKey": "subagent-builder-abc123",
  "status": "spawned",
  "task": "Build a GitHub issue sync feature"
}
```

**Example: Log Activity from Agent**

```javascript
// In agent script (e.g., scripts/github-sync.mjs)
import { supabase } from './supabase-client.mjs';

async function syncGitHubIssues(projectId, githubRepo) {
  // ... sync logic ...

  await supabase.from('activity_log').insert({
    project_id: projectId,
    agent_name: 'Builder',
    event_type: 'github_sync_completed',
    event_data: { repo: githubRepo, synced: 15 }
  });
}
```

---

## 6. Quality Gates (BMAD-Inspired)

### Overview

Enforce quality standards before marking tasks as `done`.

### Required Gates (MVP)

**1. Code Implementation (Builder Agent)**
- Red-Green-Refactor methodology
- Unit tests for each function
- Integration tests for API endpoints
- All tests pass before moving to `review`

**2. Code Review (Review Agent)**
- Adversarial review (find minimum 3 issues)
- Checklist:
  - [ ] Type safety (no `any` types)
  - [ ] Error handling (try/catch, error boundaries)
  - [ ] Security (no hardcoded secrets, SQL injection protection)
  - [ ] Performance (no N+1 queries, optimized renders)
  - [ ] Accessibility (ARIA labels, keyboard navigation)
  - [ ] Documentation (JSDoc for public APIs)
- Returns: `APPROVED` or `CHANGES_REQUESTED` with specific issues

**3. Acceptance Criteria Validation**
- QA agent runs Given/When/Then scenarios
- All criteria from story file must pass
- Manual QA for UI/UX flows (Phase 2: automated Playwright tests)

### Optional Gates (Phase 2)

**4. UX Review** (UI-heavy features)
- Design system compliance (Shadcn/ui components)
- Responsive design (mobile/desktop)
- Dark mode consistency

**5. Performance Testing**
- Lighthouse score > 85
- API response < 200ms (p95)
- WebSocket latency < 100ms (p95)

### Implementation

**Agent Workflow**:

```
Builder completes task
↓
Task status → `review`
↓
Henry spawns Review sub-agent
↓
Review agent returns: APPROVED or CHANGES_REQUESTED
↓
If APPROVED:
  - Task status → `done`
  - Merge PR (if applicable)
If CHANGES_REQUESTED:
  - Task status → `in-progress`
  - Log issues to activity_log
  - Henry respawns Builder with review feedback
```

**UI Representation**:

```
Project View → Task Detail → Quality Gates Tab:
✅ Code Implementation (Builder) - Passed
⏳ Code Review (Review Agent) - In Progress
⬜ UX Review - Not Required
⬜ QA Testing - Not Required
[View Review Comments (3)]
```

---

## 9. Authentication & Authorization

### Frontend Auth (Supabase Auth)

- **Sign Up**: Email + password (or OAuth in Phase 2)
- **Login**: JWT tokens stored in localStorage
- **Row Level Security (RLS)**: Supabase enforces user-scoped queries

### OpenClaw Gateway Auth

- **Gateway Token**: Single token for all API calls
- **Scoping**: Optional per-user tokens (Phase 2)
- **Control UI**: Separate login (setup password)

---

## 10. Real-Time Updates

### Supabase Realtime (Frontend)

Frontend subscribes to PostgreSQL changes:

```typescript
// Activity feed subscription
const subscription = supabase
  .channel(`activity:${projectId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'activity_log',
    filter: `project_id=eq.${projectId}`
  }, (payload) => {
    setActivities((prev) => [payload.new as Activity, ...prev]);
  })
  .subscribe();
```

### WebSocket (Agent Status)

Frontend connects to OpenClaw WebSocket for agent status:

```typescript
const ws = new WebSocket(`wss://your-railway-url/ws?token=${GATEWAY_TOKEN}`);

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  
  if (type === 'agent_status') {
    setAgentStatus(data);
  }
};
```

---

## 7. Agent Error Handling (HALT Protocol)

### Overview

Inspired by BMAD Method. When agents cannot proceed, they log structured HALT events instead of silent failures.

### HALT Format

**Agent Detection**:

```javascript
// Agent encounters blocking issue
throw new Error('HALT: Missing database schema | Context: Need schema before implementing data layer');
```

**Logging to Supabase**:

```javascript
await supabase.from('activity_log').insert({
  project_id: projectId,
  agent_name: 'Builder',
  event_type: 'agent_halt',
  event_data: {
    halt_reason: 'Missing database schema',
    context: 'Need schema before implementing data layer',
    task_id: taskId,
    timestamp: new Date().toISOString()
  }
});
```

### UI Representation

**Command Center (Dashboard)**:
- Project card shows 🔴 error badge
- Activity feed displays: `[Builder] ⚠️ HALT: Missing database schema`

**Project View**:
- Task detail shows HALT banner with:
  - Reason (user-friendly)
  - Context (technical details)
  - Actions: `[Retry]` `[Skip]` `[Resolve Manually]`

### Orchestrator Response

**Henry (Orchestrator) Logic**:

1. **Detect HALT** from sub-agent announcement
2. **Classify**:
   - `resolvable` → Auto-fix (e.g., install missing dependency)
   - `ambiguous` → Escalate to user via UI notification
   - `blocking` → Mark task as `blocked`, log, continue with other tasks
3. **Retry Logic**:
   - Max 2 retries per task
   - On retry: Include previous HALT context in prompt
   - On final failure: Update task status to `blocked` in Supabase

### Example Flow

```
User: "Build authentication feature"
↓
Henry spawns Builder sub-agent
↓
Builder: HALT: Missing AUTH_SECRET env var | Context: Required for JWT signing
↓
Henry detects HALT → Checks if AUTO_RESOLVE enabled
↓
If yes: Henry generates AUTH_SECRET, updates .env, respawns Builder
If no: Logs to Supabase, UI shows notification to user
↓
User clicks [Resolve] → Modal shows HALT details + input field
User provides value → Henry updates .env → Retries Builder
```

### HALT Categories

| Category | Auto-Resolve | Example |
|----------|-------------|---------| 
| `missing_dependency` | ✅ Yes | Missing npm package |
| `missing_env_var` | ⚠️ Ask user | API key not set |
| `missing_context` | ❌ No | Ambiguous requirement |
| `external_service_down` | ⏳ Wait + retry | GitHub API rate limit |
| `invalid_state` | ❌ No | Conflicting requirements |

---

## 11. Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────┐
│ Vercel (Frontend - Global Edge)        │
│ • Next.js SSR + Static                  │
│ • CDN caching                           │
│ • Auto-scaling                          │
└────┬────────────────────────────────────┘
     │ HTTPS + WebSocket
     │
┌────▼────────────────────────────────────┐
│ Railway (OpenClaw Gateway - Regional)   │
│ • Docker container                      │
│ • Persistent volume (/data)             │
│ • Auto-restart                          │
└────┬────────────────────────────────────┘
     │ PostgreSQL (pooled)
     │
┌────▼────────────────────────────────────┐
│ Supabase (Database - Regional)          │
│ • PostgreSQL 15                         │
│ • Connection pooling (6543)             │
│ • Realtime subscriptions                │
│ • Automated backups                     │
└─────────────────────────────────────────┘
```

### Regional Considerations

- **Supabase Region**: `sa-east-1` (São Paulo) for South America
- **Railway Region**: Same as Supabase (minimize latency)
- **Vercel Edge**: Global (auto-routes to nearest region)

---

## 12. Cost Projections

### Free Tier Capacity

| Service | Free Limit | Estimated Capacity |
|---------|------------|-------------------|
| **Supabase** | 500 MB DB, 2 GB bandwidth | ~1,000 users, 10K tasks |
| **Railway** | $5 credit/month (~500 hours) | Always-on service |
| **Vercel** | 100 GB bandwidth | ~100K page loads |

**Total**: Supports MVP with ~1,000 users, 10K requests/day.

### Upgrade Path

**Month 1-3 (MVP):** Free tier  
**Month 4-6 (Growth):** ~$50/month (Supabase Pro + Railway usage)  
**Month 7-12 (Scale):** ~$200/month (Vercel Pro + Railway scale)

---

## 13. Security Considerations

### Secrets Management

- ✅ Railway Variables (backend secrets)
- ✅ Vercel Environment Variables (frontend public keys)
- ✅ Supabase RLS (database-level access control)
- ✅ OpenClaw Gateway Token (API authentication)

### Sensitive Data

| Secret | Location | Exposure |
|--------|----------|----------|
| `SUPABASE_SERVICE_KEY` | Railway only | Never frontend |
| `SUPABASE_ANON_KEY` | Vercel + Railway | Frontend-safe |
| `OPENCLAW_GATEWAY_TOKEN` | Vercel + Railway | Frontend-safe (scoped) |
| `GITHUB_TOKEN` | Railway only | Never frontend |

---

## 14. Monitoring & Observability

### Built-in Tools

- **Railway Logs**: Real-time agent execution logs
- **OpenClaw Control UI**: Agent status, memory, session history
- **Supabase Dashboard**: Query performance, real-time connections
- **Vercel Analytics**: Page views, Core Web Vitals

### Custom Monitoring (Phase 2)

- Sentry (error tracking)
- Datadog (performance)
- Custom dashboards (agent metrics)

---

## 15. Testing Strategy

### Frontend Tests

- **Unit**: Components (React Testing Library)
- **Integration**: API client mocks
- **E2E**: Playwright (critical flows)

### Agent Tests

- **Unit**: Helper scripts (Jest)
- **Integration**: Supabase interactions (test DB)
- **Smoke**: Spawn test sub-agent, verify completion

---

## 16. Migration from v1 (If Needed)

If you already deployed v1 (Fastify backend):

1. Keep Supabase (no changes needed)
2. Deploy OpenClaw template on Railway
3. Migrate backend logic to OpenClaw agent scripts
4. Update Vercel env vars (point to OpenClaw URL)
5. Decommission old Fastify backend

**Migration time**: ~2-4 hours (mostly copy/paste + testing)

---

## 17. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-22 | Use Railway OpenClaw Template | Avoid Railway API token issues, simpler deployment |
| 2026-02-22 | Keep Supabase | Proven choice, RLS, Realtime |
| 2026-02-22 | Dual DB access (frontend + agents) | Frontend needs real-time UI, agents need mutations |
| 2026-02-22 | Persistent workspace on Railway volume | Agents need memory between deploys |

---

**Last Updated**: 2026-02-22 19:25 GMT-3  
**Version**: 2.0 (Railway OpenClaw Template Architecture)  
**Status**: 🟢 LOCKED  
**Maintainer**: Henry (Orchestrator)
