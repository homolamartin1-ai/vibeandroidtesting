# Section 14 — Stability & Debugging

You kill flakiness, learn each framework's debugger, then run against the **fixed** builds
for the regression pass — the suite should go green.

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Kill flakiness | **14, Clip 1** |
| Prompt 2 — Use the debuggers | **14, Clip 2** |
| Prompt 3 — Regression vs the fixed build | **14, Clip 3** |
| Prompt 4 — Close the loop | **14, Clip 4** |

---

## Prompt 1: Kill flakiness
*Used in: Section 14, Clip 1*

```
Review my four suites for flakiness risks per skills/flake-triage.md: any sleeps, taps
during animations, text/position locators, keyboard-covered fields, or state leaking
between tests. Fix each with the proper mechanism (wait-for-existence / Until, dismiss or
scroll past the keyboard, stable resource-id, fresh app launch). Espresso's auto-sync
handles most timing for free; Maestro, Appium, and UI Automator need explicit waits. Show
me each change.
```

## Prompt 2: Use the debuggers
*Used in: Section 14, Clip 2*

```
Show me how to debug a failure in each framework: Maestro Studio / recordings, the Appium
Inspector session, and — for Espresso and UI Automator — Android Studio's Layout Inspector
plus the Gradle/Espresso HTML test report, and a UI Automator window-hierarchy dump
(uiautomator dump). Walk through one real failure in each. The common thread: every debugger
shows you the view/accessibility tree as the framework actually sees it.
```

## Prompt 3: Regression against the fixed build
*Used in: Section 14, Clip 3*

```
Switch from the broken build to the FIXED build. Both use the same package id
(com.techshop.android), so only one can be installed at a time: uninstall the broken app
from the emulator first (adb uninstall com.techshop.android), then install the fixed build
(techshop/compose-fixed or techshop/reactnative-fixed) — a clean replace. Run all four
suites against it. Everything should pass, including the checkout tests that were blocked by
BUG-011. Report anything still red.
```

## Prompt 4: Close the loop
*Used in: Section 14, Clip 4*

```
For any test still failing on the fixed build, decide whether it is a leftover test bug or
a real remaining defect, fix the test if it's the former, and re-run until the suite is
fully green on the fixed build and correctly red on the broken build.
```

**Expected:** green on fixed, red-for-the-right-reasons on broken. A trustworthy suite.
Flaky tests destroy trust.
