# Architecture Context

## Stack

| Layer            | Technology                                        | Role                                                                              |
| ---------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| Framework        | Next.js 16 App Router                             | Server components, route handlers, metadata, dynamic routes                       |
| Language         | TypeScript 5, React 19                            | Strict typed UI and client/server component code                                  |
| Styling          | Tailwind CSS 4, CSS variables (oklch), shadcn/ui  | Utility-first UI, CSS-variable token system, dark/light mode                      |
| UI Primitives    | shadcn/ui (New York, neutral), Radix UI           | All form, dialog, popover, select, slider, and card primitives                    |
| Icons            | lucide-react                                      | All icon usage throughout the app                                                 |
| Auth             | Clerk (`@clerk/nextjs` v7)                        | Sign-in/up, session management, Organizations for multi-tenancy                   |
| Database         | Prisma 7 + Prisma Postgres (`db.prisma.io`)       | `Voice` and `Generation` models, org-scoped queries                               |
| Audio Storage    | Cloudflare R2                                     | Reference audio for custom voices, output audio for generations                   |
| TTS Provider     | Chatterbox (`CHATTERBOX_API_URL` + `_API_KEY`)    | Text-to-speech generation API — called from `src/lib/tts.ts`                     |
| Billing          | Polar (`POLAR_ACCESS_TOKEN` + meters)             | Usage-based billing: voice creation meter + TTS generation meter + TTS property   |
| Forms            | react-hook-form + Zod                             | Validated forms for text generation, voice creation, settings                     |
| Notifications    | Sonner                                            | Toast feedback for generation status, errors, and success                         |
| Charts           | Recharts                                          | Dashboard usage metrics (generation count, character usage, audio duration)       |
| Theme            | next-themes                                       | Class-based dark/light mode, default system preference                            |
| Animation        | tw-animate-css                                    | Entrance/exit animations via Tailwind utility classes                             |

## Runtime Shape

- Root layout is `src/app/layout.tsx`. It wraps children in `ClerkProvider`, applies Geist Sans/Mono fonts, mounts the `Toaster`, and sets base body styles.
- App shell (sidebar, top nav, content area) will be implemented as a nested layout under `src/app/(app)/layout.tsx` once the shell is built.
- Public (unauthenticated) routes: `/` (marketing or redirect), `/sign-in`, `/sign-up`.
- Protected (authenticated) routes: everything under `(app)/` — dashboard, voices, studio, history, settings.
- Clerk middleware in `src/proxy.ts` (or `middleware.ts`) protects the `(app)` segment and exposes `orgId` / `userId` to route handlers.
- DB client is initialized in `src/lib/db.ts` using `@prisma/adapter-pg` for edge-compatible connections.
- Env vars are validated via `@t3-oss/env-nextjs` in `src/lib/env.ts`.

## System Boundaries

- `src/app/(app)/` — protected app routes: dashboard, voice library, TTS studio, history, settings.
- `src/app/api/` — route handlers for TTS generation, R2 presigned URLs, voice CRUD.
- `src/components/ui/` — shadcn/ui components (all auto-generated, do not hand-edit).
- `src/components/` — app-specific composite components (voice cards, audio player, waveform, generation form).
- `src/lib/` — utilities: `db.ts` (Prisma client), `env.ts` (validated env vars), `utils.ts` (cn helper), `r2.ts` (R2 client and helpers — to be added).
- `src/hooks/` — custom React hooks (e.g., `use-mobile.ts`, future `use-audio-player.ts`).
- `src/generated/prisma/` — auto-generated Prisma client output. Never edit directly.
- `prisma/schema.prisma` — single source of truth for the data model.
- `context/` — LLM-facing project documentation. Keep current.
- `context/feature-specs/` — feature-level implementation specs.

## Storage Model

- **Prisma Postgres** (`db.prisma.io`): primary relational store for `Voice` and `Generation` records. Connection string in `DATABASE_URL`.
- **Cloudflare R2** (to be configured): binary object store for audio files. Two uses:
  - Custom voice reference audio: stored at a key referenced by `Voice.r2ObjectKey`.
  - Generated audio output: stored at a key referenced by `Generation.r2ObjectKey`.
  - R2 access via presigned URLs for upload (from browser) and download/streaming (to audio player).
- **No local fallback data**: unlike a public browsing app, all data requires authentication and a live database connection.

## Auth and Access Model

- Authentication is Clerk-based. No Supabase Auth, NextAuth, or custom JWT.
- Multi-tenancy is Clerk Organizations. Every protected resource (`Voice` with orgId, `Generation`) is scoped to `orgId`.
- System voices (`Voice.orgId = null`, `variant = SYSTEM`) are readable by all authenticated users.
- Custom voices (`Voice.orgId = <orgId>`, `variant = CUSTOM`) are readable/editable only by members of the owning org.
- Generations are org-scoped and never visible to other orgs.
- Route handlers must extract `orgId` from the Clerk session (via `auth()`) before any DB query.
- The `org-selection` page at `/org-selection` handles the Clerk org selection flow.

## Environment Variables

| Variable                            | Status          | Purpose                                                  |
| ----------------------------------- | --------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ Set          | Clerk public key for client-side SDK                     |
| `CLERK_SECRET_KEY`                  | ✅ Set          | Clerk secret key for server-side API                     |
| `DATABASE_URL`                      | ✅ Set          | Prisma Postgres connection string                        |
| `APP_URL`                           | ⏳ Future       | Public application URL (used for Polar webhooks etc.)    |
| `CHATTERBOX_API_URL`                | ⏳ Future       | Chatterbox TTS API base URL                              |
| `CHATTERBOX_API_KEY`                | ⏳ Future       | Chatterbox TTS API key                                   |
| `R2_ACCOUNT_ID`                     | ⏳ Future       | Cloudflare account ID for R2                             |
| `R2_ACCESS_KEY_ID`                  | ⏳ Future       | R2 S3-compatible access key                              |
| `R2_SECRET_ACCESS_KEY`              | ⏳ Future       | R2 S3-compatible secret key                              |
| `R2_BUCKET_NAME`                    | ⏳ Future       | R2 bucket name for audio files                           |
| `POLAR_ACCESS_TOKEN`                | ⏳ Future       | Polar billing API access token                           |
| `POLAR_SERVER`                      | ⏳ Future       | `sandbox` or `production`                                |
| `POLAR_PRODUCT_ID`                  | ⏳ Future       | Polar product/plan ID                                    |
| `POLAR_METER_VOICE_CREATION`        | ⏳ Future       | Polar meter slug for voice creation events               |
| `POLAR_METER_TTS_GENERATION`        | ⏳ Future       | Polar meter slug for TTS generation events               |
| `POLAR_METER_TTS_PROPERTY`          | ⏳ Future       | Polar meter property key (e.g., character count)         |

All ⏳ Future vars are declared as optional in `src/lib/env.ts` and will be made required when the corresponding chapter implements that service.

## Routing Map

- `/` — landing or redirect (unauthenticated → `/sign-in`, authenticated → `/dashboard`)
- `/sign-in`, `/sign-up` — Clerk auth pages
- `/org-selection` — Clerk org selection/creation page
- `/(app)/dashboard` — usage summary, recent generations, quick-access CTA
- `/(app)/voices` — voice library: browse system voices + org's custom voices, filter by category/language
- `/(app)/voices/[voiceId]` — voice detail: description, sample playback, use in studio CTA
- `/(app)/voices/new` — create custom voice: upload reference audio, set name/description/category
- `/(app)/studio` — TTS generation studio: text input, voice selector, parameter controls, generate, inline playback
- `/(app)/history` — generation history: list past generations, playback, download, delete
- `/(app)/settings` — org settings: API keys, usage, member management

## Invariants

1. `orgId` must be validated from the Clerk session on every route handler that touches Voice or Generation data. Never trust a client-provided orgId.
2. System voices (orgId null) are read-only to all users. Only platform admins can seed/modify them.
3. Generated audio files in R2 must be accessed through presigned URLs, never via public bucket URLs.
4. The Prisma client (`src/generated/prisma/`) is auto-generated — run `prisma generate` after schema changes, never edit generated files.
5. All forms must use react-hook-form + Zod schemas. No raw `useState` form state.
6. New UI components should extend shadcn/ui primitives. Do not introduce a second component library.
7. Route handlers that call external services (TTS provider, R2) must handle errors and return structured JSON error responses.
8. LLM sessions should follow `context/ai-workflow-rules.md` and the matching `context/feature-specs/` file before non-trivial implementation.
