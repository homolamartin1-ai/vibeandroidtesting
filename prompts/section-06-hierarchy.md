# Section 6 — The Android View & Accessibility Hierarchy

The concept every framework depends on. You read the tree, learn how to locate elements by
resource-id, and see why the same button looks different under Jetpack Compose vs React
Native. Read the login flow the authoring skill wrote in Section 5 with this lens.

## Course reference
| Prompt | Used in clip |
|--------|-------------|
| Prompt 1 — Dump the tree | **6, Clip 1–2** |
| Prompt 2 — Compose vs React Native | **6, Clip 3** |
| Prompt 3 — Read a locator critically | **6, Clip 4** |

---

## Prompt 1: Dump and explain the hierarchy
*Used in: Section 6*

```
Using the mobile MCP (or adb: uiautomator dump), print the view/accessibility hierarchy of
the TechShop login screen. For each interactive element show its class, resource-id, and
content-description/text. Explain which of those Maestro, Appium, Espresso, and UI Automator
each use to locate it, and which element here would be hard to locate reliably (and why —
the login button has no id in the broken build).
```

## Prompt 2: Compose vs React Native in the tree
*Used in: Section 6, Clip 3*

```
Capture the hierarchy of the SAME screen from the Compose build and from the React Native
build. Show them side by side and point out where classes or hierarchy differ, and why our
resource-id locators survive the difference anyway. Explain how Compose exposes test tags as
resource-ids (semantics { testTagsAsResourceId = true }) and how React Native maps testID to
resource-id.
```

## Prompt 3: Read a locator critically
*Used in: Section 6, Clip 4*

```
Following skills/test-authoring.md, write a simple Maestro login flow for TechShop (a
reusable login subflow plus a happy-path flow). Then read it back to me critically: for
each locator, is it stable, or would it break if the UI text or layout changed? Is each
assertion meaningful, or could it pass for the wrong reason (a false green)? Rewrite any
weak locator or assertion and explain the fix.
```

**Expected:** you can now review any locator the agent produces — the skill you use for
the rest of the course. Green does not mean correct; you mean correct.
