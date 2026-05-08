import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { resolveVideoFile } from "./extract.js";
import { buildAnalysisPrompt, type AnalysisMode } from "./prompts.js";

const DEBUG = process.env["MOTIF_DEBUG"] === "true";

function log(msg: string) {
  if (DEBUG) process.stderr.write(`[motif] ${msg}\n`);
}

export interface AnalysisResult {
  what_i_see: string;
  root_cause: string;
  fix: string;
  diff_before_after?: string;
  confidence: "high" | "medium" | "low";
  frames_analyzed: number;
}

export async function analyzeVideo(
  videoPath: string,
  code: string,
  hint?: string,
  mode?: AnalysisMode,
  language?: string
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

  log(`Upload complete: ${upload.file.uri} — waiting for ACTIVE state...`);

  // Poll until the file is ACTIVE (Gemini processes uploads asynchronously)
  let fileState = upload.file;
  const maxWaitMs = 60_000;
  const pollIntervalMs = 2_000;
  const start = Date.now();
  while ((fileState.state as string) !== "ACTIVE") {
    if (Date.now() - start > maxWaitMs) {
      throw new Error(
        `Gemini file processing timed out after ${maxWaitMs / 1000}s. The file may be too large or the API is slow. Try again.`
      );
    }
    await new Promise((r) => setTimeout(r, pollIntervalMs));
    fileState = await fileManager.getFile(fileState.name);
    log(`File state: ${fileState.state}`);
  }

  log(`File is ACTIVE: ${fileState.uri}`);

  const genai = new GoogleGenerativeAI(apiKey);
  const modelName = process.env["MOTIF_MODEL"] ?? "gemini-2.5-flash";
  const model = genai.getGenerativeModel({ model: modelName });
  log(`Using model: ${modelName}`);

  const prompt = buildAnalysisPrompt(code, hint, mode, language);

  log("Sending to Gemini for analysis...");

  const result = await model.generateContent([
    {
      fileData: {
        fileUri: fileState.uri,
        mimeType: videoFile.mimeType,
      },
    },
    prompt,
  ]);

  const rawText = result.response.text().trim();
  log(`Raw Gemini response: ${rawText}`);

  // Strip markdown code fences if Gemini wrapped the JSON
  const text = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(text) as AnalysisResult;
  } catch {
    throw new Error(
      `Gemini returned a response that couldn't be parsed as JSON. Raw response:\n\n${rawText}`
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
