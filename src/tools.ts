import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { analyzeVideo } from "./analyze.js";

export function registerTools(server: Server) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "analyze_video",
        description:
          "Watch a video or GIF of a UI bug and return a diagnosis with a code fix. " +
          "Provide the path to the recording and the relevant source code. " +
          "Powered by Gemini 1.5 Pro.",
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

    try {
      const result = await analyzeVideo(args.video_path, args.code, hint);

      const output = [
        `motif analyzed ${args.video_path} (${result.frames_analyzed} frames)\n`,
        `WHAT I SEE:\n${result.what_i_see}\n`,
        `ROOT CAUSE:\n${result.root_cause}\n`,
        `FIX:\n${result.fix}\n`,
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
