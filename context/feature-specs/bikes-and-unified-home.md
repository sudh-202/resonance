# 09 — Multi-Tenancy and Org Scoping

Use this spec for changes to the Clerk Organizations integration, `orgId` enforcement across routes and API handlers, and the org-selection flow.

Read `context/architecture.md` → "Auth and Access Model" and `context/code-standards.md` → "Auth (Clerk)" before implementing.

## Implementation

### 1. Clerk middleware (`src/proxy.ts`)

- `src/proxy.ts` uses `clerkMiddleware` and `createRouteMatcher` to protect all routes.
- Public routes: `/sign-in(.*)`, `/sign-up(.*)`.
- Org-selection route: `/org-selection(.*)` — authenticated but no org required.
- All other routes: require both `userId` (redirect to `/sign-in` if missing) and `orgId` (redirect to `/org-selection` if missing).
- The current implementation in `src/proxy.ts` is **complete** — do not restructure it.

### 2. Org selection page (`/org-selection`)

- Route: `src/app/org-selection/page.tsx` (exists and is **complete**).
- Uses Clerk's `<OrganizationList hidePersonal>` with `afterCreateOrganizationUrl="/"` and `afterSelectOrganizationUrl="/"`.
- After org selection, redirects to `/` (which should redirect to `/dashboard` once the app layout is built).

### 3. `orgId` enforcement pattern

Every server-side handler (server component, route handler, server action) that reads or writes `Voice` or `Generation` data must follow this pattern:

```ts
const { userId, orgId } = await auth();
if (!userId || !orgId) return /* 401 or redirect */;
// Use orgId in all Prisma queries
```

- Never accept `orgId` from the request body or query params — always extract from the Clerk session.
- For system voices (readable by all orgs), `orgId` is still required for the session, but the query does not filter by it.

### 4. Org-switching behavior

- When the user switches orgs via `<OrganizationSwitcher>`, Clerk refreshes the session token.
- The App Router server components re-render with the new `orgId` automatically on navigation.
- Client components that cache org-specific data must re-fetch when `orgId` changes.

### 5. System voice seeding

- System voices (`orgId: null`, `variant: SYSTEM`) should be seeded via a Prisma seed script (`prisma/seed.ts`).
- Use `upsert` with the voice `name` as the unique identifier — the script must be idempotent.
- Do not seed system voices from a route handler or on app startup.

### 6. Access control matrix

| Resource      | Read                      | Write / Delete               |
| ------------- | ------------------------- | ----------------------------- |
| System Voice  | Any authenticated user    | Platform admin only (no UI)   |
| Custom Voice  | Members of owning org     | Members of owning org         |
| Generation    | Members of owning org     | Members of owning org         |
| API Key       | Members of owning org     | Admin of owning org           |

## Scope Limits

- Do not implement role-based access within an org (Admin vs Member) in the first iteration. All org members have equal access to voices and generations.
- Do not build a custom org management UI — use Clerk's components.
- Do not store Clerk user or org metadata in Prisma unless required by a specific feature.

## Check When Done

- Unauthenticated requests to protected routes are redirected to `/sign-in`.
- Authenticated users with no active org are redirected to `/org-selection`.
- All route handlers extract `orgId` from Clerk session, never from the request body.
- Switching orgs causes data to reload with the correct org's context.
- System voices are readable by all orgs but not writable via org CRUD routes.
- Seed script creates system voices idempotently.
