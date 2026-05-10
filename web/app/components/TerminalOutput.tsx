const v = "rgba(240,240,240,0.7)";
const dim = "rgba(240,240,240,0.28)";
const ok = "#4ADE80";
const hi = "#FCD34D";
const bad = "#F87171";
const val = "rgba(240,240,240,0.78)";

function Line({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "block" }}>{children}</div>;
}
function Blank() {
  return <div style={{ height: "0.55rem" }} />;
}
function Span({
  c,
  children,
}: {
  c: string;
  children: React.ReactNode;
}) {
  return <span style={{ color: c }}>{children}</span>;
}

export default function TerminalOutput() {
  return (
    <div
      id="output"
      style={{ padding: "96px 6%", borderTop: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }} className="fade-up">
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.35)",
            marginBottom: "0.8rem",
          }}
        >
          Example Output
        </div>
        <div
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          What You Get Back
        </div>
      </div>

      {/* Terminal */}
      <div
        className="fade-up"
        style={{
          maxWidth: 820,
          margin: "0 auto",
          border: "1px solid var(--border-mid)",
          background: "#0D0D0D",
          overflow: "hidden",
          transitionDelay: "0.08s",
        }}
      >
        {/* Bar */}
        <div
          style={{
            background: "#181818",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            borderBottom: "1px solid var(--border)",
          }}
        >
          {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((c) => (
            <div
              key={c}
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.63rem",
              color: dim,
              margin: "0 auto",
              letterSpacing: "0.08em",
            }}
          >
            motif — analyze_video
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "1.6rem clamp(1rem, 4vw, 2rem) 2rem",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "clamp(0.65rem, 1.8vw, 0.78rem)",
            lineHeight: 1.85,
            overflowX: "auto",
          }}
        >
          <Line>
            <Span c={v}>›</Span>{" "}
            <Span c="var(--fg)">
              motif: watch ~/Desktop/card-overshoot.gif and fix my animation.tsx
            </Span>
          </Line>
          <Blank />
          <Line><Span c={dim}>  ▸ Resolving file...</Span></Line>
          <Line><Span c={dim}>  ▸ Uploading to Gemini Files API...</Span></Line>
          <Line><Span c={dim}>  ▸ Analyzing 47 frames (2.3s recording)</Span></Line>
          <Blank />
          <Line>
            <Span c={ok}>  ✓ motif analyzed card-overshoot.gif (47 frames)</Span>
          </Line>
          <Blank />
          <Line><Span c={v} >  WHAT I SEE:</Span></Line>
          <Line>
            <Span c={val}>
              {"  The card overshoots its final position at ~0.8s, bouncing"}
            </Span>
          </Line>
          <Line>
            <Span c={val}>
              {"  12px past target before settling. Visible on every mount."}
            </Span>
          </Line>
          <Blank />
          <Line><Span c={v}>  ROOT CAUSE:</Span></Line>
          <Line>
            <Span c={val}>
              {"  animation.tsx line 34 — spring config has "}
              <Span c={hi}>damping: 0.1</Span>
            </Span>
          </Line>
          <Line>
            <Span c={val}>
              {"  Spring never critically damps. "}
              <Span c={hi}>mass: 2</Span>
              {" amplifies it further."}
            </Span>
          </Line>
          <Blank />
          <Line><Span c={v}>  FIX:</Span></Line>
          <Line>
            <Span c={dim}>
              {"    damping: "}
              <Span c={bad}>0.1</Span>
              {"  →  "}
              <Span c={ok}>0.8</Span>
            </Span>
          </Line>
          <Line>
            <Span c={dim}>
              {"    mass:    "}
              <Span c={bad}>2</Span>
              {"    →  "}
              <Span c={ok}>1</Span>
            </Span>
          </Line>
          <Blank />
          <Line>
            <Span c={v}>  CONFIDENCE: </Span>
            <Span c={ok}>HIGH</Span>
            <Span c={dim}> — eliminates overshoot pattern in frames 18–31</Span>
          </Line>
        </div>
      </div>
    </div>
  );
}
