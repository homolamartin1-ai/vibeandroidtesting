# BookNow Android — Planted Bug Manifest (Instructor / Answer Key)

> ⛔ **Do not open this until you have finished your own capstone attempt.** The whole point
> of the capstone is that you discover the bugs yourself — the count is deliberately not
> disclosed anywhere else. This is the answer key for checking your work afterwards.

The same bugs are planted **identically** in the Jetpack Compose and React Native broken
builds, and **all are fixed** in the fixed builds. Buggy lines carry a `BUG` comment in the
broken build and a `FIXED` comment in the fixed build.

> **On the IDs:** the numbers below are a clean summary for checking your work. The in-code
> comments (particularly the React Native build) group several of these under one `BUG-0xx`
> label — match on the **behaviour**, not the number.

| ID | Area | Symptom | Compose file | React Native file | How a test catches it |
|----|------|---------|--------------|-------------------|-----------------------|
| BUG-001 | Login | Empty credentials are accepted | `BookViewModel.kt` (`login`) | `AuthContext.js` (`login`) | Submit empty → expect to stay on login |
| BUG-002 | Login | Wrong credentials are accepted | `BookViewModel.kt` (`login`) | `AuthContext.js` (`login`) | Submit wrong creds → expect error, no rooms |
| BUG-003 | Pricing | Room discount divides by 1000 not 100 | `Models.kt` (`discountedPrice`) | `data/rooms.js` / `BookingContext.js` | Assert the discounted nightly price |
| BUG-004 | Rooms | "Available" badge is red, not green | `MainActivity.kt` RoomsScreen | `RoomsScreen.js` | Optional visual/colour assertion |
| BUG-005 | Booking | Nights frozen at 1 regardless of dates | `BookViewModel.kt` (`calculateNights`) | `BookingContext.js` | Pick a 3-night range → assert nights = 3 and total updates |
| BUG-006 | Booking | Check-out before/equal check-in accepted | `BookViewModel.kt` (`createBooking`) | `BookingScreen.js` | Enter check-out ≤ check-in → expect rejection |
| BUG-007 | Booking | Zero / negative guests accepted | `BookViewModel.kt` (`createBooking`) | `BookingScreen.js` | Enter 0 guests → expect rejection |
| BUG-008 | Booking | Empty / malformed form submits | `MainActivity.kt` BookingScreen (submit) | `BookingScreen.js` (`onSubmit`) | Submit empty / bad email → expect validation errors |
| BUG-009 | Confirmation | Missing booking summary | `MainActivity.kt` ConfirmationScreen | `ConfirmationScreen.js` | Assert room / dates / guests / total are shown |
| BUG-010 | Confirmation | Missing booking reference number | `MainActivity.kt` ConfirmationScreen | `ConfirmationScreen.js` | Assert a booking-reference element is present |

## Notes
- **BUG-005** is the money bug: because nights are frozen at 1, a multi-night booking is
  under-charged and the confirmation total is wrong. A good test books a multi-night stay and
  asserts both the nights and the total.
- **BUG-003 + BUG-005 interact** — verify the discounted nightly price *and* the multi-night
  total separately so you know which is wrong.
- Every interactive control exposes a stable id (Compose `testTag` via `testTagsAsResourceId`;
  React Native `testID` → the view's `resource-id`), so your suite can locate elements by id on
  both builds.
