# 08 — API Keys and Settings

Use this spec for changes to the settings page at `/(app)/settings`.

Read `context/architecture.md` for the auth model and `context/code-standards.md` for API conventions.

## Implementation

### 1. Page structure

- Route: `src/app/(app)/settings/page.tsx` — server component.
- Tabs (shadcn `<Tabs>`):
  - **General** — org name, display preferences.
  - **API Keys** — generate and manage API keys for the Resonance REST API.
  - **Usage** — generation statistics for the current billing period.
  - **Members** — Clerk organization member management.

### 2. General tab

- Display the org name (from Clerk `organization.name`).
- Link to Clerk's hosted organization settings if available.
- Theme preference (light / dark / system) — persisted in `localStorage` via `next-themes`.

### 3. API Keys tab

- Display a list of API keys for the org (stored in a future `ApiKey` Prisma model — spec this model when implementing).
- Each key shows: name, created date, last used date, key prefix (e.g., `sk_live_...****`).
- "Create API Key" button:
  - Opens a `<Dialog>` to name the key.
  - On confirm: generate a secure random token server-side, hash it, store the hash in the database, and display the plaintext token **once** with a copy button and a warning "Store this key — it will not be shown again".
- Revoke key: `<AlertDialog>` confirmation, then `DELETE /api/keys/{id}`.
- Note: API key functionality requires adding an `ApiKey` model to the Prisma schema. Do this in the same task.

### 4. Usage tab

- Fetch aggregated `Generation` stats for the current month for the active org:
  - Total generations.
  - Total characters processed.
  - Approximate audio minutes (estimate from character count or store duration).
- Display using recharts `<BarChart>` showing daily generation counts for the last 30 days.
- Static usage limits display (placeholder until billing is added): "Characters this month: 12,450 / 100,000".

### 5. Members tab

- Embed Clerk's `<OrganizationProfile>` component or use the Clerk API to list members.
- Show each member's name, email, role (Admin / Member), and join date.
- "Invite Member" button opens Clerk's invitation flow.
- "Remove Member" for admins (uses Clerk API).
- Note: full member management is handled by Clerk. Do not build a custom member table backed by Prisma.

## Scope Limits

- Do not implement billing or Stripe integration in this spec — usage limits are placeholder values.
- API keys are a stub in this spec — skip the `ApiKey` model if implementing other tabs first.
- Do not build a custom member management system. Delegate to Clerk.

## Check When Done

- Settings page renders all four tabs.
- General tab shows the org name.
- API Keys tab lists keys (empty state if none) and supports create + revoke.
- Usage tab shows real generation counts from the database.
- Members tab renders the org's current members.
- All settings are org-scoped and do not leak across organizations.
