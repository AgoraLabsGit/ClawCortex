# ClawCortex — AI Agent Workspace SaaS

Operating system for autonomous AI teams. Unified dashboard + real-time orchestration + meta-learning layer.

## Structure

```
ClawCortex/
├── frontend/          # Next.js 14 PWA (Vercel)
├── backend/           # Fastify API (Railway)
├── docs/              # BMAD specifications
├── stories/           # Sprint tracking
└── supabase/          # Database migrations
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Shadcn/ui, TanStack Query, PWA
- **Backend**: Fastify, TypeScript, Octokit (GitHub), WebSocket (ws)
- **Database**: PostgreSQL 15 (Supabase)
- **Auth**: Supabase Auth (JWT)
- **Hosting**: Vercel (frontend), Railway (backend)
- **Real-time**: WebSocket

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Run development
npm run dev:frontend &
npm run dev:backend &

# Vercel deploy
npm run deploy:frontend

# Railway deploy
npm run deploy:backend
```

## BMAD Workflow

This project follows Spec-Driven Development (SDD):
- `docs/prd.md` — Product specification
- `docs/architecture.md` — Technical design
- `stories/` — Tracked work items

See `docs/BMAD.md` for full workflow.

## Status

🎯 **Phase 0** (Feb 22-28): Rapid prototyping + spec generation  
- [ ] UI prototype (React components)
- [ ] Backend skeleton (Fastify + GitHub sync)
- [ ] PRD generated + locked
- [ ] Architecture designed

## Team

- **Henry** (Orchestrator)
- **Architects** (Tech design)
- **Frontend Dev** (React/Next.js)
- **Backend Dev** (Fastify/Node.js)
- **QA** (Testing + validation)

---

**Last Updated**: 2026-02-22 15:22 GMT-3  
**Next**: Generate PRD + start UI prototype
