# Setup 02 — Install Node & Antigravity

Companion to Section 3, Clip 2. Two quick installs — and the theme of this whole section:
**check before you install.**

## Node (for the React Native build and Appium)

Check first:
```bash
node -v
```
If it prints v18+ you're done. Otherwise install it:

- **macOS:** `brew install node` (or download from nodejs.org)
- **Windows:** `winget install OpenJS.NodeJS` (or download from nodejs.org)
- **Linux:** use your package manager or nodejs.org — aim for the current LTS.

## Antigravity (the agentic IDE)

Antigravity is Google's AI IDE we drive the agent from throughout the course. Download it from
the **official Google website — antigravity.google** — and sign in. It runs on Windows, macOS,
and Linux.

> As of 2026 Antigravity may have a short waitlist depending on when you watch this. If you are
> waitlisted, follow the demos and come back to the hands-on parts once your access is
> confirmed — the workflow does not change.

**✅ Check:** `node -v` prints a version, and Antigravity opens and lets you start a chat.

Next: fork & clone the course repo (Setup 03).
