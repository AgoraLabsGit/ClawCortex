# ClawCortex MVP — Single-Operator Architecture

**Version**: 1.0 MVP  
**Owner**: Henry (Orchestrator)  
**Status**: 🟢 ACTIVE (Building)  
**Date**: 2026-02-22  
**Scope**: Single-operator command center (you). Multi-user Phase 2.  
**Timeline**: 4 weeks (Feb 22 — Mar 22)

---

## 1. What We're Building

### The Reality
**ClawCortex is a command center for YOU.**

You run Localist, ClawCortex, and soon more products. Each lives in a separate GitHub repo. Each spawns agents. You need one dashboard to see:
- What agents are doing (status, logs)
- What tasks are open (GitHub issues + Supabase tasks table)
- What happened (activity feed from workspace memory)
- Quick actions (reassign agents, pause work, etc.)

**This is NOT a multi-user SaaS yet.** It's a single-operator workspace UI. Phase 2 (week 8+) adds:
- Per-user GitHub OAuth
- User-owned cortex repos
- Multi-team support

### Success = You Spend 20% Less Time Context-Switching

Right now: You check Telegram, GitHub, memory files, Discord. That's scattered.  
Target: One dashboard with real-time feeds from all sources.

---

## 2. Tech Stack (LOCKED)

### Frontend
| Component | Tech | Version | Why |
|-----------|------|---------|-----|
| **Framework** | Next.js | 14.2 | App Router, zero-JS SSR, instant deploys on Vercel |
| **Language** | TypeScript | 5.4 | Type safety = fewer bugs at 3 AM |
| **UI** | Shadcn/ui | latest | Pre-built components, dark mode included |
| **Styling** | Tailwind CSS | 3.4 | Rapid iteration (you'll iterate on dashboard UX) |
| **State** | TanStack Query | 5.x | Server state caching + background sync (real-time tasks) |
| **Real-time** | Supabase Realtime | managed | PostgreSQL change streams (agent status updates live) |
| **PWA** | next-pwa | latest | Installable + offline (access dashboard anywhere) |
| **Testing** | Jest + RTL | latest | Catch regressions fast |

### Backend
| Component | Tech | Version | Why |
|-----------|------|---------|-----|
| **Runtime** | OpenClaw Gateway | latest | Agent orchestration built-in (no custom server needed) |
| **Language** | Node.js + TS | 22.x | You already know this (Claw Team workspace) |
| **Database** | Supabase | managed | Realtime, PostgreSQL, RLS for permissions |
| **Storage** | Supabase (file API) | managed | Store logs, artifacts, agent memory snapshots |
| **APIs** | Octokit, Perplexity, OpenAI | native | Agent tools (already wired) |

### Infrastructure
| Component | Tech | Why |
|-----------|------|-----|
| **Frontend** | Vercel | Auto-deploy on git push, edge functions, instant rollbacks |
| **Backend** | Railway (OpenClaw) | Persistent volumes for workspace state, easy env vars |
| **Database** | Supabase (free tier) | Real-time, managed backups, generous free limits |
| **Repository** | GitHub (public) | Source of truth, version control, webhooks for sync |

### Version Lock (No Changes Until Apr 22)
```json
{
  "nextjs": "14.2.0",
  "react": "18.2.0",
  "typescript": "5.4.0",
  "tailwindcss": "3.4.0",
  "shadcn": "latest",
  "tanstack-query": "5.x",
  "supabase-js": "2.x",
  "octokit": "20.x"
}
```

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────┐
│                    YOU (Browser)                     │
│     https://clawcortex.vercel.app/dashboard         │
└────────────────┬─────────────────────────────────────┘
                 │ HTTPS
                 ▼
    ┌─────────────────────────────────┐
    │   Next.js Frontend (Vercel)     │
    │  ┌───────────────────────────┐  │
    │  │ Dashboard (read-only)     │  │
    │  │ • Agents status (grid)    │  │
    │  │ • Tasks (table)           │  │
    │  │ • Activity feed (live)    │  │
    │  │ • Logs viewer             │  │
    │  └───────────────────────────┘  │
    │  ┌───────────────────────────┐  │
    │  │ Settings page             │  │
    │  │ • GitHub token            │  │
    │  │ • Supabase keys           │  │
    │  │ • OpenClaw gateway URL    │  │
    │  └───────────────────────────┘  │
    │  ┌───────────────────────────┐  │
    │  │ Data Layer                │  │
    │  │ • Supabase client (live) │  │
    │  │ • TanStack Query (cache) │  │
    │  │ • Real-time subscriptions│  │
    │  └───────────────────────────┘  │
    └────┬──────────────┬──────────────┘
         │ SQL          │ API key
         │              │
    ┌────▼──────────────▼──────────────┐
    │  Supabase (PostgreSQL)           │
    │  ┌────────────────────────────┐  │
    │  │ Tables                     │  │
    │  │ • agents (id, name, status)│  │
    │  │ • tasks (id, title, agent) │  │
    │  │ • activity_log (feed)      │  │
    │  └────────────────────────────┘  │
    │  ┌────────────────────────────┐  │
    │  │ Real-time Streams          │  │
    │  │ • agents.*:update          │  │
    │  │ • tasks.*:insert           │  │
    │  └────────────────────────────┘  │
    └────────────────────────────────┘
         │ (async worker writes)
         │
    ┌────▼──────────────────────────────┐
    │  OpenClaw Gateway (Railway)       │
    │  ┌────────────────────────────┐  │
    │  │ Agent Runs                 │  │
    │  │ • Henry (orchestrator)     │  │
    │  │ • Builder (feature dev)    │  │
    │  │ • Tester (QA)             │  │
    │  └────────────────────────────┘  │
    │  ┌────────────────────────────┐  │
    │  │ Memory System              │  │
    │  │ • /data workspace files    │  │
    │  │ • MEMORY.md, memory/*.md   │  │
    │  │ • Agent context store      │  │
    │  └────────────────────────────┘  │
    │  ┌────────────────────────────┐  │
    │  │ Sync Worker                │  │
    │  │ • Write agent status → DB  │  │
    │  │ • Write tasks → DB         │  │
    │  │ • Read memory → activity   │  │
    │  └────────────────────────────┘  │
    │  ┌────────────────────────────┐  │
    │  │ Integrations               │  │
    │  │ • GitHub API (Octokit)     │  │
    │  │ • OpenAI / Anthropic       │  │
    │  │ • Perplexity web search    │  │
    │  │ • Telegram notifications   │  │
    │  └────────────────────────────┘  │
    └────────────────────────────────┘
```

---

## 4. Data Model (Minimal MVP)

### Supabase Tables

#### `agents`
```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE,
  status TEXT ('idle' | 'busy' | 'error'),
  last_seen TIMESTAMP,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `tasks`
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT,
  agent_id UUID REFERENCES agents(id),
  status TEXT ('todo' | 'in_progress' | 'done'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `activity_log`
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY,
  event TEXT,
  agent_id UUID REFERENCES agents(id),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Data Flow

```
Henry (agent) runs a task
         ↓
Writes to workspace/memory/2026-02-22.md
         ↓
Sync worker (in OpenClaw) reads memory file
         ↓
Updates Supabase: agents.status, tasks.status, activity_log
         ↓
Supabase broadcasts real-time event
         ↓
Dashboard subscribes to agents:update
         ↓
UI auto-refreshes (no polling)
```

---

## 5. MVP Scope (4 Weeks)

### Week 1: Dashboard (Read-Only)
- [ ] Dashboard layout (3 columns: agents, tasks, logs)
- [ ] Query Supabase agents table
- [ ] Query Supabase tasks table
- [ ] Display with Shadcn components
- [ ] Dark mode toggle
- [ ] Responsive (mobile-friendly)
- [ ] Deployed to Vercel

**Definition of done**: You can open dashboard and see live agent status without refreshing.

### Week 2: Settings + Real-time
- [ ] Settings page (GitHub token, Supabase key, OpenClaw URL)
- [ ] Store settings in localStorage (or Supabase)
- [ ] Real-time subscriptions (agents:update)
- [ ] Activity feed (live updates, no polling)
- [ ] Basic auth (GitHub OAuth OR simple token)

**Definition of done**: You can see agents update in real-time as they work.

### Week 3: Task Management
- [ ] Create task form (+ modal)
- [ ] Update task status (todo → in_progress → done)
- [ ] Delete task
- [ ] Assign task to agent
- [ ] Task filtering (by agent, by status)

**Definition of done**: Full CRUD on tasks. Forms validate input.

### Week 4: Polish + Launch
- [ ] Error handling (connection lost, API errors)
- [ ] Loading states (spinners, skeletons)
- [ ] Search + filter (agents, tasks)
- [ ] Keyboard shortcuts (cmd-k for quick actions)
- [ ] Documentation (how to set up, deploy locally)
- [ ] Performance audit (Lighthouse, bundle size)
- [ ] Launch closed beta (you + 5 power users)

**Definition of done**: Site works great, no bugs, ready to show others.

---

## 6. MVP Does NOT Include (Phase 2)

❌ Multi-user support (OAuth, per-user workspaces)  
❌ Agent creation UI (you use CLI for now)  
❌ Advanced analytics (agent performance trends)  
❌ Workflow builder (visual agent chains)  
❌ Mobile app (PWA only, responsive web)  
❌ Integration marketplace (hardcoded for now)

These unlock value AFTER MVP proves the core idea: **unified visibility**.

---

## 7. How Data Gets Into the Dashboard

### The Sync Pattern

1. **Agent works** (Henry, Builder, etc. in OpenClaw)
   ```
   Write to: /data/.openclaw/workspace/memory/2026-02-22.md
   Format: "14:30 [Henry] Started feature X"
   ```

2. **Sync worker reads memory** (cron job, runs every 5 min)
   ```
   Read: /data/.openclaw/workspace/memory/2026-02-22.md
   Parse: Extract agent name, action, timestamp
   Write to Supabase: agents.last_seen, activity_log.event
   ```

3. **Database broadcasts change**
   ```
   Supabase: "agents row 123 updated"
   Real-time event to all subscribers
   ```

4. **Dashboard subscribes**
   ```
   const { data } = useQuery(['agents'], ...)
   const subscription = supabase
     .channel('agents')
     .on('postgres_changes', { ... }, (payload) => {
       // UI updates automatically
     })
   ```

5. **You see it live** (no refresh needed)

---

## 8. Deployment Architecture

```
Local Development
├── npm run dev (frontend on localhost:3000)
├── Supabase CLI for DB migrations
└── .env files (credentials)

Git Push → GitHub (main branch)
           ↓
Vercel ← Detects push
         ├── Build frontend
         ├── Run tests
         └── Deploy to https://clawcortex.vercel.app
         
Railway ← Separate webhook (manual for now)
          ├── Pull latest from GitHub
          ├── Update .env (secrets manager)
          └── Restart OpenClaw service

Supabase ← Automatic (no action needed)
           Real-time changes stream to frontend
```

---

## 9. Monitoring & Observability

### What You'll Track (MVP)

| Metric | How | Purpose |
|--------|-----|---------|
| **Agent status** | Supabase query | Is agent working or idle? |
| **Task completion rate** | tasks.status == 'done' | How much work got shipped? |
| **API latency** | Browser DevTools → Network tab | Is dashboard slow? |
| **Errors** | Browser console + Vercel logs | Are there bugs? |
| **Deployment health** | Vercel dashboard | Did the build succeed? |

### What You DON'T Track Yet (Phase 2)

❌ Agent performance trends (which agent is fastest?)  
❌ Cost tracking (how much does this cost to run?)  
❌ User behavior analytics (who uses what features?)

---

## 10. Key Decisions Explained

### Decision 1: Why Supabase Over Custom API?

**Options**:
- A) Custom FastAPI backend (full control)
- B) Supabase (managed, real-time built-in)

**Choice: B (Supabase)**

**Why**:
- Real-time subscriptions work automatically
- No server to manage (one less thing to deploy)
- You already use Supabase for agents + tasks tables
- RLS policies handle permissions later
- Free tier supports MVP

### Decision 2: Single-Operator vs Multi-User?

**Options**:
- A) Design for 100 users now (complex)
- B) Design for 1 operator (you), upgrade later

**Choice: B (Single-operator MVP)**

**Why**:
- Ships faster (4 weeks vs 8 weeks)
- Validates the core idea: unified visibility
- You learn what users actually want
- Phase 2 adds multi-user easily (cortex per user)
- Less code = fewer bugs

### Decision 3: Where Do Agents Write Data?

**Options**:
- A) Agents write directly to Supabase
- B) Agents write to workspace files → sync worker pushes to DB

**Choice: B (Files → sync)**

**Why**:
- Workspace files are source of truth (git-tracked, auditable)
- Sync is one-way (agents can't corrupt DB)
- Easy to replay/debug (check the log file)
- Works offline (OpenClaw runs locally first)

---

## 11. Success Metrics (By Apr 5)

✅ **Dashboard loads in <1s**  
✅ **Real-time updates (no stale data)**  
✅ **Agents + tasks visible in one place**  
✅ **You save 5+ hours/week on context-switching**  
✅ **No critical bugs**  
✅ **Code is git-tracked + documented**  
✅ **Ready to show 5 beta testers**  

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Supabase RLS blocks queries** | Dashboard returns empty | Test with service role key; relax RLS for MVP |
| **Real-time subscription drops** | Stale data on dashboard | Implement auto-reconnect + manual refresh button |
| **Sync worker misses updates** | Activity doesn't appear | Add backlog queue; retry failed writes |
| **Vercel build fails** | Can't deploy | Verify Root Directory = frontend, lock dependencies |
| **Agents write invalid JSON to memory** | Sync worker crashes | Add input validation + error logging |
| **Cost spikes on Supabase** | Unexpected bill | Monitor row counts; set up alerts in Supabase dashboard |

---

## 13. File Structure (What You'll Build)

```
frontend/src/
├── app/
│   ├── layout.tsx              # Main layout (nav, auth guard)
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard (agents + tasks)
│   ├── settings/
│   │   └── page.tsx            # Settings form (tokens, keys)
│   ├── logs/
│   │   └── page.tsx            # Activity feed / logs viewer
│   └── auth/
│       └── page.tsx            # Login (if using GitHub OAuth)
├── components/
│   ├── agents-grid.tsx         # Agents display
│   ├── tasks-table.tsx         # Tasks display
│   ├── activity-feed.tsx       # Real-time activity
│   └── create-task-modal.tsx   # Task creation form
├── lib/
│   ├── supabase.ts             # Client initialization
│   ├── api.ts                  # Fetch wrapper with types
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAgents.ts        # Fetch + subscribe agents
│   │   ├── useTasks.ts         # Fetch + subscribe tasks
│   │   └── useActivity.ts      # Fetch activity log
│   └── types.ts                # TypeScript interfaces
└── styles/
    └── globals.css             # Tailwind + dark mode

backend/ (OpenClaw Workspace)
├── /data/.openclaw/workspace/
│   ├── MEMORY.md               # Henry's long-term memory
│   ├── memory/
│   │   └── 2026-02-22.md       # Daily log (sync worker reads this)
│   ├── scripts/
│   │   └── sync-memory-to-db.js # Reads memory, writes to Supabase
│   └── cron/
│       └── sync-worker.js      # Scheduled every 5 min
```

---

## 14. Next Steps (You're Here)

1. **Read NEXT-SESSION-PROMPT.md** (build instructions)
2. **Run SYSTEMS-CHECK.md** (verify everything works)
3. **Start Phase 1** (build dashboard UI)
4. **Commit daily** (small, working features)
5. **Ship by Mar 22** (MVP launch)

---

## Phase 2 (Begins Mar 23)

Once MVP is live and you've used it for 2 weeks:

✨ **Multi-user support** (per-user cortex repos)  
✨ **Agent marketplace** (share agent configs)  
✨ **Advanced workflows** (visual agent chains)  
✨ **Analytics** (performance trends)  
✨ **Team collaboration** (approvals, comments)  

---

**You're building the future of AI team management. Keep it simple. Ship it fast.**

🚀 Let's build.
