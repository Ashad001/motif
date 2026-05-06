export function buildAnalysisPrompt(code: string, hint?: string): string {
  const hintSection = hint
    ? `\nUser hint: ${hint}\n`
    : "";

  return `You are a UI bug analyst. You are watching a screen recording of a UI bug.
${hintSection}
Here is the relevant source code:

\`\`\`
${code}
\`\`\`

Analyze the recording carefully as a sequence of frames — not isolated images.
Look for motion artifacts: overshoots, jank, flickers, incorrect transitions,
elements that appear/disappear at wrong times, scroll issues, or animation glitches.

Respond with ONLY the following JSON structure — no preamble, no markdown fences:

{
  "what_i_see": "Plain English description of the visual bug. Be specific about timing (e.g. 'at ~0.8s') and which element is affected.",
  "root_cause": "The specific line or code pattern causing the bug. Reference the code provided.",
  "fix": "The corrected code block that resolves the issue. Show the before and after if helpful.",
  "confidence": "high | medium | low",
  "frames_analyzed": <integer number of frames you processed>
}

Rules:
- Do not hallucinate line numbers. Only reference lines visible in the provided code.
- Do not guess if you cannot see the bug clearly — set confidence to "low" and explain in what_i_see.
- The fix must be directly applicable, not general advice.
- frames_analyzed must be an integer.`;
}
