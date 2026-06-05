# Progress Tracker

Update this file after every meaningful implementation change.

---

## ✅ Chapter 1 Complete — Project Setup, Auth & Database (2026-06-05)

Goal: Working app with auth, multi-tenancy & DB models. **All 3 parts done.**

### Part 1: Next.js Setup ✅

- `create-next-app` with TypeScript, Tailwind CSS, App Router, `src/` directory.
- `shadcn init` — New York style, neutral base color, CSS variables enabled.
- `shadcn add --all` — full component library scaffolded in `src/components/ui/`.
- `globals.css` → oklch-based theme tokens (`:root` light + `.dark` dark).
- `layout.tsx` → Geist font + Sonner `<Toaster>`.
- `use-mobile.ts` → 1024px breakpoint hook.

### Part 2: Clerk Authentication ✅

- `npm install @clerk/nextjs` v7.
- `.env` keys: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.
- Pages created:
  - `/sign-in/[[...sign-in]]/page.tsx` — Clerk `<SignIn>` component.
  - `/sign-up/[[...sign-up]]/page.tsx` — Clerk `<SignUp>` component.
  - `/org-selection/page.tsx` — `<OrganizationList hidePersonal>` for multi-tenancy.
- `src/proxy.ts` — `clerkMiddleware` with:
  - Public routes: `/sign-in`, `/sign-up`.
  - Unauthenticated → redirect to `/sign-in`.
  - Authenticated but no org → redirect to `/org-selection`.
  - All other routes protected and org-gated.

### Part 3: Prisma DB ✅

- `npm install @prisma/client @prisma/adapter-pg @t3-oss/env-nextjs pg`.
- `prisma/schema.prisma` — two models:
  - `Voice` (id, orgId, name, description, category: VoiceCategory, language, variant: VoiceVariant, r2ObjectKey).
  - `Generation` (id, orgId, voiceId, text, voiceName, r2ObjectKey, temperature, topP, topK, repetitionPenalty).
  - `VoiceVariant` enum: SYSTEM | CUSTOM.
  - `VoiceCategory` enum: 12 categories (AUDIOBOOK, PODCAST, CONVERSATIONAL, etc.).
- `DATABASE_URL` points to Prisma Postgres (`db.prisma.io`).
- `engineType: library` set for Vercel edge compatibility.
- `postinstall` script runs `prisma generate` automatically.
- Prisma client generated into `src/generated/prisma/`.
- **Key design decisions** (per course):
  - `onDelete: SetNull` on Voice→Generation relation: deleting a voice keeps the generation's `voiceName` intact.
  - `orgId` optional on Voice (null = system voice), required on Generation.
  - `r2ObjectKey` on both models = Cloudflare R2 object path.
- `src/lib/db.ts` — Prisma singleton using `globalForPrisma` pattern: prevents connection pool exhaustion during Next.js hot reload.
- `src/lib/env.ts` — t3-env with Zod validation. `DATABASE_URL` required now; all other vars (Polar, R2, Chatterbox) declared optional until their chapters.
- `prisma/migrations/20260324012112_init/` — initial migration already applied. ✅ `prisma migrate dev` done.
- `src/app/test/page.tsx` — test page renders voice list from DB to verify connection. ✅ Checkpoint complete.
- `prisma.config.ts` — Prisma config using `defineConfig` with dotenv for datasource URL.

### Chapter 1 Key Concepts Checklist

| Concept | File | Status |
|---|---|---|
| shadcn/ui copy-paste components | `src/components/ui/` (56 components), `components.json` New York style | ✅ |
| Tailwind v4 oklch color space | `src/app/globals.css` — `@import "tailwindcss"` + oklch() tokens in `:root`/`.dark` | ✅ |
| Clerk middleware — edge route protection | `src/proxy.ts` (logic) + `src/middleware.ts` (Next.js entry point) | ✅ fixed* |
| Org enforcement — team-based arch | `proxy.ts` redirects to `/org-selection` if `!orgId`; `hidePersonal` on OrganizationList | ✅ |
| Prisma driver adapter — direct PG connection | `src/lib/db.ts` uses `PrismaPg` from `@prisma/adapter-pg` with singleton pattern | ✅ |
| t3-env — build-time validation | `src/lib/env.ts` uses `createEnv` from `@t3-oss/env-nextjs` + Zod schemas | ✅ |

\* **Bug fixed:** `src/proxy.ts` had the correct middleware logic but Next.js requires the file to be named `src/middleware.ts`. Created `src/middleware.ts` that re-exports `default` and `config` from `src/proxy.ts`. Route protection was not being applied before this fix.

### Also completed in this session

- Updated all context docs for the Resonance TTS platform (replaced CAR&BIKE content).
- Rewrote all 9 feature specs for the TTS platform feature surface.
- Updated README.md with project description, tech stack table, and structure overview.
- Discovered full tech stack from `env.ts`: **Chatterbox** for TTS, **Polar** for usage-based billing.
- Updated `context/architecture.md` and `context/external-skills.md` with Chatterbox and Polar details.

### Not Yet Built

- App shell: authenticated layout with sidebar navigation, top bar, org switcher.
- Voice library page (`/voices`) with system voice browse and filtering.
- TTS Studio page (`/studio`) with text input, voice selection, and generation.
- Generation API route (`POST /api/generations`).
- Generation history page (`/history`) with audio playback.
- Voice creation page (`/voices/new`) for custom voice upload.
- Cloudflare R2 client and presigned URL helpers (`src/lib/r2.ts`).
- TTS provider integration (`src/lib/tts.ts`).
- Dashboard page (`/dashboard`) with usage stats.
- Settings page (`/settings`).
- Database seeding for system voices.

---

## Open Questions

- Which TTS provider to use? (ElevenLabs API, Cartesia, Kokoro, self-hosted model?)
- What audio format for generated files? (mp3 is most compatible)
- Should generation be synchronous (streamed in-request) or async (background job via Trigger.dev)?
- What are the voice parameter ranges? (temperature: 0–1, topP: 0–1, topK: 1–100, repetitionPenalty: 0–2?)
- Custom voice cloning: is it built on top of the TTS provider's voice cloning API or a separate model?
- Billing model: per-character, per-generation, or subscription-based?
- Should system voices be seeded via a migration script or admin UI?
