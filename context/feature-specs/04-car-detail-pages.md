# 04 — TTS Studio

Use this spec for changes to the TTS generation studio at `/(app)/studio`.

Read `context/project-overview.md` for the product context, `context/code-standards.md` for API and form standards, and `context/ui-context.md` for the generation form pattern.

## Implementation

### 1. Page layout

- Route: `src/app/(app)/studio/page.tsx` — server component that pre-fetches the voice list and optionally a pre-selected voice from `?voiceId=` search param.
- Two-column desktop layout: left column (text input + voice selector + generate button), right column (advanced params + generated audio player).
- Stacks to single-column on mobile (text → voice → params → player, top to bottom).
- Wrap the interactive form in a `StudioForm` client component.

### 2. Text input

- `<Textarea>` with placeholder "Enter your text here...".
- Show a character count below (e.g., "342 / 5000 characters").
- Enforce a max character limit (e.g., 5000 chars). Disable generate if exceeded.
- Auto-resize the textarea as the user types (CSS `field-sizing: content` or a resize hook).

### 3. Voice selector

- `<Select>` or `<Combobox>` populated with voices (system + org custom).
- Group options by variant (System, Custom) and sort by category within each group.
- Show the selected voice's category and language as secondary info.
- Pre-populate from `?voiceId=` search param.

### 4. Advanced parameters (collapsible)

- Wrap in a shadcn `<Collapsible>` labeled "Advanced Settings".
- Four sliders (shadcn `<Slider>`), each with a label and live numeric value display:
  - **Stability** (maps to `temperature`): 0.0 – 1.0, default 0.5.
  - **Similarity** (maps to `topP`): 0.0 – 1.0, default 0.75.
  - **Top-K** (`topK`): 1 – 100, default 50.
  - **Repetition Penalty** (`repetitionPenalty`): 0.0 – 2.0, default 1.1.
- Show a "Reset to defaults" link.

### 5. Generate button and loading state

- Primary `<Button>` labeled "Generate Speech" with a Mic icon.
- While generating:
  - Show a spinner inside the button and label "Generating...".
  - Disable text input, voice selector, parameter sliders.
- On success: show the audio player in the right column (or below on mobile).
- On error: show a sonner toast with the error message.

### 6. Generation API route

- `POST /api/generations` — route handler at `src/app/api/generations/route.ts`.
- Input (Zod-validated): `{ voiceId: string, text: string, temperature: number, topP: number, topK: number, repetitionPenalty: number }`.
- Server steps:
  1. `auth()` — extract `userId` and `orgId`. Return 401 if missing.
  2. Validate input with Zod schema.
  3. Fetch the voice record; ensure it's accessible (system or org-owned). Return 404 if not.
  4. Call `src/lib/tts.ts` with the text and parameters to generate audio bytes.
  5. Upload the audio to R2 via `src/lib/r2.ts`. Store at `generations/{orgId}/{generationId}/audio.mp3`.
  6. Create the `Generation` record in Prisma with the full parameter snapshot.
  7. Return `{ generationId, audioUrl }` where `audioUrl` is a short-lived presigned GET URL.
- Return structured errors for all failure cases (see `context/code-standards.md`).

### 7. Audio playback after generation

- On success, render the `<AudioPlayer>` component (see spec `07-audio-playback.md`) with the returned `audioUrl`.
- Show the generation metadata: voice name, character count, timestamp.
- Include a "Save to History" label (it is auto-saved — just confirm it visually).

## Scope Limits

- Do not implement voice preview playback on this page — that belongs in the voice library.
- Do not store audio in the browser (`localStorage`, `IndexedDB`) — R2 is the source of truth.
- Do not implement streaming audio (byte-by-byte) in the first iteration — return a complete audio URL.
- TTS provider integration lives in `src/lib/tts.ts`, not in the route handler.

## Check When Done

- Studio page renders with text input, voice selector, and parameter sliders.
- Submitting the form calls `POST /api/generations` with the correct payload.
- Loading state disables all inputs during generation.
- On success, the audio player appears with playback working.
- On error, a toast is shown.
- The `Generation` record appears in the database with the correct `orgId` and parameter snapshot.
- Switching org clears the studio state or reloads voices for the new org.
