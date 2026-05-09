# SongZoo Cruise — PWA Proof of Concept

A mobile-first Progressive Web App that turns a cruise holiday into a personalised song. Built as a POC for the **Icon of the Seas** activation.

---

## What it does

1. **Song Setup** — guests fill in 7 steps (song title, artist style, humour, profanity, names, email, booking ref)
2. **Daily Highlights** — record a voice note each day; transcribed via OpenAI Whisper
3. **Song Delivery** — a summary email is sent via Resend when all highlights are captured
4. **Survey** — 3-step feedback form (ratings, amenities, suggestions)

All state lives in `localStorage` via Zustand. No database, no auth.

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS v4 |
| State | Zustand 5 + persist middleware |
| Transcription | OpenAI Whisper API |
| Email | Resend |
| Type | PWA (standalone, portrait) |

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Copy and fill in your keys:

```bash
cp .env.local.example .env.local
```

```env
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
DEMO_EMAIL_FROM=SongZoo Cruise <onboarding@resend.dev>
DEMO_EMAIL_TO=you@example.com
```

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project structure

```
app/
  page.tsx              # Landing
  home/                 # State-machine hub
  song-setup/           # 7-step setup flow
  notifications/        # Permission simulation
  daily-highlight/      # Hub + day-1/2/3 recording pages
  completed/            # Sends demo email
  survey/               # Rating, amenities, suggestion
  thank-you/            # Resets state
  api/
    transcribe/         # POST → OpenAI Whisper
    send-email/         # POST → Resend
lib/
  store.ts              # Zustand store
  validation.ts         # Step gate helpers
  transcribe-client.ts  # Client-side fetch wrapper
  email-client.ts       # Client-side fetch wrapper
  email-template.ts     # HTML email builder
```

---

## Notes

- `.env.local` is gitignored — never commit API keys
- PWA icons in `public/` are placeholder solid-colour PNGs; replace with real artwork before any public demo
- No real push notifications — the permission screen is a UI simulation only
