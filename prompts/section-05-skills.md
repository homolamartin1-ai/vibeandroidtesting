# Section 5 — Skills for AI Agents: Building the Toolkit

> 📖 **Skills live in** [../skills/](../skills/)

The centerpiece. Each prompt creates one reusable skill file in `skills/`. You keep these
skills and reuse them for the rest of the course — across all four frameworks. We build
them here; we put them to work from Section 7 on.

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Build the test-case-design skill | **5, Clip 2** |
| Prompt 2 — Build the test-authoring skill | **5, Clip 3** |
| Prompt 3 — Build the bug-reporting skill | **5, Clip 4** |
| Prompt 4 — Build the flake-triage skill | **5, Clip 5** |

> A "skill" is a markdown file the agent reads before a task, so it applies your standards
> every time instead of improvising. Save these to `skills/`.

---

## Prompt 1: Build the Test-Case Design Skill
*Used in: Section 5, Clip 2*

```
Create a reusable skill file at skills/test-case-design.md.

Purpose: given a mobile feature (login, catalog, cart, or checkout) plus my exploration
notes in exploration-notes.md and the spec in techshop/requirements.md, produce a complete
test matrix. Write it as instructions YOU (the agent) follow whenever I ask you to design
test cases. It must require:

- THREE categories per feature: Positive, Negative, Edge (boundaries).
- A consistent per-case format: ID, behavioural title, category, preconditions,
  steps, expected result.
- Coverage tied to the real app: use exploration-notes.md and techshop/requirements.md,
  not generic guesses.
- For each case, note the LOCATOR it will need (resource-id or visible text),
  and flag any control with NO stable id as a testability defect.
- Flag any known bug as a planned regression case with its BUG-id, and note cases
  that are blocked by another bug.

Keep it concise and instructional. This file is the standard, not an example.
```

---

## Prompt 2: Build the Test-Authoring Skill
*Used in: Section 5, Clip 3*

```
Create a reusable skill file at skills/test-authoring.md.

Purpose: turn test cases into clean MOBILE tests to a consistent standard, in whichever
framework I name (Maestro, Appium, Espresso, or UI Automator). Write it as instructions you
follow whenever I ask you to write tests.

UNIVERSAL RULES (all four frameworks):
- LOCATORS: prefer stable resource-ids. On the Compose build these come from
  Modifier.testTag exposed via semantics { testTagsAsResourceId = true }; on React Native
  from testID — both surface as the Android resource-id. Use visible text only when no id
  exists; if a key control has no id, recommend adding one. Never locate by position or index.
- ASSERTIONS: every test asserts the real outcome (value, state, visibility, element
  type/attribute), never just "it didn't crash".
- ISOLATION: each test launches the app fresh and runs in any order.
- SECRETS: credentials from TEST_EMAIL / TEST_PASSWORD env vars, never hardcoded.
- NO manual sleeps; use each framework's wait mechanism.
- REUSE: shared setup (login, add-to-cart) in a subflow / helper / base class.
- CROSS-BUILD: the same test must run against the Compose and React Native builds
  (same package id com.techshop.android) — so the login button is located by the text
  "Log In" (it has no id in the broken build, BUG-016).
- HONESTY: Maestro and UI Automator can't read hidden attributes (masked-password input
  type, colour) — defer those cases to Appium/Espresso rather than writing a weak assertion.

Then a dedicated BEST-PRACTICES section for each framework:

MAESTRO (YAML flows):
- One .yaml flow per behaviour under maestro/flows/; reusable steps (login, add-to-cart)
  in maestro/subflows/, called with runFlow. Set appId: com.techshop.android at the top.
- Locate with `id:` (resource-id) or visible text; assert with assertVisible /
  assertNotVisible; check a value with a text regex, e.g. ".*120.*".
- Parameterise credentials with ${EMAIL} / ${PASSWORD}, passed at runtime with -e.
- launchApp with clearState:true for isolation. Prefer extendedWaitUntil over any fixed
  wait. Keep flows declarative — no logic. If a check needs an attribute Maestro can't
  read (masked input, colour), say so and hand that case to Appium/Espresso.

APPIUM (Python + pytest, Page Object Model, UiAutomator2 driver):
- conftest.py holds the driver fixture (automationName UiAutomator2, appPackage
  com.techshop.android + appActivity, fresh launch per test, creds from env). One page
  object per screen under pages/; tests under tests/; shared flows in a flows.py helper —
  never copy-pasted setup. Add pytest.ini and requirements.txt.
- Locate with AppiumBy.ID (resource-id) or AppiumBy.ACCESSIBILITY_ID (content-desc);
  AppiumBy.ANDROID_UIAUTOMATOR for text. Read attributes when a case needs it (e.g.
  element.get_attribute("password") == "true" for BUG-001).
- Waits: WebDriverWait + expected_conditions — never time.sleep. Keep page objects thin
  (locators + actions); assertions live in the tests.

ESPRESSO (Kotlin, in-app / white-box, AndroidX Test, under espresso/):
- Instrumented tests in the app's androidTest source set. A base class launches the app
  with an ActivityScenario / Compose test rule and reads creds from BuildConfig or env,
  and holds shared helpers: login(), addItemAndOpenCart(). One test class per feature.
- Classic Views: onView(withId(...)) / withContentDescription(...), perform(click()),
  check(matches(...)). Compose: createAndroidComposeRule + onNodeWithTag("login-email").
- Prove masking with the input type / VisualTransformation (Compose: a semantics assertion;
  Views: withInputType). Espresso auto-synchronises with the UI thread — never sleep; for
  genuine async use an IdlingResource, not a wait loop.
- Run with ./gradlew connectedAndroidTest. The Espresso Test Recorder is a starting point,
  not the source of truth: rewrite its convenient (text/position) locators to test-tags.

UI AUTOMATOR (Kotlin, black-box / cross-app, AndroidX Test, under uiautomator/):
- Instrumented tests using UiDevice. A base class gets UiDevice.getInstance(), launches
  com.techshop.android by package, and holds a findAndWait(By) helper plus login() and
  addItemAndOpenCart(). One test class per feature.
- Locate with By.res(resourceId), By.desc(...), or By.text(...) — never by position.
- Waits: device.wait(Until.hasObject(...) / Until.findObject(...)) before every action —
  never Thread.sleep. Relaunch the app per test for isolation.
- UI Automator is black-box: it can't read the masked-input attribute reliably — defer that
  case to Appium/Espresso. It uniquely CAN leave the app (Home, recents, permission dialogs)
  — use that for the cross-app flow.

Keep each section tight and instructional. This is the rulebook the suites are built on
in Sections 8, 9, 10, and 11.
```

---

## Prompt 3: Build the Bug-Reporting Skill
*Used in: Section 5, Clip 4*

```
Create a reusable skill file at skills/bug-reporting.md.

Purpose: turn a failing mobile test + its artifact into a developer-ready bug report.
It must require this structure: specific behavioural Title; Environment (build
Compose/RN, broken/fixed, Android version, emulator/device, which framework); numbered
Steps to reproduce; SEPARATE Expected and Actual fields; Severity with a one-line reason;
Evidence (Maestro recording / Appium screenshot / Gradle-Espresso test report / UI
Automator log). Require noting the element's resource-id (or that it has none), whether
the bug blocks other tests, and whether it reproduces on one build but not the other.

End with a self-check: "Could a developer reproduce this from the steps alone on a
clean emulator?" If not, it is not done. Keep it concise and project-agnostic.
```

**Note:** you put this skill to work in Section 13. For now, just build it.

---

## Prompt 4: Build the Flake-Triage Skill
*Used in: Section 5, Clip 5*

```
Create a reusable skill file at skills/flake-triage.md.

Purpose: decide whether a failing mobile test is a REAL BUG or a FLAKY TEST. It must
require working through: (1) Consistency — fails every run or sometimes? re-run it;
(2) Cause — app behaving wrong, or the test tripping over mobile noise (animation not
settled, keyboard covering the field, tap before render, fragile locator)?
(3) Evidence — was the app genuinely broken in the artifact, or did the test look too
early? (4) Classification — REAL BUG or FLAKY TEST; (5) Recommendation — real bug →
bug-reporting skill; flaky → the specific fix (wait-for-existence, dismiss keyboard,
stable id, relaunch isolation), don't file a bug.

List the common mobile flake sources. Require asking to re-run when consistency is
unclear. Keep it concise.
```

**Expected:** four skill files now live in `skills/`. They are the toolkit for Sections
7–16 — and the thing you carry to your next project.
