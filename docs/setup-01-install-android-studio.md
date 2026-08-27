# Setup 01 — Install Android Studio, the SDK & an Emulator

Companion to Section 3, Clip 1. This is the one big install. It runs on **Windows, macOS, or
Linux** — no Mac required. Everything else in the course sits on top of it.

> **Check first:** if you already have Android Studio and an emulator that boots, run
> `adb --version` and `emulator -list-avds`. If both print output, skip to Setup 02.

## Step 1 — Install Android Studio

Download from **developer.android.com/studio** and run the installer for your OS. On first
launch, accept the **Standard** setup — it downloads the Android SDK, an SDK platform, the
build tools, the platform-tools (which include **adb**), and the emulator. Android Studio
bundles its own **JDK**, so you do not install Java separately for it.

## Step 2 — Confirm the SDK command-line tools are on your PATH

The course uses `adb` and `emulator` from the terminal. Add the SDK to your PATH:

**macOS / Linux** (add to `~/.zshrc` or `~/.bashrc`):
```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"      # macOS
# export ANDROID_HOME="$HOME/Android/Sdk"            # Linux
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

**Windows** (PowerShell — set once, permanently):
```powershell
setx ANDROID_HOME "$env:LOCALAPPDATA\Android\Sdk"
setx PATH "$env:PATH;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator"
```
Reopen the terminal, then verify:
```bash
adb --version
```

## Step 3 — Create an emulator (AVD)

In Android Studio: **More Actions → Virtual Device Manager → Create Device**. Pick a phone
(e.g. **Pixel 7**), a recent system image (e.g. **API 34**, download it if prompted), and
finish. Give it a clear name like `Pixel_7_API_34`.

Boot it from the terminal to confirm it works:
```bash
emulator -list-avds
emulator -avd Pixel_7_API_34        # or launch it from Device Manager
adb devices                          # should list  emulator-5554   device
```

**✅ Check:** `adb devices` shows a running emulator, and you can see the Android home screen.

> **Hardware acceleration:** the emulator needs virtualization — on Windows enable WHPX/HAXM,
> on Linux enable KVM, on macOS it works out of the box. Android Studio warns you if it is off.

Next: Node & Antigravity (Setup 02).
