# Setup 04 — Install Maestro

Companion to Section 3, Clip 4. Maestro is the easiest of the four frameworks and gets you a
passing test fastest. It drives the Android emulator directly.

> **Check first:** `maestro -v` — if it prints a version, skip to the Java check.

## Step 1 — Install Maestro

**macOS / Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```
**Windows:** install via WSL (recommended) using the same command inside your WSL shell, or
follow the Windows instructions at maestro.mobile.dev. Verify:
```bash
maestro -v
```

## Step 2 — Java runtime

Maestro needs a Java runtime. Android Studio ships a JDK, but Maestro looks for one on your
PATH. If you hit "Unable to locate a Java Runtime":

- **macOS:** `brew install --cask temurin`
- **Windows / Linux:** install Temurin (adoptium.net) or point `JAVA_HOME` at Android Studio's
  bundled JDK.

## Step 3 — Confirm Maestro sees the emulator

With an emulator running (`adb devices` shows it):
```bash
maestro test --help
```
Maestro auto-detects the running emulator — no device flag needed for a single device.

> **Maestro Studio** is a separate interactive tool (`maestro studio`) — optional. We use it
> for debugging in Section 14, not now.

**✅ Check:** `maestro -v` prints a version and Java is found.

Next: install Appium + the UiAutomator2 driver (Setup 05).
