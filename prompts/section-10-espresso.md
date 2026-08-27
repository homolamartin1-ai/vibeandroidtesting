# Section 10 — Writing the Test Suite in Espresso

> Builds into `espresso/` (the app's androidTest source set) · uses **Skill 2** and `test-cases.md`

You build the native Espresso suite (Kotlin, in **Android Studio**) from the same **test
matrix** (`test-cases.md`) and the **test-authoring skill**. Espresso runs *inside* the
app's process — the fastest and deepest-access framework, and it auto-synchronises with the
UI thread. The trade-off: it is Android-only and white-box (built with the app). You run and
triage the suite in Section 13.

> **Setup:** the Espresso and Compose test dependencies go in the app module's build.gradle,
> and tests live under `app/src/androidTest/`. See [../docs/setup-06-espresso-uiautomator.md](../docs/setup-06-espresso-uiautomator.md).

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Base test + login tests | **10, Clip 2** |
| Prompt 2 — Cart & catalog tests | **10, Clip 3** |
| Prompt 3 — Checkout tests | **10, Clip 3** |
| Prompt 4 — Compose vs React Native | **10, Clip 4** |

---

## Prompt 1: Base test case + login tests
*Used in: Section 10, Clip 2*

```
First make sure the BROKEN build is the one under test — com.techshop.android from
techshop/compose-broken (the version with the planted bugs), not the fixed build.

Then, following skills/test-authoring.md, create the Espresso base under the app's
androidTest source set:

- A base class that launches the app (ActivityScenario / createAndroidComposeRule for the
  Compose build), reads TEST_EMAIL/TEST_PASSWORD from BuildConfig or the environment, and
  provides shared helpers: login(), addItemAndOpenCart(). Locate the login button by the
  text "Log In".

Then, from the LOGIN cases in test-cases.md, create a LoginTest — one test per login case in
the matrix, no more and no less. Include the masked-password case the matrix assigns to
attribute-aware frameworks (assert the password field's VisualTransformation / input type
proves masking) and the login-button-identifier case (BUG-016). Read the matrix for what
each case asserts.

List the tests you created and the test-case ID each covers.
```

**Expected:** the base plus one login test per matrix case. Run with
`./gradlew connectedAndroidTest` against your emulator (TEST_EMAIL/TEST_PASSWORD exported).

---

## Prompt 2: Cart & catalog tests
*Used in: Section 10, Clip 3*

```
Following the skill and the CART and CATALOG cases in test-cases.md, add a CartTest and a
GeneralTest using the base helpers — one test per matrix case. Locate with onNodeWithTag
(Compose) or onView(withId(...)) (Views); read the matrix for what each case asserts (the
quantity floor, the order total, the discounted total, the "Products" title). Lean on
Espresso's auto-sync — no sleeps; use an IdlingResource only if something is genuinely async.

List the tests you created and the test-case ID each covers.
```

---

## Prompt 3: Checkout tests
*Used in: Section 10, Clip 3*

```
Following the skill and the CHECKOUT cases in test-cases.md, add a CheckoutTest — one test
per matrix case. The matrix marks the cases blocked by the unresponsive "Proceed to
Checkout" button (BUG-011 — verify only on the fixed build); comment which run on the fixed
build only and why.

List the tests you created and the test-case ID each covers.
```

---

## Prompt 4: Compose vs React Native
*Used in: Section 10, Clip 4*

```
Run the Espresso suite against the Compose build, then against the React Native build (same
package id — React Native renders real Android views, so Espresso's withId / content-desc
matchers can find them). Report where the hierarchy differs and whether the shared helpers
absorbed it. Explain why Espresso runs in-process and is Android-only, and when a team on a
Kotlin/Compose codebase would still choose it despite that constraint.
```

**Expected:** the suite runs on both, and you can articulate — for Section 12 — when native
in-app Espresso is worth its Android-only, in-process constraint. One thing Espresso cannot
do at all is leave the app — which is exactly what UI Automator is for, next.
