import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { analyzeVideo } from "./analyze.js";
import { type AnalysisMode } from "./prompts.js";

const VALID_MODES: AnalysisMode[] = ["animation", "layout", "interaction", "general"];

export function registerTools(server: Server) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "analyze_video",
        description:
          "Watch a video or GIF of a UI bug and return a diagnosis with a code fix. " +
          "Provide the path to the recording and the relevant source code. " +
          "Optionally specify a mode (animation, layout, interaction, general) to focus the analysis, " +
          "a language for the fix (e.g. TypeScript, Python), and a hint to guide Gemini. " +
          "Powered by Gemini via the MOTIF_MODEL env var (default: gemini-2.5-flash).",
        inputSchema: {
          type: "object",
          properties: {
            video_path: {
              type: "string",
              description:
                "Absolute path to the bug recording. Supports .gif, .mp4, .webm, .mov.",
            },
            code: {
              type: "string",
              description:
                "The source code to fix — paste the file contents or the relevant section.",
            },
            hint: {
              type: "string",
              description:
                "Optional hint to focus the analysis (e.g. 'focus on the scroll', 'look at the modal animation').",
            },
            mode: {
              type: "string",
              enum: ["animation", "layout", "interaction", "general"],
              description:
                "Analysis mode. 'animation' focuses on motion artifacts, 'layout' on positioning/alignment, " +
                "'interaction' on hover/click/focus feedback, 'general' covers everything. Defaults to 'general'.",
            },
            language: {
              type: "string",
              description:
                "Programming language for the fix (e.g. 'TypeScript', 'JavaScript', 'Python'). " +
                "Defaults to whatever language is in the provided code.",
            },
          },
          required: ["video_path", "code"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "analyze_video") {
      return {
        content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
        isError: true,
      };
    }

    const args = request.params.arguments as {
      video_path?: unknown;
      code?: unknown;
      hint?: unknown;
      mode?: unknown;
      language?: unknown;
    };

    if (typeof args.video_path !== "string" || !args.video_path) {
      return {
        content: [{ type: "text", text: "video_path is required and must be a string." }],
        isError: true,
      };
    }

    if (typeof args.code !== "string" || !args.code) {
      return {
        content: [{ type: "text", text: "code is required and must be a string." }],
        isError: true,
      };
    }

    const hint = typeof args.hint === "string" ? args.hint : undefined;
    const language = typeof args.language === "string" ? args.language : undefined;

    const rawMode = typeof args.mode === "string" ? args.mode : "general";
    const mode: AnalysisMode = VALID_MODES.includes(rawMode as AnalysisMode)
      ? (rawMode as AnalysisMode)
      : "general";

    try {
      const result = await analyzeVideo(args.video_path, args.code, hint, mode, language);

      const diffSection = result.diff_before_after
        ? `\nDIFF:\n${result.diff_before_after}\n`
        : "";

      const modelName = process.env["MOTIF_MODEL"] ?? "gemini-2.5-flash";
      const output = [
        `motif analyzed ${args.video_path} (${result.frames_analyzed} frames · ${modelName})\n`,
        `WHAT I SEE:\n${result.what_i_see}\n`,
        `ROOT CAUSE:\n${result.root_cause}\n`,
        `FIX:\n${result.fix}`,
        diffSection,
        `CONFIDENCE: ${result.confidence}`,
      ].join("\n");

      return {
        content: [{ type: "text", text: output }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `motif error: ${message}` }],
        isError: true,
      };
    }
  });
}
