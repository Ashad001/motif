export type AnalysisMode = "animation" | "layout" | "interaction" | "general";

export function buildAnalysisPrompt(
  code: string,
  hint?: string,
  mode: AnalysisMode = "general",
  language?: string
): string {
  const hintSection = hint ? `\nUser hint: ${hint}\n` : "";

  const modeGuide: Record<AnalysisMode, string> = {
    animation:
      "Focus on motion artifacts: overshoots, easing curves, keyframe timing, spring physics, and animation sequencing.",
    layout:
      "Focus on layout shifts: element positioning, z-index stacking, overflow clipping, flex/grid alignment, and resize behavior.",
    interaction:
      "Focus on interaction feedback: hover states, click/tap responses, focus rings, scroll behavior, and transition triggers.",
    general:
      "Look for any visual bugs: motion artifacts, layout shifts, interaction failures, timing issues, or elements behaving unexpectedly.",
  };

  const langNote = language ? `\nProvide the fix in ${language}.` : "";

  return `You are a UI bug analyst. You are watching a screen recording of a UI bug.
${hintSection}
Analysis focus: ${modeGuide[mode]}
${langNote}

Here is the relevant source code:

\`\`\`
${code}
\`\`\`

Analyze the recording carefully as a sequence of frames — not isolated images.
Pay attention to timing (call out specific timestamps like "at ~0.8s"), which element
is affected, and how the visual state changes across frames.

Respond with ONLY the following JSON structure — no preamble, no markdown fences:

{
  "what_i_see": "Plain English description of the visual bug. Be specific about timing (e.g. 'at ~0.8s') and which element is affected.",
  "root_cause": "The specific line or code pattern causing the bug. Reference the code provided.",
  "fix": "The corrected code block that resolves the issue.",
  "diff_before_after": "Short before/after diff showing exactly what changed. Format: '- old line\\n+ new line'. Omit if the fix is a full replacement.",
  "confidence": "high | medium | low",
  "frames_analyzed": <integer number of frames you processed>
}

Rules:
- Do not hallucinate line numbers. Only reference lines visible in the provided code.
- Do not guess if you cannot see the bug clearly — set confidence to "low" and explain in what_i_see.
- The fix must be directly applicable, not general advice.
- diff_before_after should be concise — only the changed lines.
- frames_analyzed must be an integer.`;
}
