"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hero;
const CHIPS = ["Cursor", "Claude Code", "Claude Desktop", "Any MCP Client"];
function Hero() {
    return (<section className="grid-texture" style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 6% 60px",
            position: "relative",
        }}>
      {/* Badge */}
      <div style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.4)",
            border: "1px solid rgba(240,240,240,0.14)",
            padding: "5px 14px",
            marginBottom: "2rem",
            position: "relative",
        }}>
        Beta · Gemini 1.5 Pro · MCP Server
      </div>

      {/* Heading */}
      <h1 style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)",
            lineHeight: 0.93,
            letterSpacing: "0.025em",
            marginBottom: "1.4rem",
            position: "relative",
        }}>
        <span style={{ display: "block", color: "var(--fg)" }}>
          Your AI can now
        </span>
        <span style={{ display: "block", marginTop: "0.06em" }}>
          <span style={{
            display: "inline-block",
            background: "var(--fg)",
            color: "var(--bg)",
            padding: "0 0.18em 0.04em",
            lineHeight: 1,
        }}>
            watch your bugs
          </span>
        </span>
      </h1>

      {/* Subheading */}
      <p style={{
            fontSize: "0.95rem",
            color: "rgba(240,240,240,0.5)",
            maxWidth: 440,
            margin: "0 auto 2.2rem",
            fontWeight: 300,
            lineHeight: 1.75,
            position: "relative",
        }}>
        Drop a recording. Get the fix. No describing, no words.
        <br />
        Powered by Gemini 1.5 Pro — the only model that watches video natively.
      </p>

      {/* CTAs */}
      <div style={{
            display: "flex",
            gap: "0.8rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "3rem",
            position: "relative",
        }}>
        <a href="#install" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "12px 24px",
            background: "var(--fg)",
            color: "var(--bg)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "opacity 0.2s, transform 0.14s",
        }} onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.opacity = "0.85";
            el.style.transform = "translateY(-1px)";
        }} onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="16"/><polyline points="8 12 12 16 16 12"/><line x1="4" y1="22" x2="20" y2="22"/>
          </svg>
          Install with npm
        </a>
        <a href="#how" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "12px 24px",
            background: "transparent",
            color: "var(--fg)",
            border: "1px solid rgba(240,240,240,0.2)",
            textDecoration: "none",
            transition: "border-color 0.2s, transform 0.14s",
        }} onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(240,240,240,0.5)";
            el.style.transform = "translateY(-1px)";
        }} onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(240,240,240,0.2)";
            el.style.transform = "translateY(0)";
        }}>
          How It Works
        </a>
      </div>

      {/* Works With */}
      <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            position: "relative",
        }}>
        <span style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.22)",
        }}>
          Works with
        </span>
        {CHIPS.map((name) => (<span key={name} style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.67rem",
                color: "rgba(240,240,240,0.3)",
                border: "1px solid rgba(240,240,240,0.08)",
                padding: "4px 10px",
                letterSpacing: "0.04em",
                transition: "color 0.2s, border-color 0.2s",
                cursor: "default",
            }} onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(240,240,240,0.7)";
                el.style.borderColor = "rgba(240,240,240,0.25)";
            }} onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(240,240,240,0.3)";
                el.style.borderColor = "rgba(240,240,240,0.08)";
            }}>
            {name}
          </span>))}
      </div>
    </section>);
}
//# sourceMappingURL=Hero.js.map