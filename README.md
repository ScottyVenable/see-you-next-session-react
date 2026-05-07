# See You Next Session

See You Next Session is a mobile-first fictional clinical puzzle game built with React, TypeScript, Vite, and Capacitor Android.

This repository is named `see-you-next-session-react` on GitHub to avoid colliding with another repo that already uses the game title. The in-game title stays **See You Next Session**.

## What is in the current build

- Three authored consults:
  - Gregory Vigil: tutorial case focused on generalized anxiety clues
  - Ayla Collingwood: medium case with episodic activation and depressive contrast
  - Mara Lowell: hard case built around contradiction synthesis
- Mobile-safe tap flow for text clues, visual clue collection, and end-of-session documentation
- Durable local progress for Knowledge Points, upgrades, completion state, and onboarding dismissal
- Office upgrades, scoring, handbook testing, and a developer console for local iteration
- Automated checks for content integrity, reducer behavior, persistence, and UI session flow

All handbook and case material is fictional puzzle content. It is not real clinical guidance.

## Stack

- React 19
- TypeScript
- Vite
- Vitest + Testing Library
- ESLint
- Capacitor Android

## Shared-storage runner constraint

This project lives in Android shared storage, so direct tool execution can be unreliable.

Use the provided npm scripts. They route through `scripts/internal-run.mjs`, which copies the project into a writable cache outside shared storage, installs dependencies there, and runs the requested command from that safe worktree.

The runner now uses:

- `XDG_CACHE_HOME` when set
- otherwise `~/.cache`

That makes the workflow safe for Termux-style local development and for GitHub Actions runners.

## Prerequisites

- Node.js 20+
- npm
- For Android packaging:
  - Java 17
  - Android SDK
  - `sdkmanager` available on your path, or Android Studio installed

## Setup

```bash
npm test
npm run lint
npm run build
```

The first run will populate the cache-backed dependency/work directories used by the internal runner.

## Available scripts

```bash
npm run dev
npm run test
npm run lint
npm run build
npm run android:sync
npm run android:open
```

## Local Android packaging

1. Install Java 17 and the Android SDK.
2. Point Gradle at the SDK with one of these approaches:
   - set `ANDROID_HOME`
   - or create `android/local.properties` with `sdk.dir=/absolute/path/to/Android/Sdk`
3. Sync web assets into the Android project:

```bash
npm run android:sync
```

4. Build the debug APK:

```bash
cd android
./gradlew assembleDebug
```

Output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

More detail lives in [BUILD_ANDROID.md](./BUILD_ANDROID.md).

## GitHub Actions CI

Android CI is defined at:

```text
.github/workflows/android-build.yml
```

The workflow runs:

- `npm test`
- `npm run lint`
- `npm run build`
- `npm run android:sync`
- `./gradlew assembleDebug`

Each successful run uploads the debug APK as a workflow artifact.

## Repository notes

- Default branch: `main`
- The Android project is committed in-repo
- Local screenshots should go in `screenshots/` and stay untracked
