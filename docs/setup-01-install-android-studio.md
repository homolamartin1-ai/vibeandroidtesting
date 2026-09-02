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
**Save the file, then reload your shell** — the terminal you already have open will not pick up
the change until you do (`source ~/.zshrc`, or open a new terminal tab/window). Then verify:
```bash
source ~/.zshrc      # macOS default shell is zsh
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

> **⚠️ `zsh: command not found: emulator` (or `adb`)?** The SDK is installed but not on your
> PATH yet. Add these lines to `~/.zshrc` (macOS) — this is the same PATH setup from Step 2, and
> it is the single most common snag:
> ```bash
> export ANDROID_HOME="$HOME/Library/Android/sdk"
> export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
> ```
> Then **reload your shell** — the terminal you already have open will not see the change until
> you do:
> ```bash
> source ~/.zshrc          # or just open a new terminal tab/window
> ```
> Confirm the SDK is really there first: `ls ~/Library/Android/sdk/platform-tools/adb`.
> (Linux: `ANDROID_HOME="$HOME/Android/Sdk"`. Windows: use the `setx` commands from Step 2.)

**✅ Check:** `adb devices` shows a running emulator, and you can see the Android home screen.

> **Hardware acceleration:** the emulator needs virtualization — on Windows enable WHPX/HAXM,
> on Linux enable KVM, on macOS it works out of the box. Android Studio warns you if it is off.

Next: Node & Antigravity (Setup 02).
