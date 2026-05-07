# See You Next Session

See You Next Session is a mobile-first narrative diagnosis game built with React, Vite, and Capacitor for Android.

This repository is being prepared for the public GitHub launch. Initial tracking surfaces are live now; source import, CI activation, and gameplay expansion are tracked in the issue set below.

## Development and setup overview

### Current stack
- React 19
- TypeScript
- Vite
- Capacitor Android
- Vitest + Testing Library

### Local prerequisites
- Node.js and npm
- Java 17
- Android SDK for local APK builds

### Core commands
```bash
npm install
npm run dev
npm run test
npm run build
npm run android:add
npm run android:sync
npm run android:open
```

### Notes
- `npm run android:sync` updates the Android project from the web build output.
- `npm run android:open` opens the Capacitor Android project in Android Studio when the local toolchain is installed.
- The current local source still has a template README, so this README is the GitHub-facing project overview until the main code import lands.

## Android build and CI overview

### Local Android build
1. Install the Android SDK and Java 17.
2. Configure `ANDROID_HOME`, or create `android/local.properties` with `sdk.dir=/absolute/path/to/Android/Sdk`.
3. From the project root, run:
   ```bash
   npm run android:sync
   cd android
   ./gradlew assembleDebug
   ```
4. Expected debug APK output:
   `android/app/build/outputs/apk/debug/app-debug.apk`

### CI status
- The current local project already includes a draft workflow file named `android-build-workflow.yml`.
- That workflow still needs to be moved into `.github/workflows/` in the source repo so GitHub Actions can build and upload APK artifacts automatically.
- Hardening and activation are tracked in issue #1.

## Gameplay and content architecture overview

### Core game loop
The current app flow is organized around five major screens:
- Inbox
- Session
- Documentation
- Session summary
- Upgrades

### Data model
The local source currently defines:
- 3 authored patients
- 4 diagnosis entries
- 3 skills
- 2 decor upgrades

Content is organized under `src/data/` and typed through `src/types.ts`.

### State and progression
- Session flow and scoring are handled through `src/state/gameReducer.ts`.
- Durable progression is stored through `src/state/persistence.ts`.
- Current durable save fields include knowledge points, score, completed patients, purchased skills, purchased decor, and onboarding dismissal state.

### Scope framing
All case material is framed as fictional puzzle content rather than real clinical guidance.

## Roadmap and next milestones

### Active milestone
- **MVP Alpha**

### Initial tracked work
- #1 Harden Android APK pipeline
- #2 Polish session UX for mobile play
- #3 Expand patient roster and authored content set
- #4 Balance saves, progression, and upgrade pacing
- #5 Create release checklist and store-readiness plan
- #6 Bootstrap GitHub-facing documentation set

## Repository management status
- Repository description/about is configured.
- Wiki is enabled.
- Labels and the initial MVP Alpha milestone are in place.
- A GitHub Project could not be created with the current token because it lacks `project` and `read:project` scopes.

— Jesse
