# motif

> Your AI can now watch your bugs.

<video src="examples/demo.mp4" autoplay loop muted playsinline width="100%"></video>

Some bugs only exist in motion — the jank on scroll, the animation that overshoots, the transition that flickers for half a second and then fixes itself. You can't paste a screenshot of that into your editor and expect a useful answer.

**motif** is an MCP server. Record your bug, point your AI at the file, and it comes back with a diagnosis and a fix. No describing what you're seeing. No back and forth.

Works with Cursor, Claude Code, Claude Desktop, or anything that speaks MCP.

---

## Install

```bash
npm install -g motif-mcp
```

Or run without installing:

```bash
npx motif-mcp
```

---

## Setup

**1. Get a Gemini API key**

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

motif is now a tool your AI can call.

---

## Usage

Record any screen bug as a GIF or video. Then in Cursor or Claude Code:

```
Watch ~/Desktop/bug.gif and fix my animation.tsx
```

```
Use motif on this recording — something's wrong with the scroll behavior
```

```
motif: analyze ~/recordings/carousel-glitch.mp4 against src/components/Carousel.tsx
```

motif figures out the rest.

---

## Tool: `analyze_video`

The one tool motif exposes. All parameters:

| Parameter    | Required | Description |
|-------------|----------|-------------|
| `video_path` | ✓ | Absolute path to recording — `.gif`, `.mp4`, `.webm`, `.mov` |
| `code`       | ✓ | Source code to fix — paste the file or relevant section |
| `hint`       |   | Focus hint, e.g. `"look at the scroll"`, `"focus on modal exit"` |
| `mode`       |   | `animation` · `layout` · `interaction` · `general` (default) |
| `language`   |   | Language for the fix — e.g. `TypeScript`, `Python`. Inferred from code if omitted |

**Output:**

```
motif analyzed bug.mp4 (62 frames)

WHAT I SEE:
Clicking "Next" causes the slide to overshoot at ~0.3s — slides
past destination, snaps back. Visible on every transition.

ROOT CAUSE:
translateX uses linear easing — no overshoot correction. Slide
jumps past 100% before settling.

FIX:
transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"

DIFF:
- transition: "transform 0.3s linear"
+ transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"

CONFIDENCE: high
```

---

## How It Works

```
You record a bug              →  GIF / MP4 / WebM / MOV
                                       ↓
motif validates the file      →  Format, size, path checks
                                       ↓
Video uploaded to Gemini      →  Files API — persists 48h
                                       ↓
Gemini watches it             →  Sees motion, not just pixels
                                       ↓
Prompt + code sent            →  Mode-focused, language-aware
                                       ↓
Structured JSON returned      →  Parsed, formatted, delivered
                                       ↓
Fix applied in your editor    →  Done
```

Gemini is the right model here because it processes video as a frame
sequence — it sees the stutter at 0.3s, the element that overshoots,
the state that never resolves.

---

## Environment Variables

| Variable           | Required | Default           | Description |
|-------------------|----------|-------------------|-------------|
| `GEMINI_API_KEY`   | ✓        | —                 | Your Gemini API key |
| `MOTIF_MODEL`      |          | `gemini-2.5-flash` | Gemini model to use. Set to `gemini-2.5-pro` for harder bugs |
| `MOTIF_MAX_FILE_MB`|          | `50`              | Max video size in MB |
| `MOTIF_DEBUG`      |          | `false`           | Set to `"true"` for verbose stderr logging |

To use a more powerful model for difficult bugs:

```json
"env": {
  "GEMINI_API_KEY": "your-key-here",
  "MOTIF_MODEL": "gemini-2.5-pro"
}
```

---

## Analysis Modes

Pass `mode` to focus Gemini on the right class of bug:

| Mode          | Focuses on |
|--------------|------------|
| `animation`   | Spring physics, easing curves, keyframe timing, overshoot |
| `layout`      | Positioning, z-index stacking, flex/grid alignment, overflow |
| `interaction` | Hover states, click feedback, focus rings, scroll triggers |
| `general`     | Everything — default if omitted |

Example: `"Look at the modal exit, mode: animation"`

---

## Supported

**Input formats**
- `.gif` `.mp4` `.webm` `.mov`
- Local absolute file paths

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

## Why This Exists

Cursor feature request for video input: **847 upvotes. Still open.**

The workaround today:
1. Record the bug
2. Watch it yourself
3. Try to describe it in words
4. Hope the AI understands
5. Get a wrong fix
6. Repeat

motif skips steps 2–5.

---

## Development

```bash
npm install
npm run dev      # runs src/index.ts with tsx, hot reload
npm run build    # compiles to dist/
npm run start    # runs dist/index.js
```

Test the MCP server directly:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

**Project structure:**

```
src/
├── index.ts      Entry point — boots MCP server, wires transport
├── tools.ts      MCP tool definitions and request handlers
├── analyze.ts    Core logic — uploads to Gemini, parses response
├── extract.ts    File validation, format detection, path resolution
└── prompts.ts    All Gemini prompts — edit here, not inline

web/                         Next.js landing page
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── components/
│       ├── Hero.tsx         Hero with embedded demo video
│       ├── DemoVisual.tsx   Interactive React fallback component
│       ├── HowItWorks.tsx
│       ├── Install.tsx
│       └── ...
└── public/
    └── demo.mp4             Pre-rendered demo video (committed to repo)
```

---

## Contributing

motif is MIT licensed and built to be extended.

**Good first issues:**
- Add support for Loom / remote URLs
- Cache uploaded files by hash to skip re-uploads
- Add a `compare` tool — diff two recordings (before/after)
- Build a VS Code extension wrapper

Built with:
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- [Google Gemini API](https://ai.google.dev)
- TypeScript

---

## License

MIT — use it, fork it, ship it.

---

*motif — motion + fix. The pattern that keeps repeating until you find it.*
