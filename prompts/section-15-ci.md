# Section 15 — Shipping to CI

You build the CI pipelines yourself with the agent, so all four suites run on a **Linux
runner** with a booted **Android emulator** on every push. Workflows land in
`.github/workflows/`.

> **Android's CI advantage:** unlike iOS (which needs a macOS runner for the Simulator +
> Xcode), Android runs on a plain Linux runner — cheaper, faster to start, and more plentiful.
> We use a maintained emulator action with KVM hardware acceleration so the emulator is fast
> enough to be practical.

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — How mobile CI works | **15, Clip 1** |
| Prompt 2 — Set up the repository secrets | **15, Clip 2** |
| Prompt 3 — Maestro workflow | **15, Clip 2** |
| Prompt 4 — Push everything, monitor & fix until green | **15, Clips 2 & 4** |
| Prompt 5 — Appium, Espresso & UI Automator workflows | **15, Clip 3** |
| Prompt 6 — Push those, monitor & fix until green | **15, Clips 3 & 4** |

---

## Prompt 1: How mobile CI works
*Used in: Section 15, Clip 1*

```
Explain how CI runs Android UI tests: why it can run on a plain Linux runner (no Mac
needed), how an emulator is booted headless with a maintained action (e.g.
reactivecircus/android-emulator-runner) and why KVM hardware acceleration matters, where the
app build comes from (the Gradle wrapper), and how test artifacts (recordings, screenshots,
Gradle HTML reports) are uploaded. Keep it to what I need to write the workflows.
```

## Prompt 2: Set up the repository secrets first
*Used in: Section 15, Clip 2*

```
Before we write any workflow, set up the credentials the pipelines need so no run fails on
a missing secret. The tests read TEST_EMAIL and TEST_PASSWORD from the environment; in CI
those come from GitHub repository secrets.

Using the gh CLI, add TEST_EMAIL and TEST_PASSWORD as repository secrets on my repo, set to
the ACTUAL values from my local .env-local (source it first, then pass each value explicitly,
e.g. gh secret set TEST_EMAIL --body "$TEST_EMAIL" and gh secret set TEST_PASSWORD --body
"$TEST_PASSWORD"). Do not create them empty and do not print the values. Then confirm both
exist and are non-empty with gh secret list. If gh is not authenticated, tell me to run
gh auth login first.
```

**Expected:** `gh secret list` shows `TEST_EMAIL` and `TEST_PASSWORD`. Now every workflow
you write can read them and will not fail on a missing secret.

## Prompt 3: The Maestro workflow
*Used in: Section 15, Clip 2*

```
Write .github/workflows/maestro.yml: on push, on an ubuntu-latest runner — use
reactivecircus/android-emulator-runner to boot an Android emulator (with KVM enabled), build
& install techshop/reactnative-fixed with the Gradle wrapper, install Maestro, run
maestro test maestro/flows with TEST_EMAIL/TEST_PASSWORD from the repository secrets we just
set, and upload the Maestro report as an artifact.
```

## Prompt 4: Push everything, then monitor & fix until green
*Used in: Section 15, Clips 2 & 4*

```
We have been building locally all course and never pushed. Now commit and push EVERYTHING to
main — the skills, all four test suites (maestro/, appium/, espresso/, uiautomator/), and the
new .github/workflows/maestro.yml — not just the workflow file. First show me git status so I
see what will go up, make sure no secrets or .env-local are staged (they must stay
gitignored), then commit with a clear message and push. The push triggers the Maestro
workflow.

Then MONITOR the run to completion (gh run watch). If it fails, diagnose the cause from the
logs — emulator not booted, KVM/acceleration, app not installed, a Gradle dependency, missing
secret, or a real test failure — FIX it directly (edit the workflow or the test), commit, and
push again. Repeat this monitor → diagnose → fix → push loop until the Maestro run is green.
Report the final run URL. Don't stop at a red run and don't just describe the fix — keep going
until it passes.
```

## Prompt 5: Appium, Espresso and UI Automator workflows
*Used in: Section 15, Clip 3*

```
Write three more workflows, all on ubuntu-latest with the emulator action:
- .github/workflows/appium.yml — start the Appium server, pip install, install the
  uiautomator2 driver, install the app, run pytest, upload results.
- .github/workflows/espresso.yml — run ./gradlew connectedAndroidTest for the Espresso
  source set (Gradle builds, installs, runs the instrumented tests) and upload the HTML
  test report.
- .github/workflows/uiautomator.yml — same ./gradlew connectedAndroidTest pattern for the
  UI Automator source set, upload its report.
All read secrets TEST_EMAIL/TEST_PASSWORD; never hardcode credentials.
```

## Prompt 6: Push those, then monitor & fix until green
*Used in: Section 15, Clips 3 & 4*

```
Commit the appium.yml, espresso.yml and uiautomator.yml workflows to main and push them, so
all three trigger. Then MONITOR each run to completion (gh run watch). For any that fails,
diagnose from the logs — emulator boot, acceleration, app install, Gradle, missing secret, or
a real test failure — FIX it directly (edit the workflow or the test), commit, and push again.
Repeat the monitor → diagnose → fix → push loop until all three runs are green. Report the
final run URLs. Keep going until they pass.
```

**Expected:** four green workflows with artifacts on every push, on cheap Linux runners —
reached by pushing, watching, and fixing in a loop until green, with the secrets already in
place from Prompt 2 so nothing fails on a missing credential. Now it runs without you.
