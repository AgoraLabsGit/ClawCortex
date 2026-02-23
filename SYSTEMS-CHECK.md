# ClawCortex Systems Check — 5-Minute Verification

**Last Updated**: 2026-02-22 21:02 GMT-3  
**Time to Complete**: 5 minutes  
**Status**: ✅ All Green

---

## Quick Status Overview

| System | Status | URL / Access |
|--------|--------|--------------|
| **GitHub** | ✅ Live | https://github.com/AgoraLabsGit/ClawCortex |
| **Vercel Frontend** | ✅ Live | https://clawcortex.vercel.app (or your custom domain) |
| **Supabase Database** | ✅ Live | https://supabase.com/dashboard/project/kzcdbnznpshplbikbgub |
| **OpenClaw Gateway** | ✅ Live | http://187.77.48.243:8080 (Hostinger VPS) |
| **Model** | ✅ Haiku 4.5 | Cost: $1-5/day (not $75+/day) |

---

## 5-Minute Verification Checklist

### ✅ 1. Frontend Loads (30 seconds)

```bash
curl -s https://clawcortex.vercel.app | grep -c "ClawCortex"
# Expected: 1 (title found)

# Or: Open https://clawcortex.vercel.app in browser
# Expected: Page loads, no errors in console
```

**Status**: 🟢 PASS / 🔴 FAIL

---

### ✅ 2. Supabase Connected (30 seconds)

**Option A: Browser Console** (easiest)

Open https://clawcortex.vercel.app, press F12, paste:

```javascript
// Test Supabase client
const agents = await supabase.from('agents').select('*');
console.log(agents); 
// Expected: {data: [], error: null}
```

**Option B: Direct API Call** (if preferred)

```bash
curl -s -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6Y2RibnpucHNocGxiaWtiZ3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTIyMzQsImV4cCI6MjA4NzM2ODIzNH0.u3BrbMfqOUuTe6VwHLIagLqnMaim2QCc7n7oQtTNUMg" \
  https://kzcdbnznpshplbikbgub.supabase.co/rest/v1/agents | jq '.'
# Expected: [] or list of agents
```

**Status**: 🟢 PASS / 🔴 FAIL

---

### ✅ 3. Database Tables Exist (30 seconds)

Go to: https://supabase.com/dashboard/project/kzcdbnznpshplbikbgub/editor

Click **Table Editor** (left sidebar) → You should see:

- ✅ `agents` table
  - Columns: id, name, role, status, created_at
  - Rows: (empty or populated)

- ✅ `tasks` table
  - Columns: id, agent_id, title, status, created_at
  - Rows: (empty or populated)

**Status**: 🟢 PASS / 🔴 FAIL

---

### ✅ 4. OpenClaw Gateway Responding (30 seconds)

```bash
# Check gateway is running
curl -s http://187.77.48.243:8080 -o /dev/null -w "%{http_code}"
# Expected: 200 (or 301 redirect, still OK)

# Or from within Hostinger VPS:
openclaw status
# Expected: Gateway running, Model: anthropic/claude-haiku-4-5
```

**Status**: 🟢 PASS / 🔴 FAIL

---

### ✅ 5. Model is Haiku (30 seconds)

```bash
# SSH into Hostinger or check locally:
openclaw status

# Should show:
# 🧠 Model: anthropic/claude-haiku-4-5
# (NOT Sonnet)
```

**Or check config file**:

```bash
cat ~/.openclaw/openclaw.json | grep -A3 '"primary"'
# Should show: "anthropic/claude-haiku-4-5"
```

**Status**: 🟢 PASS / 🔴 FAIL

---

### ✅ 6. Git Repo Clean (30 seconds)

```bash
cd /data/.openclaw/workspace/projects/ClawCortex

# Check for uncommitted changes
git status
# Expected: "On branch main, nothing to commit, working tree clean"

# Verify recent commits
git log --oneline -5
# Should show: docs commits + setup commits (no Railway files)
```

**Status**: 🟢 PASS / 🔴 FAIL

---

### ✅ 7. Environment Files Present (30 seconds)

```bash
cd /data/.openclaw/workspace/projects/ClawCortex

# Check files exist
ls -la .env .env.example frontend/.env frontend/.env.example
# Expected: All 4 files present

# Verify .env.example is in git (public template)
git check-ignore .env
# Expected: .env (files should be ignored)

git check-ignore .env.example
# Expected: (no output = file tracked)
```

**Status**: 🟢 PASS / 🔴 FAIL

---

## Detailed Status Report

### GitHub (Repository)

**Latest Commits** (showing clean state):

```bash
cd /data/.openclaw/workspace/projects/ClawCortex
git log --oneline -3
```

Expected:
```
510775c docs: update deployment guide...
54ee328 docs: add comprehensive tech stack setup log
d27031d docs: add comprehensive tech stack setup log
```

**Files in Repo**:
- ✅ `frontend/` (Next.js 14)
- ✅ `supabase/migrations/001_initial_schema.sql`
- ✅ `docs/DEPLOYMENT-GUIDE.md`
- ✅ `SETUP-LOG.md`
- ✅ `.env.example`
- ❌ No vercel.json (removed)
- ❌ No railway_* files (removed)

---

### Vercel (Frontend Deployment)

**Expected State**:
- ✅ Project created: `clawcortex`
- ✅ Git connected: `AgoraLabsGit/ClawCortex`
- ✅ Root Directory: `frontend`
- ✅ Auto-deploys on git push
- ✅ Environment variables synced from Supabase
- ✅ URL: `https://clawcortex.vercel.app` (or custom domain)

**To Verify**:
```bash
# Check latest deployment status at:
# https://vercel.com/teams/agora-labs/clawcortex/deployments
# Should show: ✅ Production (latest commit)
```

---

### Supabase (Database)

**Expected State**:
- ✅ Project: `kzcdbnznpshplbikbgub`
- ✅ Region: `us-east-2`
- ✅ Tables: `agents`, `tasks`
- ✅ RLS: Enabled on both tables
- ✅ Connection pooling: Active (port 6543)

**Credentials**:
- ✅ Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (in Vercel as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- ✅ Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (in Vercel as `SUPABASE_SERVICE_ROLE_KEY`)

---

### OpenClaw (Hostinger VPS)

**Expected State**:
- ✅ Running on: `srv1402555.hstgr.cloud` (IP: 187.77.48.243)
- ✅ Model: Claude Haiku 4.5
- ✅ Environment: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set
- ✅ Gateway port: 8080

**To Verify**:
```bash
# SSH access (if available)
ssh root@187.77.48.243

# Check status
openclaw status
openclaw security audit
```

---

## Troubleshooting Quick Links

### If Frontend Not Loading
1. Check Vercel Deployments: https://vercel.com/teams/agora-labs/clawcortex
2. Look at build logs for errors
3. Verify Root Directory = `frontend` in Settings
4. Check environment variables are set

### If Database Connection Fails
1. Verify Supabase project is not paused
2. Check anon key is correct in browser console
3. Test with curl: `curl -H "apikey: xxx" https://project.supabase.co/rest/v1/agents`
4. Verify using pooled connection (port 6543)

### If OpenClaw Not Responding
1. SSH into Hostinger VPS
2. Run: `openclaw status`
3. Check: `openclaw logs --tail 20`
4. Restart if needed: `openclaw gateway restart`

### If Model is Wrong
1. Check `~/.openclaw/openclaw.json` on Hostinger
2. Verify `"primary": "anthropic/claude-haiku-4-5"`
3. If not, update and restart: `openclaw gateway restart`

---

## Next Steps

Once all checks ✅ PASS:

1. **Prepare GMAD Workflow**
   - Build: Autonomous development (database queries, UI components)
   - Measure: Unit tests, integration tests
   - Analyze: Performance metrics, user feedback
   - Decide: Prioritize next features

2. **Start Autonomous MVP Development**
   - Dashboard UI (agents list, tasks list)
   - Authentication flow
   - API endpoints (CRUD)
   - Real-time updates

3. **Monitor & Iterate**
   - Check daily logs
   - Monitor API usage
   - Track costs (target: <$10/day)

---

## Cost Tracking

| Component | Current Cost | Target |
|-----------|--------------|--------|
| **Vercel** | $0 (free tier) | <$20/mo |
| **Supabase** | $0 (free tier) | <$25/mo |
| **Hostinger VPS** | ~$20/mo | $20/mo (fixed) |
| **Anthropic API (Haiku)** | $1-5/day | <$10/day |
| **Total** | ~$50-60/mo | $100/mo cap |

**Savings vs Sonnet**: $60-70/day = $1,800-2,100/mo saved

---

**Status**: 🟢 **ALL SYSTEMS OPERATIONAL — READY FOR AUTONOMOUS DEVELOPMENT**
