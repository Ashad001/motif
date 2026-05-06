# motif — CLAUDE.md

AI assistant context for working in this codebase.
Read this before making any changes.

## What motif does

motif is an MCP (Model Context Protocol) server. It gives AI coding
assistants (Cursor, Claude Code) the ability to watch a video or GIF
of a UI bug and return a diagnosis + code fix.

The user records a bug. They tell their AI editor to "watch" it.
motif handles the video analysis via Gemini 1.5 Pro and returns
structured output the AI can act on.

## Stack

- **Runtime:** Node.js 18+, TypeScript
- **MCP SDK:** `@modelcontextprotocol/sdk`
- **AI model:** Google Gemini 1.5 Pro (via `@google/generative-ai`)
- **Package manager:** npm
- **Build:** `tsc` → `dist/`

## File Structure

```
src/
├── index.ts        Entry point. Boots the MCP server, wires transport.
├── tools.ts        Defines MCP tools exposed to AI clients.
│                   Each tool = one capability motif gives the AI.
├── analyze.ts      Core logic. Uploads video to Gemini, sends prompt,
│                   parses and returns structured diagnosis.
├── extract.ts      Handles file validation, format detection, path
│                   resolution. Keeps analyze.ts clean.
└── prompts.ts      All Gemini prompts live here. Edit prompts here,
                    not inline in analyze.ts.

examples/
├── demo.gif        The main demo — shown in README hero. Keep this good.
└── fixtures/       Sample videos for manual testing during dev.

dist/               Compiled output. Never edit directly.
```

## Key Conventions

**One tool per file concern.** `tools.ts` defines the MCP interface.
`analyze.ts` handles AI calls. `extract.ts` handles file I/O.
Don't mix them.

**Prompts are not inline.** All strings sent to Gemini live in
`prompts.ts` and are imported where needed. This makes prompt
iteration fast — one file to change, everything updates.

**Error messages are user-facing.** When something fails (bad file
path, Gemini timeout, unsupported format), the error string returned
to the MCP client is what the developer sees in their editor.
Write them like a human wrote them, not like a stack trace.

**No unnecessary dependencies.** motif has four deps: the MCP SDK,
the Gemini SDK, TypeScript, and tsx for dev. Keep it that way.
Every dependency is a reason for an install to fail.

## Environment Variables

```bash
GEMINI_API_KEY=        # required — Gemini 1.5 Pro API key
MOTIF_MAX_FILE_MB=     # optional — default 50. Max video size in MB.
MOTIF_DEBUG=           # optional — set to "true" for verbose logging
```

Never log the API key. Never commit `.env`.

## Running Locally

```bash
npm install
npm run dev          # runs src/index.ts with tsx, hot reload
npm run build        # compiles to dist/
npm run start        # runs dist/index.js (production mode)
```

To test the MCP server manually:

```bash
# In one terminal
npm run dev

# In another terminal — send a raw MCP call
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

## The MCP Tool: `analyze_video`

This is the only tool motif exposes (for now).

**Input:**
```typescript
{
  video_path: string   // absolute path to GIF/MP4/WebM/MOV
  code: string         // the code context to fix (file contents)
  hint?: string        // optional — user hint like "focus on the scroll"
}
```

**Output:**
```typescript
{
  what_i_see: string      // plain english description of the visual bug
  root_cause: string      // specific line/reason in the code
  fix: string             // corrected code block
  confidence: string      // "high" | "medium" | "low"
  frames_analyzed: number // how many frames Gemini processed
}
```

The output is returned as a `text` content block so any MCP client
can display it regardless of how it renders tool results.

## Gemini Integration Notes

motif uses the Files API to upload video before analysis:

```typescript
// Upload first
const fileManager = new GoogleAIFileManager(apiKey);
const upload = await fileManager.uploadFile(path, { mimeType });

// Then analyze — fileUri persists for 48h on Google's side
const model = genai.getGenerativeModel({ model: "gemini-1.5-pro" });
const result = await model.generateContent([
  { fileData: { fileUri: upload.file.uri, mimeType } },
  prompt
]);
```

Uploaded files persist for 48 hours on Google's servers.
motif does not cache them — each call uploads fresh.
This is fine for now. Caching is a future optimization.

**Supported MIME types:**
```
image/gif
video/mp4
video/webm
video/quicktime   ← .mov
```

## Adding a New Tool

1. Define the tool schema in `tools.ts` (name, description, inputSchema)
2. Add a handler in `tools.ts` `CallToolRequestSchema` switch
3. Write the logic in a new file (e.g. `src/compare.ts`)
4. Import prompts from `prompts.ts` or add new ones there
5. Export types from the new file, import in handler

Keep the MCP interface thin. Business logic lives in `analyze.ts`,
`compare.ts`, etc. — not in the tool handler itself.

## Prompt Engineering

The prompt in `prompts.ts` is the most important code in this repo.
Getting Gemini to return structured, actionable output is the whole game.

Current prompt structure:
1. Tell Gemini what it's watching (a UI bug recording)
2. Give it the code context
3. Tell it exactly what to return (4 fields, specific format)
4. Tell it what NOT to do (no guessing, no hallucinating line numbers)

When editing prompts, always test against `examples/fixtures/` before
committing. A prompt change that improves one bug type can break another.

## What "Done" Looks Like

A change is done when:
- `npm run build` passes with no errors
- The tool returns structured output for a real GIF in `examples/fixtures/`
- Error cases return human-readable messages, not stack traces
- No new dependencies were added without discussion

## Known Limitations (don't try to fix these yet)

- Videos over 50MB are rejected. Gemini supports larger files but
  upload time makes it impractical for real-time debugging.
- Audio in video files is ignored. Gemini processes it but we don't
  use it in our prompt.
- Remotion preview URLs require the dev server to be running.
  Direct `.mp4` export works better.

## Questions / Decisions

If you're unsure whether to build something a certain way, check:
1. Does it add a dependency? → prefer not to
2. Does it change the output schema? → check existing consumers first
3. Does it touch `prompts.ts`? → test against all fixtures

When in doubt, keep the surface area small. motif does one thing.