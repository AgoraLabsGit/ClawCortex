# ClawCortex SaaS Development Roadmap

**Vision**: AI Operating System for Business Operations  
**Timeline**: 16 weeks (MVP → Scale)  
**Status**: Week 0 (Architecture complete, prototype built)

***

## Phase 0: Foundation (Week 0 - Complete ✅)

**Goal**: Validate architecture, build visual prototype

### Completed
- ✅ Architecture locked (ARCHITECTURE-V2.md v2.0)
- ✅ PRD finalized (single-user MVP → multi-user scale path)
- ✅ BMAD integration (HALT protocol, status taxonomy, quality gates)
- ✅ Sub-agent spawning verified (6 sessions working)
- ✅ Visual prototype (Dashboard + Projects + Settings)
- ✅ Git repositories synced (Claw_Team, ClawCortex)

### Artifacts
- `/docs/ARCHITECTURE-V2.md` (16 sections)
- `/docs/PRD.md` (MVP + Phase 2 roadmap)
- `/docs/BMAD-INTEGRATION.md`
- Working Next.js prototype (localhost)

***

## Phase 1: Single-User MVP (Weeks 1-4)

**Goal**: Fully functional ClawCortex for Alex (single operator)

**Ship Date**: March 22, 2026

### Week 1: Core UI + Real Data

**Backend Setup** (Days 1-2):
- [ ] Supabase database schema
  - `projects` table
  - `tasks` table  
  - `activity_log` table
  - `workflow_runs` table
- [ ] Seed database with ClawCortex + Localist projects
- [ ] Create Supabase RLS policies (user-scoped queries)

**Frontend Integration** (Days 3-5):
- [ ] Supabase client setup (`@supabase/supabase-js`)
- [ ] GitHub API integration (Octokit)
  - Read from `AgoraLabsGit/Claw_Team` repo
  - Parse memory logs (`/memory/YYYY-MM-DD.md`)
  - Fetch project docs (PRD, ARCHITECTURE)
- [ ] Replace mock data with real data
  - Activity feed → Supabase `activity_log`
  - Projects → Supabase `projects`
  - Docs → GitHub API

**Deliverable**: Dashboard shows real activity from workspace

***

### Week 2: Project Detail Pages + Workflows

**Project Detail** (Days 1-2):
- [ ] Overview tab (stats, GitHub link, health indicators)
- [ ] Docs tab (fetch from GitHub, display with syntax highlighting)
- [ ] Tasks tab (Kanban board: backlog → in-progress → review → done)
- [ ] Activity tab (project-scoped feed from Supabase)

**Workflow Foundation** (Days 3-5):
- [ ] Create workflow YAML definitions
  - `feature-development.yaml`
  - `bug-fix.yaml`
  - `bmad-planning.yaml`
- [ ] Store in `/data/.openclaw/workspace/workflows/`
- [ ] Henry reads YAML, spawns sub-agents per workflow
- [ ] UI: "Run Workflow" button (hardcoded 3 workflows)

**Deliverable**: Click ClawCortex → See docs, tasks, run workflow

***

### Week 3: Real-Time Updates + Agent Integration

**Real-Time** (Days 1-2):
- [ ] Supabase Realtime subscriptions
  - Activity feed auto-updates (no page refresh)
  - Task status changes propagate instantly
- [ ] WebSocket to OpenClaw Gateway
  - Agent status (idle/running/halted)
  - Display in UI (agent status indicator)

**Agent Logging** (Days 3-4):
- [ ] Update sub-agent prompts (Builder, Review, Sync)
  - Log to Supabase `activity_log` on actions
  - Use exact status taxonomy (backlog → done)
- [ ] Test full flow:
  - Henry spawns Builder
  - Builder logs to Supabase
  - UI shows real-time update

**Error Handling** (Day 5):
- [ ] HALT protocol UI implementation
  - Error badge on project cards
  - HALT detail modal (reason, context, actions)
  - Retry/Skip/Resolve buttons

**Deliverable**: Real-time activity feed, agent status visible, HALT handling works

***

### Week 4: Polish + Deploy

**UI Polish** (Days 1-2):
- [ ] Mobile responsive (test on viewport 320px → 1920px)
- [ ] Loading states (skeleton screens)
- [ ] Empty states (no projects, no activity)
- [ ] Error states (API failures, network issues)
- [ ] Keyboard navigation (accessibility)

**Settings Page** (Day 3):
- [ ] User profile (username, email—read-only for MVP)
- [ ] Integrations status (GitHub, Supabase, OpenClaw—all connected)
- [ ] Test connection buttons (verify API access)

**Deployment** (Days 4-5):
- [ ] Deploy frontend to Vercel
  - Environment variables (Supabase keys, GitHub token)
  - Custom domain: `app.clawcortex.com`
- [ ] Configure OpenClaw Gateway for remote access (Phase 1B)
  - Switch to `remote` mode
  - Token auth enabled
  - Cloudflare Tunnel (optional, for security)
- [ ] End-to-end testing (Vercel → OpenClaw → Supabase)

**Deliverable**: Live MVP at `app.clawcortex.com`, Alex can use daily

***

## Phase 2: Multi-User + Workflows (Weeks 5-8)

**Goal**: Scale to 3-5 beta users, workflow library

**Ship Date**: April 19, 2026

### Week 5: Authentication + Multi-User

**Auth System** (Days 1-3):
- [ ] Supabase Auth setup
  - Email/password signup
  - JWT tokens
  - Session management
- [ ] Signup flow UI (`/auth/signup`, `/auth/login`)
- [ ] User table migration
  - Link projects to user_id
  - RLS policies (users see only their data)

**Workspace per User** (Days 4-5):
- [ ] Create "cortex" repo per user on signup
  - Fork template: `AgoraLabsGit/cortex-template`
  - Initialize structure (projects/, agents/, workflows/)
- [ ] OpenClaw instance per user (or shared with user sessions)
- [ ] Link user → cortex repo in database

**Deliverable**: 3 beta users can sign up, each has isolated workspace

***

### Week 6: Workflow Library UI

**Workflow Templates** (Days 1-2):
- [ ] Create 8 workflow templates:
  - **Development**: Feature Dev, Bug Fix, BMAD Planning, Release Cycle
  - **Marketing**: Content Creation, Campaign Launch
  - **Operations**: Daily Standup, Analytics Review
- [ ] Store in global `/workflows/` directory (YAML)

**Workflow Picker UI** (Days 3-5):
- [ ] "Run Workflow" modal
  - Show available workflows (with descriptions)
  - Preview steps (agent assignments, estimated time)
- [ ] Workflow configuration
  - Parameter inputs (tech stack, review agent, etc.)
  - Save as project workflow instance
- [ ] Workflow execution view
  - Progress bar (Step 2/5: Code Review in progress)
  - Real-time step updates
  - HALT handling (pause, resolve, resume)

**Deliverable**: Users can browse workflows, configure, and run

***

### Week 7: Project Workflow Instances

**Database Schema** (Day 1):
- [ ] `workflows` table (global templates)
- [ ] `project_workflows` table (instances with overrides)
- [ ] `workflow_runs` table (execution history)

**Project Workflows** (Days 2-4):
- [ ] Project detail page: "Workflows" tab
  - List configured workflows (Feature Dev, Bug Fix, etc.)
  - Run count, success rate, last used timestamp
- [ ] Configure workflow for project
  - Override parameters (tech stack: "Next.js" vs "React Native")
  - Assign agents (Builder vs SeniorBuilder)
  - Save instance

**Workflow History** (Day 5):
- [ ] View past workflow runs
  - Status (success/failed/halted)
  - Duration, steps completed
  - Drill into logs (per-step output)

**Deliverable**: Projects have configured workflows, run history visible

***

### Week 8: Advanced Features

**Agent Management UI** (Days 1-2):
- [ ] `/agents` page
  - List all agents (Master, Dev, Marketing, Sales)
  - Agent cards: model, specialization, projects assigned
  - Status indicator (idle/running)
- [ ] Assign agents to projects
  - Drag-drop or dropdown
  - Save to `project_agents` table

**Analytics Dashboard** (Days 3-4):
- [ ] Token usage tracking
  - Per-agent, per-project, per-workflow
  - Cost calculations (Sonnet vs Haiku)
- [ ] Performance metrics
  - Task completion time (p50, p95)
  - Workflow success rate
  - Agent efficiency (tasks/hour)

**Notifications** (Day 5):
- [ ] In-app notifications (bell icon)
  - Workflow completed
  - HALT requires attention
  - Task assigned to you
- [ ] Email digests (optional, daily summary)

**Deliverable**: Beta users have full workflow + agent management

***

## Phase 3: Scale + Marketplace (Weeks 9-12)

**Goal**: 50+ users, workflow marketplace, revenue

**Ship Date**: May 17, 2026

### Week 9: Billing + Pricing

**Stripe Integration** (Days 1-3):
- [ ] Pricing tiers:
  - **Free**: 1 project, 10 workflow runs/month
  - **Pro** ($69/mo): 5 projects, unlimited runs, priority agents
  - **Team** ($199/mo): 20 projects, team collaboration, custom agents
- [ ] Checkout flow (`/pricing` → Stripe → subscription)
- [ ] Subscription management (`/settings/billing`)
  - Cancel, upgrade, downgrade
  - Usage tracking (show limits)

**Metering** (Days 4-5):
- [ ] Track workflow runs per user
- [ ] Enforce limits (block runs if over quota)
- [ ] Upgrade prompts ("You've used 10/10 runs—upgrade to Pro")

**Deliverable**: Paid subscriptions working, revenue starting

***

### Week 10: Workflow Marketplace

**Marketplace UI** (Days 1-3):
- [ ] `/marketplace` page
  - Browse public workflows (categories: Dev, Marketing, Sales)
  - Search + filters (by category, popularity, rating)
  - Workflow detail page (description, steps, reviews)
- [ ] Install workflow
  - "Add to My Workflows" button
  - Configure for your project
  - Fork (if customization needed)

**Publishing** (Days 4-5):
- [ ] "Publish Workflow" button (on custom workflows)
  - Make public (visible in marketplace)
  - Add description, tags, pricing (free or paid)
- [ ] Revenue sharing (optional, Phase 4)
  - Creators earn 70% on paid workflows
  - ClawCortex takes 30%

**Deliverable**: Users can share/discover workflows, network effects begin

***

### Week 11: Team Collaboration

**Multi-User Projects** (Days 1-3):
- [ ] Invite team members (`/projects/[id]/settings`)
  - Send email invite
  - Assign roles (Owner, Editor, Viewer)
- [ ] Permissions (RBAC)
  - Owners: Full access
  - Editors: Run workflows, edit tasks
  - Viewers: Read-only
- [ ] Activity attribution (show who did what)

**Comments** (Days 4-5):
- [ ] Task comments
  - Comment on task detail page
  - Mention users (@alex)
  - Real-time updates (Supabase Realtime)
- [ ] Workflow run comments
  - Discuss HALT issues
  - Tag team members for review

**Deliverable**: Teams can collaborate on projects, shared workspace

***

### Week 12: Performance + Scaling

**Optimization** (Days 1-2):
- [ ] Database indexes (Supabase)
  - Index on `project_id`, `user_id`, `created_at`
- [ ] Query optimization (reduce N+1 queries)
- [ ] Caching (Redis for activity feed, project metadata)

**Monitoring** (Days 3-4):
- [ ] Sentry (error tracking)
- [ ] Datadog (performance monitoring)
- [ ] Custom dashboards (agent uptime, API latency)

**Load Testing** (Day 5):
- [ ] Simulate 100 concurrent users
- [ ] Stress test workflow execution (50 parallel runs)
- [ ] Identify bottlenecks (OpenClaw concurrency, Supabase connections)

**Deliverable**: System handles 100+ users, <200ms API response time

***

## Phase 4: Enterprise + AI Coaching (Weeks 13-16)

**Goal**: Enterprise deals, AI-driven insights

**Ship Date**: June 14, 2026

### Week 13: Enterprise Features

**SSO + SAML** (Days 1-3):
- [ ] OAuth providers (Google, GitHub, Microsoft)
- [ ] SAML for enterprise SSO
- [ ] Admin panel (manage organization users)

**Advanced Permissions** (Days 4-5):
- [ ] Organization-level settings
- [ ] Department/team hierarchy
- [ ] Custom roles (beyond Owner/Editor/Viewer)

***

### Week 14: AI Coaching Layer

**Meta-Learning** (Days 1-3):
- [ ] Analyze workflow runs (success/failure patterns)
- [ ] AI suggestions:
  - "Tasks assigned to Builder take 20% longer—consider using FastBuilder"
  - "Code reviews find 5+ issues 80% of the time—improve unit tests"
- [ ] Display in dashboard ("Insights" widget)

**Workflow Optimization** (Days 4-5):
- [ ] Auto-tune parameters (agent selection, timeouts)
- [ ] A/B testing workflows (compare success rates)
- [ ] Recommend workflow changes ("Add QA step to reduce bugs")

***

### Week 15: Marketing + Sales Workflows

**Marketing Agents** (Days 1-3):
- [ ] Content Writer (blog posts, social media)
- [ ] SEO Specialist (keyword research, optimization)
- [ ] Social Media Manager (schedule posts, engage)
- [ ] 5 marketing workflows (content calendar, campaign launch, etc.)

**Sales Agents** (Days 4-5):
- [ ] Outreach Specialist (email campaigns, LinkedIn)
- [ ] CRM Manager (sync leads, update pipelines)
- [ ] 3 sales workflows (lead qualification, demo follow-up, deal close)

***

### Week 16: Launch Prep

**Marketing Site** (Days 1-2):
- [ ] Landing page (`clawcortex.com`)
  - Hero, features, pricing, testimonials
  - Demo video (2 min walkthrough)
- [ ] Blog (technical content, case studies)

**Documentation** (Days 3-4):
- [ ] User guide (`docs.clawcortex.com`)
  - Getting started, workflows, agents, integrations
- [ ] API docs (for custom integrations)
- [ ] Video tutorials (YouTube)

**Launch** (Day 5):
- [ ] Product Hunt launch
- [ ] Twitter/LinkedIn announcements
- [ ] Email to beta waitlist (500+ signups)
- [ ] Press release (TechCrunch, The Verge)

**Deliverable**: Public launch, 100+ signups in first week

***

## Success Metrics

### Phase 1 (Week 4)
- ✅ Alex uses ClawCortex daily (replace manual GitHub/Discord checks)
- ✅ 1+ workflow run per day (validate agent system)
- ✅ <1s dashboard load time (Lighthouse 85+)

### Phase 2 (Week 8)
- 🎯 5 beta users active (3+ workflow runs/week)
- 🎯 80%+ workflow success rate (low HALT failures)
- 🎯 NPS 50+ (user satisfaction)

### Phase 3 (Week 12)
- 🎯 50 users (10 paying, $690 MRR)
- 🎯 10 workflows in marketplace (3+ installs each)
- 🎯 40% Day 30 retention

### Phase 4 (Week 16)
- 🎯 200 users (40 paying, $2,760 MRR)
- 🎯 5 enterprise pilots ($199/mo tier)
- 🎯 Featured on Product Hunt (Top 5)

***

## Tech Stack Evolution

### Phase 1 (MVP)
- Frontend: Next.js 14, Shadcn/ui, TanStack Query
- Backend: OpenClaw Gateway (Railway), Supabase
- Hosting: Vercel (frontend), Railway (OpenClaw)

### Phase 2 (Scale)
- Add: Redis (caching), Cloudflare Tunnel (security)
- Monitoring: Sentry, Datadog

### Phase 3 (Enterprise)
- Add: Auth0 (SSO/SAML), Stripe (billing)
- Infrastructure: Kubernetes (multi-tenant isolation)

### Phase 4 (AI Coaching)
- Add: Vector DB (Pinecone for meta-learning)
- ML: Fine-tuned models (workflow optimization)

***

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **OpenClaw instability** | Self-host OpenClaw, contribute to upstream, have fallback (direct LLM API) |
| **GitHub rate limits** | Cache aggressively, use webhooks instead of polling |
| **Supabase free tier limits** | Upgrade to Pro ($25/mo) at 10 users, monitor usage |
| **Agent cost explosion** | Use Haiku for simple tasks, Sonnet for complex, enforce token budgets |
| **User churn** | Weekly value delivery (ship features fast), NPS surveys, 1-on-1 calls |

***

## Team Allocation

### Weeks 1-4 (MVP)
- **Alex** (Product): PRD updates, user testing
- **Henry** (Orchestrator): Backend logic, agent coordination
- **Builder Agent**: Frontend + backend implementation
- **Review Agent**: Code quality, testing

### Weeks 5-8 (Multi-User)
- Add: **Marketing Agent** (landing page, docs)
- Add: **Sales Agent** (beta onboarding, demos)

### Weeks 9-16 (Scale)
- Consider: Human engineer (if agent velocity drops)
- Consider: Designer (if UI needs custom work)

***

## Next Session Prep

**Immediate Actions** (Tonight):
1. ✅ Finish prototype (Project detail + Settings pages)
2. ✅ Test full navigation flow (Dashboard → Projects → Settings)
3. ✅ Commit to ClawCortex repo

**Tomorrow (Monday)**:
1. 📋 Set up Supabase project (database schema)
2. 📋 Seed projects table (ClawCortex, Localist)
3. 📋 Wire activity feed to real Supabase data

**This Week (Target: Friday EOD)**:
- Complete Week 1 tasks (Core UI + Real Data)
- Deploy to Vercel (staging environment)
- Begin Week 2 (Project detail pages)

***

**Roadmap Status**: 🟢 Ready to execute

**Estimated Effort**: 640 hours (16 weeks × 40 hours)

**With AI agents**: 160-240 hours human oversight (4x-10x productivity multiplier)

**Ship Date**: June 14, 2026 (16 weeks from today)

***

Does this roadmap match your vision? Should we adjust timelines, features, or priorities?
