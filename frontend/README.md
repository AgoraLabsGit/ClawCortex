# ClawCortex UI - 30-Minute Rapid Prototype

Dark mode Next.js dashboard with real-time activity feed and project progress tracking.

## Features

- ✅ Activity feed with agent status (Builder, Review, Sync)
- ✅ Project cards with GitHub links and progress bars
- ✅ Dark mode (tailwindcss)
- ✅ Responsive layout (grid auto-adjusts)
- ✅ Relative timestamps (`5 minutes ago`, etc.)

## Quick Start (Your Local Machine)

```bash
# Clone the repo
git clone https://github.com/AgoraLabsGit/Claw_Team.git
cd Claw_Team/projects/ClawCortex-UI

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## File Structure

```
app/
  page.tsx           # Main dashboard
  layout.tsx         # Root layout (dark mode)
  globals.css        # Tailwind + dark mode colors
components/
  activity-feed.tsx  # Activity list with status icons
  project-card.tsx   # Project card with progress bar
lib/
  mock-data.ts       # Mock projects + activity (replace with real data)
```

## Next: Real Data Integration

### Phase 1A (tomorrow): Replace Mock Data
- [ ] GitHub API (read from Claw_Team repo)
- [ ] Local file reading (parse memory logs)
- [ ] Supabase connection (activity_log table)

### Phase 1B: Real-Time Updates
- [ ] Supabase Realtime subscription
- [ ] Activity feed auto-updates
- [ ] WebSocket to OpenClaw (agent status)

## Config Files

- `tailwind.config.ts` — Dark mode color scheme
- `tsconfig.json` — TypeScript strict mode
- `next.config.js` — Next.js defaults
- `.eslintrc.json` — ESLint (next recommended)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS (dark mode)
- Lucide React (icons)
- date-fns (timestamps)

---

**Created**: 2026-02-22 21:37 GMT-3  
**Time to first run**: ~5 min (npm install + npm run dev)
