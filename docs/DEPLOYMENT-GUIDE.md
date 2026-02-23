# ClawCortex Deployment Guide

**Complete setup guide for deploying ClawCortex to production.**

**Stack:**
- **Frontend**: Next.js 14 (PWA) → Vercel
- **Database**: PostgreSQL → Supabase (managed, with pooling)
- **AI Orchestration**: OpenClaw Gateway → Hostinger VPS
- **Version Control**: GitHub

**Time to Deploy**: ~15 minutes (following this guide end-to-end)

---

## ⚡ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   ClawCortex Stack                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  GitHub (Source Control)                                │
│      ↓ (webhook on push)                                │
│  Vercel (Frontend: Next.js 14, Root: frontend/)         │
│      ↓ (REST API calls)                                 │
│  Supabase (PostgreSQL + Auth + Realtime)               │
│      ↓ (Service Role Key access)                        │
│  Hostinger VPS (OpenClaw Gateway, Haiku Model)         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- ✅ No separate backend API — use Supabase REST API + OpenClaw for orchestration
- ✅ Pooled PostgreSQL connections (port 6543, not 5432)
- ✅ Haiku model for cost optimization (~$1-5/day vs $75+/day on Sonnet)
- ✅ Vercel integrations for auto-synced credentials

---

## Prerequisites

- [ ] GitHub account with repo access (https://github.com/AgoraLabsGit/ClawCortex)
- [ ] Vercel account (free tier sufficient)
- [ ] Supabase account (free tier sufficient)
- [ ] Hostinger VPS with OpenClaw running (or alternative agent host)
- [ ] Git installed locally
- [ ] Node.js 18+ installed
- [ ] Anthropic API key (Claude Haiku) or OpenAI key

---

## Phase 1: GitHub Repository Setup (2 minutes)

### 1.1 Clone Repository

```bash
git clone https://github.com/AgoraLabsGit/ClawCortex.git
cd ClawCortex
```

### 1.2 Clean Repository Structure

Ensure your repo has this minimal structure:

```
ClawCortex/
├── frontend/
│   ├── package.json          # Must include "next" in dependencies
│   ├── src/
│   │   └── app/
│   ├── .env                  # Local dev (git ignored)
│   └── .env.example          # Template
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── docs/
├── .env                      # Project root (git ignored)
├── .env.example
├── .gitignore                # Exclude .env, node_modules
├── SETUP-LOG.md              # What we did to build this
└── README.md
```

### 1.3 Remove Old Deployment Artifacts

```bash
# Clean up any conflicting configs
git rm -f vercel.json railway.json .railway-project-id
git rm -f *_deploy.sh *_setup.sh

# Commit
git commit -m "chore: clean deployment artifacts for fresh setup"
git push origin main
```

---

## Phase 2: Vercel Frontend Deployment (3 minutes)

### 2.1 Create Vercel Project

1. Go to https://vercel.com/new
2. **Import Git Repository** → Select `AgoraLabsGit/ClawCortex`
3. **Configure Project:**
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `frontend` ⚠️ **CRITICAL**
   - **Build Command**: (leave default, or `npm run build`)
   - **Output Directory**: (leave default, `.next`)
4. **Do NOT add environment variables yet** — we'll use integrations
5. Click **Deploy**

### 2.2 Wait for Build

- First build takes ~2-3 minutes
- If build fails with TypeScript errors:
  - Check `frontend/package.json` has `"next"` in dependencies
  - Verify all TypeScript types are correct (see Phase 3)
  - Fix code locally and push again
- Once ✅ green checkmark appears, proceed to Phase 3

**⚠️ Common Issues:**

| Issue | Fix |
|-------|-----|
| Build fails: `Could not identify Next.js version` | Check Root Directory = `frontend` |
| TypeScript error: `Type 'response' is of type 'unknown'` | Add generic type parameter to `fetchAPI<ResponseType>()` |
| Build succeeds but app doesn't load | Check console for runtime errors, verify API URL in env vars |

---

## Phase 3: TypeScript & API Type Safety (1 minute)

### 3.1 Fix Type Errors

This project uses a generic `fetchAPI<T>()` function. All API calls MUST include the response type:

**✅ Correct:**
```typescript
interface LoginResponse {
  token: string;
}

const response = await fetchAPI<LoginResponse>("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

// response.token is properly typed
localStorage.setItem("token", response.token);
```

**❌ Wrong:**
```typescript
// This causes: Type 'response' is of type 'unknown'
const response = await fetchAPI("/auth/login", { ... });
localStorage.setItem("token", response.token); // Error!
```

### 3.2 Verify Across Project

Before proceeding, search your codebase:

```bash
grep -r "fetchAPI(" frontend/src --include="*.tsx" --include="*.ts" | grep -v "fetchAPI<"
```

Any matches without `<Type>` need to be fixed.

---

## Phase 4: Supabase Database Setup (2 minutes)

### 4.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. **Configuration:**
   - **Name**: `clawcortex` (or your project name)
   - **Database Password**: Generate strong password (⚠️ save it!)
   - **Region**: South America (São Paulo) or closest to your users
   - **Plan**: Free tier is fine
4. Click **"Create Project"** (takes ~2 minutes)

### 4.2 Get Credentials

Once ready, go to **Settings → API** and copy:

```bash
# Project URL
SUPABASE_URL=https://[project-id].supabase.co

# Anon key (safe for frontend)
SUPABASE_ANON_KEY=eyJhbGci...

# Service role key (admin, backend ONLY)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

Also from **Settings → Database → Connection Pooling**:

```bash
# Pooled connection (port 6543, NOT 5432)
POSTGRES_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
```

**⚠️ Security Rules:**
- ✅ `SUPABASE_ANON_KEY` → Safe in frontend code as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` → Backend only (Vercel production, OpenClaw)
- ❌ Never expose service role key to frontend
- ❌ Never hardcode database password in code

### 4.3 Run Database Migration

Create the `agents` and `tasks` tables. **Choose one method:**

**Option A: Direct SQL (via Supabase UI)**

1. Go to your Supabase project → **SQL Editor** → **New Query**
2. Paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'idle',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

3. Click **Run** (or Cmd/Ctrl + Enter)

**Option B: Programmatic (Node.js + pg client)**

```bash
# From project root
node << 'EOF'
const { Client } = require('pg');

const client = new Client({
  connectionString: 'your-postgres-url-from-supabase',
  ssl: { rejectUnauthorized: false } // For development
});

(async () => {
  await client.connect();
  console.log('✅ Connected');
  
  const sql = `
    CREATE TABLE agents (...);
    CREATE TABLE tasks (...);
  `;
  
  await client.query(sql);
  console.log('✅ Tables created');
  await client.end();
})();
EOF
```

### 4.4 Verify Tables

Go to **Table Editor** in Supabase dashboard. You should see:
- `agents` table (id, name, role, status, created_at)
- `tasks` table (id, agent_id, title, status, created_at)

---

## Phase 5: Connect Vercel + Supabase (2 minutes)

### 5.1 Add Environment Variables to Vercel

1. Go to **Vercel Dashboard → Settings → Environment Variables**
2. Add these variables (choose: Production / Preview / Development scopes):

```bash
# Public (can expose to browser)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Private (production only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

3. Click **Save**
4. Trigger redeploy: **Deployments → [Latest] → ⋯ → Redeploy**

### 5.2 Verify Deployment

Wait ~1-2 minutes, then:

1. Visit your Vercel URL (e.g., `https://clawcortex.vercel.app`)
2. Open browser console (F12)
3. Check for errors
4. If Supabase client initializes, you'll see: `✅ Supabase connected`

---

## Phase 6: Connect OpenClaw (Hostinger VPS) (2 minutes)

### 6.1 Get Supabase Credentials

From Supabase → Settings → API, copy:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 6.2 Update Hostinger OpenClaw

**Method A: Via SSH + config file**

```bash
# SSH into Hostinger VPS
ssh root@your-vps-ip

# Edit OpenClaw config
nano ~/.openclaw/openclaw.json

# Find "environment" section, add:
{
  "environment": {
    "SUPABASE_URL": "https://xxx.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGci...",
    "GITHUB_TOKEN": "ghp_xxx",        # For git operations
    "VERCEL_TOKEN": "xxx",             # For Vercel deployments (optional)
  }
}

# Save (Ctrl+X, then Y, then Enter)

# Restart gateway
openclaw gateway restart
```

**Method B: Via OpenClaw UI**

1. Visit OpenClaw gateway dashboard (http://your-vps-ip:8080)
2. Go to **Settings → Environment Variables**
3. Add the three variables above
4. Click **Save & Restart**

### 6.3 Verify Connection

```bash
# From OpenClaw (test Supabase connectivity)
curl -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  https://your-project.supabase.co/rest/v1/agents

# Expected: Empty array or list of agents (JSON)
```

---

## Phase 7: End-to-End Verification (1 minute)

### 7.1 Test Each Layer

```bash
# 1. Frontend loads
curl https://clawcortex.vercel.app
# Expected: HTML response with "ClawCortex" in title

# 2. Supabase REST API works
curl -H "apikey: $SUPABASE_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/agents
# Expected: JSON response (empty array or data)

# 3. OpenClaw gateway responds
curl http://your-vps-ip:8080/health
# Expected: {"status":"ok"}
```

### 7.2 Test Database from Frontend

In browser console on Vercel app:

```javascript
// This should work if Supabase client is configured
const { data, error } = await supabase.from('agents').select('*');
console.log(data); // Should show agents list (or empty)
```

### 7.3 Verify Logs

- **Vercel**: Deployments → [Latest] → Function Logs
- **Supabase**: Settings → Database → Logs
- **Hostinger**: `openclaw status` or SSH logs

---

## Phase 8: Cost Optimization (Critical!)

### 8.1 Switch to Haiku Model

This is crucial to avoid $75+/day spend on expensive models.

In OpenClaw config (`~/.openclaw/openclaw.json`):

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "model": {
          "primary": "anthropic/claude-haiku-4-5",
          "fallbacks": ["Claude"]
        }
      }
    ]
  }
}
```

**Impact:**
- Haiku: ~$0.001-0.01 per request
- Sonnet: ~$0.10-1.00 per request
- **Savings: ~90% reduction in API costs**

### 8.2 Verify Model Switch

```bash
openclaw status
# Should show: "Model: anthropic/claude-haiku-4-5"
```

---

## Troubleshooting

### Build Fails on Vercel: "Could not identify Next.js version"

**Cause**: Root Directory not set to `frontend`

**Fix**:
1. Go to Vercel → Settings → Build & Development Settings
2. Verify **Root Directory** = `frontend`
3. Click **Save**
4. Redeploy

---

### TypeScript Error: "Type 'response' is of type 'unknown'"

**Cause**: `fetchAPI()` called without generic type parameter

**Fix**:
```typescript
// Add interface
interface MyResponse {
  token: string;
  user: { id: string };
}

// Use with generic
const response = await fetchAPI<MyResponse>("/endpoint", options);
```

---

### Supabase Connection Fails: "ECONNREFUSED"

**Cause**: Using wrong Postgres URL format

**Fix**:
```bash
# ✅ Correct (pooler, port 6543)
postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require

# ❌ Wrong (direct connection, port 5432)
postgresql://postgres.xxx:password@aws-0-region.db.supabase.co:5432/postgres
```

---

### Supabase Project "Paused"

**Cause**: Free tier auto-pauses after 7 days inactivity

**Fix**:
1. Go to Supabase Dashboard → Settings → Pause
2. Click **Resume Project**
3. Wait ~1 minute for restart

---

### OpenClaw Can't Push to GitHub

**Cause**: GitHub token expired or missing permissions

**Fix**:
1. Generate new token: https://github.com/settings/tokens
2. Scopes needed: `repo` (full control)
3. Update in OpenClaw: `GITHUB_TOKEN=ghp_xxx`
4. Restart: `openclaw gateway restart`

---

## Final Architecture Diagram

```
┌──────────────┐
│   GitHub     │
│ (Source)     │
└────────┬─────┘
         │ (webhook: push → deploy)
         ↓
┌──────────────────────────────────┐
│   Vercel                         │
│   - Next.js 14 Frontend          │
│   - Env vars auto-injected       │
│   - URL: clawcortex.vercel.app   │
└────────┬─────────────────────────┘
         │ (HTTPS REST API)
         ↓
┌──────────────────────────────────┐
│   Supabase                       │
│   - PostgreSQL (pooled)          │
│   - agents + tasks tables        │
│   - RLS enabled                  │
│   - Region: us-east-2            │
└────────┬─────────────────────────┘
         │ (Service Role Key access)
         ↓
┌──────────────────────────────────┐
│   Hostinger VPS                  │
│   - OpenClaw Gateway             │
│   - Claude Haiku 4.5 (cheap)     │
│   - Orchestration + routing      │
└──────────────────────────────────┘
```

---

## Cost Breakdown

| Service | Free Tier | Monthly Cost | Notes |
|---------|-----------|--------------|-------|
| **GitHub** | Unlimited public | $0 | Includes private repos |
| **Vercel** | 100 GB bandwidth | $0-20 | Auto-scales, no downtime |
| **Supabase** | 500 MB DB + 2 GB bandwidth | $0-25 | Free tier sufficient for MVP |
| **Hostinger VPS** | N/A | $10-30 | Shared 4GB RAM plan |
| **Anthropic API (Haiku)** | Pay-as-you-go | $1-5/day | Haiku 4.5 (~$0.80/M input tokens) |

**Total Monthly**: $50-100 (mainly VPS + occasional API overages)

**vs. Sonnet (~$2,000+/month)**: Save $1,900+/month by using Haiku

---

## Next Steps After Deployment

1. ✅ Verify all systems responding (this guide covers it)
2. Create initial admin user in Supabase
3. Build dashboard that queries `agents` + `tasks` tables
4. Set up monitoring (Sentry for errors, UptimeRobot for uptime)
5. Configure custom domain (optional)
6. Enable SSL/HTTPS (auto on Vercel)
7. Set up automated backups (Supabase does this automatically)

---

## Quick Reference

```bash
# Check OpenClaw status
openclaw status

# View logs
openclaw logs --tail 50

# Restart gateway
openclaw gateway restart

# Test Supabase connection
curl -H "apikey: $SUPABASE_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/agents

# Tail Vercel logs (if using CLI)
vercel logs
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **OpenClaw Docs**: https://docs.openclaw.ai
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

**Last Updated**: 2026-02-22  
**Tested With**: Next.js 14.2.35, Node.js 22, Supabase PostgreSQL 14.1  
**Maintainer**: Henry (OpenClaw Agent)  
**Status**: ✅ Production Ready
