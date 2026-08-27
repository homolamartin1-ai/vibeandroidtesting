# TechShop Android — Sprint 1 Requirements

**Project:** TechShop Android Mobile App
**Sprint:** Sprint 1
**Sprint Goal:** Deliver a working login, product browsing, cart, and checkout flow on Android
**Sprint Duration:** 2 weeks
**Status:** Ready for QA
**Builds delivered:** Native Jetpack Compose **and** React Native — feature-identical

---

## In Scope

### Login Screen

- Users log in with email and password
- Email must be valid format (contains @ and domain)
- Password field must **mask input** (masked input (password input type))
- Empty fields must be rejected with an inline error message
- Valid credentials: demo@techshop.com / password123
- Successful login navigates to the product catalog
- Failed login shows an error, stays on the login screen
- Session persists for the app session
- The tab bar is **hidden** until the user is authenticated
- Every interactive element must have an **resource-id / content-description** (for testability)

### Product Catalog

- Scrollable list/grid of available products
- Each cell: product name, price, image placeholder, Add to Cart button
- Long product names must truncate cleanly, not overflow the cell
- Out of Stock products show a **red** badge and a disabled button
- Navigation title: "Products"

### Shopping Cart

- Add products from the catalog
- Cart shows: name, unit price, quantity, line total, order total
- Quantity stepper — **minimum 1**, no negative or zero quantities
- Order total updates immediately when quantity changes
- Remove individual items
- Empty cart message: "Your cart is empty"
- Discount code applies a percentage discount (e.g. SAVE10 = 10% off)
- Cart state persists within the app session only
- Orders under $10.00 rejected with message: "Minimum order value is $10.00"

### Checkout Screen

- Accessible via "Proceed to Checkout" button in the cart
- Fields: First Name, Last Name, Email, Phone, Card Number, Expiry Date, CVV
- All fields required — empty submission rejected
- Email: valid format
- Card Number: exactly 16 digits (numeric keypad)
- Phone: 10 digits (numeric keypad)
- Expiry: MM/YY format, **not in the past**
- CVV: exactly 3 digits, **numeric keypad only**
- The keyboard must not permanently cover the field being edited
- Success: confirmation screen with an **order reference**, items, and total

---

## Out of Scope — Sprint 1

- Payment gateway integration
- Push notifications / email confirmations
- User registration and password reset
- Account / profile screen
- tablet layout and landscape orientation
- Dark mode polish
- Deep links and universal links
- Product search and filtering
- Offline mode

---

## Technical Context

- Two implementations, feature-identical: **Jetpack Compose** (native, Android Studio) and **React Native**
- Target: Android API 24+, Android emulator
- No backend — data and auth are in-app/mocked
- Credentials hardcoded: demo@techshop.com / password123
- Cart state held in memory — not persisted across launches

---

## QA Resource

- Tester: 1 QA analyst
- Available time: 3 days
- Device: Android emulator (latest)
- Frameworks under evaluation: Maestro, Appium, Espresso, UI Automator
