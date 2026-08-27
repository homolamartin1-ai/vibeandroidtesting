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

## Step 3 — Environment check

Appium needs the Android SDK on your PATH (`ANDROID_HOME`, `adb`, `emulator` — set up in
Setup 01) and a Java runtime. Run the doctor to confirm:
```bash
appium driver doctor uiautomator2
```
Fix anything it flags (usually a missing `ANDROID_HOME` or Java).

## Step 4 — Python client (for the suite you build in Section 9)

The Appium suite is Python + pytest. Confirm Python 3 is present (`python3 --version`); you'll
`pip install Appium-Python-Client pytest` when you scaffold the suite in Section 9.

**✅ Check:** `appium` starts a server, `uiautomator2` is installed, and the doctor passes.

Next: Espresso & UI Automator — already in Android Studio (Setup 06).
