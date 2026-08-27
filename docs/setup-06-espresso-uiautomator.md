# Setup 06 — Espresso & UI Automator (Already in Android Studio)

Companion to Section 3, Clip 6. Good news after Appium: **nothing to install today.** Both
native frameworks ship with the Android tooling you already have.

## What they are

- **Espresso** — Google's native, in-app UI test framework. White-box: the test runs inside
  the app's process. Fastest, deepest access. You write it in **Kotlin**, in the app's
  `androidTest` source set. Best for the native Jetpack Compose build.
- **UI Automator** — Google's native, **black-box** UI test framework. It drives any installed
  app externally by resource-id / content-description — the true parallel to iOS XCUITest's
  black-box model. Also Kotlin, also in `androidTest`.

Both are part of **AndroidX Test**, which comes with Android Studio. There is no separate
download.

## What you'll do later (Sections 10 & 11)

- Add the AndroidX Test dependencies to the app module's `build.gradle` (`espresso-core`,
  `uiautomator`, `androidx.test:runner`, `ext:junit`) — the prompt provides the exact block.
- Write your tests under `app/src/androidTest/…` (or the course's `espresso/` and
  `uiautomator/` folders wired into the module).
- Run them with `./gradlew connectedAndroidTest` (or **Run** in Android Studio) against a
  running emulator.

## Confirm the toolchain is ready

```bash
adb devices                 # an emulator is running
./gradlew tasks | grep -i connectedAndroidTest   # the test task exists (Windows: gradlew.bat)
```

**✅ Check:** you understand that Espresso (in-app) and UI Automator (black-box) are both
already available — you'll wire them into the app module when you reach Sections 10 and 11.

Next: connect the mobile MCP (Setup 07).
