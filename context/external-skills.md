# External Skill References

This file captures guidance for external integrations that may be added to Resonance in the future. These are not active runtime dependencies today.

## Current Integration Status

| Integration   | Status                | Use case                                                                    |
| ------------- | --------------------- | --------------------------------------------------------------------------- |
| Chatterbox    | ⏳ Env vars declared  | Primary TTS generation API — called from `src/lib/tts.ts`                  |
| Polar         | ⏳ Env vars declared  | Usage-based billing: voice creation + TTS generation metering               |
| Cloudflare R2 | ⏳ Env vars declared  | Audio file storage for custom voice refs and generation output               |
| Trigger.dev   | Not yet added         | Long-running TTS jobs, batch generation, audio post-processing              |
| Liveblocks    | Not yet added         | Real-time collaboration on voice scripts or shared studio sessions           |

Do not add these packages speculatively. Add them when a specific feature explicitly requires the capability.

## Chatterbox TTS Integration

Resonance uses **Chatterbox** as the TTS provider. Env vars: `CHATTERBOX_API_URL` and `CHATTERBOX_API_KEY` (declared optional in `src/lib/env.ts`, made required when implementing the TTS Studio chapter).

When implementing `src/lib/tts.ts`:

- Wrap ALL Chatterbox SDK/API calls in `src/lib/tts.ts`. Route handlers must not call the API directly.
- The route handler `POST /api/generations` calls `src/lib/tts.ts`, gets audio bytes back, uploads to R2, and saves the `Generation` record.
- Handle rate limits, quota errors, and model errors with structured error responses (see `context/code-standards.md`).
- The generation parameters in the Prisma schema map to Chatterbox parameters: `temperature` → stability, `topP` → similarity, `topK` → top-k, `repetitionPenalty` → repetition penalty.
- Update `context/architecture.md` env var table status from ⏳ to ✅ when integrated.

## Polar Billing Integration

Resonance uses **Polar** for usage-based billing. Env vars: `POLAR_ACCESS_TOKEN`, `POLAR_SERVER`, `POLAR_PRODUCT_ID`, `POLAR_METER_VOICE_CREATION`, `POLAR_METER_TTS_GENERATION`, `POLAR_METER_TTS_PROPERTY`.

Polar meters are event-based: when a user creates a voice or generates audio, the app reports a meter event to Polar. Polar accumulates usage and bills accordingly.

When implementing the billing chapter:

- Voice creation: report a meter event to `POLAR_METER_VOICE_CREATION` when a custom voice is created.
- TTS generation: report a meter event to `POLAR_METER_TTS_GENERATION` with the character count via `POLAR_METER_TTS_PROPERTY`.
- Keep Polar API calls in `src/lib/polar.ts`.
- Use `POLAR_SERVER=sandbox` for development and `production` for live billing.
- Update `context/architecture.md` env var table status from ⏳ to ✅ when integrated.

## Cloudflare R2 Integration

R2 is in the schema (`r2ObjectKey`) but the client is not yet wired up. When adding:

- Create `src/lib/r2.ts` using the AWS S3-compatible SDK (`@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`).
- Required env vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`.
- Expose two server-side helpers: `getPresignedUploadUrl(key, contentType, ttlSeconds)` and `getPresignedDownloadUrl(key, ttlSeconds)`.
- Key conventions: `voices/{orgId}/{voiceId}/ref.{ext}` for custom voice refs, `generations/{orgId}/{generationId}/audio.mp3` for output.
- Never return a raw R2 object URL to the client. Always use short-lived presigned URLs.
- Update `context/architecture.md` and `.env.example` when R2 is wired up.

## Trigger.dev Setup Guidance

Use Trigger.dev when a generation or processing job should run outside the request lifecycle (e.g., long TTS generation, audio normalization, batch generation from a list of scripts).

Setup rules:

- Keep tasks in a `trigger/` directory and export them from `trigger.config.ts`.
- Add `TRIGGER_SECRET_KEY` to env vars.
- Keep Next.js route handlers thin: validate input, enqueue a Trigger task, return a job ID.
- Poll or use Trigger's realtime stream to surface generation progress to the studio page.
- Use the `@trigger.dev/sdk` `task()` or `schemaTask()` pattern with Zod-typed payloads.

When adding Trigger.dev:

1. Write a feature spec under `context/feature-specs/` for the specific use case.
2. Update `context/architecture.md` with the new runtime boundary.
3. Update `context/code-standards.md` with task conventions.
4. Update `.env` with required env vars.
5. Update `context/progress-tracker.md` with the decision.

## Trigger.dev Agent Patterns (for future AI workflows)

If Resonance adds AI-driven workflows (e.g., script optimization, voice recommendation, batch narration), use the simplest durable pattern:

- **Prompt chaining**: sequential LLM steps with validation between steps.
- **Parallelization**: generate multiple voice samples concurrently for A/B preview.
- **Evaluator-optimizer**: generate audio, evaluate quality, retry with adjusted parameters.
- **Human-in-the-loop**: pause for user approval before bulk generation.

Error-handling rules:

- Inspect per-task results from batch runs. Do not assume every task succeeded.
- Preserve typed payloads and outputs across task boundaries.
- Add max attempts and bail conditions for recursive workflows.

## Stripe Integration

When billing is added:

- Use Stripe for subscription management and usage-based billing.
- Org-level subscription: each Clerk org maps to a Stripe customer.
- Usage metering: track character count and audio duration per org per billing period.
- Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to env vars.
- Keep checkout and webhook logic in `src/app/api/stripe/`.
- Webhook must verify the Stripe signature before mutating the database.

## Liveblocks Guidance

Use Liveblocks only if real-time collaboration is explicitly requested (e.g., shared voice script editing, collaborative studio sessions, live annotation of generated audio).

If added:

- Model room IDs from durable IDs (e.g., `studio-session-{id}`, not display names).
- Type Liveblocks presence, storage, and user metadata.
- Handle loading, error, and full-room states explicitly.
- Align Liveblocks UI component CSS variables with `context/ui-context.md`.
- Write a feature spec and update `context/architecture.md` before implementing.

## Documentation Rules

When any of these integrations becomes active:

1. Add or update the matching feature spec under `context/feature-specs/`.
2. Update `context/architecture.md` with the new runtime boundary and env vars.
3. Update `context/code-standards.md` with implementation conventions.
4. Update `.env` with required env var keys and comments.
5. Update `context/progress-tracker.md` with the decision and verification status.
