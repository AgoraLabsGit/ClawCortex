# ClawCortex MVP — Architecture Document

**Version**: 1.0  
**Owner**: Henry (Orchestrator)  
**Status**: 🟢 LOCKED (Implementation begins)  
**Date**: 2026-02-22

---

## 1. Tech Stack (LOCKED)

### Frontend
| Component | Choice | Version | Rationale |
|-----------|--------|---------|-----------|
| **Framework** | Next.js | 14.2.0 | App Router, edge functions, fastest React framework |
| **Language** | TypeScript | 5.4.0 | Type safety, catches bugs early |
| **UI Library** | Shadcn/ui | latest | Developer-friendly, accessible, consistent |
| **Styling** | Tailwind CSS | 3.4.0 | Utility-first, fast development |
| **State Mgmt** | TanStack Query | 5.x | Server state sync, real-time updates, caching |
| **Real-time** | React hooks + native fetch | — | Simple, no extra library overhead |
| **PWA** | next-pwa | latest | Service worker, installable, offline support |
| **Testing** | Jest + React Testing Library | latest | Unit + component tests |
| **Linting** | ESLint + Prettier | latest | Code quality, consistency |

### Backend
| Component | Choice | Version | Rationale |
|-----------|--------|---------|-----------|
| **Framework** | Fastify | 4.x | Lightweight, fast, excellent TypeScript support |
| **Language** | TypeScript | 5.4.0 | Type safety, catches bugs early |
| **GitHub API** | Octokit | 20.x | Official GitHub SDK, maintains compatibility |
| **Real-time** | ws (WebSocket) | 8.x | Simple, performant, no extra dependencies |
| **Database** | Supabase (PostgreSQL 15) | managed | Managed Postgres, built-in Auth, Realtime |
| **Auth** | Supabase Auth | managed | JWT tokens, OAuth Phase 2 |
| **Testing** | Jest | latest | Unit + integration tests |
| **Logging** | Pino | latest | Structured logging, fast |
| **Monitoring** | Sentry | — | Error tracking (Phase 2) |

### Infrastructure & Hosting
| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Frontend Hosting** | Vercel | Native Next.js support, edge functions, instant deploys |
| **Backend Hosting** | Railway | Docker-friendly, background jobs, PostgreSQL support |
| **Database** | Supabase (PostgreSQL 15) | Managed, free tier sufficient for MVP |
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
  "fastify": "4.x",
  "octokit": "20.x",
  "ws": "8.x"
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
        │  │ Pages                       │ │
        │  │ • /dashboard (Command Ctr)  │ │
        │  │ • /projects/[id]            │ │
        │  │ • /settings/integrations    │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ Components (Shadcn/ui)      │ │
        │  │ • ActivityFeed              │ │
        │  │ • SprintBoard               │ │
        │  │ • TaskDetail                │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ TanStack Query (state)      │ │
        │  │ • Real-time sync from API   │ │
        │  │ • Caching                   │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ Service Worker (PWA)        │ │
        │  │ • Offline support           │ │
        │  │ • Background sync           │ │
        │  └─────────────────────────────┘ │
        └────┬───────────────┬─────────────┘
             │ REST API      │ WebSocket
             │               │
    ┌────────▼────────────────▼──────────┐
    │  Fastify Backend (Railway)         │
    │  ┌────────────────────────────────┐ │
    │  │ Routes (Express-like)          │ │
    │  │ POST   /auth/login             │ │
    │  │ GET    /projects/:id/tasks     │ │
    │  │ GET    /activity (paginated)   │ │
    │  │ WS     /ws (WebSocket)         │ │
    │  └────────────────────────────────┘ │
    │  ┌────────────────────────────────┐ │
    │  │ Services                       │ │
    │  │ • AuthService (Supabase JWT)   │ │
    │  │ • GitHubService (Octokit)      │ │
    │  │ • ActivityService (DB)         │ │
    │  │ • WebSocketManager             │ │
    │  └────────────────────────────────┘ │
    │  ┌────────────────────────────────┐ │
    │  │ Middleware                     │ │
    │  │ • JWT auth validation          │ │
    │  │ • CORS (for Vercel)            │ │
    │  │ • Error handling               │ │
    │  │ • Rate limiting                │ │
    │  └────────────────────────────────┘ │
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

---

## 3. Component Breakdown

### Frontend Components (React)

```
src/
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
│   ├── ActivityFeed.tsx       # Command Center: activity feed
│   ├── SprintBoard.tsx        # Command Center: sprint board
│   ├── ProjectHealth.tsx      # Command Center: project status
│   ├── TaskDetail.tsx         # Project View: expanded task
│   ├── ExecutionLogs.tsx      # Project View: agent run logs
│   ├── TaskList.tsx           # Project View: task list
│   ├── IntegrationsStatus.tsx # Settings: service status
│   └── common/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase.ts            # Supabase client init
│   ├── api.ts                 # API helpers (fetch, error handling)
│   ├── hooks.ts               # React hooks (useActivity, useProjects)
│   └── utils.ts               # Formatters, time helpers
├── types/
│   ├── index.ts               # All TypeScript interfaces
└── public/
    ├── manifest.json          # PWA manifest
    └── sw.js                  # Service worker
```

### Backend Services (Fastify)

```
src/
├── index.ts                   # Fastify app setup, middleware
├── routes/
│   ├── auth.ts                # POST /auth/login, /auth/signup, etc.
│   ├── projects.ts            # GET /projects, /projects/:id/tasks
│   ├── activity.ts            # GET /activity (paginated)
│   └── integrations.ts        # GET /integrations/status
├── services/
│   ├── AuthService.ts         # JWT validation, user session
│   ├── GitHubService.ts       # Octokit wrapper, sync logic
│   ├── ActivityService.ts     # Log, retrieve activity
│   └── WebSocketService.ts    # Connection mgmt, rooms
├── middleware/
│   ├── auth.ts                # JWT validation middleware
│   ├── errorHandler.ts        # Global error handling
│   └── cors.ts                # CORS config
├── websocket.ts               # ws server setup, message handlers
├── lib/
│   ├── supabase.ts            # Supabase client init
│   ├── octokit.ts             # Octokit client init
│   └── logger.ts              # Pino logging setup
└── types/
    └── index.ts               # All TypeScript interfaces
```

---

## 4. Data Models & Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- NULL if OAuth
  auth_provider TEXT DEFAULT 'email', -- 'email', 'github', 'google'
  github_username TEXT, -- For linked GitHub account
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
  github_repo TEXT, -- 'owner/repo' format
  github_synced_at TIMESTAMP, -- Last time we synced tasks
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_github_repo ON projects(github_repo);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  github_issue_id INT, -- GitHub issue number (for syncing)
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in-progress', 'ready-review', 'done')),
  owner TEXT, -- Agent name or 'human'
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_owner ON tasks(owner);
```

### Activity Log Table
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL, -- 'Henry', 'Dev', 'QA', etc.
  action TEXT NOT NULL, -- 'started', 'completed', 'errored'
  task_id UUID REFERENCES tasks(id),
  metadata JSONB, -- {duration_ms: 900, tokens_used: 2450, cost: 0.07}
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_project_id ON activity_log(project_id);
CREATE INDEX idx_activity_agent ON activity_log(agent_name);
CREATE INDEX idx_activity_created_at ON activity_log(created_at DESC);
```

### Integrations Table
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service TEXT NOT NULL, -- 'github', 'notion', 'openai'
  api_key TEXT ENCRYPTED, -- Never shown in UI or logs
  status TEXT DEFAULT 'connected', -- 'connected', 'expired', 'error'
  error_message TEXT,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_integrations_service ON integrations(service);
```

---

## 5. API Design

### RESTful Endpoints

#### Authentication
```
POST /auth/signup
  Body: {email, password}
  Response: 201 Created {user_id, token}
  
POST /auth/login
  Body: {email, password}
  Response: 200 OK {user_id, token}
  
POST /auth/logout
  Headers: Authorization: Bearer {token}
  Response: 200 OK

GET /auth/user
  Headers: Authorization: Bearer {token}
  Response: 200 OK {user_id, email, created_at}
```

#### Projects
```
GET /projects
  Headers: Authorization: Bearer {token}
  Response: 200 OK [{id, name, github_repo, last_sync}, ...]

GET /projects/:id
  Headers: Authorization: Bearer {token}
  Response: 200 OK {id, name, description, github_repo, tasks_count}

GET /projects/:id/tasks
  Headers: Authorization: Bearer {token}
  Query: ?status=todo&owner=Dev&limit=20&offset=0
  Response: 200 OK [{id, title, status, owner, due_date}, ...]

GET /projects/:id/activity
  Headers: Authorization: Bearer {token}
  Query: ?limit=20&offset=0&agent_name=Henry
  Response: 200 OK [{id, agent_name, action, task_id, metadata, created_at}, ...]
```

#### Integrations
```
GET /integrations/status
  Headers: Authorization: Bearer {token}
  Response: 200 OK {
    github: {status: "connected", last_sync: "2026-02-22T15:22Z"},
    notion: {status: "connected", last_sync: "2026-02-22T14:00Z"},
    openai: {status: "expired", error: "API key expired"}
  }

POST /integrations/github/connect
  Headers: Authorization: Bearer {token}
  Body: {code} (from OAuth redirect)
  Response: 201 Created {service, status, last_sync}
```

### WebSocket Events

#### Client → Server
```json
{
  "type": "join",
  "room": "project:abc123",
  "token": "eyJhbGc..."
}

{
  "type": "subscribe",
  "events": ["activity:new", "task:changed"]
}
```

#### Server → Client
```json
{
  "type": "activity:new",
  "data": {
    "id": "uuid",
    "project_id": "uuid",
    "agent_name": "Henry",
    "action": "completed",
    "task_id": "uuid",
    "metadata": {"duration_ms": 1200, "tokens_used": 2450}
  }
}

{
  "type": "task:changed",
  "data": {
    "id": "uuid",
    "status": "ready-review"
  }
}
```

---

## 6. Security & Compliance

### Authentication Flow
```
User enters email/password
  ↓
POST /auth/login (HTTPS only)
  ↓
Fastify backend validates against Supabase Auth
  ↓
If valid: Return JWT token (signed by Supabase)
  ↓
Client stores token in localStorage (secure: HttpOnly flag Phase 2)
  ↓
All subsequent requests: Authorization: Bearer {token}
  ↓
Middleware validates token signature (Supabase public key)
  ↓
Extract user_id from token claims
```

### Data Isolation
```
Rule: Users can only see their own projects + tasks

Implementation:
- All DB queries include WHERE user_id = $1
- API middleware injects user_id from JWT
- Row-level security (RLS) enabled on Supabase tables
- No public queries exposed

Example:
GET /projects
  ↓
Query: SELECT * FROM projects WHERE user_id = auth.uid()
```

### Credential Management
```
API keys (GitHub, Notion, OpenAI):
- Encrypted at rest in Supabase (encryption plugin)
- Never sent to frontend
- Only used server-side in Fastify services
- Rotation plan (Phase 2): 90-day expiry + renewal

Environment variables:
- .env.local (never committed)
- Secrets in Vercel project settings (frontend)
- Secrets in Railway (backend)
```

### Error Handling
```
Don't expose:
- Full error stack traces to client
- Internal server URLs or paths
- Database structure
- API key hints

Log internally:
- Full errors in structured logs (Pino)
- Include request ID for tracing
- Send to monitoring (Sentry Phase 2)

Return to client:
- User-friendly error message
- Error code (e.g., AUTH_001)
- Request ID (for support)
```

### Audit Logging
```
All user actions logged to activity_log:
- What: user_id, action (login, task_update, setting_change)
- When: timestamp
- Why: request_id, metadata

Retention: 1 year (configurable)
Access: Admins only (Phase 2)
```

---

## 7. Deployment Architecture

### Frontend (Vercel)
```
GitHub Push → Vercel Webhook
  ↓
Build: npm run build:frontend
  ↓
Test: npm test:frontend
  ↓
Deploy: Upload to Vercel edge network
  ↓
Domain: cortex-frontend.vercel.app → cortex.ai (Phase 2)
  ↓
Monitoring: Vercel Analytics (built-in)
```

### Backend (Railway)
```
GitHub Push → Railway Webhook
  ↓
Build: Docker build (Railway auto-detects Node.js)
  ↓
Test: npm test:backend
  ↓
Deploy: Railway runs docker run (processes, env vars from Railway dashboard)
  ↓
Domain: cortex-api-prod.railway.app → api.cortex.ai (Phase 2)
  ↓
Database: Supabase PostgreSQL (auto-backed-up daily)
  ↓
Monitoring: Railway logs + Sentry (Phase 2)
```

### Environment Variables
```
Frontend (.env.local from Vercel):
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  NEXT_PUBLIC_API_URL=https://cortex-api-prod.railway.app

Backend (.env from Railway):
  DATABASE_URL=postgresql://...
  JWT_SECRET=(from Supabase)
  GITHUB_TOKEN
  GITHUB_REPO=AgoraLabsGit/ClawCortex
  NODE_ENV=production
```

---

## Appendix: Performance Targets & Budget

### Performance Budget

| Metric | Target | Notes |
|--------|--------|-------|
| **FCP** (First Contentful Paint) | <1s | Mobile 3G |
| **LCP** (Largest Contentful Paint) | <2.5s | Mobile 3G |
| **CLS** (Cumulative Layout Shift) | <0.1 | Visual stability |
| **WebSocket latency** | <100ms p95 | Real-time feel |
| **API response** | <200ms p95 | Dashboard responsiveness |

### Resource Budget

| Resource | Target |
|----------|--------|
| **JS bundle** | <100KB (gzipped) |
| **CSS** | <20KB (gzipped) |
| **Fonts** | System fonts (no external) |
| **Images** | Optimized with next/image |

---

**Locked by**: Henry (Orchestrator)  
**Approved on**: 2026-02-22  
**Next step**: Frontend + Backend scaffolds (this week)
