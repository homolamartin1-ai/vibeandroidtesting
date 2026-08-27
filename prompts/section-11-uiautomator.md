# Section 11 — Writing the Test Suite in UI Automator

> Builds into `uiautomator/` (an androidTest source set) · uses **Skill 2** and `test-cases.md`

You build the native UI Automator suite (Kotlin) from the same **test matrix**
(`test-cases.md`) and the **test-authoring skill**. UI Automator is the mirror image of
Espresso — it drives the whole device from *outside* the app via `UiDevice`, black-box.
That gives it one superpower none of the others have: it can leave the app. You run and
triage the suite in Section 13.

> **Setup:** UI Automator ships with AndroidX Test; add the dependency and write tests under
> an androidTest source set with the instrumentation runner. See
> [../docs/setup-06-espresso-uiautomator.md](../docs/setup-06-espresso-uiautomator.md).

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Base + login tests | **11, Clip 2** |
| Prompt 2 — Cart & catalog tests | **11, Clip 3** |
| Prompt 3 — Checkout tests | **11, Clip 3** |
| Prompt 4 — The superpower: leaving the app | **11, Clip 4** |

---

## Prompt 1: Base test + login tests
*Used in: Section 11, Clip 2*

```
First make sure the BROKEN build is installed on the emulator — com.techshop.android from
techshop/compose-broken or techshop/reactnative-broken (the version with the planted bugs),
not the fixed build.

Then, following skills/test-authoring.md, create the UI Automator base class:

- Get UiDevice.getInstance(InstrumentationRegistry.getInstrumentation()), launch
  com.techshop.android by package name, read TEST_EMAIL/TEST_PASSWORD from the environment,
  and provide shared helpers: a findAndWait(By) that waits with Until before acting, login(),
  and addItemAndOpenCart(). Locate the login button by By.text("Log In").

Then, from the LOGIN cases in test-cases.md, create a LoginTest — one test per login case in
the matrix, no more and no less, located with By.res on the resource-id. Because UI Automator
is black-box, it can't read the masked-input attribute — defer the masked-password case to
Appium/Espresso (note it), but DO catch the login-button-identifier case (BUG-016): the
black-box tool literally cannot find a stable handle for it.

List the tests you created and the test-case ID each covers.
```

**Expected:** the base plus one login test per matrix case. Run with
`./gradlew connectedAndroidTest`. Every locator is By.res / By.desc / By.text — never position.

---

## Prompt 2: Cart & catalog tests
*Used in: Section 11, Clip 3*

```
Following the skill and the CART and CATALOG cases in test-cases.md, add a CartTest and a
GeneralTest using the base helpers — one test per matrix case, located with By.res. Read the
matrix for what each case asserts. Every interaction must wait for its target with
device.wait(Until.hasObject(...)) first — no Thread.sleep anywhere. Relaunch the app per test
for isolation.

List the tests you created and the test-case ID each covers.
```

---

## Prompt 3: Checkout tests
*Used in: Section 11, Clip 3*

```
Following the skill and the CHECKOUT cases in test-cases.md, add a CheckoutTest — one test
per matrix case. The matrix marks the cases blocked by the unresponsive "Proceed to
Checkout" button (BUG-011 — verify only on the fixed build); comment which run on the fixed
build only and why.

List the tests you created and the test-case ID each covers.
```

---

## Prompt 4: The superpower — leaving the app
*Used in: Section 11, Clip 4*

```
Write one UI Automator flow that steps OUTSIDE TechShop, to show what only UI Automator can
do: press the device Home button, open the recent-apps overview, return to the app, and —
on the checkout screen — interact with a system keyboard or permission-style dialog directly.
Explain why Espresso cannot do this (it is trapped in the app's process) and why real bugs
live at these seams (backgrounding, notifications, permission dialogs, app switching).

Then run the whole UI Automator suite against the Compose build and the React Native build
unchanged, confirming the By.res locators held on both.
```

**Expected:** four frameworks now, all driven from one matrix, all catching the same bugs,
each with its own character — and UI Automator uniquely reaching across app boundaries. Next
we put all four side by side (Section 12).
