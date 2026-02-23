# ClawCortex MVP — Next Session Autonomous Build Prompt

**Date Created**: 2026-02-22 21:02 GMT-3  
**Status**: Tech stack deployed, ready for autonomous development  
**Workflow**: GMAD (Build → Measure → Analyze → Decide)  
**Time Budget**: This session + next 3-4 days for MVP

---

## Context & Setup

### What's Done ✅

The tech stack is fully operational. You have:

1. **GitHub Repository** — Clean, documented, ready for commits
2. **Vercel Frontend** — Next.js 14, auto-deploys on push
3. **Supabase Database** — PostgreSQL, agents + tasks tables, RLS enabled
4. **OpenClaw Gateway** — Hostinger VPS, Haiku model (cost optimized)
5. **Documentation** — SETUP-LOG.md + DEPLOYMENT-GUIDE.md for reference

### Your Environment

```bash
# Working directory:
/data/.openclaw/workspace/projects/ClawCortex

# Key files:
- .env (project credentials, git ignored)
- frontend/.env (dev credentials, git ignored)
- SYSTEMS-CHECK.md (5-min verification checklist)
- SETUP-LOG.md (what we built)
- docs/DEPLOYMENT-GUIDE.md (how to replicate)
```

### Model & Cost Control

- **Model**: Claude Haiku 4.5 (already switched, active)
- **Cost**: $1-5/day (vs $75+/day on Sonnet)
- **Use Sonnet only for**: Complex logic, novel problems
- **Use Haiku for**: Routing, code generation, standard tasks

---

## MVP Scope (Autonomous Build)

### Phase 1: Dashboard UI (Day 1-2)

**Goal**: Agents + Tasks list, read-only data display

**Checklist**:
- [ ] Dashboard page at `/dashboard`
- [ ] Query Supabase agents table
- [ ] Display agents in table/grid format
- [ ] Query Supabase tasks table
- [ ] Display tasks filtered by agent
- [ ] Basic styling (dark mode, responsive)
- [ ] Unit tests for data fetching

**Example UI**:
```
┌─ ClawCortex Dashboard ──────────────────┐
│                                           │
│  Agents (3)              Tasks (5)       │
│  ┌─────────────────┐   ┌──────────────┐ │
│  │ TestBot (idle)  │   │ Task 1       │ │
│  │ Worker-1 (busy) │   │ Task 2       │ │
│  │ Worker-2 (idle) │   │ Task 3       │ │
│  └─────────────────┘   │ Task 4       │ │
│                         │ Task 5       │ │
│                         └──────────────┘ │
└─────────────────────────────────────────┘
```

---

### Phase 2: Authentication (Day 2-3)

**Goal**: User sign-up/login, protected routes

**Checklist**:
- [ ] Sign-up page at `/auth/signup`
- [ ] Login page at `/auth/login` (already scaffolded)
- [ ] Create user in Supabase Auth
- [ ] Store session token in localStorage
- [ ] Protect `/dashboard` route (redirect to login if not authenticated)
- [ ] Logout button
- [ ] User profile indicator

---

### Phase 3: API & CRUD (Day 3-4)

**Goal**: Create/Read/Update/Delete agents and tasks

**Checklist**:
- [ ] API endpoint: `POST /api/agents` (create)
- [ ] API endpoint: `GET /api/agents` (list)
- [ ] API endpoint: `GET /api/agents/:id` (detail)
- [ ] API endpoint: `PUT /api/agents/:id` (update)
- [ ] API endpoint: `DELETE /api/agents/:id` (delete)
- [ ] Same for tasks (`/api/tasks/*`)
- [ ] Input validation
- [ ] Error handling

---

### Phase 4: Real-time Updates (Day 4+, if time)

**Goal**: Live agent status, real-time task updates

**Checklist**:
- [ ] Supabase Realtime subscriptions (agents)
- [ ] Auto-refresh when agent status changes
- [ ] WebSocket fallback (optional)
- [ ] Subscription cleanup on unmount

---

## How to Execute (GMAD Workflow)

### 1. BUILD (Code)

```bash
cd /data/.openclaw/workspace/projects/ClawCortex

# Create feature branch
git checkout -b feat/dashboard-ui

# Build dashboard UI component
# - Query agents + tasks from Supabase
# - Display in table/grid
# - Add basic styling

# Test locally
npm run dev --prefix frontend
# Visit http://localhost:3000/dashboard

# Commit
git add .
git commit -m "feat: add dashboard with agents + tasks display"
git push origin feat/dashboard-ui
```

### 2. MEASURE (Test)

```bash
# Run tests
npm test --prefix frontend

# Check coverage
npm run test:coverage --prefix frontend

# Check performance
# - Open DevTools → Lighthouse
# - Check Core Web Vitals
# - Check bundle size
```

### 3. ANALYZE (Review)

```bash
# Check Vercel analytics
# - https://vercel.com/teams/agora-labs/clawcortex

# Review database queries
# - Go to Supabase → Logs
# - Look for N+1 queries
# - Optimize if needed

# Review build time
# - Should be <30s
# - If slower, investigate

# Check error logs
# - Vercel: Deployments → Function Logs
# - Browser console: F12
```

### 4. DECIDE (Merge & Plan)

```bash
# Create Pull Request on GitHub
# - Write description
# - Link to this task list
# - Request review (if applicable)

# Merge to main
git checkout main
git pull origin feat/dashboard-ui
git merge feat/dashboard-ui
git push origin main

# Auto-deploys to Vercel

# Plan next phase
# - What should Phase 2 focus on?
# - Any blockers?
```

---

## Key Files to Know

### Frontend

- **`frontend/src/app/dashboard/page.tsx`** — Dashboard UI (you'll create/modify)
- **`frontend/src/lib/api.ts`** — Fetch wrapper with types
- **`frontend/src/app/auth/login/page.tsx`** — Already scaffolded, needs finishing

### Database

- **Supabase URL**: `https://kzcdbnznpshplbikbgub.supabase.co`
- **Anon Key**: In `frontend/.env` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Service Role**: In `.env` as `SUPABASE_SERVICE_ROLE_KEY`

### Deployment

- **Vercel**: https://vercel.com/teams/agora-labs/clawcortex
- **Auto-deploy**: Git push to `main` → Vercel deploys
- **Domains**: https://clawcortex.vercel.app (or custom domain)

---

## Commands (Cheat Sheet)

```bash
# Development
npm run dev --prefix frontend            # Start frontend (port 3000)

# Build & Test
npm run build --prefix frontend          # Build
npm test --prefix frontend               # Run tests

# Git
git status                               # Check changes
git add .                                # Stage changes
git commit -m "feat: description"        # Commit
git push origin feat/branch-name         # Push feature branch
git pull origin main                     # Update main
git merge feat/branch-name               # Merge locally before push

# Vercel (if using CLI)
vercel --prod                            # Deploy to production
vercel logs                              # View logs

# OpenClaw / Cost Tracking
openclaw status                          # Check model (should be Haiku)
```

---

## Success Metrics

At the end of this session, you should have:

✅ **Dashboard UI**
- Agents displayed (from Supabase)
- Tasks displayed (from Supabase)
- Responsive design
- No console errors

✅ **Clean Git History**
- Commits are atomic + descriptive
- All code in GitHub
- No secrets exposed

✅ **Vercel Deployment**
- ✅ https://clawcortex.vercel.app loads
- ✅ No build errors
- ✅ Dashboard accessible

✅ **Documentation**
- Updated README if needed
- Added comments to complex code
- Documented new endpoints

---

## Blockers to Watch

| Risk | Mitigation |
|------|------------|
| **Supabase RLS policy blocks queries** | Test with anon key; may need to update RLS policies |
| **TypeScript compilation errors** | Add proper types to all responses (see Phase 1 checklist) |
| **Vercel build fails** | Check Root Directory = `frontend`, verify Next.js is in dependencies |
| **API performance slow** | Check Supabase logs for missing indexes; optimize N+1 queries |
| **Model costs spike** | Verify model is still Haiku; avoid Sonnet for routine tasks |

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Supabase Realtime**: https://supabase.com/docs/guides/realtime
- **React Query**: https://tanstack.com/query/latest (for caching + sync)
- **TypeScript**: https://www.typescriptlang.org/docs

---

## Start Here

1. **Verify systems** (5 min):
   ```bash
   cat /data/.openclaw/workspace/projects/ClawCortex/SYSTEMS-CHECK.md
   # Run through the checklist
   ```

2. **Read setup context** (10 min):
   ```bash
   cat /data/.openclaw/workspace/projects/ClawCortex/SETUP-LOG.md
   # Review what we built and why
   ```

3. **Start building** (this session):
   ```bash
   cd /data/.openclaw/workspace/projects/ClawCortex
   git checkout -b feat/dashboard-ui
   # Follow Phase 1 checklist above
   ```

---

## Fresh Chat Instructions

When starting a new chat:

1. Read this file (you're reading it now)
2. Read `/data/.openclaw/workspace/MEMORY.md` (current state)
3. Read `/data/.openclaw/workspace/memory/2026-02-22.md` (today's log)
4. Verify systems with `SYSTEMS-CHECK.md`
5. Execute Phase 1 of the MVP (Dashboard UI)
6. Commit every working feature
7. Measure, analyze, decide on next phase

---

**You're ready. Build autonomously. Ship daily. Keep it simple.**

🚀 **Let's build ClawCortex.**
