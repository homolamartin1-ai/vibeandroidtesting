# Section 12 — Four Frameworks Compared

> Cheat sheet output: [../snippets/framework-cheatsheet.md](../snippets/)

The payoff. You now have the same login/cart/checkout suite in Maestro, Appium, Espresso,
and UI Automator. Put them side by side and learn to choose.

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Same test, four ways | **12, Clip 1** |
| Prompt 2 — Measure and compare | **12, Clip 2** |
| Prompt 3 — Native / cross-platform / in-out fit | **12, Clip 3** |
| Prompt 4 — Decision guide | **12, Clip 4** |

---

## Prompt 1: The same login test, four ways
*Used in: Section 12, Clip 1*

```
Show my login test in Maestro, Appium, Espresso, and UI Automator side by side. Annotate
each with how it locates the email field, how it taps login, and how it asserts success.
Point out what each framework makes easy and what it makes verbose.
```

## Prompt 2: Measure and compare
*Used in: Section 12, Clip 2*

```
Run the full suite in each framework against the fixed build and record: total run time,
setup effort, flakiness/waits needed, and which planted bugs each suite could and could not
catch (remember BUG-001 masked input and BUG-008 colour need attribute/visual reads; only
UI Automator can leave the app). Put it in a comparison table in test-cases.md.
```

## Prompt 3: Native, cross-platform, in-app, black-box fit
*Used in: Section 12, Clip 3*

```
Given we ran every suite against both the Compose and React Native builds, summarise which
framework fits which app and team, and why. Fold in the two dimensions that decide it on
Android: platform reach (Maestro and Appium are cross-platform → carry to iOS; Espresso and
UI Automator are Android-only) and inside-vs-outside (Espresso is in-app/white-box/fastest;
UI Automator is black-box and the only one that crosses app boundaries).
```

## Prompt 4: A decision guide
*Used in: Section 12, Clip 4*

```
Write a short decision guide: given a team's stack (native Kotlin/Compose, RN, Flutter),
skills (coders vs not), platform targets (Android-only vs Android+iOS), whether they need
cross-app flows, CI budget, and job market — which of Maestro / Appium / Espresso / UI
Automator should they pick? Save it as snippets/framework-cheatsheet.md.
```

**Expected:** you can read any of the four suites and justify a framework choice in an
interview — the most portable skill in this course.
