# Setup 07 — Connect the Mobile MCP

Companion to Section 3, Clip 7. This is the piece that makes it a *vibe* testing course: the
AI agent drives the Android emulator through a **mobile MCP server** — tapping, typing, and
reading the accessibility/view hierarchy for you.

## Step 1 — Use the correct package

Add the **scoped** server: **`@mobilenext/mobile-mcp`**.

> ⚠️ Do **not** install the unscoped `mobile-mcp` — it is a broken v0.0.7 stub. The scoped
> `@mobilenext/mobile-mcp` is the maintained one and drives the Android emulator (and iOS
> Simulator) via the standard device bridges.

## Step 2 — Let the Antigravity agent add it for you

This is a *vibe* course — so instead of hand-editing config files, let the agent set up the MCP
server. Paste this prompt into the Antigravity chat (it is **Prompt 3** from
`prompts/section-03-setup.md`):

```
Set up the mobile MCP server in Antigravity IDE so you can drive the Android emulator.
1. Find (or create) Antigravity IDE's MCP config file and show me the path.
2. Add this EXACT server entry, alongside my other servers (do not touch the others).
   Use the SCOPED package @mobilenext/mobile-mcp — NOT the unscoped "mobile-mcp",
   which is a broken stub:

     "mobile": {
       "command": "npx",
       "args": ["-y", "@mobilenext/mobile-mcp@latest"]
     }

3. Tell me if I need to reload/restart Antigravity IDE, then verify by taking a screenshot
   of the running emulator and describing what you see.
```

The agent locates the config file, adds the entry **without disturbing your other servers**, and
tells you when to reload. It bakes in the scoped-package rule from Step 1, so you cannot
accidentally pull the broken stub.

> Prefer to edit it by hand instead? The exact JSON block is in
> [`snippets/mobile-mcp-config.json`](../snippets/mobile-mcp-config.json) — open Antigravity's
> MCP settings and paste it under `mcpServers`.

## Step 3 — Restart and verify

1. Have an emulator running (`adb devices` shows it) with a TechShop build installed.
2. Fully **restart Antigravity** so it picks up the new MCP server.
3. In a new chat, confirm the agent can see the device — ask it to list the screen elements or
   take a screenshot of the current app.

> If the mobile MCP tools don't appear, restart Antigravity again — MCP servers are only loaded
> at startup.

**✅ Check:** the agent can read the emulator screen and describe the app's elements.

## Step 4 — Verify the whole toolchain

Before exploration, confirm everything from Section 3 is in place — Android Studio + emulator,
Node, Maestro (+ Java), Appium (+ uiautomator2), and the mobile MCP. Use **Prompt 1** from
`prompts/section-03-setup.md`, which asks the agent to check each tool and report what's
missing, without installing anything.

Next: run both TechShop builds and take the agent for its first spin (Section 3, Clip 8).
