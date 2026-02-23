# Sprint 001: UI Navigation Structure

**Sprint Goal**: Ship refined 5-page navigation structure with visual polish  
**Timeline**: February 22, 2026 (9:58 PM) → February 22, 2026 (11:58 PM)  
**Duration**: 2 hours  
**Status**: 🟡 In Progress  

---

## Context

Following architecture refinement session, we've designed a comprehensive navigation structure for ClawCortex:
- **Dashboard**: Activity feed across all projects
- **Projects**: Grid view + detail pages with docs/tasks/activity
- **Workflows**: Reusable automation pipelines (Dev/Marketing/Ops)
- **Agents**: AI team management (Master, Dev, Marketing, Sales)
- **Settings**: User profile + integrations

This sprint implements the visual structure with mock data to validate UX before connecting real data sources (Supabase, GitHub, OpenClaw).

---

## Goals

### Primary Goal
✅ **Visual prototype with 5-page navigation working on localhost**

### Success Criteria
- [ ] All 5 pages render without errors
- [ ] Navigation between pages works (sticky top bar)
- [ ] Project cards clickable (Dashboard → Project Detail)
- [ ] Consistent dark mode theming
- [ ] Mobile responsive (320px → 1920px)

---

## Task Breakdown

### Task 1: Add Navigation (15 min) ⏱️

**File**: `app/layout.tsx`

**Changes**:
- Add sticky top navigation bar
- 5 nav links: Dashboard, Projects, Workflows, Agents, Settings
- Icons from `lucide-react` (Home, FolderKanban, Workflow, Bot, Settings)
- Active state styling (highlight current page)

**Acceptance**:
- [ ] Navigation visible on all pages
- [ ] Sticky behavior works (scrolls with page)
- [ ] Links navigate correctly

---

### Task 2: Dashboard Enhancements (5 min) ⏱️

**File**: `app/page.tsx`

**Changes**:
- Add filter buttons above activity feed (All/Dev/Marketing/System)
- Make project cards clickable (Link to `/projects/[id]`)

**Acceptance**:
- [ ] Filter buttons render (functionality Phase 2)
- [ ] Project cards link to detail pages
- [ ] No layout breaks on click

---

### Task 3: Projects List Page (20 min) ⏱️

**File**: `app/projects/page.tsx`

**Content**:
- Header with "New Project" button
- Grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- Project cards using existing `<ProjectCard>` component
- Mock data: ClawCortex, Localist

**Acceptance**:
- [ ] Grid responsive at all breakpoints
- [ ] Cards clickable to detail pages
- [ ] "New Project" button visible (no action yet)

---

### Task 4: Project Detail Page (25 min) ⏱️

**File**: `app/projects/[id]/page.tsx`

**Content**:
- Header with project name + GitHub link
- Tab navigation (Overview, Docs, Tasks, Activity)
- Overview tab (active):
  - Stats cards (Tasks Completed, Total Tasks)
  - Quick docs list (PRD.md, ARCHITECTURE-V2.md, etc.)
- Activity sidebar (project-scoped feed)

**Acceptance**:
- [ ] Dynamic route works (`/projects/1`, `/projects/2`)
- [ ] 404 page for invalid IDs
- [ ] GitHub link opens in new tab
- [ ] Tabs render (only Overview functional in Sprint 001)

---

### Task 5: Workflows Page (20 min) ⏱️

**File**: `app/workflows/page.tsx`

**Content**:
- Category filter buttons (All, Development, Marketing, Operations)
- Workflow cards with:
  - Name, category, description
  - Stats: Steps, Avg Duration, Success Rate, Total Runs
  - Play button (mock action)
- Mock workflows: Feature Development, Bug Fix, BMAD Planning

**Acceptance**:
- [ ] 3 workflow cards render
- [ ] Category filters visible (functionality Phase 2)
- [ ] Play button hover state works

---

### Task 6: Agents Page (20 min) ⏱️

**File**: `app/agents/page.tsx`

**Content**:
- Agent cards with:
  - Name, type, model
  - Status indicator (active/idle)
  - Projects assigned
  - Task count, uptime
- Mock agents: Henry (Master), Builder, Review

**Acceptance**:
- [ ] 3 agent cards render
- [ ] Status badges color-coded (green=active, gray=idle)
- [ ] Project tags visible

---

### Task 7: Settings Page (20 min) ⏱️

**File**: `app/settings/page.tsx`

**Content**:
- Tab navigation (Profile, Integrations)
- Profile section:
  - User avatar placeholder
  - Username, Email inputs (read-only for now)
  - Save button (mock action)
- Integrations section:
  - GitHub, Supabase, OpenAI cards
  - Connection status (connected/disconnected)
  - Last sync timestamp

**Acceptance**:
- [ ] Profile form renders
- [ ] 3 integration cards show "Connected" status
- [ ] Disconnect buttons visible (no action yet)

---

### Task 8: Testing (10 min) ⏱️

**Actions**:
1. Run `npm run dev`
2. Test navigation flow:
   - Dashboard → Projects → Workflows → Agents → Settings
   - Dashboard → Click project card → Detail page
   - Project detail → Click GitHub link (new tab)
3. Test responsive behavior (DevTools: 320px, 768px, 1920px)
4. Check for console errors
5. Verify dark mode consistency

**Acceptance**:
- [ ] All pages load without errors
- [ ] Navigation works bidirectionally
- [ ] No layout breaks at mobile/tablet/desktop
- [ ] Dark mode consistent across all pages

---

### Task 9: Commit & Document (5 min) ⏱️

**Actions**:
```bash
git add .
git commit -m "feat: add 5-page navigation structure (Dashboard, Projects, Workflows, Agents, Settings)"
git push origin main
```

**Documentation**:
- Update NEXT-SESSION-PROMPT.md (mark Sprint 001 complete)
- Screenshot dashboard for reference
- Note any bugs/improvements for Sprint 002

**Acceptance**:
- [ ] Code committed to main branch
- [ ] NEXT-SESSION-PROMPT.md updated
- [ ] Sprint 002 tasks identified

---

## Mock Data

### Projects
```typescript
[
  {
    id: '1',
    name: 'ClawCortex',
    description: 'AI Agent Workspace SaaS',
    github_repo: 'AgoraLabsGit/ClawCortex',
    status: 'active',
    tasks_done: 12,
    tasks_total: 45
  },
  {
    id: '2',
    name: 'Localist',
    description: 'Local business discovery platform',
    github_repo: 'AgoraLabsGit/Localist',
    status: 'active',
    tasks_done: 8,
    tasks_total: 20
  }
]
```

### Workflows
```typescript
[
  {
    id: '1',
    name: 'Feature Development',
    category: 'Development',
    steps: 4,
    avgDuration: '45 min',
    successRate: 92,
    runs: 12
  },
  {
    id: '2',
    name: 'Bug Fix',
    category: 'Development',
    steps: 5,
    avgDuration: '20 min',
    successRate: 100,
    runs: 8
  },
  {
    id: '3',
    name: 'BMAD Planning',
    category: 'Development',
    steps: 6,
    avgDuration: '2 hours',
    successRate: 85,
    runs: 3
  }
]
```

### Agents
```typescript
[
  {
    id: '1',
    name: 'Henry',
    type: 'Master Agent',
    model: 'Claude Sonnet 4.5',
    status: 'active',
    projects: ['ClawCortex', 'Localist'],
    tasks: 45,
    uptime: '99.8%'
  },
  {
    id: '2',
    name: 'Builder',
    type: 'Development',
    model: 'Claude Sonnet',
    status: 'active',
    projects: ['ClawCortex'],
    tasks: 12,
    uptime: '100%'
  },
  {
    id: '3',
    name: 'Review',
    type: 'Development',
    model: 'Claude Sonnet',
    status: 'idle',
    projects: ['ClawCortex'],
    tasks: 8,
    uptime: '100%'
  }
]
```

---

## Dependencies

### Required Packages (Already Installed)
- `next@14` - React framework
- `lucide-react` - Icons
- `shadcn/ui` - Component library
- `tailwindcss` - Styling
- `date-fns` - Timestamp formatting

### New Components Created
- `<ActivityFeed>` ✅ (from prototype)
- `<ProjectCard>` ✅ (from prototype)
- No new components required (reuse existing)

---

## Technical Decisions

### Routing Strategy
- **App Router** (Next.js 14): File-based routing
- **Dynamic routes**: `app/projects/[id]/page.tsx`
- **Layouts**: Shared navigation in `app/layout.tsx`

### State Management
- **Phase 1**: None (static mock data in `lib/mock-data.ts`)
- **Phase 2**: TanStack Query for server state (Week 1)
- **Phase 3**: Zustand for client state (Week 3)

### Styling Approach
- **Dark mode**: Default (hardcoded `className="dark"` on `<html>`)
- **Responsive**: Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Components**: Shadcn/ui primitives (Card, Button, Badge)

### Navigation Pattern
- **Sticky top bar**: Always visible (z-50, backdrop-blur)
- **Active state**: Detect current route, highlight nav link
- **Mobile**: Same navigation (no hamburger menu yet—Phase 2)

---

## Known Limitations (Deferred to Phase 2)

1. **No real data**: All mock data (Supabase integration Week 1)
2. **No filtering**: Category/status filters render but don't function
3. **No search**: Search bar not implemented
4. **No actions**: Buttons (New Project, Run Workflow, Save Profile) are visual only
5. **No authentication**: Single-user assumption (Auth in Week 5)
6. **No error handling**: No try/catch, error boundaries (Week 3)
7. **No loading states**: No skeleton screens (Week 4)

---

## Testing Checklist

### Desktop (1920x1080)
- [ ] Navigation visible and clickable
- [ ] All 5 pages render
- [ ] Project cards in 3-column grid
- [ ] Project detail tabs visible
- [ ] Workflow cards in 3-column grid
- [ ] Agent cards in 3-column grid
- [ ] Settings tabs functional

### Tablet (768x1024)
- [ ] Navigation remains horizontal
- [ ] Project cards in 2-column grid
- [ ] All text readable (no truncation)
- [ ] Images/icons scale correctly

### Mobile (375x667)
- [ ] Navigation wraps or scrolls
- [ ] Project cards in 1-column stack
- [ ] Activity feed readable
- [ ] No horizontal overflow

### Cross-Browser
- [ ] Chrome (primary)
- [ ] Safari (test webkit rendering)
- [ ] Firefox (nice-to-have)

---

## Success Metrics

### Completion Criteria
- ✅ All 9 tasks completed
- ✅ All acceptance criteria met
- ✅ Testing checklist passed
- ✅ Code committed to main

### Quality Gates
- Zero console errors on page load
- Lighthouse accessibility score 85+
- All nav links functional
- Dark mode consistent across pages

---

## Next Sprint (Sprint 002)

**Goal**: Connect real data (Supabase + GitHub)

**Key Tasks**:
1. Set up Supabase database schema
2. Seed projects and activity_log tables
3. Replace mock data with Supabase queries
4. GitHub API integration (fetch docs from repos)
5. Real-time activity feed (Supabase Realtime)

**Estimated Duration**: 8 hours (Week 1 of roadmap)

---

## Notes

### Architecture Decisions
- **Workflows as templates**: Global library, projects reference them
- **Agent management**: Lightweight in Phase 1 (detail pages in Phase 3)
- **Project-centric**: Everything lives under a project context

### UI/UX Principles
- **Top-down structure**: Answer/key info first, details below
- **Scannable**: Icons, badges, progress bars for quick insights
- **Consistent**: Same card pattern for projects/workflows/agents

### Team Communication
- Sprint stored in `/sprints/` directory (this file)
- Daily updates in NEXT-SESSION-PROMPT.md
- Blockers logged in GitHub Issues

---

## Sprint Retrospective (Post-Completion)

_Fill out after Sprint 001 is complete_

### What Went Well
- 

### What Could Be Improved
- 

### Action Items for Sprint 002
- 

### Blockers Encountered
- 

### Time Spent
- Estimated: 2 hours
- Actual: ___

---

**Sprint Owner**: Alex  
**Executor**: ClawBot (Builder Agent)  
**Started**: February 22, 2026, 9:58 PM -03  
**Target Completion**: February 22, 2026, 11:58 PM -03  
**Status**: 🟡 In Progress
