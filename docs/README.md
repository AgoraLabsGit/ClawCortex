# ClawCortex Documentation

**Last Updated**: 2026-02-23  
**Source of Truth**: MVP-ARCHITECTURE.md

---

## 📚 Essential Reading (Start Here)

### 1. MVP-ARCHITECTURE.md ⭐ **CURRENT SPEC**
**Purpose**: Complete technical spec for the 4-week MVP (single-operator dashboard)  
**Read if**: You're building, deploying, or making technical decisions  
**Updated**: 2026-02-23  
**Status**: 🟢 ACTIVE

### 2. PRD.md
**Purpose**: Product strategy, positioning, market context  
**Read if**: You want to understand "why ClawCortex exists" and "who it's for"  
**Updated**: 2026-02-22  
**Status**: 🟢 ACTIVE (valid through MVP launch)

### 3. NEXT-SESSION-PROMPT.md
**Purpose**: Build instructions, GMAD workflow, checklist  
**Read if**: You're about to code a feature  
**Updated**: 2026-02-22  
**Status**: 🟢 ACTIVE

---

## 🔧 Reference (For Details)

### ARCHITECTURE-V2.md
**Purpose**: Deep technical details (component breakdown, API specs, data model)  
**Read if**: You need implementation specifics, not overview  
**Status**: 🔷 REFERENCE (still accurate, but MVP-ARCHITECTURE.md is the spec)

### DEPLOYMENT-GUIDE-V2.md
**Purpose**: Step-by-step setup and deployment instructions  
**Read if**: You need to replicate the environment or troubleshoot deployment  
**Status**: 🔷 REFERENCE

---

## 📋 Archived (Historical Context Only)

### ARCHITECTURE.md (v1.0)
**Status**: 🔴 DEPRECATED  
**Reason**: Superseded by MVP-ARCHITECTURE.md (clearer scope)  
**Archive Date**: 2026-02-23

### DEPLOYMENT-GUIDE.md (v1.0)
**Status**: 🔴 DEPRECATED  
**Reason**: Superseded by DEPLOYMENT-GUIDE-V2.md  
**Archive Date**: 2026-02-23

### PROJECT-LOG.md
**Status**: 🟠 ARCHIVED (Historical)  
**Purpose**: Early setup logs (useful context, not current state)  
**See Instead**: MEMORY.md in workspace root for current state

---

## 🗺️ Document Map

```
docs/
├── README.md (this file)
│
├── MVP-ARCHITECTURE.md ⭐ START HERE
│   └── What we're building (single-operator dashboard, 4 weeks)
│
├── PRD.md
│   └── Product vision, market, positioning
│
├── NEXT-SESSION-PROMPT.md
│   └── Build instructions, GMAD workflow, checklists
│
├── ARCHITECTURE-V2.md
│   └── Technical deep dive (components, APIs, data model)
│
├── DEPLOYMENT-GUIDE-V2.md
│   └── Setup replication, infrastructure, troubleshooting
│
├── ARCHITECTURE-DEPRECATED.txt
│   └── Deprecation notice (why v1.0 was replaced)
│
└── PROJECT-LOG.md
    └── Historical setup log (2026-02-22)
```

---

## ✅ Quick Decisions Made

| Question | Answer | See |
|----------|--------|-----|
| What are we building? | Single-operator dashboard (MVP), multi-user later (Phase 2) | MVP-ARCHITECTURE.md §1 |
| Why single-operator? | Ships faster, validates core idea, scales later | MVP-ARCHITECTURE.md §10 |
| Tech stack? | Next.js 14, Supabase, OpenClaw Gateway | MVP-ARCHITECTURE.md §2 |
| Timeline? | 4 weeks (Feb 22 — Mar 22) | MVP-ARCHITECTURE.md §5 |
| Success = ? | You save 5+ hours/week, all systems working, no bugs | MVP-ARCHITECTURE.md §11 |

---

## 🚀 What to Read Before You Start Building

**In Order:**

1. **MVP-ARCHITECTURE.md** (15 min)
   - Understand what you're building and why

2. **NEXT-SESSION-PROMPT.md** (10 min)
   - Get the checklist, commands, success metrics

3. **ARCHITECTURE-V2.md** (optional, 20 min)
   - Deep dive if you need component details

4. **Start coding** 🎉

---

## 💡 When to Reference Each Doc

| Situation | Read This |
|-----------|-----------|
| "What are we building?" | MVP-ARCHITECTURE.md §1 |
| "How long will this take?" | MVP-ARCHITECTURE.md §5 (Week 1-4) |
| "What tech stack?" | MVP-ARCHITECTURE.md §2 |
| "How does data flow?" | MVP-ARCHITECTURE.md §7 |
| "Why this design decision?" | MVP-ARCHITECTURE.md §10 |
| "What should I build next?" | NEXT-SESSION-PROMPT.md (GMAD workflow) |
| "How do I deploy?" | DEPLOYMENT-GUIDE-V2.md |
| "What about multi-user?" | MVP-ARCHITECTURE.md §6 (Phase 2) |
| "Who is the customer?" | PRD.md |

---

## 📊 Sync Status

All docs are synced to GitHub: **AgoraLabsGit/ClawCortex/docs/**

When docs change:
1. Update markdown file here
2. Commit to git (`git add docs/`)
3. Push to GitHub (`git push origin main`)
4. Auto-deploy on Vercel (frontend only)

---

**Questions? Check MVP-ARCHITECTURE.md or NEXT-SESSION-PROMPT.md first.**  
**Not answered? Open an issue on GitHub.**

🚀 **Let's build.**
