# ClawCortex MVP — Product Requirements Document (PRD)

**Version**: 1.0 MVP  
**Owner**: Alex (Product), Henry (Orchestrator)  
**Status**: 🟢 LOCKED (Spec-driven development begins)  
**Date**: 2026-02-22  
**Target Ship**: 2026-04-05 (6 weeks)

---

## 1. Problem Definition

### The Problem
**Market reality**: AI agents are proliferating (OpenClaw, CrewAI, LangChain, Claude Code). Technical founders and dev teams running 2-5 autonomous projects face a critical gap: **no unified command center**.

**Current state**:
- Agent runs scattered across disparate tools (GitHub, Discord, email, Notion)
- No real-time visibility into what agents are doing
- No centralized way to approve/prioritize agent work
- Manual copy-paste between tools to track progress
- Meta-learning hidden (teams can't easily improve agent performance)

### Who Feels the Pain
- **Primary**: Technical founders (Seed-Series A) running Localist + future products
- **Secondary**: Dev teams (5-50 people) automating workflows via agents
- **Tertiary**: AI consultancies managing agent systems for clients

### Why Existing Solutions Fail
| Tool | What It Does | Gap |
|------|-------------|-----|
| **LangSmith** | Monitor + debug agent runs | No task management, no governance, pure observability |
| **n8n / Make** | Visual workflow builder | Generic (not agent-native), no team concept |
| **GitHub Projects** | Task tracking | Doesn't understand agent-specific work, manual updates |
| **Discord / Slack** | Team chat | Not designed for structured agent orchestration |

**ClawCortex's gap to fill**: A **unified command center purpose-built for AI teams** that makes agents first-class citizens, integrates with GitHub (source of truth), and enables collaborative governance.

### Business Impact (If Solved)
- **For founders**: See all projects in one place, reduce time spent context-switching (estimate: 10 hrs/week → 2 hrs/week)
- **For dev teams**: Clear visibility into agent work, faster approvals (estimate: cycle time 2 days → 4 hours)
- **For consultancies**: Client dashboard + transparent agent performance (new revenue lever)

---

## 2. Solution Design

### Positioning
**ClawCortex** = "Operating system for autonomous AI teams"

**One-liner**: A collaborative workspace where technical teams see what their agents are doing, approve work, and continuously improve them—all from one place.

**Why different**: Not a monitoring tool (LangSmith), not a builder (n8n), not a project manager (Jira). **Purpose-built for teams managing AI agents**, with GitHub as source of truth.

---

### MVP Scope: 3 Screens Only

#### Screen 1: Command Center (Dashboard)
**Purpose**: Real-time view of what's happening across all projects

**Components**:
- **Live Activity Feed** (left sidebar)
  - List of recent agent actions (last 24 hours)
  - Format: `[Henry] - Completed task E1.1 (15 min) ✅`
  - Format: `[Sub-agent: Task Learner] - Analyzed patterns, 3 insights`
  - Sortable by: timestamp (default), agent, project
  - Pagination: 20 per page
  - Real-time updates via WebSocket (no refresh needed)

- **Sprint Board** (center panel)
  - Current sprint from `CURRENT-SPRINT.md` (GitHub synced)
  - Task cards: status, owner (human or AI), priority
  - Statuses: `todo`, `in-progress`, `ready-review`, `done`
  - Drag-to-reorder (local, not saved yet)
  - Click task → drill to Project View

- **Project Health** (right sidebar)
  - List of projects (Localist, ClawCortex, etc.)
  - Per-project: task count, agent activity (24h), last sync
  - Status indicator: 🟢 (healthy), 🟡 (slower), 🔴 (error)

**Acceptance Criteria**:
- [ ] Activity feed loads in <500ms
- [ ] WebSocket connects on page load (auto-reconnect on disconnect)
- [ ] Sprint board synced with GitHub `CURRENT-SPRINT.md` every 30s
- [ ] Responsive on mobile + desktop (viewport 320px → 1920px)
- [ ] Dark mode by default
- [ ] No external API calls on this screen (data from backend only)

---

#### Screen 2: Project View
**Purpose**: Deep dive into a specific project's tasks + agent runs

**Components**:
- **Project Header**
  - Project name, description, GitHub repo link
  - Last sync timestamp + sync status
  - Back button to Command Center

- **Task List** (top half)
  - All tasks in project (from GitHub issues)
  - Format: Task ID | Title | Status | Owner (agent/human) | Due date
  - Filter: by status, by agent, by assignee
  - Sort: by due date, by status, by created date
  - Click row → expand task detail

- **Task Detail** (on click)
  - Full task description
  - Acceptance criteria (from GitHub issue body)
  - Comments / activity history
  - Related sub-agent runs (expandable)
  - Action buttons: `Approve`, `Send to Review`, `Close`

- **Execution Logs** (bottom half)
  - Timeline of all agent runs on this task
  - Format: `[2026-02-22 14:30 UTC] Dev Agent - Started E1.1 (20 min elapsed) ⏳`
  - Format: `[2026-02-22 14:45 UTC] Dev Agent - Completed E1.1 (15 min) ✅ (2,450 tokens, $0.07)`
  - Expandable: Full logs, console output, error traces
  - Metrics: Time taken, tokens used, cost

**Acceptance Criteria**:
- [ ] Load task list in <1s
- [ ] Click to expand task detail without page reload
- [ ] Execution logs update in real-time (WebSocket)
- [ ] Show cost/token usage per run (transparent)
- [ ] Mobile-responsive (swipe between sections)
- [ ] Export logs as PDF (Phase 2)

---

#### Screen 3: Integrations Settings
**Purpose**: See what's connected, manage credentials (read-only for MVP)

**Components**:
- **Integration Status Cards**
  - GitHub: Status ✅ | Last sync 2 min ago | Connected as `cortex-agent-dev`
  - Notion: Status ✅ | Last sync 1h ago | 5 pages monitored
  - OpenAI: Status ✅ | API key active | Last used 30 min ago
  - Supabase: Status ✅ | Database healthy | 127 MB used
  - Any errors shown as 🔴 with actionable message

- **Credentials Display** (masked)
  - GitHub: `ghp_****...QI47` (click to copy masked version, full key in .env only)
  - API keys never displayed in browser (security)
  - Button to "Reconnect" (Phase 2 — re-auth flow)

**Acceptance Criteria**:
- [ ] Load in <500ms
- [ ] Show real status (not hardcoded)
- [ ] No sensitive data leaked to frontend
- [ ] Clear, actionable error messages if service down
- [ ] Mobile-responsive

---

### User Flows

#### Flow 1: First-Time Login
```
User arrives → Signup page (email + password)
  → Confirm email
  → Redirected to /dashboard
  → See "Welcome" overlay (not enough data yet)
  → Overlay: "Connect GitHub" button → redirects to GitHub OAuth
  → GitHub authorizes → returns to dashboard
  → Dashboard loads with activity feed, sprint board
```

#### Flow 2: Review Agent Work
```
See activity feed → "Dev Agent - Completed task E1.2"
  → Click activity → Drill to /projects/[id]
  → See task E1.2 expanded
  → Read acceptance criteria + comments
  → See execution log ("15 min, 2,450 tokens, $0.07")
  → Click "Send to Review" → Task moves to ready_review status
  → QA agent picks it up automatically
```

#### Flow 3: Monitor Real-Time Updates
```
Dashboard open → Activity feed shows recent action
  → WebSocket delivers live update: "Task Learner completed analysis"
  → Activity feed updates instantly (no page refresh)
  → If WebSocket disconnects → Automatic reconnect with spinner
  → Missed updates backfilled on reconnect
```

---

### Feature Scope: What's IN vs OUT

#### ✅ IN MVP (Weeks 1-6)
- 3 screens (Command Center, Project View, Integrations)
- GitHub sync (fetch issues, CURRENT-SPRINT.md)
- WebSocket real-time activity (sub-100ms latency target)
- Supabase auth (email/password, OAuth Phase 2)
- Activity logging (all agent actions recorded)
- Dark mode
- Mobile-responsive

#### ❌ OUT OF MVP (Phase 2+)
- Brain Studio (visual prompt editor)
- Multi-user collaboration (comments, approval workflows)
- Analytics dashboard (token trends, performance benchmarks)
- Advanced filtering / custom views
- Workflow triggering from UI
- Push notifications
- Email digests
- Slack bot integration
- Export / reporting

---

## 3. Technical Scope

### Integrations (MVP)

| Service | Purpose | Status |
|---------|---------|--------|
| **GitHub API** (Octokit) | Fetch issues, sync CURRENT-SPRINT.md | MVP |
| **Supabase Auth** | Email/password, JWT tokens, OAuth (Phase 2) | MVP |
| **Supabase DB** | Users, projects, tasks, activity logs | MVP |
| **WebSocket** | Real-time activity feed <100ms latency | MVP |
| **Notion** | Read docs (linked via Integrations Settings) | Phase 2 |
| **OpenAI** | Token counting, error tracking | Phase 2 |
| **Slack** | Send notifications | Phase 2 |

### Non-Functional Requirements

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **Homepage load** | <1s (Lighthouse 85+) | PWA performance |
| **WebSocket latency** | <100ms (p95) | Real-time feel |
| **API response** | <200ms (p95) | Dashboard responsiveness |
| **Database latency** | <50ms (p95) | Activity feed sync |
| **Uptime** | 99.5% (MVP) | Production-ready |
| **Error rate** | <0.1% (P99) | Silent failures avoided |
| **Mobile support** | iOS 14+, Android 10+ | Modern devices |

### Constraints & Dependencies

| Constraint | Impact | Plan |
|-----------|--------|------|
| **6-week timeline** | Can't do Phase 2 features | Cut Brain Studio, multi-user, analytics |
| **Dev team size** | 1 FTE frontend + 1 FTE backend + coordination | Parallel work, tight specs |
| **Supabase free tier** | Limited to 500MB, 1000 concurrent connections | Fine for MVP (<100 users) |
| **GitHub rate limits** | 5,000 requests/hour (auth) | Cache CURRENT-SPRINT.md locally, sync every 30s |
| **Vercel free tier** | No serverless concurrency limit issue (good) | Use Vercel for frontend, Railway for backend |

---

## 4. Success Metrics (MVP)

### Product Metrics

| Metric | Target | Rationale | How to Measure |
|--------|--------|-----------|-----------------|
| **Activation** | 70% | Free users run ≥1 workflow in first 3 days | Google Analytics event: "Viewed activity feed" |
| **Conversion** | 5% | Free → Pro ($69/mo) in first month | Stripe subscription created |
| **Retention** | 40% | Day 30 active rate | Return users (logged in, viewed page) |
| **NPS** | 50+ | Word-of-mouth signal | Typeform survey (exit, week 2, week 4) |
| **Churn** | <5% | Monthly (acceptable at this stage) | Active subscription count trend |

### Technical Metrics

| Metric | Target | How to Measure |
|--------|--------|-----------------|
| **Homepage load** | <1s | Lighthouse, Speed Insights (Vercel) |
| **WebSocket latency** | <100ms p95 | Client-side performance timing |
| **API response** | <200ms p95 | Backend logs, monitoring |
| **Error rate** | <0.1% | Sentry / LogRocket |
| **Mobile usability** | Lighthouse 90+ | Mobile friendliness audit |

### Business Metrics (Phase 2+)

| Metric | Phase 2 Target | Notes |
|--------|----------------|-------|
| **MRR** | $5K | End of Q2 2026 |
| **Free tier size** | 300-500 users | Conversion target: 5% = 15-25 paying |
| **CAC payback** | 3-4 months | If MRR grows to $5K |

---

## 5. Versioning

### MVP (v1) — Ship 2026-04-05
**Deliverables**:
- 3 screens (Command Center, Project View, Integrations)
- GitHub sync + WebSocket real-time
- Supabase auth + activity logging
- Deployed to Vercel + Railway

**User limit**: 100 beta users (closed beta)

**Know issues**: None critical; minor UX polish in Phase 2

### Phase 2 (v1.1) — Ship 2026-06-14
**Deliverables**:
- Brain Studio (visual prompt editor)
- Multi-user collaboration (comments, approvals)
- Analytics dashboard (token trends, performance)
- Slack integration
- OAuth signup (GitHub, Google)
- Advanced filtering + custom views
- **BMAD Planning Wizard** (new project creation pipeline)

**User limit**: 500 (public beta)

#### Phase 2 Enhancement: BMAD-Inspired Project Wizard

**Feature**: Structured project creation pipeline (instead of manual setup)

**User Flow**:

```
User clicks [Create New Project] in ClawCortex UI
↓
Modal: "What are you building?" (text input)
↓
ClawCortex spawns BMAD Planning Pipeline:
  1. Product Owner agent → Product Brief (1 min)
  2. Business Analyst agent → PRD (2 min)
  3. Architect agent → Architecture doc (3 min)
  4. Scrum Master agent → Epics & Stories (2 min)
  5. Readiness Check → GO/NO-GO (1 min)
↓
UI shows progress: "Planning your project... (Step 3/5: Architecture)"
↓
When complete:
  - UI displays all artifacts (Brief, PRD, Architecture, Epics)
  - Readiness status: 🟢 GO or 🔴 NO-GO (with blockers)
↓
User reviews + approves
↓
ClawBot:
  - Creates GitHub repo (user/project-name)
  - Scaffolds initial structure (based on tech stack)
  - Commits planning artifacts to repo
  - Updates ClawCortex dashboard (new project card)
```

**MVP Scope (Excluded)**: Manual project creation (user provides GitHub repo URL) — ClawCortex syncs existing repo

**Phase 2 Scope (Week 8-12)**: Full BMAD planning pipeline + automated repo creation + scaffolding + project wizard UI

**Reference Implementation**:
- BMAD prompts: `/data/.openclaw/workspace/bmad-reference/prompts/`
- Adapt for ClawCortex context (multi-project, Supabase integration)

### Phase 3 (v2) — Ship 2026-08-23
**Deliverables**:
- Agent marketplace (share workflows)
- Webhook system (trigger agents from external systems)
- API for white-label integrations
- Advanced permission system (RBAC)
- Data export (JSON, CSV)

**User limit**: Unlimited (public)

### Phase 4 (Enterprise) — 2026-10+
**Deliverables**:
- SSO + SAML
- SOC2 compliance
- Advanced audit logging
- Custom contracts
- Dedicated support

---

## Appendix: API Endpoints (Preliminary)

### Authentication
```
POST   /auth/signup           (email, password)
POST   /auth/login            (email, password, returns JWT)
POST   /auth/logout           (invalidates token)
GET    /auth/user             (returns current user)
```

### Projects
```
GET    /projects              (list user's projects)
GET    /projects/:id          (get project details)
GET    /projects/:id/tasks    (get tasks from GitHub)
GET    /projects/:id/activity (get activity log, paginated)
```

### Integrations
```
GET    /integrations/status   (GitHub, Notion, OpenAI, Supabase status)
POST   /integrations/github/connect    (OAuth flow)
GET    /integrations/github/repos      (list repos)
```

### WebSocket
```
WS     /ws                    (connect to real-time feed)
        Events:
        - activity:new         (new activity log entry)
        - project:updated      (project sync completed)
        - task:changed         (task status change)
```

---

## Appendix: Database Tables (Preliminary)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  auth_provider TEXT, -- 'email', 'github', 'google' (Phase 2)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  github_repo TEXT, -- 'owner/repo'
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks (synced from GitHub issues)
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  github_issue_id INT, -- GitHub issue number
  title TEXT NOT NULL,
  description TEXT,
  status TEXT, -- 'todo', 'in-progress', 'ready-review', 'done'
  owner TEXT, -- agent name or human
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  agent_name TEXT, -- 'Henry', 'Dev', 'QA', etc.
  action TEXT, -- 'started', 'completed', 'errored'
  task_id UUID REFERENCES tasks(id),
  metadata JSONB, -- {duration_ms, tokens_used, cost}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Integrations (store API keys, encrypted)
CREATE TABLE integrations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  service TEXT, -- 'github', 'notion', 'openai'
  api_key TEXT ENCRYPTED, -- Never shown in UI
  status TEXT, -- 'connected', 'expired', 'error'
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

**Locked by**: Alex (Founder)  
**Approved on**: 2026-02-22  
**Next step**: Architecture document generation + Story generation (week 3)
