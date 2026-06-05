# 05 — Generation History

Use this spec for changes to the generation history page at `/(app)/history`.

Read `context/code-standards.md` for data access rules and `context/ui-context.md` for component patterns.

## Implementation

### 1. Page structure

- Route: `src/app/(app)/history/page.tsx` — server component.
- Fetch `Generation` records for `orgId`, ordered by `createdAt DESC`, with pagination (page size 20).
- Pass records and pagination metadata to a client component for rendering.

### 2. History list

- Render as a vertical list or table (`<Table>` from shadcn/ui).
- Each row shows:
  - Voice name (`voiceName` — the denormalized field).
  - Truncated text (first 100 chars, with a "Show more" expander).
  - Date/time (formatted, relative for recent items — use `date-fns`).
  - Audio player (inline, compact — play/pause + duration, no waveform needed here).
  - Download button (presigned R2 URL, `Content-Disposition: attachment`).
  - Delete button (with confirmation dialog).
  - "Re-run in Studio" button → navigates to `/studio` with pre-filled voice and text.
- Audio URL for each row: fetched client-side via `GET /api/generations/{id}/audio-url` to get a fresh presigned URL on demand (not pre-fetched on page load to avoid URL expiry).

### 3. Filtering and search

- Client-side filter bar at the top:
  - Text search (filters by `text` content, client-side on loaded records).
  - Voice filter (`<Select>` populated from distinct voice names in the loaded records).
  - Date range picker (`react-day-picker`) — optional, lower priority.
- Filter state lives in component state, not URL params (for history this is acceptable).

### 4. Pagination

- "Load more" button at the bottom (infinite scroll or manual) rather than numbered pages.
- Fetch next page via a client action calling `GET /api/generations?page=N&pageSize=20`.

### 5. Delete generation

- "Delete" button on each row opens a shadcn `<AlertDialog>` confirming deletion.
- On confirm: call `DELETE /api/generations/{id}`. The handler:
  1. `auth()` — verify `orgId` owns this generation.
  2. Delete the R2 object (`r2ObjectKey`).
  3. Delete the `Generation` record.
  4. Return `{ success: true }`.
- On success: remove the row from the list without a full refresh.

### 6. Empty state

- If no generations exist, render a centered empty state with an illustration/icon, a message "No generations yet", and a "Generate Speech" CTA linking to `/studio`.

## Scope Limits

- Do not implement bulk delete in the first iteration.
- Do not implement full-text search against the database — client-side filtering of the loaded page is sufficient.
- Presigned audio URLs are fetched on demand (when the user hits play), not on page load.

## Check When Done

- History page loads the org's generations, most recent first.
- Each row shows voice name, truncated text, timestamp, and action buttons.
- Inline audio player plays the generation audio.
- Download button triggers a file download.
- Delete flow shows a confirmation dialog and removes the row on success.
- "Re-run in Studio" button pre-fills the studio correctly.
- Empty state renders when no generations exist.
