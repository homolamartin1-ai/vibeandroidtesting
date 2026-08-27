# Section 3 — Setup

> 📖 **Guides:** [setup-01…07](../docs/README.md) · CLI in [../snippets/](../snippets/)

You drive setup through the agent where you can. Most of this is one-time. Everything here
works the same on **Windows, macOS, or Linux** — Android needs no Mac.

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Verify the toolchain | **3, Clip 7** (first — confirm everything installed) |
| Prompt 3 — Connect the mobile MCP | **3, Clip 7** (then set up the MCP) |
| Prompt 2 — Run both TechShop apps | **3, Clip 8** |
| Prompt 4 — First vibe check | **3, Clip 8** |

---

## Prompt 1: Verify the toolchain
*Used in: Section 3, Clip 7 — run this first, before connecting the MCP, to confirm everything installed*

```
Check my machine is ready for Android mobile testing and tell me exactly what's missing:
- Android SDK + platform-tools on PATH: adb devices, sdkmanager --version
- A running emulator or connected device (adb devices shows one "device")
- Java JDK (java -version) and Android Studio installed
- Node (node -v)
- Maestro (maestro -v), Appium (appium -v) + the uiautomator2 driver
  (appium driver list), and Python + pip
For anything missing, give me the exact install command for my OS. Do not install without asking.
```

## Prompt 2: Run both TechShop apps on the emulator
*Used in: Section 3, Clip 8*

```
First, run `adb devices` and confirm exactly one Android emulator or device is connected.
If none is, list my AVDs (emulator -list-avds) and boot one, then wait for it with
`adb wait-for-device`. Tell me which device you are using and reuse it for everything from here on.

Then, on that device:
1. Build and install techshop/compose-broken with the Gradle wrapper
   (./gradlew installDebug — use gradlew.bat on Windows).
2. Separately, run techshop/reactnative-broken with Expo (npx expo run:android).
Confirm both install as package id com.techshop.android and show the login screen.
```

> **Why:** letting the agent detect the connected device (rather than hardcoding an AVD
> name) keeps every later command working on your machine, whatever OS you are on.

## Prompt 3: Connect the mobile MCP
*Used in: Section 3, Clip 7*

```
Set up the mobile MCP server in Antigravity IDE so you can drive the Android emulator.
1. Find (or create) Antigravity IDE's MCP config file and show me the path.
2. Add this EXACT server entry, alongside my other servers (do not touch the others).
   Use the SCOPED package @mobilenext/mobile-mcp — NOT the unscoped "mobile-mcp",
   which is a broken stub:

     "mobile": {
       "command": "npx",
       "args": ["-y", "@mobilenext/mobile-mcp@latest"]
     }

3. Tell me if I need to reload/restart Antigravity IDE, then verify by taking a screenshot
   of the running emulator and describing what you see.
```

> **Use the scoped package.** `@mobilenext/mobile-mcp` is the real mobile-next server (iOS +
> Android, via adb/UiAutomator on Android — no extra tools needed). The unscoped `mobile-mcp`
> on npm is a broken stub and will fail with missing-dependency or `ADB not found` errors.
> A ready copy of this entry is in [../snippets/mobile-mcp-config.json](../snippets/mobile-mcp-config.json).

**The one manual beat:** Antigravity IDE usually needs a reload to load a new MCP server.
The agent will tell you when.

## Prompt 4: First vibe check
*Used in: Section 3, Clip 8*

```
Using the mobile MCP, open the running TechShop app on the emulator, describe the login
screen, and read back the resource-ids you can see on it.
```

**Expected:** the agent drives the emulator and reports what it sees — no test written
yet. That is the whole idea: exploration before a single test exists.
