---
title: SongZoo Cruise PWA Proof of Concept
type: feat
status: active
date: 2026-05-09
---

# SongZoo Cruise PWA Proof of Concept

## Overview

Build a mobile-first PWA demo (`SongZoo Cruise`) on Next.js 16 that walks a prospect from Landing → Home → Song Setup (7-step form) → Notification simulation → Daily Highlight (Day 1–3 voice + transcription) → Congratulations → Quick Survey → Thank You. The single permanent output is a plain-text **demo email** (Song Setup + Day 1–3 transcripts) sent to a configured admin address.

> "Turn your cruise into your song."

This is a **prospect-facing demo prototype**, not production. The brief is explicit:

> *"I just need it to **look** like the real thing to my prospect, but in the background it can actually be built in the cheapest, easiest and quickest way possible. None of the data captured needs to be permanently stored anywhere."*

That single sentence drives every architectural decision below: no database, no auth, no real push, no audio storage, no admin panel. State lives in `localStorage` until the email is fired, then we forget about the user.

## Problem Statement

SongZoo wants to pitch personalized cruise souvenir songs to cruise-line partners. They have static slide mockups (in [SongZoo Cruise POC Brief.pdf](../../SongZoo%20Cruise%20POC%20Brief.pdf)) but no live artifact a prospect can actually swipe through during a meeting. The pitch falls flat without an interactive thing to hold.

**What's missing:** a working demo that mimics the real product end-to-end in ~10 minutes (compressed Day 1/2/3 recording flow), looks pixel-close to the design, and produces a tangible artifact (the demo email) the prospect can see in real time.

**What's deliberately out of scope** (per [PRD §5.2](../../SongZoo_Cruise_PWA_PRD.md)): real backend, login, real push notifications, AI music generation, audio storage, booking ID validation, payment, analytics, admin panel.

## Proposed Solution

Single Next.js 16 App Router PWA with this shape:

- **All UI state** lives in a Zustand store with `persist` middleware → `localStorage`. No database. State survives refresh during a demo.
- **Each PRD page = one route segment** under `app/` (e.g. `/song-setup/title`, `/daily-highlight/day-1`). Step-by-step routing matches the PRD's Page List exactly so the URL bar reads like the real product flow.
- **Two server endpoints only**, both Route Handlers:
  - `POST /api/transcribe` — receives an audio blob, calls OpenAI Whisper, returns `{ transcript: string }`. Never persists audio.
  - `POST /api/send-email` — receives the assembled payload, sends one plain-text email via Resend, returns `{ success: true }`. Idempotent on the client via `emailSent` flag.
- **Voice recording** uses the browser-native `MediaRecorder` API inside a modal component. Audio blob is held in memory only until transcription completes, then discarded.
- **PWA manifest + icons** make it installable on a phone home screen for the demo. **No service worker, no real push.** The "ALLOW notification" page is a static screen that just navigates forward — exactly as the brief specifies.
- **Mobile-first layout** with the cruise header (`ICON OF THE SEAS`), white app body, blue/red CTA palette, SongZoo footer — applied as a shared root layout.

## Technical Approach

### Architecture

```
[Browser PWA — Next 16 App Router]
        │
        ├─ Zustand store (persist → localStorage)
        │   ├─ songSetup, dailyHighlights, survey, appProgress
        │
        ├─ Pages (Server Components by default; "use client" where needed)
        │   ├─ /                       Landing
        │   ├─ /home                   Home (state-aware menu)
        │   ├─ /song-setup/*           7 steps
        │   ├─ /notifications          Simulation
        │   ├─ /daily-highlight/*      List + Day 1/2/3
        │   ├─ /completed              Congratulations (fires email)
        │   ├─ /survey/*               Rating, Amenities, Suggestion
        │   └─ /thank-you              Final
        │
        └─ MediaRecorder API ── audio blob ──┐
                                              ▼
[Server (Next.js Route Handlers)]
        ├─ POST /api/transcribe  → OpenAI Whisper API → transcript
        └─ POST /api/send-email  → Resend API         → email to DEMO_EMAIL_TO
```

### Tech Stack

Locked-in (already installed via `create-next-app`):
- **Next.js 16.2.6**, **React 19.2.4**, **TypeScript 5**, **Tailwind CSS v4**, **ESLint 9 flat config**

To add:
- **`zustand`** — global state with `persist` middleware → localStorage
- **`zod`** — server-side payload validation in route handlers
- **`openai`** (official SDK) — Whisper transcription
- **`resend`** (official SDK) — demo email sending
- **`clsx`** — className composition for active/disabled buttons (tiny, optional)

### Next.js 16 conventions to honor

This codebase has an `AGENTS.md` warning that "this is NOT the Next.js you know." Specifically, vs. older training data:

- **`params` and `searchParams` are now `Promise`s.** Always `await` them. Use the global type helpers `PageProps<'/path'>`, `LayoutProps<'/path'>`, `RouteContext<'/path'>` (no import needed; generated by `next dev` / `next build` / `next typegen`).
- **`'use client'` is required** for any component using `useState`, `useEffect`, event handlers, browser APIs (`MediaRecorder`, `localStorage`, `navigator.mediaDevices`).
- **Route Handlers** live in `app/**/route.ts` and export `GET`/`POST` etc. Not cached by default for `POST`.
- **Server Actions** (`'use server'`) are valid but **not the right tool here** for the form steps — each step just stores into client state and routes forward, no server roundtrip needed. Server Actions are reserved for the two genuine server interactions: transcribe and send-email (we'll use Route Handlers there because we need to send `multipart/form-data` audio and want a clean REST shape, not because Actions can't do it).
- **PWA manifest** ships as `app/manifest.ts` (typed, returns `MetadataRoute.Manifest`).
- **App icons** use file conventions: `app/icon.png` and `app/apple-icon.png` (Next handles `<link rel="icon">` for you).
- **Tailwind v4** — `@import "tailwindcss";` and `@theme inline` syntax (already in [app/globals.css](../../app/globals.css)). Define cruise blue / accent red as theme tokens here, not as one-off classes.
- **`next lint` is removed.** Use `eslint` directly (already wired in [package.json](../../package.json) as `npm run lint`).
- **Turbopack is default** for `next dev` / `next build` — no flag needed.

### State Schema (Zustand store)

```ts
// lib/store.ts
type HumourLevel = 'Not funny' | 'Quite funny' | 'Very funny';
type ProfanityLevel = 'No profanities' | 'Some profanities' | 'Lots of profanities';
type DayKey = 'day1' | 'day2' | 'day3';

type AppState = {
  appProgress: {
    songSetupCompleted: boolean;
    notificationSimulated: boolean;
    dailyHighlightCompleted: boolean;
    emailSent: boolean;
  };
  songSetup: {
    songTitle: string;
    artistReference: string;
    humourLevel: HumourLevel | null;
    profanityLevel: ProfanityLevel | null;
    firstNames: string;
    emailAddress: string;
    bookingId: string;
    termsAccepted: boolean;
  };
  dailyHighlights: Record<DayKey, { isCompleted: boolean; transcript: string }>;
  survey: {
    recommendationScore: number;
    cleanlinessScore: number;
    staffFriendlinessScore: number;
    amenitiesUsed: string[];
    suggestion: string;
  };
  // actions
  setSongSetupField: <K extends keyof AppState['songSetup']>(k: K, v: AppState['songSetup'][K]) => void;
  completeSongSetup: () => void;
  setNotificationSimulated: (v: boolean) => void;
  setDayTranscript: (day: DayKey, transcript: string) => void;
  setEmailSent: (v: boolean) => void;
  setSurveyField: <K extends keyof AppState['survey']>(k: K, v: AppState['survey'][K]) => void;
  reset: () => void;
};
```

Persist with `zustand/middleware.persist` keyed on `'songzoo-cruise-poc/v1'`. Bump the key if the schema ever changes (future-proofing the demo against stale localStorage).

### File Structure (target)

```
app/
├── layout.tsx                    # Root layout: <html>, <body>, <PhoneShell> with cruise header + footer
├── page.tsx                      # Landing (/)
├── globals.css                   # Tailwind v4 + theme tokens (blue, red, cruise palette)
├── manifest.ts                   # PWA manifest
├── icon.png                      # App icon (Next file convention)
├── apple-icon.png                # iOS home-screen icon
│
├── home/page.tsx                 # /home — state-aware 3-button menu
│
├── song-setup/
│   ├── layout.tsx                # "SONG SETUP" page header common to all 7 steps
│   ├── _components/
│   │   ├── StepFooter.tsx        # < BACK | NEXT > / DONE > buttons (client)
│   │   ├── OptionCard.tsx        # Selectable card (humour / profanity)
│   │   └── HelperText.tsx
│   ├── title/page.tsx            # Step 1
│   ├── artist/page.tsx           # Step 2
│   ├── humour/page.tsx           # Step 3
│   ├── profanity/page.tsx        # Step 4
│   ├── names/page.tsx            # Step 5
│   ├── email/page.tsx            # Step 6 (DONE >)
│   └── booking/page.tsx          # Step 7 (NEXT >, completes setup)
│
├── notifications/page.tsx        # WELL DONE! + ALLOW / NO THANKS (simulated only)
│
├── daily-highlight/
│   ├── page.tsx                  # DAY 1 / 2 / 3 list with locking + checkmarks
│   ├── _components/
│   │   ├── RecorderModal.tsx     # client; controls record/pause/stop/play/done
│   │   ├── useMediaRecorder.ts   # client hook around MediaRecorder API
│   │   ├── MicButton.tsx         # red circular start-recording button
│   │   └── DayPageShell.tsx      # shared instructions block
│   ├── day-1/page.tsx
│   ├── day-2/page.tsx
│   └── day-3/page.tsx
│
├── completed/page.tsx            # CONGRATULATIONS! — fires email on mount
│
├── survey/
│   ├── rating/page.tsx           # 3 sliders
│   ├── amenities/page.tsx        # multi-select (Spa, Pool, Fitness, Casino, Kids' Club, Shops)
│   └── suggestion/page.tsx       # textarea + SEND!
│
├── thank-you/page.tsx            # THANK YOU! + OK
│
└── api/
    ├── transcribe/route.ts       # POST: multipart audio → Whisper → { transcript }
    └── send-email/route.ts       # POST: payload → Resend → { success }

components/
├── CruiseHeader.tsx              # Blue ICON OF THE SEAS bar
├── SongZooFooter.tsx             # "Powered by SongZoo" with logo dot
├── PrimaryButton.tsx             # Blue active / grey disabled (wraps <button>)
├── PageBody.tsx                  # Constrained mobile-width content frame
└── HomeReturnIcon.tsx            # House icon for daily-highlight pages

lib/
├── store.ts                      # Zustand store + persist
├── validation.ts                 # canProceedX helpers (mirror PRD §22)
├── transcribe-client.ts          # client wrapper that POSTs blob to /api/transcribe
├── email-client.ts               # client wrapper that POSTs to /api/send-email
└── email-template.ts             # buildDemoEmailBody(state) → plain text matching PRD §14.2

types/
└── app-state.ts                  # AppState, HumourLevel, ProfanityLevel, DayKey

public/
├── icon-192.png                  # PWA manifest icon
├── icon-512.png                  # PWA manifest icon
└── songzoo-mark.svg              # Footer brand mark
```

### Implementation Phases

#### Phase 1 — Foundation & design tokens

**Goal:** every page exists as a routable shell with the correct cruise header / footer chrome and palette, and Zustand is wired up. No real form behavior yet.

Tasks:
1. Install deps: `npm i zustand zod openai resend clsx`.
2. Define theme tokens in [app/globals.css](../../app/globals.css) under `@theme inline` — cruise blue (header `#3F69B0`-ish per mockups), CTA blue, disabled grey, accent red (mic button), text colors. Pull exact swatches from the PDF.
3. Build chrome components: `CruiseHeader`, `SongZooFooter`, `PageBody`, `PrimaryButton` ([components/](../../)).
4. Replace boilerplate in [app/layout.tsx](../../app/layout.tsx) with the mobile-first phone-shell layout (cruise header, `<main>` slot, footer). Update `<title>` and `<description>` metadata to "SongZoo Cruise" / "Turn your cruise into your song."
5. Replace [app/page.tsx](../../app/page.tsx) with the Landing page UI (hero text, "VALUED AT $150", `LET'S GO!` link to `/home`).
6. Create empty `page.tsx` for every route in the [File Structure](#file-structure-target) above with a `<h1>` placeholder.
7. Create [lib/store.ts](../../) with the Zustand store + `persist` middleware, all actions stubbed.
8. Add `app/manifest.ts` returning `MetadataRoute.Manifest` (name, short_name, theme_color matching cruise blue, `start_url: '/'`, `display: 'standalone'`, icon refs).

**Done when:** every route in PRD Page List loads without error, navigation chrome is correct on every page, the manifest is served at `/manifest.webmanifest`, and `npm run lint` + `npm run build` are clean.

#### Phase 2 — Song Setup flow (7 steps)

**Goal:** user can complete all 7 setup steps with NEXT/DONE correctly enabled/disabled per validation rules; state persists across refresh.

Tasks:
1. Build `OptionCard` (used in humour & profanity), `StepFooter` with BACK / NEXT (or DONE) — buttons are blue when `canProceed === true` else grey/disabled.
2. Implement validation helpers in [lib/validation.ts](../../) mirroring PRD §22 (`isNonEmpty`, `isValidEmail`, `canProceed*`).
3. Build each step page as a client component reading from / writing to Zustand:
   - `title` → `songTitle` (text)
   - `artist` → `artistReference` (text)
   - `humour` → `humourLevel` (3 cards)
   - `profanity` → `profanityLevel` (3 cards)
   - `names` → `firstNames` (text)
   - `email` → `emailAddress` (email + regex). Button label is `DONE >` per the mockups.
   - `booking` → `bookingId` (text) + `termsAccepted` (checkbox). On NEXT: call `completeSongSetup()` then `router.push('/notifications')`.
4. Wire `BACK` button to `router.back()` (or explicit prev step `Link`).
5. Add a "Tap here to edit" affordance later (Phase 7). For now, deep-linking back into the flow simply re-shows the saved value.

**Done when:** filling each step in order writes to localStorage; refreshing mid-flow rehydrates the input; NEXT is greyed for empty/invalid input; submitting Step 7 lands on `/notifications` with `appProgress.songSetupCompleted === true`.

#### Phase 3 — Notification simulation + Home state machine

**Goal:** `/notifications` and `/home` reflect the post-setup state correctly.

Tasks:
1. Build `/notifications`: WELL DONE! copy + `NO THANKS` (grey) and `ALLOW` (blue) side by side. Both routes write `notificationSimulated` and push to `/home`. **No real Notification API call** — per brief, this is purely a screen.
2. Build `/home` as a state-aware menu:
   - If `!songSetupCompleted`: Song Setup blue+active, Daily Highlight & Quick Survey grey+disabled.
   - If `songSetupCompleted && !dailyHighlightCompleted`: Song Setup blue with subtitle `DONE! (Tap here to edit)`, Daily Highlight blue+active, Quick Survey disabled.
   - If `dailyHighlightCompleted`: all three active (Quick Survey enabled).
3. Tapping Song Setup when DONE re-enters the flow at `/song-setup/title`.

**Done when:** navigating Setup → Notifications → Home shows the correct state transitions; disabled buttons are unclickable; `notificationSimulated` is recorded.

#### Phase 4 — Daily Highlight recording + transcription

**Goal:** user records 3 highlights, each gets transcribed, transcripts persist, and audio is never stored beyond the in-flight request.

Tasks:
1. Build `useMediaRecorder` hook (client) wrapping `navigator.mediaDevices.getUserMedia({ audio: true })` + `MediaRecorder`. Expose `state` (`'idle' | 'recording' | 'paused' | 'stopped' | 'transcribing' | 'error'`), `start`, `pause`, `resume`, `stop`, `audioBlob`, `error`. Handle permission denial gracefully with a clear "Please allow microphone access" UI.
2. Build `RecorderModal` with controls Record / Pause / Resume / Stop / Play (preview) / Done. Done triggers transcription.
3. Build `transcribe-client.ts`:

    ```ts
    // lib/transcribe-client.ts
    export async function transcribeAudio(blob: Blob): Promise<string> {
      const fd = new FormData();
      fd.append('audio', blob, 'recording.webm');
      const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Transcription failed');
      const { transcript } = await res.json();
      return transcript;
    }
    ```

4. Build `app/api/transcribe/route.ts`:
   - Read the multipart `FormData`.
   - Call OpenAI Whisper via the official SDK with the audio file.
   - Return `Response.json({ transcript })`. On failure return `{ error }` with `status: 500`.
   - **No persistence**, no logging of the audio bytes.
5. Build `/daily-highlight/page.tsx`:
   - Renders DAY 1 / DAY 2 / DAY 3 buttons.
   - Locking logic: Day N is active iff `day(N-1).isCompleted`. Completed days show ✓ and stay tappable (re-record allowed for demo flexibility, optional).
   - Home icon top-left → `/home`.
6. Build `/daily-highlight/day-{1,2,3}/page.tsx` reusing `DayPageShell` for the instructions text and `MicButton`. On Done from the modal: save transcript to Zustand and `router.push` to the next day or `/completed` if last.
7. Show a transcribing spinner state in the modal while the API is in flight. On error, allow retry.

**Done when:** in Chrome with mic permission granted, user can record → see transcript text → auto-advance through Day 1 → 2 → 3 → land on `/completed`; refreshing mid-flow keeps already-completed days; transcripts are visible in the Zustand devtools / localStorage; no audio is persisted server-side or in `localStorage`.

#### Phase 5 — Congratulations + demo email

**Goal:** on reaching `/completed`, send the demo email exactly once and proceed to survey.

Tasks:
1. Build [lib/email-template.ts](../../) → `buildDemoEmailBody(state)` returns a plain-text string matching PRD §14.2 exactly:

    ```
    Subject: Cruise Demo

    Song title:        Our Cruise to Spain
    Musical artist:    Elvis Presley
    Humour level:      Very funny
    Profanities:       No profanities
    First names:       John, Sally, Mary
    Email address:     johnsmith@gmail.com
    Booking ID:        X2390GH

    Day 1: <transcript>

    Day 2: <transcript>

    Day 3: <transcript>
    ```

2. Build `app/api/send-email/route.ts`:
   - Validate body with Zod schema (all strings present).
   - Call Resend `emails.send({ from: env.DEMO_EMAIL_FROM, to: env.DEMO_EMAIL_TO, subject: 'Cruise Demo', text: body })`.
   - Return `{ success: true }` or `{ success: false, error }` with appropriate status.
3. Build [lib/email-client.ts](../../) → `sendDemoEmail(state)`.
4. Build `/completed/page.tsx`:
   - On mount (`useEffect`), if `!emailSent` → call `sendDemoEmail`, then `setEmailSent(true)`. Use a `sentRef` guard so React 19 strict-mode double-effects don't fire twice.
   - Render the CONGRATULATIONS! copy and `LET'S GO!` button → `/survey/rating`.
   - If sending fails, show a small inline error + retry link. **Do not block** navigation to the survey — the demo must always reach Thank You.

**Done when:** completing Day 3 lands on `/completed`, the demo email arrives at `DEMO_EMAIL_TO`, and re-navigating to `/completed` does not send a second email.

#### Phase 6 — Survey + Thank You

**Goal:** three survey screens collect input client-side and the user lands on Thank You. **No persistence** — PRD §13.3 explicitly says survey data is not stored.

Tasks:
1. `/survey/rating` — three labeled sliders (`<input type="range" min={1} max={10} />`) writing to Zustand. NEXT > → `/survey/amenities`.
2. `/survey/amenities` — six toggle buttons (Spa, Pool, Fitness Center, Casino, Kids' Club, Shops). Selected = blue, unselected = white outline. NEXT > → `/survey/suggestion`.
3. `/survey/suggestion` — `<textarea>` + `SEND!` button → `/thank-you`. SEND does not call any API; the email already went out at `/completed`.
4. `/thank-you` — final copy + `OK` button. OK can either reset the store and route to `/` (offer "start over for next prospect" UX) or simply do nothing. **Decision for POC: reset the store and route to `/`** so the salesperson can re-run the demo immediately for the next person without `localStorage.clear()` in DevTools.

**Done when:** survey screens are clickable end-to-end, no network calls fire from them, and OK on Thank You returns to a fresh Landing page.

#### Phase 7 — Polish (Should Have)

- **Loading states**: spinner overlay while transcribing; disabled SEND button while emailing.
- **Error UI**: graceful messages for mic-permission-denied, transcription failure (retry), email failure (retry once, then continue silently).
- **Edit Song Setup**: tapping Song Setup on `/home` after completion re-enters `/song-setup/title` with values pre-filled (already wired in Phase 2 since steps read from store).
- **PWA polish**: real 192px / 512px icons, theme color matches cruise blue header, `apple-mobile-web-app-capable` meta for iOS standalone, test "Add to Home Screen" on iOS Safari and Chrome Android.
- **Accessibility pass**: `aria-live="polite"` for transcribing/email status, `aria-label` on icon-only buttons, focus rings on all CTAs.
- **Mobile manual test**: load on a real phone over the local network with `next dev --experimental-https` (Whisper requires HTTPS for some browsers' mic permissions).

#### Phase 8 — Nice-to-haves (skip unless time permits)

- Phone-frame visual wrapper around the app on desktop (the PDF mockups show the app inside a phone frame on a grey background; reproducing this on desktop sells the demo harder).
- View Transitions API (React 19.2 `<ViewTransition>`) for between-step animations.
- Mock lock-screen notification visual (page 11 of brief — "How was Cozumel?" lock-screen mockup) shown for 2s after ALLOW, then auto-advance.
- Progress dots on Song Setup steps.
- Preview transcript in the modal before tapping Done.

## Alternative Approaches Considered

**Server Actions for every form step.** Rejected. Each setup step's "submit" is just `setSongSetupField(...)` + `router.push(nextStep)`. Routing through the network for 7 client-only mutations adds latency, complicates progressive enhancement (forms would briefly POST before the client takes over), and gains nothing — there is no server-side state to mutate. Server Actions are reserved for `/api/transcribe` (Route Handler — multipart) and `/api/send-email` (Route Handler — clean REST).

**Redux / Jotai instead of Zustand.** Rejected. Zustand + `persist` is one file, no provider, and serializes to localStorage out of the box. Redux Toolkit adds boilerplate not justified by the scope. Jotai's atom-per-field model works but yields more files for no win on a flat schema like ours.

**EmailJS (client-side) instead of Resend (server-side).** Rejected. EmailJS would expose the public key in the bundle and rate-limit per browser. Resend behind a Route Handler keeps the API key server-side, gives us one place to validate the payload, and costs zero on the free tier. The brief says "no backend infrastructure" but it means *no app backend* — using a SaaS email API from a serverless function is the cheapest path that still hides the key.

**Browser SpeechRecognition API instead of Whisper.** Rejected. Inconsistent across browsers (Safari iOS doesn't fully support `SpeechRecognition`), language detection is weak, and the brief explicitly names "Whisper AI or equivalent". Whisper via the OpenAI SDK is one HTTP call from a Route Handler.

**Service worker with offline support.** Rejected for POC. The brief calls for "PWA-ready behavior secondly basic" and the demo will always run with connectivity (sales meeting, prospect's office). Adding Serwist + workbox introduces webpack-config complexity the brief explicitly tells us to avoid.

**One giant `/song-setup` page with internal step state.** Rejected because the PRD's Page List names each step as a distinct route (`/song-setup/title`, `/song-setup/artist`, ...), and matching it makes the URL bar look real to the prospect (they see the path advance as they tap). Cost is a few extra `page.tsx` files; benefit is "looks like a real product."

## System-Wide Impact

### Interaction Graph

User taps **DONE** on Step 7 (Booking) →
  `completeSongSetup()` writes `appProgress.songSetupCompleted = true` to Zustand →
  `persist` middleware serializes the store to `localStorage` →
  `router.push('/notifications')` →
  `/notifications` renders WELL DONE! →
  user taps ALLOW →
  `setNotificationSimulated(true)` → `localStorage` updated →
  `router.push('/home')` →
  `/home` reads `songSetupCompleted` from store, swaps Song Setup label to "DONE!" and unlocks Daily Highlight.

User taps **Done** in `RecorderModal` →
  hook stops `MediaRecorder` → emits `audioBlob` →
  `transcribeAudio(blob)` POSTs to `/api/transcribe` →
  Route Handler streams the file into OpenAI Whisper SDK →
  Whisper returns text →
  Route Handler returns `{ transcript }` →
  modal calls `setDayTranscript('day1', transcript)` →
  Zustand persists →
  modal closes, `router.push('/daily-highlight/day-2')`.

User lands on `/completed` →
  `useEffect` sees `emailSent === false` and `sentRef.current === false` →
  sets `sentRef.current = true` (StrictMode guard) →
  `sendDemoEmail(state)` POSTs to `/api/send-email` →
  Route Handler validates with Zod, calls Resend →
  on 200, store flips `emailSent = true` →
  user taps `LET'S GO!` → `/survey/rating`.

### Error & Failure Propagation

| Failure | Where surfaces | Recovery |
|---|---|---|
| `getUserMedia` permission denied | `useMediaRecorder` `error` state | Modal shows "Please allow microphone access in browser settings" + close button. User cannot proceed past that day. |
| `MediaRecorder` not supported (rare; old iOS) | hook init throws | Modal shows fallback "Your browser doesn't support recording. Try Chrome or Safari 14+." |
| Whisper 4xx/5xx or network error | `transcribeAudio` rejects | Modal flips to error state with `Retry` button. Audio blob is kept in memory for retry; never written to disk. |
| Resend 4xx/5xx | `sendDemoEmail` rejects on `/completed` | Inline `"Email failed to send. Retry?"` link + console.error. `LET'S GO!` button still works — demo must reach Thank You. Sales rep can manually re-trigger from DevTools if needed. |
| User refreshes mid-flow | localStorage rehydrates store | All progress intact. Routes are safe to deep-link to from anywhere. |
| User clears site data mid-demo | store falls back to defaults | They get sent to Landing-equivalent state. Acceptable. |

### State Lifecycle Risks

- **Audio blob orphaning.** The blob lives in the React state of `RecorderModal` and is dropped on modal unmount. We must ensure the component does **not** retain a reference after `setDayTranscript`; explicitly clear it in a `finally` block.
- **Email duplicate-send under React 19 StrictMode.** `useEffect` runs twice in dev. We guard with both `appProgress.emailSent` and a `useRef(false)` set synchronously before the fetch.
- **Stale localStorage between schema versions.** Mitigation: store is keyed `'songzoo-cruise-poc/v1'` and we accept that bumping to `v2` simply discards old state (acceptable for a demo).
- **Whisper temp file lifetime on the server.** OpenAI SDK uploads via `multipart/form-data`; nothing is written to our filesystem. Vercel function instance is ephemeral. Verified safe.

### API Surface Parity

Only two exposed endpoints, both POST:
- `/api/transcribe` — accepts `multipart/form-data` with `audio` field. No GET. No caching.
- `/api/send-email` — accepts `application/json`. Server validates with Zod, returns JSON.

Both handlers will set `export const dynamic = 'force-dynamic'` (or rely on the default for non-GET) to avoid any caching surprises.

### Integration Test Scenarios

(Manual smoke tests — POC has no automated test suite per "simplicity" NFR.)

1. **Happy path end-to-end on a real phone.** Open URL → tap LET'S GO → fill all 7 steps → grant mic → record Day 1/2/3 → see Congratulations → check inbox for the demo email → finish survey → land on Thank You. All within ~7 minutes.
2. **Refresh resilience.** Refresh during Step 4 (Profanity); state should be intact and the page should re-render with selected option highlighted.
3. **Mic-denied path.** Deny mic permission on Day 1; verify the modal shows the permission prompt, the `<MicButton>` reverts to `idle`, and the user can navigate away via the home icon.
4. **Email-fail path.** Temporarily set `RESEND_API_KEY` to an invalid value; verify `/completed` still allows progress to `/survey/rating` after the failure is shown.
5. **Re-run for next prospect.** Reach `/thank-you`, tap OK, verify Landing renders with no leaked state and Song Setup is gated again.

## Acceptance Criteria

### Functional Requirements

Mapped 1:1 to PRD §27 (`FR-001` through `FR-034`). Specifically:

- [ ] AC-001 — Landing Page renders with hero copy, `LET'S GO!` button, and powered-by footer.
- [ ] AC-002 — `LET'S GO!` navigates to `/home`.
- [ ] AC-003 — Home shows Song Setup active and Daily Highlight + Quick Survey disabled before setup.
- [ ] AC-004 — User can complete all 7 Song Setup steps in order.
- [ ] AC-005 — NEXT/DONE buttons disabled when required inputs are empty/invalid.
- [ ] AC-006 — NEXT/DONE buttons enable when valid.
- [ ] AC-007 — Notification simulation: ALLOW and NO THANKS both route to `/home`.
- [ ] AC-008 — After Setup, Home shows Song Setup with "DONE! (Tap here to edit)".
- [ ] AC-009 — After Setup, Daily Highlight is active.
- [ ] AC-010 — User can record Day 1.
- [ ] AC-011 — Day 1 transcript saved to state; user auto-advances to Day 2.
- [ ] AC-012 — Day 2 transcript saved; auto-advances to Day 3.
- [ ] AC-013 — Day 3 transcript saved; user lands on `/completed`.
- [ ] AC-014 — Demo email sent containing Song Setup + Day 1–3 transcripts in PRD §14.2 format.
- [ ] AC-015 — No audio file persisted server-side or in localStorage.
- [ ] AC-016 — No real push notification subscribed or requested.
- [ ] AC-017 — User can complete all three survey screens.
- [ ] AC-018 — User sees Thank You page at the end.

### Non-Functional Requirements

- [ ] Loads in under 2s on 4G mobile (Lighthouse mobile score 90+).
- [ ] Works in Safari iOS 16.4+, Chrome Android 111+, latest desktop Chrome / Edge / Firefox / Safari.
- [ ] Installable from "Add to Home Screen" on iOS and Android (manifest validates, icons present).
- [ ] No console errors during the happy path.
- [ ] All secrets (`OPENAI_API_KEY`, `RESEND_API_KEY`) are server-side only; verified by `grep "OPENAI_API_KEY" .next/static/` returning nothing post-build.

### Quality Gates

- [ ] `npm run build` is clean (no TypeScript errors, no lint errors).
- [ ] `npm run lint` is clean.
- [ ] No use of synchronous `params` / `searchParams` (Next 16 breaking change).
- [ ] Manual happy path completed on at least one real iOS device and one Android device.

## Success Metrics

The POC is "good enough to ship" when:

1. The salesperson can hand a phone to a prospect cold, with no instructions, and the prospect reaches `/thank-you` in ≤10 minutes.
2. The demo email arrives at `DEMO_EMAIL_TO` while the prospect is still in the meeting room (visible "ding" creates a moment).
3. The prospect can install the demo to their own home screen and re-open it offline-shell-only (manifest works) — proving the "real app" feel.
4. Visual fidelity to the PDF mockups is close enough that a non-technical prospect cannot tell it apart from a finished product.

## Dependencies & Prerequisites

External services (each free tier sufficient for demo):
- **OpenAI account** with Whisper API access. Set `OPENAI_API_KEY`.
- **Resend account** with one verified sender domain (or use `onboarding@resend.dev` for dev). Set `RESEND_API_KEY`, `DEMO_EMAIL_FROM`, `DEMO_EMAIL_TO`.
- **Vercel account** for deploy (or any host that supports Next.js 16 + Node 20+).

`.env.local`:

```env
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
DEMO_EMAIL_FROM=demo@yourdomain.com
DEMO_EMAIL_TO=alifmaruf5923@gmail.com   # or whoever owns the demo
NEXT_PUBLIC_APP_URL=https://songzoo-demo.vercel.app
```

`.env.local` must be gitignored (it already is via the `create-next-app` template's `.gitignore`).

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Whisper API rate-limit or downtime during a live demo | Low | High (kills the demo) | Pre-warm during meeting prep; fallback message + retry; consider a "demo mode" hardcoded transcript flag (`?mock=1`) for absolute reliability in front of the prospect. |
| Mic permission denied on prospect's phone | Medium | High | Modal copy is explicit; sales rep can pre-grant on their own phone before handing it over. |
| iOS Safari quirks with `MediaRecorder` (codec defaults) | Medium | Medium | `MediaRecorder` on iOS produces `audio/mp4`; Whisper accepts that. Test explicitly. Specify `mimeType` only after feature-detect. |
| `localStorage` cleared between Setup and Daily Highlight (private mode, etc.) | Low | Medium | Acceptable — they'd be back at Landing, same as a fresh install. |
| Email goes to spam | Medium | Medium | Use Resend with verified domain; SPF/DKIM via Resend; salesperson can pre-add sender to safe list before the meeting. |
| Browser blocks `getUserMedia` over HTTP | High in dev | Low | Already mitigated — Vercel deploys are HTTPS, and dev uses `next dev --experimental-https`. |
| Pixel-perfect Tailwind v4 mismatch with PDF | Medium | Low | Live-tweak vs. PDF screenshots side-by-side at the end of Phase 1; the brief explicitly accepts a close approximation. |

## Resource Requirements

- **One developer**, ~3-5 working days end-to-end:
  - Phase 1 (foundation) — 0.5 day
  - Phase 2 (Song Setup) — 1 day
  - Phase 3 (Notifications + Home) — 0.5 day
  - Phase 4 (Recording + Whisper) — 1 day
  - Phase 5 (Email) — 0.5 day
  - Phase 6 (Survey + Thank You) — 0.5 day
  - Phase 7 (Polish + manual test) — 1 day
- Vercel free tier
- OpenAI + Resend API quotas (negligible for demo volume)

## Future Considerations

If the prototype lands a partner and gets greenlit for production, the following will need to be built (deliberately *not* done now):

- Real backend with persistent storage (Postgres + Prisma)
- Real authentication tied to cruise booking systems
- Actual AI music generation pipeline (the brief's biggest "fake it" — there's no real song produced)
- True web push notifications with VAPID keys + service worker (the [PWA guide](../../node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md) covers this)
- Audio storage with retention policy + GDPR controls
- Multi-tenant cruise branding (Icon of the Seas is hardcoded in this POC)
- Admin panel for cruise partners to configure / monitor

## Documentation Plan

- This plan ([docs/plans/2026-05-09-001-...](.))
- Update [README.md](../../README.md) with: how to run locally, required env vars, demo flow recap, how to reset state.
- Add a `DEMO_SCRIPT.md` for the salesperson: 5-minute walkthrough script, common prospect questions, what to do if Whisper fails.

## Sources & References

### Internal References

- [SongZoo_Cruise_PWA_PRD.md](../../SongZoo_Cruise_PWA_PRD.md) — full requirements (36 sections, 34 FRs, 18 ACs)
- [SongZoo Cruise POC Brief.pdf](../../SongZoo%20Cruise%20POC%20Brief.pdf) — visual design mockups (24 pages) and the "look like the real thing" framing
- [AGENTS.md](../../AGENTS.md) — "this is NOT the Next.js you know" warning
- [package.json](../../package.json) — pinned versions: Next 16.2.6, React 19.2.4, Tailwind v4

### Next.js 16 Documentation (local)

- [Project Structure](../../node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md)
- [Layouts and Pages](../../node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md)
- [Server and Client Components](../../node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md)
- [Route Handlers](../../node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md)
- [Mutating Data (Server Functions)](../../node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md)
- [Forms with Server Actions](../../node_modules/next/dist/docs/01-app/02-guides/forms.md)
- [Progressive Web Apps](../../node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md)
- [Upgrading to v16 (breaking changes)](../../node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md) — async `params`/`searchParams`, Turbopack default, `next lint` removed, image config changes

### External APIs (specified in PRD §30)

- OpenAI Whisper — `https://platform.openai.com/docs/api-reference/audio/createTranscription` (verify when implementing Phase 4)
- Resend — `https://resend.com/docs/send-with-nodejs` (verify when implementing Phase 5)
- Web `MediaRecorder` API — MDN `https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder`
