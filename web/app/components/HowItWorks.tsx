"use client";

const STEPS = [
  {
    num: "01 ///",
    glyph: "⏺",
    title: "Record the Bug",
    desc: "Capture your UI glitch as a GIF, MP4, WebM, or MOV. Any screen recorder works — QuickTime, Kap, ScreenToGif.",
  },
  {
    num: "02 ///",
    glyph: "💬",
    title: "Tell Your AI",
    desc: 'In Cursor or Claude Code: "watch ~/Desktop/bug.gif and fix my animation.tsx". motif figures out the rest.',
  },
  {
    num: "03 ///",
    glyph: "◈",
    title: "Gemini Watches It",
    desc: "motif uploads to Gemini 1.5 Pro via the Files API. It processes video as sequence — not isolated frames.",
  },
  {
    num: "04 ///",
    glyph: "⚡",
    title: "Get the Fix",
    desc: "Diagnosis + corrected code returned inline. Structured output, applied directly in your editor. Done.",
  },
];

export default function HowItWorks() {
  return (
    <div
      id="how"
      style={{
        padding: "96px 6%",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }} className="fade-up">
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.4)",
            marginBottom: "0.8rem",
          }}
        >
          Process
        </div>
        <div
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          How It Works
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
          background: "var(--border)",
          border: "1px solid var(--border-mid)",
          maxWidth: 1140,
          margin: "0 auto",
        }}
        className="steps-grid"
      >
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="step-card fade-up"
            style={{
              background: "var(--bg)",
              padding: "2.4rem 1.8rem",
              borderLeft: i > 0 ? "1px solid var(--border-mid)" : undefined,
              transition: "background 0.22s",
              transitionDelay: `${i * 0.08}s`,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "var(--card)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "var(--bg)")
            }
          >
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.18em",
                color: "rgba(240,240,240,0.35)",
                marginBottom: "1.6rem",
                display: "block",
              }}
            >
              {step.num}
            </span>
            <span
              style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "block" }}
            >
              {step.glyph}
            </span>
            <div
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "1.35rem",
                letterSpacing: "0.06em",
                marginBottom: "0.7rem",
                color: "var(--fg)",
              }}
            >
              {step.title}
            </div>
            <p
              style={{
                fontSize: "0.82rem",
                color: "rgba(240,240,240,0.42)",
                lineHeight: 1.65,
              }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
