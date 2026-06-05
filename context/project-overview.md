# Resonance — Project Overview

## Overview

Resonance is a multi-tenant text-to-audio generation SaaS platform similar to ElevenLabs. Users (organized into Clerk Organizations) can browse a curated library of system voices, create custom cloned voices, generate speech from text with fine-grained model parameters, and manage their audio generation history. Generated audio files are stored in Cloudflare R2 and streamed back to the client for playback and download.

## Goals

1. Let users generate high-quality speech from text by selecting a voice and tuning generation parameters (temperature, topP, topK, repetition penalty).
2. Provide a rich voice library with system-curated voices organized by category (audiobook, podcast, conversational, etc.) and user-uploaded custom voices.
3. Persist every generation with its full parameter set so users can replay, download, and re-run past generations.
4. Support multi-tenant isolation through Clerk Organizations — each org has its own voice library, generation history, and usage quota.
5. Expose a clean, professional audio-studio interface that matches the quality of tools like ElevenLabs.

## Core User Flows

1. User signs in via Clerk, selects or creates an organization, and lands on the dashboard.
2. User opens the Voice Library at `/voices` to browse system voices filtered by category, language, or search term, and to manage their org's custom voices.
3. User opens the TTS Studio at `/studio`, types or pastes text, selects a voice, optionally tunes generation settings, and clicks Generate. The audio is streamed back and played inline. The generation is saved to history.
4. User opens Generation History at `/history` to replay past generations, view their parameter snapshot, download the audio file, or delete a record.
5. User opens Voice Management at `/voices/new` to upload reference audio clips and create a custom voice clone attached to their organization.
6. Admin/owner opens Settings at `/settings` to view API usage, manage organization members, and configure billing.

## Current Feature Surface

### Foundation (set up)

- Next.js 16 App Router with Clerk auth and Clerk Organizations.
- Prisma 7 schema with `Voice` and `Generation` models backed by Prisma Postgres.
- Cloudflare R2 object keys stored on both models for audio file references.
- shadcn/ui component library (New York style, neutral base, lucide icons) fully scaffolded.
- `next-themes` installed for dark/light mode support.
- Sonner for toast notifications.

### Not Yet Built

- Voice library UI and data seeding.
- TTS Studio page and generation API route.
- Generation history page with audio player.
- Voice creation / cloning UI.
- R2 upload/download integration.
- Dashboard with usage stats.
- Settings page.

## Data Model

### Voice

Represents a voice that can be used for generation. System voices (`variant: SYSTEM`) ship with the platform. Custom voices (`variant: CUSTOM`) are owned by an org.

- `id` — cuid
- `orgId` — nullable (null = platform-wide system voice)
- `name`, `description`
- `category` — VoiceCategory enum (AUDIOBOOK, CONVERSATIONAL, CUSTOMER_SERVICE, GENERAL, NARRATIVE, CHARACTERS, MEDITATION, MOTIVATIONAL, PODCAST, ADVERTISING, VOICEOVER, CORPORATE)
- `language` — BCP-47 language tag, default `en-US`
- `variant` — SYSTEM | CUSTOM
- `r2ObjectKey` — reference audio file in R2 (for custom voices)

### Generation

Represents a single TTS run. Stores the full parameter snapshot and a reference to the output audio file in R2.

- `id` — cuid
- `orgId` — owning organization
- `voiceId` / `voiceName` — voice used (name denormalized for history display if voice is deleted)
- `text` — input text
- `r2ObjectKey` — output audio file in R2
- `temperature`, `topP`, `topK`, `repetitionPenalty` — model params

## Scope

### In Scope

- Voice library browse, filter, and detail views.
- TTS generation studio with live parameter controls and inline audio playback.
- Generation history with playback, download, and delete.
- Custom voice creation via audio upload and R2.
- Clerk org-based multi-tenancy for voices and generations.
- Dashboard usage metrics (generation count, character count, audio duration).
- Settings for API keys and org management.

### Out of Scope Unless Explicitly Requested

- Real-time collaboration on voice or generation drafts.
- Background scheduled generation jobs (Trigger.dev not yet added).
- Billing and Stripe integration (planned but not started).
- Public-facing marketing or landing page.
- Podcast or audiobook editing workflows.

## Success Criteria

1. A fresh local run authenticates through Clerk and loads the shell without errors.
2. Voice library renders system voices from the database.
3. TTS Studio accepts text input, selects a voice, calls the generation API, and plays back audio.
4. Every generation is persisted with its full parameter snapshot and retrievable from history.
5. Custom voices are org-scoped and do not leak across organizations.
6. Context docs are updated whenever stack, routes, storage, or product scope changes.
