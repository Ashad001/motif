# Motif

> AI can see screenshots. Now it can see your bugs move.

![motif demo](examples/demo.gif)

Bugs live in motion. Hover states, scroll jank, animation glitches,
transition flickers — you can't screenshot a stutter.

**motif** is an MCP server that lets Cursor, Claude Code, and any
MCP-compatible AI assistant watch a video or GIF of your UI bug
and return a diagnosis + code fix. Powered by Gemini 1.5 Pro,
the only model that watches video natively.

Drop a recording. Get the fix. No describing, no words.

---

## Install

```bash
npm install -g motif-mcp
```

Or use without installing:

```bash
npx motif-mcp init
```

---

## Setup

**1. Get a free Gemini API key**

→ [ai.google.dev](https://ai.google.dev) — free tier is enough to start

**2. Add motif to your MCP config**

**Cursor** (`~/.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "motif": {
      "command": "npx",
      "args": ["motif-mcp"],
      "env": {
        "GEMINI_API_KEY": "your-key-here"
      }
    }
  }
}
```

**Claude Code** (`~/.claude/mcp.json`):
```json
{
  "mcpServers": {
    "motif": {
      "command": "npx",
      "args": ["motif-mcp"],
      "env": {
        "GEMINI_API_KEY": "your-key-here"
      }
    }
  }
}
```

**3. Restart your editor**

That's it. motif is now a tool your AI can call.

---

## Usage

Record any screen bug as a GIF or video. Then in Cursor or Claude Code chat:

```
Watch ~/Desktop/bug.gif and fix my animation.tsx
```

```
Use motif on the recording I just made — something's wrong with the scroll behavior
```

```
motif: analyze ~/recordings/checkout-glitch.mp4 against src/components/Cart.tsx
```

motif figures out the rest.

---

## How It Works

```
You record a bug               →  GIF / MP4 / WebM / MOV
                                        ↓
motif extracts the key frames   →  Detects where things break
                                        ↓
Gemini 1.5 Pro watches it      →  Understands motion, not just pixels
                                        ↓
Your code is read from context  →  Right file, right lines
                                        ↓
Diagnosis + fix returned        →  Applied directly in your editor
```

Gemini is the right model here because it watches video as a sequence,
not as isolated frames. It sees the stutter at 0.3s. It sees the
element that overshoots. It sees the state that never resolves.

---

## Supported

**Input formats**
- `.gif` `.mp4` `.webm` `.mov`
- Remotion preview URLs
- Local file paths

**AI clients**
- Cursor
- Claude Code
- Claude Desktop
- Any MCP-compatible client

**Works with any framework**
- React / Next.js
- Vue / Nuxt
- Svelte
- Vanilla JS / CSS
- Remotion animations

---

## Example Output

```
motif analyzed bug.gif (2.3s, 47 frames)

WHAT I SEE:
The card component overshoots its final position at ~0.8s,
bouncing 12px past the target before settling. Visible on
every mount, worse on slower devices.

ROOT CAUSE:
animation.tsx line 34 — spring config has damping: 0.1.
At this value the spring never critically damps, causing
the overshoot. The mass (2) amplifies it further.

FIX:
- damping: 0.1  →  damping: 0.8
- mass: 2       →  mass: 1

CONFIDENCE: high — the fix eliminates the overshoot pattern
visible in frames 18-31.
```

---

## Why This Exists

Cursor feature request for video input: **847 upvotes. Still open.**

The workaround today:
1. Record the bug
2. Watch it yourself
3. Try to describe it in words
4. Hope the AI understands
5. Get a wrong fix
6. Repeat

motif skips steps 2-5.

---

## Contributing

motif is MIT licensed and built to be extended.

**Good first issues:**
- Add support for Loom URLs
- Add frame-diff highlighting to output
- Build a VS Code extension wrapper
- Add support for comparing two recordings (before/after)


Built with:
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- [Google Gemini API](https://ai.google.dev)
- TypeScript

---

## License

MIT — use it, fork it, ship it.

---

*motif — motion + fix. The pattern that keeps repeating until you find it.*