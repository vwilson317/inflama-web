# Carnival — Tinder-style swipe PWA

A React Native (Expo) PWA with a **Brazilian carnival** theme. Swipe on profiles (mock data): each card shows photo, age, country flag, current location, and a **countdown to when they're leaving**. Built with TypeScript and Supabase (ready for real data).

## Features

- **Swipe stack**: Drag cards left (nope) or right (like); velocity and threshold trigger swipe-off
- **Profile cards**: Image, age, country-of-origin flag, current location, live countdown (“Leaving in Xd Yh”)
- **Mock data**: Men and women with stable placeholder images (Picsum), varied locations and “leaving” times
- **Brazilian carnival theme**: Dark purple/gold palette, sequin-style shadows, carnival copy
- **PWA**: Web manifest and theme color for “Add to Home Screen” and standalone install

## Tech stack

- **Expo** (React Native) + **TypeScript**
- **Supabase** client (configure with env vars for real backend later)
- **expo-image** for photos
- **PanResponder** + **Animated** for swipe (no native-only deps, works on web)

## Setup

```bash
npm install
npx expo install react-dom react-native-web   # for web/PWA
```

### Run

- **Web (PWA):** `npm run web`
- **iOS:** `npm run ios`
- **Android:** `npm run android`

### Supabase (optional)

To use Supabase instead of mock data:

1. Create a project at [supabase.com](https://supabase.com).
2. Add env vars (e.g. in `.env` or Expo config):
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Use `src/lib/supabase.ts` and replace `MOCK_PROFILES` in `App.tsx` with a query to your `profiles` table (same shape as `Profile` in `src/types/profile.ts`).

## Project structure

- `App.tsx` — Root screen, header, swipe stack
- `src/components/` — `ProfileCard`, `SwipeStack`
- `src/data/mockProfiles.ts` — Mock men/women and combined list
- `src/types/profile.ts` — `Profile` and related types
- `src/theme.ts` — Brazilian carnival colors and shadows
- `src/utils/countdown.ts` — “Leaving in Xd Yh” text
- `src/utils/flags.ts` — Country code → flag emoji
- `public/manifest.json` — PWA manifest (name, icons, theme)

## Mock data

- **Men:** `MOCK_MEN` (Rafael, Bruno, Lucas, Diego, Thiago)
- **Women:** `MOCK_WOMEN` (Beatriz, Marina, Camila, Larissa, Fernanda)
- **Combined:** `MOCK_PROFILES` — used as the swipe deck
- Each profile has: `id`, `name`, `age`, `imageUri`, `countryCode`, `currentLocation`, `leavingAt`, `gender`

Swipe left = nope, right = like; callbacks are logged (and can be wired to Supabase later).
