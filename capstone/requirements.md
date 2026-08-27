# BookNow Android — Capstone Requirements

**Project:** BookNow — a hotel room booking app
**Used in:** Section 16 (Capstone). This is the spec you verify the app against.
**Builds delivered:** Native Jetpack Compose **and** React Native — feature-identical, each
shipped **broken and fixed**.

> This is your independent project. Explore the app, design a test matrix from this spec, build
> your suite, and report the bugs. The bug count is **not disclosed** — finding them is the job.

---

## In Scope

### Login
- Users log in with email and password.
- Password field must **mask input**.
- Empty fields must be rejected with an inline error.
- Valid credentials: **demo@booknow.com / password123**.
- Wrong credentials must be rejected — stay on login, show an error.
- Successful login navigates to the rooms list.
- Every interactive element must have a stable **resource-id / content-description**.

### Rooms
- A scrollable list of rooms; each shows: name, description, nightly price, an **availability
  badge**, and a **Book** button.
- The nightly price reflects the room's discount (a percentage off the base price).
- The availability badge for an available room must be **green**.

### Booking
- Selecting **Book** on a room opens the booking form for that room.
- Fields: First Name, Last Name, Email, Phone, Check-in date, Check-out date, Guests.
- **All fields required** — empty or malformed submissions rejected.
- Email must be a valid format.
- Check-out date must be **after** the check-in date.
- Guests must be **at least 1**.
- **Nights = the number of days between check-in and check-out.**
- **Total = discounted nightly price × nights.**

### Confirmation
- On a successful booking, show a confirmation with:
  - a **booking reference number**,
  - the room, the dates, the number of guests and nights, and
  - the **total price**.

---

## Out of Scope — Sprint 1
- Payment gateway, real availability/inventory, user registration, account screen,
  push/email notifications, tablet layout, dark-mode polish, search/filter, offline mode.

## Technical Context
- Two implementations, feature-identical: **Jetpack Compose** (native, Android Studio) and
  **React Native**.
- Target: Android API 24+ (Android 7.0+), Android emulator. No backend — data and auth are
  in-app/mocked. Credentials hardcoded: demo@booknow.com / password123.
- Works on Windows, macOS, or Linux.

## Your task (Section 16)
1. Explore BookNow with the mobile MCP; write exploration notes.
2. Design a test matrix from this spec (positive, negative, edge).
3. Build a suite in at least one framework; run it against the broken build.
4. Triage failures, report the real bugs, verify against the fixed build.
5. **Only after you finish**, compare your findings to `BUGS.md`.
