# Resonance

A multi-tenant text-to-audio generation platform built with Next.js — similar to ElevenLabs. Generate high-quality speech from text, manage a library of voices (system + custom clones), and replay your generation history, all scoped to your team's organization.

## Tech Stack

![Tech Stack](./public/tech-stack.png)

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 · React 19 |
| Styling | Tailwind CSS 4 · shadcn/ui (New York) |
| Auth | Clerk (Organizations for multi-tenancy) |
| Database | Prisma 7 · Prisma Postgres |
| Storage | Cloudflare R2 (audio files) |
| Forms | React Hook Form · Zod |
| Charts | Recharts |
| Notifications | Sonner |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd resonance
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL=postgres://...
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

### 3. Set up the database

```bash
npx prisma db push
npx prisma generate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (app)/          # Protected routes (dashboard, voices, studio, history, settings)
│   ├── api/            # Route handlers (generations, voices, R2 presign)
│   ├── sign-in/        # Clerk sign-in page
│   ├── sign-up/        # Clerk sign-up page
│   └── org-selection/  # Clerk org selection page
├── components/
│   ├── ui/             # shadcn/ui primitives (auto-generated)
│   └── ...             # App-specific composite components
├── lib/
│   ├── db.ts           # Prisma client
│   ├── env.ts          # Validated env vars
│   ├── r2.ts           # Cloudflare R2 helpers (presigned URLs)
│   └── tts.ts          # TTS provider wrapper
├── generated/prisma/   # Auto-generated Prisma client (do not edit)
└── proxy.ts            # Clerk middleware
prisma/
└── schema.prisma       # Database schema (Voice + Generation models)
context/                # LLM context docs and feature specs
```

## Core Features

- **Voice Library** — browse system voices + manage org-specific custom voices, filtered by category and language
- **TTS Studio** — text input with voice selection and fine-grained generation parameters (stability, similarity, top-k, repetition penalty)
- **Generation History** — replay, download, or re-run past generations with full parameter snapshots
- **Custom Voices** — upload reference audio to create a voice clone scoped to your organization
- **Multi-Tenancy** — every resource (voices, generations) is isolated per Clerk Organization

## Build

```bash
npm run build
```

## Linting

```bash
npm run lint
```
