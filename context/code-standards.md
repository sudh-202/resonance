# Code Standards

## General

- Build against the Resonance TTS platform surface described in `context/project-overview.md`.
- Every protected route and API handler must check Clerk auth and extract `orgId` before touching the database.
- Prefer small, focused changes that respect existing route/component boundaries.
- Use existing helpers and types before creating parallel abstractions.
- Do not mix voice library work, studio work, history work, and settings work in one change.
- For feature work, read the matching `context/feature-specs/*` file before editing source. If no matching spec exists, create or update one when the requested behavior is more than a trivial bug fix.
- Use `rtk` when running shell commands in this workspace.

## TypeScript

- `strict` mode is enabled; keep all new code fully typed.
- Import types from `src/generated/prisma/` (Prisma-generated types) and Zod schemas for domain shapes.
- Never use `any` for database query results — use the generated Prisma types.
- Keep browser-only values behind `'use client'` components, effects, or runtime guards.
- Validate all external/API inputs with Zod before passing them to the database or TTS provider.

## Next.js App Router

- Default to server components for data fetching, layout composition, and metadata.
- Add `'use client'` only for state, effects, browser APIs, event handlers, audio playback, or context consumers.
- Route handlers belong in `src/app/api/**/route.ts`. Keep them thin: validate input, call a service function, return structured JSON.
- Use `auth()` from `@clerk/nextjs/server` inside server components and route handlers to get `userId` and `orgId`.
- Use `Metadata` and `generateMetadata` for page titles and descriptions.
- Protected pages live under `src/app/(app)/` behind the Clerk middleware guard.

## Styling

- Use Tailwind CSS 4 utilities and the CSS variable token system defined in `src/app/globals.css`.
- Use semantic tokens (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, etc.) rather than hardcoded color classes like `bg-gray-900`.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging.
- Dark mode is class-based via `next-themes`. All components must render correctly in both light and dark modes.
- Do not introduce inline styles, CSS-in-JS, or a second styling framework.
- Do not add arbitrary one-off color values; extend the CSS variable system in `globals.css` if a new semantic token is needed.

## shadcn/ui

- shadcn/ui components live in `src/components/ui/` and are the canonical source for all UI primitives: Button, Input, Select, Slider, Dialog, Sheet, Card, Badge, Tabs, etc.
- Install new shadcn components with `npx shadcn@latest add <component>` — do not hand-author them.
- Do not modify files inside `src/components/ui/` unless fixing a bug that cannot be addressed through composition.
- Use lucide-react for all icons (`import { Mic, Play, Pause, Download } from 'lucide-react'`).
- Compose app-specific components in `src/components/` using shadcn primitives.

## Forms

- Use react-hook-form with `@hookform/resolvers/zod` for all forms.
- Define Zod schemas alongside the form component or in a shared `src/lib/schemas/` directory.
- Use shadcn `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` wrappers.
- Never use uncontrolled inputs or raw `useState` for form state.

## Database (Prisma)

- Import the Prisma client from `src/lib/db.ts`.
- Always scope queries to `orgId` for `Voice` (custom) and `Generation` models.
- Use `prisma.$transaction` for multi-step writes.
- After schema changes: run `prisma migrate dev` (local) or `prisma db push` (dev/preview), then `prisma generate`.
- Never edit files in `src/generated/prisma/`.
- Use `select` to fetch only the fields needed; avoid over-fetching.

## Audio Storage (R2)

- All R2 access goes through helpers in `src/lib/r2.ts` (to be created).
- Audio files are never served via public R2 URLs. Always generate presigned URLs with a short TTL.
- Upload flow: client requests a presigned PUT URL from the API, uploads directly to R2, then saves the `r2ObjectKey` to the database.
- Playback flow: client requests a presigned GET URL from the API, uses it as the `src` for an `<audio>` element.
- Key naming convention: `voices/{orgId}/{voiceId}/{filename}` for custom voice refs, `generations/{orgId}/{generationId}/{filename}` for output audio.

## Auth (Clerk)

- Use `auth()` from `@clerk/nextjs/server` in server components and route handlers.
- Use `useAuth()` / `useOrganization()` from `@clerk/nextjs` in client components.
- The active `orgId` is the tenancy boundary. Never skip this check.
- Use Clerk's `OrganizationSwitcher` and `UserButton` for org/user management UI.
- Protect routes via Clerk middleware defined in `src/proxy.ts` or `middleware.ts`.

## File Organization

- `src/app/(app)/` — protected app routes (dashboard, voices, studio, history, settings).
- `src/app/api/` — route handlers (generation, voices, R2 presign, etc.).
- `src/components/ui/` — shadcn/ui primitives (auto-generated, do not hand-edit).
- `src/components/` — app-specific composite components (AudioPlayer, VoiceCard, GenerationForm, WaveformVisualizer, etc.).
- `src/lib/` — utilities and service clients (db, env, r2, utils, tts).
- `src/hooks/` — custom React hooks.
- `src/generated/prisma/` — generated Prisma client (never hand-edit).
- `prisma/schema.prisma` — data model source of truth.
- `context/` — LLM-facing project docs; keep current.
- `context/feature-specs/` — feature-level implementation specs.

## API Route Conventions

- All route handlers return `NextResponse.json(...)`.
- On auth failure: return `{ error: 'Unauthorized' }` with status 401.
- On validation failure: return `{ error: 'Bad request', details: ... }` with status 400.
- On not found: return `{ error: 'Not found' }` with status 404.
- On server error: return `{ error: 'Internal server error' }` with status 500. Log the real error server-side.
- Do not return raw Prisma errors or stack traces to the client.

## Protected Files

- Do not edit `node_modules/`.
- Do not edit `.next/` or build artifacts.
- Do not edit `src/generated/prisma/` — this is auto-generated by `prisma generate`.
- Do not rewrite `package-lock.json` or `pnpm-lock.yaml` unless dependencies are intentionally changed.
