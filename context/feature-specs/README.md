# Feature Specs

Each feature unit in Resonance has a small Markdown spec describing implementation requirements, scope limits, and completion checks. LLM sessions should read the matching spec before editing source code, then update `context/progress-tracker.md` when the unit changes.

## Current Specs

1. `01-design-system-and-shell.md` — app shell, sidebar navigation, top bar, theme tokens, and reusable UI rules.
2. `02-dashboard.md` — authenticated dashboard: usage stats, recent generations, quick-access CTAs.
3. `03-voice-library.md` — voice library page: browse system + custom voices, filter by category/language/variant.
4. `04-tts-studio.md` — TTS generation studio: text input, voice selection, parameter controls, generate, inline playback.
5. `05-generation-history.md` — generation history: list, playback, download, delete past generations.
6. `06-voice-management.md` — custom voice creation: upload reference audio, name/describe voice, save to org.
7. `07-audio-playback.md` — audio player component: waveform or progress bar, play/pause, seek, download.
8. `08-api-and-settings.md` — settings page: API key display, usage metrics, org member management.
9. `09-multi-tenancy.md` — Clerk org-scoping rules, orgId enforcement across routes and API handlers.

## Rules

- Specs describe expected behavior for this app. Source files remain the final authority for current implementation.
- Keep changes feature-scoped. If a task crosses specs, record it in `progress-tracker.md`.
- Do not mix studio work, voice library work, and settings work in a single change.
- If a future feature adds Trigger.dev, Liveblocks, or Stripe, read `context/external-skills.md` and write a Resonance-specific feature spec before editing runtime code.
- Every feature spec must include "Implementation", "Scope Limits", and "Check When Done" sections.
