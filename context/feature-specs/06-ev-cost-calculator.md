# 06 — Voice Management

Use this spec for custom voice creation and editing at `/(app)/voices/new` and `/(app)/voices/[voiceId]`.

Read `context/code-standards.md` for R2 upload conventions and Prisma access rules.

## Implementation

### 1. Create custom voice page (`/voices/new`)

- Route: `src/app/(app)/voices/new/page.tsx` — client component (needs file upload state).
- Form fields (react-hook-form + Zod):
  - **Name** (required, string, 1–64 chars).
  - **Description** (optional, string, max 256 chars).
  - **Category** (`<Select>`, required, maps to `VoiceCategory` enum).
  - **Language** (`<Select>` or text input, default `en-US`).
  - **Reference Audio** (file input, required for custom voices, accepts `.mp3`, `.wav`, `.m4a`, max 50 MB).
- Submit button: "Create Voice".

### 2. Reference audio upload flow

- On form submit:
  1. Client calls `POST /api/voices/upload-url` with `{ filename, contentType }`.
  2. Server returns a presigned R2 PUT URL and the final `r2ObjectKey`.
  3. Client uploads the file directly to R2 using the presigned URL (`fetch(presignedUrl, { method: 'PUT', body: file })`).
  4. Client calls `POST /api/voices` with the form data + `r2ObjectKey`.
  5. Server creates the `Voice` record in Prisma with `variant: CUSTOM` and `orgId` from Clerk session.
- Show upload progress (use a `<Progress>` bar during R2 upload).
- On success: redirect to `/voices` with a success toast.

### 3. Voice detail / edit page (`/voices/[voiceId]`)

- Route: `src/app/(app)/voices/[voiceId]/page.tsx` — server component.
- Fetch the `Voice` record. Verify it belongs to the active org (or is a system voice for read-only view).
- Display: name, description, category, language, variant, creation date.
- For custom voices (org-owned): show an "Edit" button that opens an inline form or links to `/voices/[voiceId]/edit`.
- Edit form: same fields as create, but reference audio upload is optional (keep existing if not replaced).
- Delete button: confirm via `<AlertDialog>`, then `DELETE /api/voices/{id}` (also deletes R2 object).
- "Use in Studio" CTA → `/studio?voiceId={id}`.

### 4. API routes

- `POST /api/voices/upload-url` — returns a presigned PUT URL for R2. Auth required, org-scoped key.
- `POST /api/voices` — creates a `Voice` record. Validates that the `r2ObjectKey` belongs to the expected org prefix.
- `PATCH /api/voices/[id]` — updates name/description/category/language/r2ObjectKey for org-owned voices.
- `DELETE /api/voices/[id]` — deletes R2 object and `Voice` record. Verifies org ownership.

## Scope Limits

- Do not implement AI-based voice cloning in the first iteration — the reference audio is stored and associated with the voice. The TTS provider handles the actual cloning when it is integrated.
- System voices (`variant: SYSTEM`) are read-only. The create/edit/delete UI must not render for system voices.
- File size validation must happen client-side (before upload) and server-side (check `contentType` and key prefix).

## Check When Done

- Create voice form submits, uploads to R2, and creates a `Voice` record.
- The new voice appears in the voice library.
- Edit form updates the voice metadata.
- Delete flow removes the voice and its R2 object.
- System voices are not editable or deletable from the UI.
- Upload progress is shown during R2 file transfer.
- Switching orgs does not allow editing another org's custom voices.
