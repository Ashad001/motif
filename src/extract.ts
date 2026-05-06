import { existsSync, statSync } from "node:fs";
import { resolve, extname } from "node:path";

const SUPPORTED_MIME_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

const MAX_FILE_MB = parseInt(process.env["MOTIF_MAX_FILE_MB"] ?? "50", 10);

export interface VideoFile {
  absolutePath: string;
  mimeType: string;
  sizeBytes: number;
}

export function resolveVideoFile(rawPath: string): VideoFile {
  const absolutePath = resolve(rawPath);

  if (!existsSync(absolutePath)) {
    throw new Error(
      `File not found: ${absolutePath}. Make sure the path is correct and the file exists.`
    );
  }

  const ext = extname(absolutePath).toLowerCase();
  const mimeType = SUPPORTED_MIME_TYPES[ext];

  if (!mimeType) {
    throw new Error(
      `Unsupported file format: ${ext}. motif supports .gif, .mp4, .webm, and .mov files.`
    );
  }

  const stats = statSync(absolutePath);
  const sizeMB = stats.size / (1024 * 1024);

  if (sizeMB > MAX_FILE_MB) {
    throw new Error(
      `File is too large (${sizeMB.toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_MB} MB.`
    );
  }

  return {
    absolutePath,
    mimeType,
    sizeBytes: stats.size,
  };
}
