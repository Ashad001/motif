import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { resolveVideoFile } from "./extract.js";
import { buildAnalysisPrompt } from "./prompts.js";

const DEBUG = process.env["MOTIF_DEBUG"] === "true";

function log(msg: string) {
  if (DEBUG) process.stderr.write(`[motif] ${msg}\n`);
}

export interface AnalysisResult {
  what_i_see: string;
  root_cause: string;
  fix: string;
  confidence: "high" | "medium" | "low";
  frames_analyzed: number;
}

export async function analyzeVideo(
  videoPath: string,
  code: string,
  hint?: string
): Promise<AnalysisResult> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to your MCP config env section."
    );
  }

  const videoFile = resolveVideoFile(videoPath);
  log(`Resolved video: ${videoFile.absolutePath} (${videoFile.mimeType})`);

  const fileManager = new GoogleAIFileManager(apiKey);
  log("Uploading video to Gemini Files API...");

  const upload = await fileManager.uploadFile(videoFile.absolutePath, {
    mimeType: videoFile.mimeType,
    displayName: "motif-bug-recording",
  });

  log(`Upload complete: ${upload.file.uri}`);

  const genai = new GoogleGenerativeAI(apiKey);
  const model = genai.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = buildAnalysisPrompt(code, hint);

  log("Sending to Gemini for analysis...");

  const result = await model.generateContent([
    {
      fileData: {
        fileUri: upload.file.uri,
        mimeType: videoFile.mimeType,
      },
    },
    prompt,
  ]);

  const text = result.response.text().trim();
  log(`Raw Gemini response: ${text}`);

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(text) as AnalysisResult;
  } catch {
    throw new Error(
      `Gemini returned a response that couldn't be parsed as JSON. Raw response:\n\n${text}`
    );
  }

  if (!parsed.what_i_see || !parsed.root_cause || !parsed.fix || !parsed.confidence) {
    throw new Error(
      `Gemini response is missing required fields. Raw response:\n\n${text}`
    );
  }

  if (!["high", "medium", "low"].includes(parsed.confidence)) {
    parsed.confidence = "low";
  }

  if (typeof parsed.frames_analyzed !== "number") {
    parsed.frames_analyzed = 0;
  }

  return parsed;
}
