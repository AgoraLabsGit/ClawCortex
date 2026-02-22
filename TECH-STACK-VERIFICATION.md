# ClawCortex Tech Stack Verification
**Date**: 2026-02-22 18:30 GMT-3  
**Purpose**: Verify full control before autonomous development  
**Status**: In Progress

---

## Services to Verify

### 1. GitHub ✅
**Status**: Full access  
**Token**: Configured in `/data/.openclaw/.env`  
**Test**: Create/push/PR

**Verification**:
```bash
# Test 1: Check auth
git config --global user.name
git config --global user.email

# Test 2: Clone repo
git clone https://github.com/AgoraLabsGit/ClawCortex.git /tmp/test-clone

# Test 3: Make change and push
cd /tmp/test-clone
echo "# Tech Stack Verification Test" > TEST.md
git add TEST.md
git commit -m "test: verify GitHub access"
git push origin main
git rm TEST.md
git commit -m "test: cleanup verification test"
git push origin main
```

---

### 2. Vercel ✅
**Status**: Full access  
**Token**: `VERCEL_TOKEN` in `/data/.openclaw/.env`  
**Test**: Trigger redeploy, check env vars

**Verification**:
```bash
# Test 1: List projects
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v9/projects

# Test 2: Get ClawCortex project
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v9/projects/clawcortex

# Test 3: List env vars
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v9/projects/clawcortex/env

# Test 4: Trigger redeploy
curl -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v13/deployments \
  -d '{"name":"clawcortex","gitSource":{"type":"github","repoId":"AgoraLabsGit/ClawCortex","ref":"main"}}'
```

---

### 3. Railway ⏳
**Status**: Project created, deployment in progress  
**Token**: `RAILWAY_TOKEN` in `/data/.openclaw/.env`  
**Project ID**: `4435ddd3-cfbe-4ec7-bff1-10c9b90be843`  
**Service ID**: `c3160b33-5a5e-4e8b-a3a1-061ffc105b2e`

**Verification**:
```bash
# Test 1: Check deployment status
curl -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { service(id: \"c3160b33-5a5e-4e8b-a3a1-061ffc105b2e\") { deployments(first: 1) { edges { node { id status url } } } } }"}'

# Test 2: Get deployment logs (if needed)
# (GraphQL query for logs)

# Test 3: Test deployed endpoint
# curl https://[railway-url]/health
```

---

### 4. Supabase ⏳
**Status**: REST API working, direct DB connection blocked  
**Project**: `tknirrjluvyraqqdycci`  
**URL**: `https://tknirrjluvyraqqdycci.supabase.co`

**Verification**:
```bash
# Test 1: REST API health check
curl https://tknirrjluvyraqqdycci.supabase.co/rest/v1/ \
  -H "apikey: $SUPABASE_ANON_KEY"

# Test 2: Create test table (via REST API)
curl -X POST https://tknirrjluvyraqqdycci.supabase.co/rest/v1/rpc/create_table \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"table_name":"test_table","columns":[{"name":"id","type":"serial"},{"name":"data","type":"text"}]}'

# Test 3: Insert test data
curl -X POST https://tknirrjluvyraqqdycci.supabase.co/rest/v1/test_table \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"data":"test"}'

# Test 4: Query test data
curl https://tknirrjluvyraqqdycci.supabase.co/rest/v1/test_table \
  -H "apikey: $SUPABASE_ANON_KEY"
```

---

### 5. Open Router ✅
**Status**: Configured  
**Token**: `OPENROUTER_API_KEY` in `/data/.openclaw/.env`

**Verification**:
```bash
# Test 1: List available models
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"

# Test 2: Test GPT-4o-mini (future default)
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Say test"}]
  }'
```

---

## Verification Checklist

**Before Autonomous Development:**

- [ ] GitHub: Can clone, commit, push
- [ ] Vercel: Can trigger deploys, manage env vars
- [ ] Railway: Deployment succeeded, endpoint responding
- [ ] Supabase: REST API working, can create/query tables
- [ ] Open Router: GPT-4o-mini responding

**Environment Variables:**

- [ ] All tokens present in `/data/.openclaw/.env`
- [ ] Backend `.env` has Supabase credentials
- [ ] Vercel env vars synced (via integration)
- [ ] Railway env vars set (via GraphQL API)

**Development Environment:**

- [ ] Node.js installed + working
- [ ] npm packages installed (frontend + backend)
- [ ] Git configured correctly
- [ ] No blocking errors in recent builds

---

## Blockers Found

(Will be populated during verification)

---

## Next Steps After Verification

1. ✅ If all checks pass → Begin GMAD implementation
2. ❌ If blockers found → Document in CONTINUITY.md, notify Alex
3. ⏸️ If Railway still deploying → Wait, then verify endpoint

---

**Last Updated**: 2026-02-22 18:30 GMT-3  
**Status**: Ready to execute verification
