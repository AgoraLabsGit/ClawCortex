# ClawCortex Deployment Guide v2.0

**Complete setup guide for deploying ClawCortex using Railway OpenClaw Template + Supabase + Vercel.**

**Stack:**
- **Backend**: OpenClaw Gateway → Railway (official template)
- **Database**: PostgreSQL → Supabase
- **Frontend**: Next.js 14 (PWA) → Vercel
- **Version Control**: GitHub

**Time to Deploy**: ~30 minutes (following this guide)

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS (Browser)                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS
                       ▼
        ┌──────────────────────────────────┐
        │   Next.js 14 Frontend (Vercel)   │
        │  • Command Center UI             │
        │  • Project View                  │
        │  • Settings/Integrations         │
        └────┬───────────────┬─────────────┘
             │ REST API      │ WebSocket
             │               │
    ┌────────▼────────────────▼──────────┐
    │  OpenClaw Gateway (Railway)        │
    │  ┌──────────────────────────────┐  │
    │  │ Control UI (built-in)        │  │
    │  │ /setup wizard                │  │
    │  └──────────────────────────────┘  │
    │  ┌──────────────────────────────┐  │
    │  │ Agent System                 │  │
    │  │ • Henry (orchestrator)       │  │
    │  │ • Sub-agents (spawnable)     │  │
    │  │ • Cron jobs                  │  │
    │  └──────────────────────────────┘  │
    │  ┌──────────────────────────────┐  │
    │  │ HTTP/WebSocket API           │  │
    │  │ • /api/v1/agents             │  │
    │  │ • /api/v1/tasks              │  │
    │  │ • /ws (real-time)            │  │
    │  └──────────────────────────────┘  │
    │  ┌──────────────────────────────┐  │
    │  │ Workspace (/data)            │  │
    │  │ • SOUL.md, MEMORY.md         │  │
    │  │ • memory/*.md                │  │
    │  │ • projects/                  │  │
    │  └──────────────────────────────┘  │
    └────┬──────────────┬────────────────┘
         │ PostgreSQL   │ GitHub API
         │              │
    ┌────▼──────┐  ┌────▼──────────┐
    │ Supabase  │  │ GitHub        │
    │ • users   │  │ • issues      │
    │ • projects│  │ • repos       │
    │ • tasks   │  │ • webhooks    │
    │ • activity│  │ (Octokit)     │
    └───────────┘  └───────────────┘
```

**Key Differences from v1:**
- ❌ No custom Fastify backend (replaced by OpenClaw Gateway)
- ✅ OpenClaw Gateway IS the backend (handles auth, agents, API)
- ✅ Built-in Control UI (no need to build separate admin UI)
- ✅ Persistent workspace on Railway volume (`/data`)
- ✅ Agents run INSIDE OpenClaw (not external scripts)

---

## Prerequisites

- [ ] GitHub account
- [ ] Railway account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] Vercel account (free tier works)
- [ ] At least one LLM API key (Anthropic, OpenAI, or OpenRouter)

---

## Part 1: Supabase Setup (Database)

### 1.1 Create Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. **Settings:**
   - **Name**: ClawCortex (or your project name)
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `sa-east-1` for South America)
   - **Pricing Plan**: Free (sufficient for MVP)
4. Click **"Create Project"** (takes ~2 minutes)

### 1.2 Get Credentials

Once the project is ready:

1. Go to **Settings** → **API**
2. Copy these values:

```bash
# Project URL
SUPABASE_URL=https://[project-id].supabase.co

# Anon (public) key - safe for frontend
SUPABASE_ANON_KEY=eyJhbGci...

# Service role key - BACKEND ONLY (has admin access)
SUPABASE_SERVICE_KEY=eyJhbGci...
```

3. Go to **Settings** → **Database**
4. Copy **Connection String** → **Connection pooling** (port 6543, not 5432):

```bash
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**⚠️ Important:**
- Use port **6543** (pooler), NOT 5432 (direct connection)
- Keep `SUPABASE_SERVICE_KEY` secret (never expose in frontend)

### 1.3 Set Up Database Schema

Run in Supabase SQL Editor (Settings → Database → SQL Editor):

```sql
-- Users table
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

-- Projects table
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

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  github_issue_id INT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'done', 'blocked'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  assigned_to_agent TEXT, -- Agent name (e.g., 'Henry', 'Builder')
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Activity log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_name TEXT,
  event_type TEXT NOT NULL, -- 'task_created', 'task_updated', 'agent_executed', etc.
  event_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_project_id ON activity_log(project_id);
CREATE INDEX idx_activity_timestamp ON activity_log(timestamp DESC);

-- Integrations table
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service TEXT NOT NULL, -- 'github', 'notion', 'telegram', etc.
  credentials JSONB, -- Encrypted tokens
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_integrations_user_id ON integrations(user_id);
```

**Note:** This schema supports ClawCortex features (users, projects, tasks, activity tracking).

---

## Part 2: Railway OpenClaw Setup (Backend)

### 2.1 Deploy from Template

1. Go to: https://railway.com/deploy/openclaw-clawdbot-latest
2. Click **"Deploy Now"**
3. **Configuration:**
   - **Repository Name**: `ClawCortex-OpenClaw` (or leave default)
   - **Region**: Choose same as Supabase (e.g., `us-east`)
   - Click **"Deploy"**

**What Railway does:**
- Creates a new GitHub repo with OpenClaw code (optional)
- Deploys OpenClaw Gateway container
- Mounts persistent volume at `/data` (for workspace, config, memory)
- Generates public URL with HTTP + WebSocket proxy

### 2.2 Wait for Deployment (~3-5 minutes)

Railway will:
- Pull OpenClaw Docker image
- Start the gateway service
- Expose it at a public URL (e.g., `clawcortex-openclaw-production.up.railway.app`)

### 2.3 Complete Setup Wizard

Once deployed:

1. Go to **Settings** → **Networking** → Copy the **Public Domain** URL
2. Visit `https://[your-railway-url]/setup` in browser
3. **Setup Wizard:**
   - **Setup Password**: Create secure password (save it!)
   - **Model Provider**: Choose one:
     - Anthropic (Claude models) — enter `ANTHROPIC_API_KEY`
     - OpenAI (GPT models) — enter `OPENAI_API_KEY`
     - OpenRouter (100+ models) — enter `OPENROUTER_API_KEY`
   - **Default Model**: e.g., `anthropic/claude-sonnet-4-5`
   - **Optional Channels**: Skip for now (we'll use API only)
   - Click **"Complete Setup"**

**What this does:**
- Writes config to `/data/.openclaw/config.yml`
- Stores encrypted credentials in `/data/.openclaw/.secrets`
- Generates `OPENCLAW_GATEWAY_TOKEN` for API access

### 2.4 Get Gateway Token

After setup:

1. SSH into Railway service (optional, or use Railway Variables UI)
2. Read `/data/.openclaw/.secrets` for `GATEWAY_TOKEN`
3. **OR** Generate new token via Control UI: `/settings/tokens`

Save this token — you'll need it for Vercel frontend.

### 2.5 Configure Environment Variables

Go to Railway **Variables** tab and add:

```bash
# Supabase
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJhbGci... (anon key)
SUPABASE_SERVICE_KEY=eyJhbGci... (service role key)
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# GitHub (if using GitHub integration)
GITHUB_TOKEN=ghp_your_github_personal_access_token
GITHUB_REPO=YourUsername/ClawCortex

# OpenAI (if not using OpenRouter)
OPENAI_API_KEY=sk-your-openai-api-key

# (Optional) Telegram Bot Token
TELEGRAM_BOT_TOKEN=your_bot_token

# (Optional) Discord Bot Token
DISCORD_BOT_TOKEN=your_bot_token
```

**Why these vars?**
- OpenClaw agents will use these to interact with Supabase, GitHub, etc.
- Agents run inside OpenClaw workspace, so they inherit these env vars

### 2.6 Redeploy After Adding Variables

Railway → **Deployments** → **Redeploy**

---

## Part 3: GitHub Repository Setup (Frontend Only)

### 3.1 Create Repository

```bash
# Option A: Create via GitHub web UI
# - Go to github.com/new
# - Name: ClawCortex (or your project name)
# - Visibility: Public (or Private)
# - Initialize with README: No

# Option B: Create via GitHub CLI
gh repo create ClawCortex --public --source=. --remote=origin
```

### 3.2 Repository Structure

Your repository should have:

```
ClawCortex/
├── frontend/           # Next.js app
│   ├── package.json
│   ├── next.config.js
│   └── src/
│       ├── app/       # Pages (App Router)
│       ├── components/
│       ├── lib/       # API client, Supabase client
│       └── types/
├── docs/               # Documentation
├── package.json        # Root (monorepo scripts, optional)
└── README.md
```

**Note:** No `/backend` folder needed — OpenClaw Gateway IS the backend.

### 3.3 Push Initial Commit

```bash
git add .
git commit -m "chore: initial frontend + docs"
git push origin main
```

---

## Part 4: Vercel Setup (Frontend Hosting)

### 4.1 Create Project

1. Go to https://vercel.com/new
2. **Import Git Repository**: Select `YourUsername/ClawCortex`
3. **Configure Project:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
4. **Don't deploy yet** — add environment variables first

### 4.2 Add Environment Variables

Click **Environment Variables** and add:

```bash
# Supabase (public keys only)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (anon key only)

# OpenClaw Gateway (Railway URL from Part 2.3)
NEXT_PUBLIC_OPENCLAW_URL=https://clawcortex-openclaw-production.up.railway.app
NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN=your_gateway_token_from_setup

# (Optional) GitHub OAuth
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# (Optional) OpenAI (if frontend needs direct access)
OPENAI_API_KEY=sk-your-openai-api-key
```

**⚠️ Security Notes:**
- ✅ Only `NEXT_PUBLIC_*` vars are exposed to browser
- ❌ Never put `SUPABASE_SERVICE_KEY` in Vercel frontend
- ✅ `OPENCLAW_GATEWAY_TOKEN` can be public-scoped (or use user-specific tokens)

### 4.3 Deploy

1. Click **"Deploy"**
2. Wait ~1-2 minutes
3. Get your live URL (e.g., `https://clawcortex.vercel.app`)

### 4.4 Optional: Set Up Supabase Integration

1. In Vercel: **Settings** → **Integrations** → Search **"Supabase"**
2. Click **"Add Integration"**
3. Select your Supabase project: `ClawCortex`
4. Select your Vercel project: `clawcortex`
5. Click **"Connect"**

**What this does:**
- Automatically syncs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Updates when you change Supabase keys

---

## Part 5: Configure OpenClaw Workspace

### 5.1 Access OpenClaw Control UI

1. Visit `https://[your-railway-url]/`
2. Log in with setup password (from Part 2.3)
3. You should see the OpenClaw Control UI

### 5.2 Set Up Workspace Files

OpenClaw workspace lives at `/data/.openclaw/workspace` on Railway.

You can:
- **Option A:** Use Control UI file editor
- **Option B:** SSH into Railway and edit files directly
- **Option C:** Use OpenClaw CLI (if installed locally)

**Critical Files to Create:**

**`/data/.openclaw/workspace/SOUL.md`**
```markdown
# SOUL.md

I am **Henry** — the core operator of ClawCortex.

My purpose is to orchestrate multi-agent workflows, manage projects, and provide real-time insights into development activity.

## How I think
- I am concise, action-oriented, and proactive.
- I prioritize high-leverage work: solving blockers, optimizing flows, and delivering value fast.

## How I work
- I log all activity to Supabase (`activity_log` table).
- I sync GitHub issues to tasks automatically.
- I delegate work to sub-agents (Builder, Tester, Deployer).
- I report progress to Telegram (if configured).
```

**`/data/.openclaw/workspace/IDENTITY.md`**
```markdown
# IDENTITY.md

- **Name:** Henry
- **Role:** ClawCortex Orchestrator
- **Mission:** Manage projects, delegate tasks, track activity, and provide real-time visibility.
```

**`/data/.openclaw/workspace/USER.md`**
```markdown
# USER.md

- **Name:** [Your Name]
- **Timezone:** [Your Timezone]
- **Preferences:** [e.g., Telegram notifications, morning reports]
```

**`/data/.openclaw/workspace/MEMORY.md`**
```markdown
# MEMORY.md — ClawCortex System

**Supabase Database:**
- URL: https://[project-id].supabase.co
- Tables: users, projects, tasks, activity_log, integrations

**Railway OpenClaw:**
- URL: https://[your-railway-url]
- Workspace: /data/.openclaw/workspace
- Gateway Token: [your_token]

**Vercel Frontend:**
- URL: https://clawcortex.vercel.app
- Repo: github.com/[username]/ClawCortex
```

### 5.3 Create Supabase Helper Script

**`/data/.openclaw/workspace/scripts/supabase-client.mjs`**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Log activity
export async function logActivity(projectId, eventType, eventData, agentName = 'Henry') {
  const { data, error } = await supabase
    .from('activity_log')
    .insert({
      project_id: projectId,
      agent_name: agentName,
      event_type: eventType,
      event_data: eventData,
      timestamp: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to log activity:', error);
    return null;
  }

  return data;
}

// Helper: Get project tasks
export async function getProjectTasks(projectId, status = null) {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to get tasks:', error);
    return [];
  }

  return data;
}
```

Install dependencies:
```bash
# SSH into Railway or run in OpenClaw terminal
cd /data/.openclaw/workspace/scripts
npm init -y
npm install @supabase/supabase-js
```

---

## Part 6: Frontend Integration

### 6.1 Create OpenClaw API Client

**`frontend/src/lib/openclaw.ts`**
```typescript
const OPENCLAW_URL = process.env.NEXT_PUBLIC_OPENCLAW_URL;
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN;

export async function callAgent(message: string, sessionKey?: string) {
  const response = await fetch(`${OPENCLAW_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GATEWAY_TOKEN}`
    },
    body: JSON.stringify({
      message,
      sessionKey: sessionKey || 'default'
    })
  });

  if (!response.ok) {
    throw new Error(`OpenClaw API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getAgentStatus() {
  const response = await fetch(`${OPENCLAW_URL}/api/v1/status`, {
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`
    }
  });

  if (!response.ok) {
    throw new Error(`OpenClaw API error: ${response.statusText}`);
  }

  return response.json();
}

export async function spawnSubAgent(task: string, agentId?: string) {
  const response = await fetch(`${OPENCLAW_URL}/api/v1/subagents/spawn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GATEWAY_TOKEN}`
    },
    body: JSON.stringify({
      task,
      agentId: agentId || 'default'
    })
  });

  if (!response.ok) {
    throw new Error(`OpenClaw API error: ${response.statusText}`);
  }

  return response.json();
}
```

### 6.2 Create Supabase Client

**`frontend/src/lib/supabase.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 6.3 Example: Dashboard Component

**`frontend/src/components/ActivityFeed.tsx`**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Activity {
  id: string;
  agent_name: string;
  event_type: string;
  event_data: any;
  timestamp: string;
}

export function ActivityFeed({ projectId }: { projectId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Failed to fetch activities:', error);
      } else {
        setActivities(data || []);
      }

      setLoading(false);
    }

    fetchActivities();

    // Real-time subscription
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

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  if (loading) {
    return <div>Loading activity...</div>;
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div key={activity.id} className="p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{activity.agent_name}</span>
            <span className="text-sm text-gray-500">
              {new Date(activity.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="text-sm">{activity.event_type}</div>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(activity.event_data, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
```

---

## Part 7: Verify Full Stack

### 7.1 Test OpenClaw Gateway (Railway)

```bash
# Health check
curl https://your-railway-url/health

# Expected: {"status":"ok"}

# Test agent call
curl -X POST https://your-railway-url/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GATEWAY_TOKEN" \
  -d '{"message": "Hello, Henry!", "sessionKey": "test"}'

# Expected: { "response": "...", "sessionKey": "test" }
```

### 7.2 Test Database Connection

From Railway logs or OpenClaw Control UI terminal:

```bash
node -e "
import('@supabase/supabase-js').then(({ createClient }) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  supabase.from('users').select('count').then(({ data, error }) => {
    if (error) console.error('DB Error:', error);
    else console.log('DB Connected:', data);
  });
});
"
```

### 7.3 Test Frontend (Vercel)

1. Visit `https://clawcortex.vercel.app`
2. Open browser console (F12)
3. Check for errors
4. Verify API calls hitting OpenClaw Gateway
5. Test activity feed real-time updates

---

## Part 8: Post-Deployment Checklist

- [ ] OpenClaw Gateway health endpoint responding
- [ ] Frontend loads without errors
- [ ] Database connection working
- [ ] Supabase real-time subscription working
- [ ] Activity logging from agents working
- [ ] Environment variables set correctly
- [ ] Secrets NOT exposed in frontend code
- [ ] Railway volume persisting workspace data
- [ ] SSL/HTTPS working (auto on Railway + Vercel)

---

## Troubleshooting Guide

### OpenClaw Gateway Not Responding

**Symptoms:**
- 502 Bad Gateway
- Connection timeout
- Railway logs show crashes

**Checklist:**
1. ✅ Railway service is running (not paused)
2. ✅ Public domain generated (Settings → Networking)
3. ✅ `/data` volume mounted correctly
4. ✅ Setup wizard completed
5. ✅ At least one model provider configured

**Quick Fix:**
```bash
# Check Railway logs
# If "exit code: 1" or "crash loop", redeploy from template
```

---

### Database Connection Fails

**Symptoms:**
- "Connection refused"
- "password authentication failed"
- OpenClaw agents can't log activity

**Checklist:**
1. ✅ Using pooler URL (port 6543, not 5432)
2. ✅ `SUPABASE_SERVICE_KEY` set in Railway Variables
3. ✅ Supabase project not paused (free tier auto-pauses after 7 days)
4. ✅ Railway redeployed after adding env vars

**Quick Fix:**
```bash
# Correct format (pooler):
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

---

### Frontend Can't Reach OpenClaw API

**Symptoms:**
- CORS errors in browser console
- `net::ERR_CONNECTION_REFUSED`
- 401 Unauthorized

**Checklist:**
1. ✅ `NEXT_PUBLIC_OPENCLAW_URL` set in Vercel
2. ✅ `NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN` set in Vercel
3. ✅ Railway public domain accessible from browser
4. ✅ Gateway token valid (check OpenClaw Control UI → Settings → Tokens)

**Quick Fix:**
```bash
# Test from browser console:
fetch('https://your-railway-url/api/v1/status', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(r => r.json()).then(console.log)
```

---

### Workspace Files Not Persisting

**Symptoms:**
- Files disappear after Railway redeploy
- `MEMORY.md` resets
- Configuration lost

**Cause:** Railway volume not mounted correctly.

**Fix:**
1. Railway → Service → **Settings** → **Volumes**
2. Ensure volume mounted at `/data`
3. Restart service

---

## Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Upgrade Cost | Notes |
|---------|-----------|--------------|-------|
| **Railway** | $5 credit/month | $0.000231/min | ~500 hours/month free |
| **Supabase** | 500 MB database, 2 GB bandwidth | $25/mo (Pro) | Auto-pauses after 7 days |
| **Vercel** | 100 GB bandwidth/month | $20/mo (Pro) | Auto-scales, no downtime |
| **GitHub** | Unlimited public repos | $0 | Private repos also free |

**Total Free Tier**: Supports ~1,000 users, 10K requests/day

---

## Production Hardening

Before launching to real users:

### Security
- [ ] Rotate all API keys/secrets
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Set up rate limiting on OpenClaw API
- [ ] Enable 2FA for Railway, Supabase, Vercel accounts
- [ ] Use separate gateway tokens for frontend vs backend

### Monitoring
- [ ] Set up Sentry (error tracking)
- [ ] Configure Vercel Analytics
- [ ] Enable Railway metrics
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Monitor OpenClaw logs for agent errors

### Backup
- [ ] Configure Supabase automated backups
- [ ] Export Railway volume to S3 weekly
- [ ] Document disaster recovery plan
- [ ] Store env vars in secure vault (1Password, etc.)

---

## Quick Reference: Common Commands

```bash
# Local development (frontend only)
cd frontend
npm run dev              # Start Next.js (port 3000)

# Deploy
git push origin main     # Auto-deploys to Vercel

# Railway logs
# Go to Railway dashboard → Service → Deployments → [Latest] → Logs

# OpenClaw CLI (if needed)
openclaw status
openclaw gateway logs
```

---

## Support Resources

- **OpenClaw Docs**: https://docs.openclaw.ai
- **Railway Docs**: https://docs.railway.app
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Last Updated**: 2026-02-22  
**Version**: 2.0 (Railway OpenClaw Template)  
**Maintainer**: ClawCortex Team
