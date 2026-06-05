# 01 — Design System and Shell

Use this spec for changes to global styling, the app shell (sidebar + top bar), layout wrappers, and reusable UI components.

Read `context/ui-context.md` before implementing. Resonance uses a CSS variable–based token system (oklch), shadcn/ui New York style, Geist fonts, and Tailwind CSS 4.

## Implementation

### 1. Root layout (`src/app/layout.tsx`)

- Wrap children in `<ClerkProvider>`.
- Apply `Geist` (sans) and `Geist_Mono` fonts via `next/font/google`.
- Mount `<Toaster>` from sonner.
- Set the metadata title to "Resonance" and a meaningful description.
- Keep the `<html>` tag with `lang="en"`.

### 2. Authenticated app shell (`src/app/(app)/layout.tsx`)

Create a nested layout for all authenticated routes:

- Use the shadcn `<SidebarProvider>` and `<Sidebar>` component from `src/components/ui/sidebar.tsx`.
- Sidebar contents:
  - Brand logo / name at the top.
  - Navigation links: Dashboard, Voices, Studio, History, Settings.
  - Active link highlighted using the `sidebar-primary` token.
  - Collapse to icon-only on mobile.
- Top bar:
  - `<OrganizationSwitcher>` from Clerk.
  - `<UserButton>` from Clerk.
  - Theme toggle (light/dark/system).
- Main content area: `flex-1 overflow-auto p-6`.
- Protect this layout with Clerk auth — redirect to `/sign-in` if not authenticated.

### 3. Theme toggle

- Use `next-themes` `useTheme()` hook.
- Render a Button with a Sun/Moon icon that toggles between light and dark.
- Place in the top bar, right-aligned alongside the Clerk controls.

### 4. Reusable components

- Use shadcn/ui components for all primitives. Do not create parallel button/input implementations.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging.
- Icon usage: `lucide-react` only.
- `<Separator>` for dividers; `<Badge>` for category/variant labels; `<Skeleton>` for loading states.

## Scope Limits

- Do not modify `src/components/ui/` files by hand. Use `npx shadcn@latest add` to install components.
- Do not introduce a second font, color system, or icon library.
- Do not rewrite the root layout while changing a feature-specific component.

## Check When Done

- The authenticated shell renders on all `(app)` routes with sidebar visible.
- Sidebar navigation links route correctly to their pages.
- `OrganizationSwitcher` and `UserButton` display in the top bar.
- Light and dark mode both render cleanly.
- Unauthenticated users are redirected to `/sign-in`.
- `context/ui-context.md` is updated if tokens, fonts, or component conventions changed.
