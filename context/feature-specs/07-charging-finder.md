# 07 — Audio Playback Component

Use this spec for the `<AudioPlayer>` component and related audio UI used across the studio, history, and voice library pages.

Read `context/ui-context.md` for the AudioPlayer component pattern.

## Implementation

### 1. Component location

- `src/components/AudioPlayer.tsx` — client component (`'use client'`).
- Props:
  ```ts
  interface AudioPlayerProps {
    src: string;            // presigned R2 URL or data URL
    label?: string;         // e.g., "Rachel · Audiobook" or generation text excerpt
    showDownload?: boolean; // default true
    compact?: boolean;      // compact mode for history list rows
  }
  ```

### 2. Full-size player (default)

Used in the TTS Studio after a successful generation.

- A progress bar (shadcn `<Progress>` or a custom `<input type="range">` scrubber).
- Play/Pause button (lucide `Play` / `Pause` icon).
- Current time and total duration display (e.g., "0:12 / 1:04").
- Download button (lucide `Download`) — triggers presigned URL download with `Content-Disposition: attachment`.
- Optional: waveform visualization (simplified static waveform bar chart using SVG bars).

### 3. Compact player

Used in the Generation History list rows.

- Just a play/pause button and a slim progress bar.
- No waveform, no duration display by default (show duration only if there is horizontal space).
- Pause other active players when this one starts (use a module-level `currentAudio` ref or a simple context).

### 4. Audio loading states

- Before the user hits play: show an idle state (play button enabled if `src` is set, disabled with a spinner if loading the presigned URL).
- While loading audio: show a loading spinner overlaid on the play button.
- On audio error: show an error icon and "Failed to load audio" tooltip.

### 5. Presigned URL handling

- The `src` prop may be a short-lived presigned URL (15 minutes TTL).
- When the player is initialized, set the `<audio>` element `src` immediately and start buffering.
- Do not pre-fetch URLs on page load for the history list. Fetch on demand when the user clicks play: the parent passes `onRequestSrc?: () => Promise<string>` and the player calls it before setting `src`.

### 6. Browser `<audio>` element

- Use a hidden `<audio>` element (not visible, controlled via React refs).
- Sync `currentTime` to the progress bar position using the `timeupdate` event.
- Seek by setting `audio.currentTime` when the user scrubs the range input.
- Use `audio.ended` to reset to the beginning and show the play icon.

## Scope Limits

- Do not implement a full waveform visualizer using `AudioContext` decoding in the first iteration — a progress bar scrubber is sufficient.
- Do not implement a queue or playlist — each player is independent.
- Do not use an external audio player library (react-player, wavesurfer) — keep it a small in-house component.

## Check When Done

- AudioPlayer renders and plays audio from a presigned R2 URL.
- Play/pause toggle works; progress bar updates as audio plays.
- Seeking works by scrubbing the progress bar.
- Download button triggers a file download.
- Compact mode renders in history rows without taking up excessive space.
- Error state renders when the audio URL is invalid or expired.
- Multiple players on the same page pause when another one starts playing.
