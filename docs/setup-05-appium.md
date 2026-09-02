# Setup 05 — Install Appium + the UiAutomator2 Driver

Companion to Section 3, Clip 5. Appium has the heaviest setup of the four, so take it slowly.
On Android, Appium drives the app through the **UiAutomator2** driver.

> **Check first:** `appium -v` and `appium driver list --installed`. If Appium prints a version
> and `uiautomator2` is listed, skip ahead.

## Step 1 — The Appium server (installs via Node)

```bash
npm install -g appium
appium -v
```

## Step 2 — The Android driver

Appium cannot talk to Android on its own — it needs a driver. Install **UiAutomator2**
(Google's UI Automator under the hood — the Android equivalent of the iOS XCUITest driver):
```bash
appium driver install uiautomator2
appium driver list --installed        # should show  uiautomator2
```

## Step 3 — Environment check (`ANDROID_HOME` + `JAVA_HOME`)

Appium needs the Android SDK on your PATH (`ANDROID_HOME`, `adb`, `emulator` — set up in
Setup 01) **and a JDK with `JAVA_HOME` set**. The UiAutomator2 doctor fails on a missing
`JAVA_HOME` even though `java` runs, so set it explicitly.

**1. Install a JDK if you do not have one** (Appium needs a standalone JDK, not only Android
Studio's bundled one):
- **macOS:** `brew install --cask temurin`
- **Windows / Linux:** install **Temurin** from adoptium.net

**2. Set `JAVA_HOME`** in your shell profile:

- **macOS** — add to `~/.zshrc`. This resolves to whatever JDK is installed, so it survives
  version changes:
  ```bash
  export JAVA_HOME=$(/usr/libexec/java_home)
  ```
- **Linux** — add to `~/.bashrc` or `~/.zshrc`:
  ```bash
  export JAVA_HOME="/usr/lib/jvm/temurin-<version>"     # adjust to your JDK path
  ```
- **Windows** — PowerShell, once:
  ```powershell
  setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-<version>"
  ```

**3. Reload your shell** (`source ~/.zshrc`, or open a new terminal), then run the doctor:
```bash
echo "$JAVA_HOME"                     # should print the JDK path, not blank
appium driver doctor uiautomator2
```

You want **"0 required fixes needed."** The two optional warnings are **safe to skip** for this
course: **`bundletool.jar`** (only for Android App Bundles / `.aab`) and **`gst-launch`**
(GStreamer, only for live screen streaming).

## Step 4 — Python client (for the suite you build in Section 9)

The Appium suite is Python + pytest. Confirm Python 3 is present (`python3 --version`); you'll
`pip install Appium-Python-Client pytest` when you scaffold the suite in Section 9.

**✅ Check:** `appium` starts a server, `uiautomator2` is installed, and the doctor passes.

Next: Espresso & UI Automator — already in Android Studio (Setup 06).
