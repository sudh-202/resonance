# 02 — Dashboard

Use this spec for changes to the authenticated dashboard page at `/(app)/dashboard`.

Read `context/project-overview.md` for the product context and `context/ui-context.md` for styling rules.

## Implementation

### 1. Page structure

- Route: `src/app/(app)/dashboard/page.tsx` — server component.
- Fetch stats server-side using the Clerk `auth()` `orgId`:
  - Total generations this month (count of `Generation` rows for the org with `createdAt >= start of current month`).
  - Total characters processed this month (sum of `text.length` across those generations).
  - Total voices in the org's voice library (system voices + org custom voices).
- Pass stats as props to a client component for display.

### 2. Stats cards

- Show 3–4 stat cards in a responsive grid (2 columns mobile, 4 columns desktop).
- Stats: Generations this month, Characters processed, Custom voices, (future: Audio minutes).
- Use shadcn `<Card>` with a large number, a label, and a lucide icon.

### 3. Recent generations strip

- Fetch the 5 most recent `Generation` records for the org (ordered by `createdAt desc`).
- Display as a vertical list or small card grid.
- Each item: voice name, truncated text (max 80 chars), timestamp, and an inline play button.
- "View all" link to `/history`.

### 4. Quick-access CTAs

- "Generate Speech" button → links to `/studio`.
- "Add Voice" button → links to `/voices/new`.
- Place these prominently, e.g., above the stats grid or in a hero banner.

### 5. Empty state

- If no generations exist yet, show an empty state with a CTA to open the Studio.

## Scope Limits

- Do not implement audio playback on the dashboard — the play button should link to `/history` scoped to that generation ID, or open a simple modal.
- Keep database queries server-side only.
- Do not add a full usage chart here; save recharts visualization for a future analytics section.

## Check When Done

- Dashboard loads with real stats from the database for the active org.
- Stats grid is responsive on mobile and desktop.
- Recent generations list shows the 5 latest entries.
- Quick-access CTAs navigate correctly.
- Empty state renders when no generations exist.
- Switching Clerk org updates the stats shown.
