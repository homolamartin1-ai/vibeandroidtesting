# TechShop Android — Jetpack Compose (Broken)

Native **Jetpack Compose** build (Kotlin). The 15 core + 2 mobile-specific bugs are planted here (see `../BUGS.md`). Each buggy line carries a `BUG-0xx` comment.

## Run it

1. Open this folder in **Android Studio** and let it sync (this also generates the Gradle
   wrapper the first time). Or from the command line if you have Gradle:
   ```bash
   ./gradlew installDebug        # Windows: gradlew.bat installDebug
   adb shell am start -n com.techshop.android/.MainActivity
   ```
2. Pick a running emulator and press **Run**.

> Elements expose their `testTag` as an Android **resource-id** (via
> `testTagsAsResourceId`), so Maestro, Appium, UI Automator, and the Compose/Espresso test
> APIs can all locate them by id.

**Test credentials:** demo@techshop.com / password123
