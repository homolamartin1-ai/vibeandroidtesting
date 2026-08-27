# Section 7 — From Exploration to Test Cases

> Uses **Skill 1** ([../skills/](../skills/)) · spec in [../techshop/requirements.md](../techshop/requirements.md)

You turn the exploration notes into a prioritised **test matrix** with the
test-case-design skill. One matrix drives all four frameworks — so the comparison in
Section 12 is apples-to-apples.

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Design the full matrix | **7, Clip 1** |
| Prompt 2 — Positive/edge/negative balance | **7, Clip 2** |
| Prompt 3 — Known bugs → planned regressions | **7, Clip 3** |

---

## Prompt 1: Design the full matrix
*Used in: Section 7, Clip 1*

```
Following skills/test-case-design.md and using exploration-notes.md and
techshop/requirements.md, design the test matrix for login, cart, and checkout. Output one
table with the skill's columns (ID, title, category, preconditions, steps, expected,
locator). Save it to test-cases.md.
```

## Prompt 2: Check the positive / edge / negative balance
*Used in: Section 7, Clip 2*

```
Review test-cases.md: for every feature, confirm there is at least one positive, one
negative, and one edge case. Call out any feature that is all happy-path and add the
missing negative and boundary cases (empty fields, wrong values, quantity below 1, past
expiry, non-numeric CVV, minimum order value).
```

## Prompt 3: Turn known bugs into planned regressions
*Used in: Section 7, Clip 3*

```
For each planted bug we noticed in Section 4, add or tag a regression case in
test-cases.md with its BUG-id and its expected (correct) behaviour. Mark which framework
should own each case — remember Maestro and UI Automator cannot assert the masked-password
input type (BUG-001) or colour (BUG-008); those belong to Appium/Espresso. Mark cases
blocked by BUG-011 (checkout).
```

**Expected:** `test-cases.md` — the single source the Maestro, Appium, Espresso, and UI
Automator suites are all built from in Sections 8–11.
