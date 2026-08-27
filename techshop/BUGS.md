# TechShop Android — Planted Bug Manifest (Instructor Reference)

The same 15 core + 2 mobile-specific bugs are planted **identically** in the Jetpack Compose and
React Native broken builds, and **all are fixed** in the fixed builds. This is the
instructor reference — students discover the bugs themselves through exploration and their
own tests, so avoid opening this until you have.

Each buggy line is marked with a `BUG-0xx` comment in the broken build and a
`FIXED (BUG-0xx)` comment in the fixed build.

| ID | Area | Symptom | Compose file | React Native file | How a test catches it |
|----|------|---------|--------------|-------------------|-----------------------|
| BUG-001 | Login | Password shown in plaintext | `MainActivity.kt` LoginScreen (no PasswordVisualTransformation) | `LoginScreen.js` (`secureTextEntry={false}`) | Assert the password field is masked (password input type) |
| BUG-002 | Login | Empty email/password accepted | `AppViewModel.kt` (`login`) | `AuthContext.js` (`login`) | Submit empty → expect to stay on login |
| BUG-003 | Login | Wrong credentials accepted | `AppViewModel.kt` (`login`) | `AuthContext.js` (`login`) | Submit wrong creds → expect error, no catalog |
| BUG-004 | Cart | Discount divides by 1000 | `AppViewModel.kt` (`discountAmount`) | `CartContext.js` (`discountAmount`) | Apply SAVE10 → assert exact discounted total |
| BUG-005 | Cart | Quantity goes below 1 | `AppViewModel.kt` (`setQuantity`) | `CartContext.js` (`setQuantity`) | Tap − at qty 1 → assert qty stays 1 |
| BUG-006 | Cart | Total not updating on qty change | `MainActivity.kt` CartScreen (`displayedTotal`) | `CartScreen.js` (`orderTotal` effect) | Change qty → assert order total updates |
| BUG-007 | Catalog | Long name overflows cell | `MainActivity.kt` CatalogScreen (no `maxLines`) | `CatalogScreen.js` (no `numberOfLines`) | Optional layout/visual assertion |
| BUG-008 | Catalog | Out-of-stock badge is green | `MainActivity.kt` CatalogScreen (`Color.Green`) | `CatalogScreen.js` (`#2ecc71`) | Optional visual assertion |
| BUG-009 | Checkout | Past expiry accepted | `MainActivity.kt` CheckoutScreen (submit) | `CheckoutScreen.js` (`onSubmit`) | Enter past MM/YY → expect rejection |
| BUG-010 | Checkout | CVV accepts non-numeric | `MainActivity.kt` CheckoutScreen (CVV field) | `CheckoutScreen.js` (CVV field) | Enter letters → expect rejection / numeric keypad |
| BUG-011 | Checkout | Proceed button no-op (BLOCKER) | `MainActivity.kt` AppRoot (onProceed) | `CartScreen.js` (`onProceed`) | Tap Proceed → assert Checkout appears (fails) |
| BUG-012 | Checkout | Empty form submits | `MainActivity.kt` CheckoutScreen (submit) | `CheckoutScreen.js` (`onSubmit`) | Submit empty → expect validation errors |
| BUG-013 | Checkout | Confirmation missing order ref | `MainActivity.kt` ConfirmationScreen | `ConfirmationScreen.js` | Assert order-reference element is present |
| BUG-014 | General | Nav title "Untitled" | `MainActivity.kt` CatalogScreen (title) | `App.js` (Products tab `title`) | Assert title is "Products" |
| BUG-015 | General | Bottom nav visible before auth | `MainActivity.kt` AppRoot (bottom nav) | `App.js` (tabs before gate) | On login screen, assert Cart tab not present |
| BUG-016 | Accessibility | Login button has no identifier | `MainActivity.kt` LoginScreen (no testTag) | `LoginScreen.js` (no testID) | Locate login button by id → fails; add one |
| BUG-017 | Keyboard | Keyboard covers CVV | `MainActivity.kt` CheckoutScreen (no imePadding) | `CheckoutScreen.js` (plain View) | Focus CVV → assert it stays visible |

## The blocker dependency

**BUG-011** blocks the checkout flow in the broken builds — the "Proceed to Checkout"
button does nothing, so the checkout screen is unreachable via the UI. That is intentional:
it is a realistic blocker that gates downstream tests. Checkout-screen bugs (009, 010, 012,
013, 017) are therefore **verified against the fixed builds**, where Proceed works. Note the
dependency in any checkout test.

## The testability lesson

**BUG-016** cannot be caught by a normal assertion — the login button simply has no stable
locator. This is the mobile testability lesson: the agent must first *recommend adding* an
resource-id / content-description, then the login test becomes reliably writable. Every other
interactive element already carries an identifier (`accessibilityIdentifier` in Jetpack Compose,
`testID` in React Native — which maps to the view's `resource-id` on Android).
