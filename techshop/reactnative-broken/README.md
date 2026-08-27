# TechShop Android — React Native (Broken)

The **broken** React Native build of TechShop, with 15 core bugs + 2 mobile-specific
bugs planted for the test suites to catch. The same bugs are planted in the Jetpack Compose build.

## Run it

```bash
npm install
npx expo start --android      # boots the Android emulator and installs the app
```

**Credentials:** demo@techshop.com / password123

> Note: **BUG-011** makes "Proceed to Checkout" a no-op, so the Checkout screen is
> unreachable in the broken build via the button — that is the blocker bug. The checkout
> bugs (009, 010, 012, 013, 017) are verified against the **fixed** build. This mirrors a
> real blocker that gates downstream tests.

## Where each bug lives

| Bug | File |
|-----|------|
| BUG-001 password not secure | `src/screens/LoginScreen.js` |
| BUG-002 empty login accepted | `src/context/AuthContext.js` |
| BUG-003 wrong credentials accepted | `src/context/AuthContext.js` |
| BUG-004 discount /1000 | `src/context/CartContext.js` |
| BUG-005 quantity below 1 | `src/context/CartContext.js` |
| BUG-006 total not updating | `src/screens/CartScreen.js` |
| BUG-007 long name overflow | `src/screens/CatalogScreen.js` |
| BUG-008 green out-of-stock badge | `src/screens/CatalogScreen.js` |
| BUG-009 past expiry accepted | `src/screens/CheckoutScreen.js` |
| BUG-010 CVV non-numeric | `src/screens/CheckoutScreen.js` |
| BUG-011 proceed no-op (blocker) | `src/screens/CartScreen.js` |
| BUG-012 empty checkout submit | `src/screens/CheckoutScreen.js` |
| BUG-013 no order reference | `src/screens/ConfirmationScreen.js` |
| BUG-014 title "Untitled" | `App.js` |
| BUG-015 tab bar before auth | `App.js` |
| BUG-016 login button no testID | `src/screens/LoginScreen.js` |
| BUG-017 keyboard covers CVV | `src/screens/CheckoutScreen.js` |

Every buggy line is marked with a `BUG-0xx` comment. The fixed build removes all of them.
