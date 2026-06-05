# 03 — Voice Library

Use this spec for changes to the voice library page at `/(app)/voices`.

Read `context/project-overview.md` for the product context and `context/code-standards.md` for data access rules.

## Implementation

### 1. Page structure

- Route: `src/app/(app)/voices/page.tsx` — server component (with filter state passed via URL search params).
- Fetch voices server-side:
  - System voices: `Voice` records where `orgId IS NULL` and `variant = SYSTEM`.
  - Custom voices: `Voice` records where `orgId = activeOrgId` and `variant = CUSTOM`.
  - Combine and pass to the client voice grid.
- Support URL search params for filtering: `?category=PODCAST&language=en-US&variant=SYSTEM`.

### 2. Filter controls

- Client component: category multi-select, language select, variant toggle (All / System / Custom).
- When filters change, update the URL search params and re-render the server component via Next.js navigation.
- Show a "Filters applied" badge when any non-default filter is active.

### 3. Voice card grid

- Responsive grid: 2 columns mobile, 3 columns tablet, 4 columns desktop.
- Each `<VoiceCard>` shows:
  - Voice name (bold).
  - Category badge (`<Badge variant="secondary">`).
  - Language tag (small muted text).
  - Variant indicator: "System" (filled badge) or "Custom" (outline badge).
  - Brief description (2 lines max, truncated).
  - "Use in Studio" button → navigates to `/studio?voiceId={id}`.
  - Sample play button (if `r2ObjectKey` is set on the voice).
- Create `src/components/VoiceCard.tsx` as a client component (needs play button state).

### 4. Empty state

- If no custom voices exist, show an empty state with an "Add Your First Voice" CTA linking to `/voices/new`.
- If filters return no results, show a "No voices match your filters" state with a reset link.

### 5. Add Voice button

- Prominent "Add Voice" button in the page header → links to `/voices/new`.
- Only visible for Custom-eligible users (all authenticated org members can add).

## Scope Limits

- Do not implement voice editing on this page. Voice detail and edit lives at `/voices/[voiceId]`.
- Do not add pagination yet — render up to 100 voices (system + custom combined).
- Sample playback uses a presigned R2 URL; this requires R2 to be wired up first. Use a disabled play button with a tooltip "Coming soon" until then.

## Check When Done

- System voices and org custom voices render in the grid.
- Filters update results without a full page reload.
- VoiceCard shows all required fields.
- "Use in Studio" CTA navigates to the studio with the correct voiceId.
- Empty state renders when no custom voices exist.
- Add Voice button is present and links correctly.
- `context/ui-context.md` VoiceCard pattern is consistent with implementation.
