"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Callout;
function Callout() {
    return (<div style={{
            padding: "72px 6%",
            background: "var(--card)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
        }}>
      <div style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: "4rem",
            alignItems: "center",
        }} className="callout-grid">
        {/* Left: stat */}
        <div className="fade-up">
          <div style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            lineHeight: 0.9,
            color: "var(--fg)",
            letterSpacing: "-0.01em",
        }}>
            &lt;30s
          </div>
          <div style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            color: "rgba(240,240,240,0.35)",
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: 9,
        }}>
            <span className="pulse-dot"/>
            {"[ ● ANALYZING ]"}
          </div>
        </div>

        {/* Right: copy */}
        <div className="fade-up" style={{
            borderLeft: "1px solid rgba(240,240,240,0.2)",
            paddingLeft: "2.5rem",
            transitionDelay: "0.1s",
        }}>
          <p style={{
            fontSize: "0.95rem",
            color: "rgba(240,240,240,0.55)",
            lineHeight: 1.75,
            marginBottom: "1rem",
        }}>
            From recording to fix in{" "}
            <strong style={{ color: "var(--fg)", fontWeight: 600 }}>
              under 30 seconds
            </strong>
            . Gemini watches it as motion — it sees the stutter at 0.3s, the
            element that overshoots, the state that never resolves.
          </p>
          <p style={{
            fontSize: "0.95rem",
            color: "rgba(240,240,240,0.55)",
            lineHeight: 1.75,
        }}>
            Bugs live in motion. Hover states, scroll jank, animation glitches,
            transition flickers —{" "}
            <strong style={{ color: "var(--fg)", fontWeight: 600 }}>
              you can&apos;t screenshot a stutter.
            </strong>{" "}
            Now you don&apos;t have to describe it either.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .callout-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .callout-grid > div:last-child {
            border-left: none !important;
            border-top: 1px solid rgba(240,240,240,0.2);
            padding-left: 0 !important;
            padding-top: 2rem;
          }
        }
      `}</style>
    </div>);
}
//# sourceMappingURL=Callout.js.map