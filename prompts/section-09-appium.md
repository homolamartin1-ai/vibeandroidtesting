# Section 9 — Writing the Test Suite in Appium

> Builds into `appium/` · uses **Skill 2** and the **test matrix** (`test-cases.md`)

You build the Appium suite (Python + pytest, Page Object Model, **UiAutomator2** driver)
from the same **test matrix** (`test-cases.md`) and the **test-authoring skill**. Appium
reads element attributes, so it picks up the matrix cases Maestro had to skip (e.g.
**BUG-001**, password not masked). You run and triage the suite in Section 13.

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Scaffold + login tests | **9, Clip 2** |
| Prompt 2 — The attribute-only cases | **9, Clip 2** |
| Prompt 3 — Cart & catalog tests | **9, Clip 3** |
| Prompt 4 — Checkout tests | **9, Clip 3** |
| Prompt 5 — Same caps, two apps | **9, Clip 4** |

---

## Prompt 1: Scaffold the suite + login tests
*Used in: Section 9, Clip 2*

```
First make sure the BROKEN build is installed on the emulator — com.techshop.android from
techshop/compose-broken or techshop/reactnative-broken (the version with the planted bugs),
not the fixed build.

Then, following skills/test-authoring.md, scaffold an Appium suite under appium/ for TechShop
Android (appPackage com.techshop.android, automationName UiAutomator2): a conftest.py driver
fixture (fresh launch per test, appPackage + appActivity, creds from env), pytest.ini,
requirements.txt, a pages/base_page.py with locate/assert helpers, and a flows.py for shared
login/add-to-cart.

Then, from the LOGIN cases in test-cases.md, create pages/login_page.py,
pages/catalog_page.py, and tests/test_login.py — one test per login case in the matrix,
no more and no less. Locate the login button by the text "Log In".

List the tests you created and the test-case ID each covers.
```

**Expected:** a runnable skeleton plus the login tests. Start Appium (`appium`) and run
`pytest -v`.

---

## Prompt 2: The attribute-only cases (that Maestro skipped)
*Used in: Section 9, Clip 2*

```
The matrix marks some cases as needing element ATTRIBUTES — the ones Maestro had to defer.
Add those to appium/tests/test_login.py, following test-cases.md: the masked-password case
(assert the password field's "password" attribute is "true", not plaintext) and the
login-button-identifier case (BUG-016). Explain why Maestro could not assert these but
Appium can.
```

**Expected:** the "framework can see what it can see" lesson, made concrete — Appium
covers the attribute cases the matrix assigned to it.

---

## Prompt 3: Cart & catalog tests
*Used in: Section 9, Clip 3*

```
Following the skill and the CART and CATALOG cases in test-cases.md, add pages/cart_page.py,
tests/test_cart.py, and tests/test_general.py — one test per matrix case. Reuse the
add-item-and-open-cart flow from flows.py. Read the matrix for what each case asserts.

List the tests you created and the test-case ID each covers.
```

---

## Prompt 4: Checkout tests
*Used in: Section 9, Clip 3*

```
Following the skill and the CHECKOUT cases in test-cases.md, add pages/checkout_page.py and
tests/test_checkout.py — one test per matrix case. The matrix marks the cases blocked by
the unresponsive "Proceed to Checkout" button (BUG-011 — verify only on the fixed build);
note those in comments.

List the tests you created and the test-case ID each covers.
```

---

## Prompt 5: Same capabilities, two apps
*Used in: Section 9, Clip 4*

```
Without changing the tests, point Appium at the Compose build, run the suite, then install
the React Native build (same package id) and run again. Explain any element-class
differences you had to account for, and confirm the resource-id locators held.
```

**Expected:** the suite runs on both builds; the bug tests are red on broken. Compare run
time and setup effort with Maestro — you'll use this in Section 12. Note Appium, like
Maestro, is cross-platform: this Python suite drives iOS too with different capabilities.
