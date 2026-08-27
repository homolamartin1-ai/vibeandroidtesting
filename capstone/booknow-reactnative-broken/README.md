# BookNow (React Native / Expo - Broken)

Capstone project (Broken Build) for Section 16 of the Android Testing course.

## Intentional Defects
- **BUG-001/002/003 (Login):** Bypasses validation, accepts invalid credentials.
- **BUG-004 (Pricing):** Discount calculation error (`/ 1000` instead of `/ 100`).
- **BUG-008 (Rooms):** "Available" badge renders in red.
- **BUG-009/010 (Dates/Guests):** Accepts checkout before checkin, accepts non-positive guests.
- **BUG-011 (Booking Total):** Total nights frozen at 1 regardless of date picker selection.
- **BUG-012/013/014 (Form Validation):** Unconditional form submission with empty/malformed inputs.
- **BUG-015/016 (Confirmation):** Missing booking details summary and reference number.

## How to run on emulator

```bash
npm install
npx expo start --android
```
