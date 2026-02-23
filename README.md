# ClawCortex — AI Agent Workspace SaaS

**AI Operating System for Business Operations**  
Unified dashboard for autonomous AI teams running development, marketing, sales, and operations workflows.

---

## Architecture

```
ClawCortex/
├── frontend/          # Next.js 14 dashboard (Vercel)
├── docs/              # Architecture, PRD, sprints
├── sprints/           # Sprint tracking (SPRINT-001, SPRINT-002, ...)
└── supabase/          # Database schema
```

**Backend**: OpenClaw Gateway (self-hosted on Hostinger VPS)  
**Database**: PostgreSQL 15 (Supabase)  
**Agent Orchestration**: Henry (Claude Sonnet 4.5) via OpenClaw  

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: Shadcn/ui + Tailwind CSS
- **State**: TanStack Query (server state)
- **Real-time**: Supabase Realtime + WebSocket to OpenClaw
- **Hosting**: Vercel

### Backend
- **Agent Runtime**: OpenClaw (local mode on Hostinger VPS)
- **Orchestrator**: Henry (Claude Sonnet 4.5)
- **Sub-Agents**: Builder, Review, Sync (ephemeral sessions)
- **API**: OpenClaw Gateway (port 3000, token auth)

### Database
- **PostgreSQL 15** (Supabase)
- **Tables**: projects, tasks, activity_log, workflow_runs
- **Auth**: Supabase Auth (JWT) - Phase 2
- **Real-time**: Supabase Realtime subscriptions

### Integrations
- **GitHub**: Octokit (read repos, parse docs)
- **Supabase**: `@supabase/supabase-js`
- **OpenClaw**: WebSocket + REST API

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (free tier)
- GitHub account
- OpenClaw instance (see [OpenClaw setup](https://github.com/ErwanLorteau/openclaw))

### Installation

```bash
# Clone repository
git clone https://github.com/AgoraLabsGit/ClawCortex.git
cd ClawCortex

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Add your keys to .env.local:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# GITHUB_TOKEN=your_github_token
# OPENCLAW_GATEWAY_URL=http://your-vps-ip:3000
# OPENCLAW_AUTH_TOKEN=your_openclaw_token
```

### Development

```bash
# Run frontend (localhost:3000)
npm run dev

# Open browser
open http://localhost:3000
```

### Deployment

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - GITHUB_TOKEN
# - OPENCLAW_GATEWAY_URL
# - OPENCLAW_AUTH_TOKEN
```

---

## Project Status

### Current Phase: MVP Development (Weeks 1-4)

**Sprint 001** (Feb 22, 2026): UI Navigation Structure 🟡 In Progress
- [ ] 5-page navigation (Dashboard, Projects, Workflows, Agents, Settings)
- [ ] Project detail pages
- [ ] Dark mode theming
- [ ] Mobile responsive

**Sprint 002** (Week 1): Real Data Integration
- [ ] Supabase database setup
- [ ] GitHub API integration
- [ ] Real-time activity feed
- [ ] Replace mock data

**Target Launch**: March 22, 2026 (single-user MVP)

### Roadmap

- **Phase 1** (Weeks 1-4): Single-user MVP - Dashboard + Projects + Real-time updates
- **Phase 2** (Weeks 5-8): Multi-user + Workflows - Auth + Workflow library + Instances
- **Phase 3** (Weeks 9-12): Scale + Marketplace - Billing + Workflow marketplace + Teams
- **Phase 4** (Weeks 13-16): Enterprise + AI Coaching - SSO + Meta-learning + Launch

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for full timeline.

---

## Architecture

### BMAD Integration

ClawCortex follows BMAD OpenClaw patterns:
- **HALT Protocol**: Structured error handling (reason + context + actions)
- **Status Taxonomy**: Exact task states (backlog → ready-for-dev → in-progress → review → done → blocked)
- **Quality Gates**: Adversarial code review (minimum 3 issues before approval)
- **Ephemeral Sub-Agents**: On-demand spawning (Builder, Review, Sync)

Reference: [`bmad-reference/`](https://github.com/ErwanLorteau/BMAD_Openclaw) (cloned locally)

### Key Documents

- [`docs/ARCHITECTURE-V2.md`](docs/ARCHITECTURE-V2.md) - System design (16 sections)
- [`docs/PRD.md`](docs/PRD.md) - Product requirements
- [`sprints/SPRINT-001-UI-NAVIGATION.md`](sprints/SPRINT-001-UI-NAVIGATION.md) - Current sprint
- [`NEXT-SESSION-PROMPT.md`](NEXT-SESSION-PROMPT.md) - Session continuity

---

## Agent Team

### Master Agent
- **Henry** (Claude Sonnet 4.5) - Orchestrator, spawns sub-agents, manages workflow

### Sub-Agents (Ephemeral)
- **Builder** (Claude Sonnet) - Implements features (red-green-refactor)
- **Review** (Claude Sonnet) - Adversarial code review (minimum 3 issues)
- **Sync** (Claude Haiku) - Workspace → GitHub bidirectional sync

### Phase 2 Agents (Planned)
- **Tester** - E2E testing, visual regression
- **Deployer** - CI/CD, Vercel deployment
- **Content Writer** - Marketing content
- **SEO Specialist** - Keyword research, optimization
- **Outreach Specialist** - Sales campaigns

See [`brain/prompts/`](https://github.com/AgoraLabsGit/Claw_Team/tree/main/brain/prompts) for agent prompts.

---

## Development Workflow

### Sprint Cycle (2-hour sprints)

1. **Plan**: Read sprint doc (`sprints/SPRINT-XXX.md`)
2. **Build**: Execute tasks (ClawBot + Henry)
3. **Test**: Verify acceptance criteria
4. **Deploy**: Commit + push to GitHub
5. **Review**: Fill sprint retrospective

### Daily Workflow

1. Check [`NEXT-SESSION-PROMPT.md`](NEXT-SESSION-PROMPT.md) for today's tasks
2. Open ClawCortex dashboard (`localhost:3000`)
3. Review activity feed (what agents did overnight)
4. Assign tasks to Henry (via OpenClaw Control UI)
5. Monitor real-time progress in ClawCortex UI
6. Review completed work, merge PRs

---

## Contributing

### For Beta Users (Phase 2)

Interested in early access? Join the waitlist:
- Email: alex@agoralabs.com
- Twitter: [@ClawCortex](https://twitter.com/ClawCortex)

### For Developers

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Standards**:
- TypeScript strict mode (no `any`)
- ESLint + Prettier
- Unit tests for functions
- Integration tests for APIs

---

## Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/AgoraLabsGit/ClawCortex/issues)
- **Email**: alex@agoralabs.com
- **Workspace**: [Claw_Team](https://github.com/AgoraLabsGit/Claw_Team) (meta-learning repo)

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

**Last Updated**: February 22, 2026, 10:04 PM -03  
**Current Sprint**: [SPRINT-001-UI-NAVIGATION.md](sprints/SPRINT-001-UI-NAVIGATION.md)  
**Status**: 🟡 MVP Phase 1 (Weeks 1-4)  
**Next Milestone**: Single-user dashboard live (March 22, 2026)
