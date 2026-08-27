# Agent vibe testing 2026: Android Mobile Testing with AI — Course Repository

Resources for the Udemy course. Everything you need to follow along is in this repo.

> **Works on Windows, macOS, or Linux — no Mac required.** Android tooling is cross-platform:
> Android Studio, the emulator, and every framework here run on all three. Each setup step
> gives the command for your OS.

## Getting started

**Fork this repo** (click **Fork**, top-right) so you have your own copy to commit to and
push from, then clone your fork:

```
git clone git@github.com:<your-username>/vibeandroidtesting.git
cd vibeandroidtesting
```

Full setup — Android Studio + SDK + emulator, Node, Antigravity, Maestro, Appium, and the
mobile MCP — is Section 3.

---

## What's in here

```
vibeandroidtesting/
├── techshop/                     ← The app under test — two implementations
│   ├── compose-broken/           ← Native Jetpack Compose — 15 bugs planted (+2 mobile-specific)
│   ├── compose-fixed/            ← Native Jetpack Compose — clean, used in verification
│   ├── reactnative-broken/       ← React Native — SAME 15 bugs
│   ├── reactnative-fixed/        ← React Native — clean
│   └── requirements.md           ← Sprint 1 spec — the Section 4 coverage check
│
├── capstone/                     ← Your independent project (Section 16)
│   ├── booknow-compose-broken/   ← Hotel booking app — bugs planted, count not disclosed
│   ├── booknow-compose-fixed/
│   ├── booknow-reactnative-broken/
│   ├── booknow-reactnative-fixed/
│   └── requirements.md           ← BookNow spec — verify the app against it
│
├── skills/                       ← YOU BUILD in Section 5 — starts empty
├── maestro/                      ← YOU BUILD in Section 8 — starts empty
├── appium/                       ← YOU BUILD in Section 9 — starts empty
├── espresso/                     ← YOU BUILD in Section 10 — starts empty
├── uiautomator/                  ← YOU BUILD in Section 11 — starts empty
├── .github/workflows/            ← YOU BUILD in Section 15 — starts empty
│
├── docs/                         ← Written guides — the companion to each lecture
│   ├── setup-01…setup-07-*.md    ← Android Studio, Node, Maestro, Appium, native, mobile MCP
│   ├── s04…s17-*.md              ← one guide per section
│   └── README.md                 ← index
│
├── prompts/                      ← Every Antigravity prompt, by section + clip
│   └── section-03-setup.md … section-16-capstone.md
│
└── snippets/                     ← Setup commands, MCP config, CLI references, cheat sheet
```

> **This is a build-along course.** `skills/`, `maestro/`, `appium/`, `espresso/`,
> `uiautomator/`, and `.github/workflows/` start **empty** — you generate every one of them
> yourself with the AI agent during the course, guided by the `prompts/` and `docs/`. Your
> instructor builds the same artifacts live and shares the finished versions as the class
> answer key — but the learning is in the doing, so build yours first.

---

## Running TechShop Android

### Jetpack Compose build

Open `techshop/compose-broken/` in Android Studio, pick an emulator (AVD), and press **Run**.
Or from the command line (Gradle wrapper works on any OS):

```bash
cd techshop/compose-broken
./gradlew installDebug        # Windows: gradlew.bat installDebug
adb shell am start -n com.techshop.android/.MainActivity
```

### React Native build

```bash
cd techshop/reactnative-broken
npm install
npx expo run:android          # builds, installs, and launches on the running emulator
```

**Test credentials:** `demo@techshop.com` / `password123`

> **One build at a time — reinstall when you switch.** All four builds (Compose/React Native
> × broken/fixed) share `applicationId com.techshop.android`, so only one can be installed on
> the emulator at once. Whenever you switch — **broken → fixed** for the Section 14 regression,
> or Compose ↔ React Native — **uninstall the current app first** (`adb uninstall
> com.techshop.android`) or reinstall over it, so you're actually running the build you think
> you are. The suites relaunch the app fresh on every test, so in-run state is handled for you;
> this is only about *which build* is installed. For **Section 4 exploration**, start from a
> clean install of the **broken** build.

The **same 15 bugs** are planted in both builds, so a suite you write once runs against both —
and you get to watch it behave differently under the hood.

---

## The 15 Bugs (broken builds only) — what the suites target

| ID | Area | What's wrong | Caught by |
|----|------|-------------|-----------|
| BUG-001 | Login | Password field is not masked — plaintext | Input-type / attribute assertion |
| BUG-002 | Login | Empty email/password accepted | Negative test |
| BUG-003 | Login | Wrong credentials still navigate to catalog | Negative test |
| BUG-004 | Cart | Discount divides by 1000 not 100 | Computed-total assertion |
| BUG-005 | Cart | Quantity stepper decrements below 1 | Boundary test |
| BUG-006 | Cart | Total does not update on quantity change | State assertion |
| BUG-007 | Catalog | Long product names overflow / clip the cell | Optional visual assertion |
| BUG-008 | Catalog | "Out of Stock" badge is green, not red | Optional visual assertion |
| BUG-009 | Checkout | Expiry date accepts past dates | Negative test |
| BUG-010 | Checkout | CVV accepts letters/symbols — keyboard not numeric | Input validation test |
| BUG-011 | Checkout | "Proceed to Checkout" unresponsive (blocker) | Tap / navigation assertion |
| BUG-012 | Checkout | Form submits with all fields empty | Negative test |
| BUG-013 | Checkout | Confirmation missing order reference | Presence assertion |
| BUG-014 | General | Navigation title shows "Untitled" | Title assertion |
| BUG-015 | General | Bottom nav visible before auth | Visibility assertion |

**Mobile-specific bonus bugs:**

| ID | Area | What's wrong | Caught by |
|----|------|-------------|-----------|
| BUG-016 | Accessibility | Login button has no resource-id / content-description | Testability lesson — add one |
| BUG-017 | Keyboard | Keyboard covers the CVV field and won't dismiss | Interaction / scroll test |

> **BUG-011 is a blocker** for checkout flows — the "Proceed to Checkout" button does not
> respond to taps. Note this dependency in any checkout test.
>
> **BUG-016 is special:** you cannot write a stable test for the login button until it is given
> a `testTag` / content-description. This is the mobile testability lesson — the agent proposes
> the fix, then the test becomes writable.

---

## Credentials — keep secrets out of your code

The suites read credentials from environment variables. Never hardcode usernames, passwords,
or tokens in flow files, test code, prompts, or commits.

**Local:** copy `.env.example` to `.env`, fill in your values. `.env` is gitignored.
**CI (GitHub Actions):** add `TEST_EMAIL` and `TEST_PASSWORD` as repository secrets.

---

## The mobile MCP (Antigravity)

The agent drives a real Android emulator through a mobile MCP server (tap, type, read the
screen, report what it sees) — the mobile equivalent of Playwright MCP for the web. Install
the scoped `@mobilenext/mobile-mcp` server (not the unscoped `mobile-mcp` stub). Full
step-by-step is in **[docs/setup-07-mobile-mcp.md](docs/setup-07-mobile-mcp.md)**.

---

## How to use the prompts

Each file in `prompts/` maps to a course section and lists every prompt with the exact clip it
is used in. Copy the prompt, paste it into the Antigravity chat, and follow along. Prompts
reference the skills in `skills/` and the app running on the emulator.

## Course sections and what to find here

| Section | What to grab |
|---------|-------------|
| 3 — Setup | `techshop/*`, `prompts/section-03-setup.md`, MCP config |
| 4 — Exploration | `techshop/*`, `techshop/requirements.md`, `prompts/section-04-exploration.md` |
| 5 — Skills | `prompts/section-05-skills.md` → builds `skills/` |
| 6 — View hierarchy | `prompts/section-06-accessibility.md` |
| 7 — Test cases | `prompts/section-07-testcases.md` |
| 8 — Maestro | `prompts/section-08-maestro.md`, `maestro/` |
| 9 — Appium | `prompts/section-09-appium.md`, `appium/` |
| 10 — Espresso | `prompts/section-10-espresso.md`, `espresso/` |
| 11 — UI Automator | `prompts/section-11-uiautomator.md`, `uiautomator/` |
| 12 — Compared | `prompts/section-12-compare.md`, framework comparison cheat sheet |
| 13 — Bugs | `prompts/section-13-bugs.md` |
| 14 — Stability | `prompts/section-14-stability.md`, `techshop/*-fixed` |
| 15 — CI | `prompts/section-15-ci.md`, `.github/workflows/*` |
| 16 — Capstone | `prompts/section-16-capstone.md`, `capstone/*` |
