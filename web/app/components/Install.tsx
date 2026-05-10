"use client";

import { useState } from "react";

const CURSOR_CODE = `{
  "mcpServers": {
    "motif": {
      "command": "npx",
      "args": ["motif-mcp"],
      "env": {
        "GEMINI_API_KEY": "your-key-here"
      }
    }
  }
}`;

const CLAUDE_CODE = `{
  "mcpServers": {
    "motif": {
      "command": "npx",
      "args": ["motif-mcp"],
      "env": {
        "GEMINI_API_KEY": "your-key-here"
      }
    }
  }
}`;

function highlight(code: string, comment: string) {
  return (
    <>
      <span style={{ color: "rgba(240,240,240,0.22)", fontStyle: "italic" }}>
        {comment}
      </span>
      {"\n"}
      {code.split("\n").map((line, i) => {
        // Colour keys (quoted before colon) and string values differently
        const keyMatch = line.match(/^(\s*)("[\w_]+")\s*:/);
        const strMatch = line.match(/:\s*(".*")/);
        const parts: React.ReactNode[] = [];

        if (keyMatch) {
          const [, indent, key] = keyMatch;
          const rest = line.slice(indent.length + key.length);
          parts.push(
            <span key="indent">{indent}</span>,
            <span key="key" style={{ color: "rgba(240,240,240,0.7)" }}>
              {key}
            </span>,
            <span key="rest" style={{ color: "rgba(240,240,240,0.35)" }}>
              {rest.replace(/"[^"]*"$/, "")}
            </span>
          );
          if (strMatch) {
            parts.push(
              <span key="val" style={{ color: "#86EFAC" }}>
                {strMatch[1]}
              </span>
            );
            const afterVal = rest.replace(/.*"[^"]*"/, "");
            if (afterVal)
              parts.push(
                <span key="after" style={{ color: "rgba(240,240,240,0.35)" }}>
                  {afterVal}
                </span>
              );
          }
        } else {
          parts.push(
            <span key="plain" style={{ color: "rgba(240,240,240,0.35)" }}>
              {line}
            </span>
          );
        }

        return (
          <span key={i} style={{ display: "block" }}>
            {parts}
          </span>
        );
      })}
    </>
  );
}

export default function Install() {
  const [tab, setTab] = useState<"cursor" | "claude">("cursor");
  const [copied, setCopied] = useState(false);

  function copy() {
    const code = tab === "cursor" ? CURSOR_CODE : CLAUDE_CODE;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const mono: React.CSSProperties = {
    fontFamily: "var(--font-mono), monospace",
  };

  return (
    <div
      id="install"
      style={{ padding: "96px 6%", borderTop: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "0.5rem" }} className="fade-up">
        <div
          style={{
            ...mono,
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.4)",
            marginBottom: "0.8rem",
          }}
        >
          Setup
        </div>
        <div
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          Add to Your Editor
        </div>
      </div>

      <p
        className="fade-up"
        style={{
          ...mono,
          textAlign: "center",
          fontSize: "0.72rem",
          color: "rgba(240,240,240,0.35)",
          letterSpacing: "0.04em",
          marginBottom: "2.5rem",
        }}
      >
        Get a free Gemini API key at ai.google.dev → add the config below → restart your editor.
      </p>

      {/* Tabs + code */}
      <div
        className="fade-up"
        style={{ maxWidth: 820, margin: "0 auto" }}
      >
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-mid)",
          }}
        >
          {(["cursor", "claude"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...mono,
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "10px 22px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t ? "var(--fg)" : "transparent"}`,
                color:
                  tab === t ? "var(--fg)" : "rgba(240,240,240,0.35)",
                cursor: "pointer",
                marginBottom: -1,
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {t === "cursor" ? "Cursor" : "Claude Code"}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div
          style={{
            background: "#0D0D0D",
            border: "1px solid var(--border-mid)",
            borderTop: "none",
            padding: "1.6rem clamp(1rem, 4vw, 2rem) 1.8rem",
            ...mono,
            fontSize: "clamp(0.65rem, 1.8vw, 0.78rem)",
            lineHeight: 1.85,
            position: "relative",
            overflowX: "auto",
          }}
        >
          <button
            onClick={copy}
            style={{
              position: "absolute",
              top: 12,
              right: 14,
              ...mono,
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "5px 11px",
              background: "rgba(240,240,240,0.06)",
              color: "rgba(240,240,240,0.5)",
              border: "1px solid rgba(240,240,240,0.14)",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(240,240,240,0.12)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(240,240,240,0.06)")
            }
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <pre style={{ margin: 0, whiteSpace: "pre" }}>
            {tab === "cursor"
              ? highlight(CURSOR_CODE, "// ~/.cursor/mcp.json")
              : highlight(CLAUDE_CODE, "// ~/.claude/mcp.json")}
          </pre>
        </div>
      </div>
    </div>
  );
}
