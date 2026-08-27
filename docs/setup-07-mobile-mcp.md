# Setup 07 — Connect the Mobile MCP

Companion to Section 3, Clip 7. This is the piece that makes it a *vibe* testing course: the
AI agent drives the Android emulator through a **mobile MCP server** — tapping, typing, and
reading the accessibility/view hierarchy for you.

## Step 1 — Use the correct package

Add the **scoped** server: **`@mobilenext/mobile-mcp`**.

> ⚠️ Do **not** install the unscoped `mobile-mcp` — it is a broken v0.0.7 stub. The scoped
> `@mobilenext/mobile-mcp` is the maintained one and drives the Android emulator (and iOS
> Simulator) via the standard device bridges.

## Step 2 — Add it to Antigravity's MCP config

Open Antigravity's MCP settings and add the server (see `snippets/mobile-mcp-config.json` for
the exact block):
```json
{
  "mcpServers": {
    "mobile": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@latest"]
    }
  }
}
```

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
