# ClawCortex Deployment Guide

**Complete setup guide for deploying ClawCortex (or similar Next.js + Fastify monorepo) to production.**

**Stack:**
- **Frontend**: Next.js 14 (PWA) → Vercel
- **Backend**: Fastify (Node.js) → Railway
- **Database**: PostgreSQL → Supabase
- **Version Control**: GitHub

**Time to Deploy**: ~20 minutes (following this guide)

---

## ⚡ Key Insight: Use Vercel Integrations

**IMPORTANT**: Vercel has native integrations for both Supabase and Railway. This is the **recommended approach** because:

- ✅ **Automatic env var sync** (no manual copy/paste)
- ✅ **Zero-config setup** (credentials auto-populated)
- ✅ **Always up-to-date** (changes in Supabase/Railway auto-sync)
- ✅ **Fewer errors** (no typos, no missing vars)

**How it works:**
1. Deploy to Supabase + Railway first
2. Use Vercel's built-in integrations to connect them
3. Environment variables appear automatically in your Vercel project

**This guide follows that approach** — you'll set up each service independently, then connect them via Vercel integrations (Part 4).

---

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Railway account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] Git installed locally
- [ ] Node.js 18+ installed

---

## Part 1: GitHub Repository Setup

### 1.1 Create Repository

```bash
# Option A: Create via GitHub web UI
# - Go to github.com/new
# - Name: ClawCortex (or your project name)
# - Visibility: Public (or Private if preferred)
# - Initialize with README: No

# Option B: Create via GitHub CLI
gh repo create ClawCortex --public --source=. --remote=origin
```

### 1.2 Monorepo Structure

Your repository should have this structure:

```
ClawCortex/
├── frontend/           # Next.js app
│   ├── package.json
│   ├── next.config.js
│   └── src/
├── backend/            # Fastify API
│   ├── package.json
│   ├── nixpacks.toml   # ⚠️ CRITICAL for Railway
│   ├── tsconfig.json
│   └── src/
├── docs/               # Documentation
├── package.json        # Root (monorepo scripts)
└── README.md
```

**⚠️ Critical Files:**

1. **`backend/nixpacks.toml`** (required for Railway):

```toml
[phases.setup]
nixPkgs = ["nodejs_22"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

**Why this matters**: Railway uses Nixpacks to detect build configuration. Without this file, it may try to build the entire monorepo (including frontend), causing build failures.

2. **Root `package.json`** should NOT be used for Railway builds:

```json
{
  "scripts": {
    "build": "npm run build --prefix frontend && npm run build --prefix backend"
  }
}
```

This script builds BOTH frontend and backend. Railway (with root directory `/backend`) will fail because frontend dependencies aren't installed.

### 1.3 Push Initial Commit

```bash
git add .
git commit -m "chore: initial monorepo structure"
git push origin main
```

---

## Part 2: Supabase Setup (Database)

### 2.1 Create Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. **Settings:**
   - **Name**: ClawCortex (or your project name)
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `sa-east-1` for South America)
   - **Pricing Plan**: Free (sufficient for MVP)
4. Click **"Create Project"** (takes ~2 minutes)

### 2.2 Get Credentials

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

**⚠️ Common Mistakes:**

- ❌ Using port 5432 (direct connection) instead of 6543 (pooler)
- ❌ Exposing `SUPABASE_SERVICE_KEY` in frontend code
- ❌ Hardcoding database password in version control

### 2.3 Set Up Database Schema (Optional for Now)

```sql
-- Run in Supabase SQL Editor (Settings → Database → SQL Editor)

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Part 3: Railway Setup (Backend Hosting)

### 3.1 Create Account & Project

1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Click **"New Project"** → **"Deploy from GitHub repo"**

### 3.2 Connect GitHub Repository

1. **Select Repository**: `YourUsername/ClawCortex`
2. **⚠️ CRITICAL: Set Root Directory**
   - Click **"Add Root Directory"**
   - Enter: `backend`
   - **Why**: Tells Railway to build only `/backend`, not entire monorepo
3. **Branch**: `main`

### 3.3 Configure Environment Variables

Go to **Variables** tab and add:

```bash
# Supabase
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJhbGci... (anon key from Supabase)
SUPABASE_SERVICE_KEY=eyJhbGci... (service role key from Supabase)
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# JWT (generate random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server
PORT=3001
NODE_ENV=production

# CORS (Vercel frontend URL - update after Vercel deployment)
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**⚠️ JWT Secret Generator:**

```bash
# Generate secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait ~2-3 minutes for build
3. **Get Public URL**: Settings → Networking → **Generate Domain**
4. Copy the URL (e.g., `https://clawcortex-backend-production.up.railway.app`)

### 3.5 Common Railway Issues & Fixes

**Issue: "exit code: 127" or "command not found"**

**Cause**: Railway trying to build frontend dependencies that don't exist in `/backend`.

**Fix**: Ensure `backend/nixpacks.toml` exists (see Part 1.2).

---

**Issue: "Not Authorized" with Railway API/CLI**

**Cause**: Railway API tokens may have limited permissions or expire.

**Fix**: Use manual setup via Railway dashboard instead of CLI/API. The web UI is more reliable.

---

**Issue: Environment variables not working**

**Cause**: Railway needs redeploy after adding/changing env vars.

**Fix**: Settings → Redeploy (or push new commit to trigger deploy).

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
4. **Don't add env vars yet** — we'll use integrations (see 4.2)

### 4.2 Set Up Integrations (Recommended Method)

**⚠️ BEST PRACTICE: Use Vercel integrations instead of manual env vars.**

Vercel has native integrations for Supabase and Railway that:
- ✅ Auto-sync environment variables
- ✅ Update automatically when backend changes
- ✅ Single source of truth (no manual updates)
- ✅ Secure by default (proper scoping)

#### 4.2.1 Supabase Integration

1. In Vercel: **Settings** → **Integrations** → Search **"Supabase"**
2. Click **"Add Integration"**
3. **Select your Supabase project**: ClawCortex
4. **Select your Vercel project**: clawcortex
5. Click **"Connect"**

**What this does:**
- Automatically adds `NEXT_PUBLIC_SUPABASE_URL`
- Automatically adds `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Updates when you change Supabase keys

#### 4.2.2 Railway Integration

1. In Vercel: **Settings** → **Integrations** → Search **"Railway"**
2. Click **"Add Integration"**
3. **Configuration:**
   - Vercel project: `clawcortex`
   - Railway project: `ClawCortex-Backend`
   - Environment sync: Production → Production
4. Click **"Save Configuration"**

**What this does:**
- Backend URL automatically available as `RAILWAY_PUBLIC_DOMAIN`
- Railway env vars synced to Vercel (if needed)
- Updates when Railway redeploys

### 4.3 Manual Environment Variables (Only If Not Using Integrations)

**Skip this if you set up integrations above.**

If you prefer manual setup, click **Environment Variables** and add:

```bash
# Supabase (public keys only)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (anon key only)

# Backend API (Railway URL from Part 3.4)
NEXT_PUBLIC_API_URL=https://clawcortex-backend-production.up.railway.app

# GitHub (for integrations - optional)
GITHUB_TOKEN=ghp_your_github_personal_access_token
GITHUB_REPO=YourUsername/ClawCortex

# OpenAI (if using AI features)
OPENAI_API_KEY=sk-your-openai-api-key
```

**⚠️ Security Notes:**

- ✅ Only `NEXT_PUBLIC_*` vars are exposed to browser
- ❌ Never put `SUPABASE_SERVICE_KEY` in Vercel frontend
- ✅ Backend secrets stay in Railway only

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait ~1-2 minutes
3. Get your live URL (e.g., `https://clawcortex.vercel.app`)

### 4.5 Update Railway CORS

Now that you have the Vercel URL, go back to Railway:

1. **Variables** → Edit `ALLOWED_ORIGINS`
2. Set to: `https://your-app.vercel.app`
3. Redeploy backend

**Note**: If using Railway integration, the frontend can access `process.env.RAILWAY_PUBLIC_DOMAIN` to construct the API URL dynamically.

---

## Part 5: Verify Full Stack

### 6.1 Test Backend (Railway)

```bash
# Health check
curl https://your-backend.up.railway.app/health

# Expected: {"status":"ok"}
```

### 6.2 Test Frontend (Vercel)

1. Visit `https://your-app.vercel.app`
2. Open browser console (F12)
3. Check for errors
4. Verify API calls hitting Railway backend

### 6.3 Test Database Connection

```bash
# From backend logs (Railway dashboard → Deployments → Logs)
# Should see: "Database connected successfully"
```

---

## Part 6: Post-Deployment Checklist

- [ ] Backend health endpoint responding
- [ ] Frontend loads without errors
- [ ] Database connection working
- [ ] CORS configured (frontend can call backend)
- [ ] Environment variables set correctly
- [ ] Secrets NOT exposed in frontend code
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS working (auto on Vercel + Railway)
- [ ] Monitoring/logging set up

---

## Troubleshooting Guide

### Backend Won't Build on Railway

**Symptoms:**
- "exit code: 127"
- "command not found"
- "Cannot find module"

**Checklist:**
1. ✅ Root Directory set to `backend`
2. ✅ `backend/nixpacks.toml` exists
3. ✅ `backend/package.json` has `build` and `start` scripts
4. ✅ Dependencies listed in `package.json` (not just `devDependencies`)

**Quick Fix:**

```bash
# In backend/package.json, ensure:
{
  "scripts": {
    "build": "tsc",        # or your build command
    "start": "node dist/index.js"
  },
  "dependencies": {
    "fastify": "^4.24.0",  # All runtime deps here
    "@supabase/supabase-js": "^2.38.0"
  }
}
```

---

### TypeScript Build Errors

**Symptoms:**
- `error TS2769: No overload matches this call` (logger types)
- `Property 'signUpWithPassword' does not exist` (Supabase API)
- `Type 'Http2SecureServer' is not assignable` (HTTP server)

**Common Causes & Fixes:**

**1. Fastify Logger Type Mismatch:**

```typescript
// ❌ Wrong: Custom Pino logger causes type errors
import { logger } from "./lib/logger";
const fastify = Fastify({ logger: logger });

// ✅ Correct: Use Fastify's built-in logger
const fastify = Fastify({ logger: true });
```

**2. Supabase Auth API Changes:**

```typescript
// ❌ Old API (deprecated)
await supabase.auth.signUpWithPassword({ email, password });

// ✅ Current API
await supabase.auth.signUp({ email, password });
```

**3. HTTP/WebSocket Server Setup:**

```typescript
// ❌ Wrong: Creating separate HTTP server causes type conflicts
import { createServer } from "http";
const server = createServer(fastify.server);
const wss = new WebSocketServer({ server });

// ✅ Correct: Use Fastify's server directly
const wss = new WebSocketServer({ server: fastify.server });
```

**Debugging Steps:**
1. Run `npm run build` locally to see TypeScript errors before pushing
2. Check Railway build logs for exact error messages
3. Consult latest Fastify/Supabase docs for API changes
4. Use `@types/node` and framework type definitions that match your versions

---

### Frontend Can't Connect to Backend

**Symptoms:**
- CORS errors in browser console
- `net::ERR_CONNECTION_REFUSED`
- `401 Unauthorized`

**Checklist:**
1. ✅ `NEXT_PUBLIC_API_URL` set in Vercel
2. ✅ Backend `ALLOWED_ORIGINS` includes Vercel URL
3. ✅ Railway backend is deployed and running
4. ✅ Railway public domain generated (Settings → Networking)

**Quick Fix:**

```bash
# Backend .env (Railway Variables)
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000

# Redeploy backend after changing CORS
```

---

### Database Connection Fails

**Symptoms:**
- "Connection refused"
- "password authentication failed"
- "ECONNREFUSED"

**Checklist:**
1. ✅ Using pooler URL (port 6543, not 5432)
2. ✅ Password URL-encoded (no special characters breaking the string)
3. ✅ Supabase project not paused (free tier auto-pauses after 7 days inactivity)
4. ✅ IP allowlist disabled (or Railway IPs whitelisted)

**Quick Fix:**

```bash
# Correct format (pooler):
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

# Wrong (direct connection):
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

---

### Vercel Build Succeeds But Runtime Errors

**Symptoms:**
- Build passes
- Deployment succeeds
- App crashes when visiting URL

**Checklist:**
1. ✅ All `NEXT_PUBLIC_*` vars set in Vercel
2. ✅ Backend URL reachable from browser
3. ✅ No hardcoded `localhost:3001` in frontend code
4. ✅ Environment variables scoped to correct environment (Production vs Preview)

**Quick Fix:**

```bash
# Check Vercel logs: Deployments → [Latest] → Function Logs
# Look for "Cannot read property of undefined" or missing env vars
```

---

## Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Upgrade Cost | Notes |
|---------|-----------|--------------|-------|
| **GitHub** | Unlimited public repos | $0 | Private repos also free |
| **Vercel** | 100 GB bandwidth/month | $20/mo (Pro) | Auto-scales, no downtime |
| **Railway** | $5 credit/month | $0.000231/min | ~500 hours/month free |
| **Supabase** | 500 MB database, 2 GB bandwidth | $25/mo (Pro) | Auto-pauses after 7 days |

**Total Free Tier**: Supports ~1,000 users, 10K requests/day

**When to Upgrade**:
- Vercel: >100 GB bandwidth (viral growth)
- Railway: >500 compute hours (always-on services)
- Supabase: >500 MB data or >2 GB bandwidth

---

## Production Hardening

Before launching to real users:

### Security
- [ ] Rotate all API keys/secrets
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Set up rate limiting on backend
- [ ] Add CSRF protection
- [ ] Enable WAF (Vercel Pro)

### Monitoring
- [ ] Set up Sentry (error tracking)
- [ ] Configure Vercel Analytics
- [ ] Enable Railway metrics
- [ ] Set up uptime monitoring (e.g., UptimeRobot)

### Performance
- [ ] Enable Vercel Edge caching
- [ ] Optimize images (next/image)
- [ ] Add database indexes
- [ ] Set up CDN for static assets

### Backup
- [ ] Configure Supabase automated backups
- [ ] Export env vars to secure vault (1Password, etc.)
- [ ] Document disaster recovery plan

---

## Quick Reference: Common Commands

```bash
# Local development
npm run dev              # Start both frontend + backend
npm run dev:frontend     # Frontend only (port 3000)
npm run dev:backend      # Backend only (port 3001)

# Build
npm run build            # Build both (monorepo)
npm run build:frontend   # Frontend only
npm run build:backend    # Backend only

# Deploy
git push origin main     # Auto-deploys to Vercel + Railway

# Railway CLI (if using)
railway login
railway link             # Link to existing project
railway status
railway logs

# Vercel CLI (if using)
vercel login
vercel link              # Link to existing project
vercel deploy --prod
```

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Fastify Docs**: https://www.fastify.io/docs

---

**Last Updated**: 2026-02-22  
**Tested With**: Next.js 14, Node.js 22, Railway Nixpacks 0.17.2  
**Maintainer**: ClawCortex Team
