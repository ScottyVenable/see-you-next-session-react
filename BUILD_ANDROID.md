See You Next Session — Android APK build instructions

Quick summary

- CI: The live GitHub Actions workflow is `.github/workflows/android-build.yml`. It runs test, lint, build, Android sync, Gradle assembleDebug, and uploads the APK artifact.
- Local: To build locally you must install the Android SDK and set `ANDROID_HOME` or create `android/local.properties` with `sdk.dir=/absolute/path/to/Android/Sdk`.
- Runner note: npm commands are routed through `scripts/internal-run.mjs`, which copies the project to a writable cache outside shared storage before running Node-based tools.

Local build steps

1. Install Android SDK, Java 17, and ensure `sdkmanager` is available.
2. From project root:
   - npm run android:sync
   - cd android
   - ./gradlew assembleDebug
3. Resulting debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`

CI notes

- The workflow installs Java 17, Node 20, Android SDK platform 35 / build-tools 35.0.0, then runs the standard npm and Gradle checks.
- After CI completes, download the artifact named `app-debug-apk` from the Actions run.
