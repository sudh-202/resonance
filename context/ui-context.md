# UI Context

## Theme

Resonance is a professional audio production tool. The UI should feel like a high-quality creative studio — clean, dark-friendly, and purposeful. The default theme is neutral/light, but dark mode is a first-class citizen and the design should look equally good in both. Think: a modern SaaS tool (like ElevenLabs, Descript, or Linear) rather than a consumer app.

The brand name is **Resonance**. Do not use placeholder names like "Create Next App".

## Styling System

- Tailwind CSS 4 is imported in `src/app/globals.css` with `@import 'tailwindcss'`.
- The design system uses **CSS custom properties** (oklch-based) defined in `:root` and `.dark` blocks in `globals.css`. This is the token system — always use semantic tokens.
- Dark mode is class-based via `@custom-variant dark (&:is(.dark *))` and `next-themes`.
- shadcn/ui provides the component primitives. The style is **New York**, base color **neutral**.
- `tw-animate-css` provides entrance/exit animation utilities.

## Semantic Color Tokens

Always use semantic Tailwind tokens that map to CSS variables — never hardcode color values.

| Role                     | Token class                   | Notes                                          |
| ------------------------ | ----------------------------- | ---------------------------------------------- |
| Page background          | `bg-background`               | White (light) / near-black (dark)              |
| Primary text             | `text-foreground`             | Near-black (light) / near-white (dark)         |
| Card background          | `bg-card`                     | White (light) / dark surface (dark)            |
| Card text                | `text-card-foreground`        |                                                |
| Muted background         | `bg-muted`                    | Subtle fills, empty states, code blocks        |
| Muted text               | `text-muted-foreground`       | Labels, hints, secondary info                  |
| Primary action           | `bg-primary text-primary-foreground` | Main CTA buttons                        |
| Secondary action         | `bg-secondary text-secondary-foreground` |                                     |
| Accent / hover           | `bg-accent text-accent-foreground` |                                           |
| Destructive action       | `bg-destructive text-destructive-foreground` | Delete, error states             |
| Border                   | `border-border`               | All card, input, and divider borders           |
| Input background         | `bg-input`                    |                                                |
| Focus ring               | `ring-ring`                   |                                                |
| Sidebar background       | `bg-sidebar`                  | App sidebar surface                            |
| Sidebar text             | `text-sidebar-foreground`     |                                                |
| Sidebar primary (active) | `bg-sidebar-primary text-sidebar-primary-foreground` |                       |
| Sidebar accent (hover)   | `bg-sidebar-accent text-sidebar-accent-foreground` |                         |

## Typography

- Primary font: `Geist` (sans) via `next/font/google`, variable `--font-geist-sans`.
- Mono font: `Geist_Mono`, variable `--font-geist-mono`. Use for audio file keys, code, parameter values.
- Font variables are applied to `globals.css` `@theme` block and the `<body>` via `antialiased`.
- Standard Tailwind scale for heading sizes: `text-2xl font-bold` for page headings, `text-lg font-semibold` for section headings, `text-sm` for labels and metadata.

## Layout Patterns

- App shell: sidebar on the left (collapsible on mobile), top bar with org switcher and user button, main content area.
- The `<Sidebar>` shadcn component is the canonical sidebar primitive.
- Main content uses `p-6` or `p-8` padding with `max-w-screen-xl` for wide content.
- Dashboard grid: stat cards in a 2–4 column responsive grid, recent generations below.
- Studio page: two-column layout on desktop — left for text input + voice selection, right for parameter controls + generated audio player. Stacks vertically on mobile.
- Voice library: responsive card grid (2–4 columns) with filter sidebar or top filter bar.
- History: data table or feed list with inline audio player per row.

## Component Patterns

- **Audio Player**: a custom `AudioPlayer` component wrapping the browser `<audio>` API. Should show a waveform visualization (or progress bar as fallback), play/pause button, current time / duration, and download button.
- **Voice Card**: shows voice name, category badge, language tag, variant indicator (System / Custom), sample playback button, and "Use in Studio" CTA.
- **Generation Form**: shadcn `<Textarea>` for text input, `<Select>` for voice, `<Slider>` for temperature/topP/topK/repetitionPenalty, `<Button>` to trigger generation.
- **Parameter Sliders**: each generation parameter (temperature, topP, topK, repetitionPenalty) gets a labeled slider with the current numeric value shown. Wrap in a collapsible "Advanced Settings" section.
- **Category Badge**: `<Badge variant="secondary">` for voice categories. Use consistent category labels from the `VoiceCategory` enum.
- **Loading States**: use shadcn `<Skeleton>` for card loading and a spinner inside the generate button while generation is in progress.
- **Empty States**: use the `<Empty>` component from `src/components/ui/empty.tsx` for empty voice library, empty history, etc.

## Visual Rules

- Audio generation is the primary action. The Generate button and voice selector must be the most prominent controls on the studio page.
- Show generation status clearly: idle → loading (spinner in button, disabled inputs) → success (audio player appears) → error (toast + inline error).
- Waveforms and audio controls should feel responsive: play state should update instantly, scrubbing should be smooth.
- Category labels should be consistent with the `VoiceCategory` enum values (formatted for display: `AUDIOBOOK` → `Audiobook`).
- Voice variant (System vs Custom) should be visually distinct — e.g., a filled badge for System, outline badge for Custom.
- Do not add marketing language or decorative illustrations to the app shell. Keep it functional and professional.
- Use `<Separator>` for section dividers, not custom `<hr>` elements.

## Dark Mode

- All components must render correctly in both light and dark modes. Use semantic tokens — do not add explicit `dark:` overrides that duplicate what the token system already handles.
- The default theme is system preference or light. Users can toggle via a theme toggle control in the top bar.
- Test both modes when building new pages.
