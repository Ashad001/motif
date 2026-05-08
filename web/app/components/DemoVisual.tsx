"use client";

import { useEffect, useRef, useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    tag: "NEW ARRIVAL",
    title: "Velocity Pro",
    sub: "Running Shoes",
    desc: "Engineered mesh upper with adaptive cushioning. Built for the long run.",
    price: "$148",
    cta: "Shop Now",
    accent: "#a78bfa",
    bg: "#0e0a1c",
    emoji: "👟",
  },
  {
    id: 1,
    tag: "BESTSELLER",
    title: "Summit Ridge",
    sub: "Hiking Boots",
    desc: "Waterproof full-grain leather. Vibram® outsole. Ready for anything.",
    price: "$219",
    cta: "View Details",
    accent: "#34d399",
    bg: "#071410",
    emoji: "🥾",
  },
  {
    id: 2,
    tag: "LIMITED",
    title: "Urban Drift",
    sub: "Street Sneakers",
    desc: "Retro silhouette, modern materials. From the court to the concrete.",
    price: "$112",
    cta: "Buy Now",
    accent: "#fb923c",
    bg: "#130e05",
    emoji: "👟",
  },
];

// ── Typewriter ────────────────────────────────────────────────────────────
function useTypewriter(text: string, delay: number, speed: number, active: boolean) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setOut(""); setDone(false); return; }
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [active, text, delay, speed]);
  return { out, done };
}

function Cursor({ color = "rgba(240,240,240,0.5)" }: { color?: string }) {
  return (
    <span style={{
      display: "inline-block", width: 2, height: "0.8em",
      background: color, marginLeft: 1, verticalAlign: "text-bottom",
      animation: "motif-blink 1s step-end infinite",
    }} />
  );
}

// ── Code highlight ────────────────────────────────────────────────────────
function Code({ code, variant }: { code: string; variant: "broken" | "fixed" }) {
  const lines = code.split("\n");
  const red = "rgba(239,68,68,0.09)";
  const green = "rgba(134,239,172,0.08)";
  const redBar = "rgba(239,68,68,0.5)";
  const greenBar = "rgba(134,239,172,0.45)";

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: "0.66rem",
      lineHeight: 1.8,
      overflowX: "auto",
      padding: "1rem 0",
    }}>
      {lines.map((raw, i) => {
        const isHit = variant === "broken"
          ? raw.includes("linear")
          : raw.includes("cubic-bezier");
        const bg = isHit ? (variant === "broken" ? red : green) : "transparent";
        const bar = isHit ? (variant === "broken" ? redBar : greenBar) : "transparent";

        // token coloring
        const colored = raw
          .replace(/(".*?")/g, '<s class="str">$1</s>')
          .replace(/\b(const|return|function|let|var|import|export|from|default)\b/g, '<k>$1</k>')
          .replace(/\b(\d+\.?\d*)\b/g, '<n>$1</n>')
          .replace(/(\/\/.*)/g, '<c>$1</c>');

        return (
          <div key={i} style={{
            display: "flex", gap: "1.1rem",
            padding: "0 1.2rem 0 0",
            background: bg,
            borderLeft: `3px solid ${bar}`,
            paddingLeft: "1.2rem",
          }}>
            <span style={{
              minWidth: "1.6rem", textAlign: "right", userSelect: "none",
              color: "rgba(240,240,240,0.1)", fontSize: "0.58rem",
              paddingTop: "0.1rem", flexShrink: 0,
            }}>{i + 1}</span>
            <span
              style={{ whiteSpace: "pre", color: "rgba(240,240,240,0.5)" }}
              dangerouslySetInnerHTML={{ __html: raw
                .replace(/("(?:[^"\\]|\\.)*?")/g, `<span style="color:#a3e635">$1</span>`)
                .replace(/\b(const|return|function|let|var|import|export|from)\b/g, `<span style="color:#c084fc">$1</span>`)
                .replace(/(?<![a-zA-Z])(\d+\.?\d*)(?![a-zA-Z])/g, `<span style="color:#fb923c">$1</span>`)
                .replace(/(\/\/.*)/g, `<span style="color:#374151">$1</span>`)
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Auto-looping broken carousel ──────────────────────────────────────────
function BrokenCarousel() {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % SLIDES.length);
      setKey(k => k + 1);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  const slide = SLIDES[idx];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: slide.bg, transition: "background 0.3s" }}>
      {/* Incoming slide — jerks in with overshoot */}
      <div key={key} style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center",
        animation: "broken-slide-in 0.55s ease-out both",
      }}>
        <SlideContent slide={slide} idx={idx} />
      </div>
      {/* Red overshoot ghost that flashes past */}
      <div key={`ghost-${key}`} style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `linear-gradient(90deg, ${slide.accent}00 0%, ${slide.accent}30 60%, ${slide.accent}60 100%)`,
        animation: "broken-ghost 0.55s ease-out both",
      }} />
    </div>
  );
}

// ── Auto-looping fixed carousel ───────────────────────────────────────────
function FixedCarousel() {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % SLIDES.length);
      setKey(k => k + 1);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  const slide = SLIDES[idx];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: slide.bg, transition: "background 0.5s" }}>
      <div key={key} style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center",
        animation: "fixed-slide-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <SlideContent slide={slide} idx={idx} />
      </div>
    </div>
  );
}

function SlideContent({ slide, idx }: { slide: typeof SLIDES[0]; idx: number }) {
  return (
    <div style={{ width: "100%", padding: "1.8rem 2.4rem", display: "flex", gap: "2rem", alignItems: "center" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.5rem", letterSpacing: "0.18em",
          color: slide.accent, border: `1px solid ${slide.accent}44`,
          padding: "3px 10px", marginBottom: "0.8rem",
        }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: slide.accent, display: "inline-block" }} />
          {slide.tag}
        </div>
        <div style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          letterSpacing: "0.04em", lineHeight: 1, color: "#f0f0f0", marginBottom: "0.2rem",
        }}>{slide.title}</div>
        <div style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.52rem", letterSpacing: "0.12em",
          color: "rgba(240,240,240,0.3)", marginBottom: "0.8rem",
        }}>{slide.sub}</div>
        <p style={{ fontSize: "0.78rem", color: "rgba(240,240,240,0.4)", lineHeight: 1.65, maxWidth: 260, marginBottom: "1.2rem" }}>
          {slide.desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.8rem", color: "#f0f0f0" }}>{slide.price}</span>
          <button style={{
            fontFamily: "var(--font-mono), monospace", fontSize: "0.52rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "9px 20px", background: slide.accent, color: "#000",
            border: "none", cursor: "pointer", fontWeight: 700,
          }}>{slide.cta}</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}>
        <div style={{ fontSize: "3.8rem", lineHeight: 1, filter: `drop-shadow(0 0 24px ${slide.accent}55)` }}>
          {slide.emoji}
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {SLIDES.map((_, i) => (
            <span key={i} style={{
              display: "inline-block",
              width: i === idx ? 18 : 5, height: 4,
              background: i === idx ? slide.accent : "rgba(240,240,240,0.15)",
              borderRadius: 2, transition: "width 0.3s, background 0.3s",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}


// ── Main ──────────────────────────────────────────────────────────────────
export default function DemoVisual() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"broken" | "fixed">("broken");
  const ref = useRef<HTMLDivElement>(null);

  const { out: t1, done: d1 } = useTypewriter(
    'Clicking “Next” causes the slide to overshoot at ~0.3s — slides past destination, snaps back. Visible on every transition.',
    600, 14, visible
  );
  const { out: t2 } = useTypewriter(
    "translateX uses linear easing — no overshoot correction. Slide jumps past 100% before settling.",
    2800, 13, visible
  );
  const { out: t3, done: d3 } = useTypewriter(
    `"transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"`,
    5000, 11, visible
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!d3) return;
    const t = setTimeout(() => setMode("fixed"), 1400);
    return () => clearTimeout(t);
  }, [d3]);

  const CODE_BROKEN = `// Carousel.tsx
function Carousel({ slides }) {
  const [idx, setIdx] = useState(0);

  return (
    <div className="overflow-hidden">
      <div
        style={{
          display: "flex",
          transform: \`translateX(-\${idx * 100}%)\`,
          transition: "transform 0.3s linear", // ← bug
        }}
      >
        {slides.map(s => <Slide key={s.id} {...s} />)}
      </div>
      <button onClick={() => setIdx(i => i + 1)}>
        Next →
      </button>
    </div>
  );
}`;

  const CODE_FIXED = `// Carousel.tsx  ✓ fixed by motif
function Carousel({ slides }) {
  const [idx, setIdx] = useState(0);

  return (
    <div className="overflow-hidden">
      <div
        style={{
          display: "flex",
          transform: \`translateX(-\${idx * 100}%)\`,
          transition:
            "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)", // ✓
        }}
      >
        {slides.map(s => <Slide key={s.id} {...s} />)}
      </div>
      <button onClick={() => setIdx(i => i + 1)}>
        Next →
      </button>
    </div>
  );
}`;

  return (
    <div
      ref={ref}
      style={{
        maxWidth: 1000,
        margin: "3.5rem auto 0",
        width: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center",
        background: "#0f0f0f",
        border: "1px solid rgba(240,240,240,0.09)",
        borderBottom: "none",
        padding: "10px 18px", gap: 12,
      }}>
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
            <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block", opacity: 0.8 }} />
          ))}
        </div>

        {/* File + meta */}
        <span style={{
          fontFamily: "var(--font-mono), monospace", fontSize: "0.5rem",
          color: "rgba(240,240,240,0.22)", letterSpacing: "0.1em", marginLeft: 6, flex: 1,
        }}>
          motif · Carousel.tsx · 74 frames · gemini-2.5-flash
        </span>

        {/* Mode toggle */}
        <div style={{
          display: "flex",
          border: "1px solid rgba(240,240,240,0.1)",
          overflow: "hidden",
        }}>
          {(["broken","fixed"] as const).map(v => (
            <button key={v} onClick={() => setMode(v)} style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.48rem", letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "5px 14px",
              background: mode === v
                ? v === "broken" ? "rgba(239,68,68,0.15)" : "rgba(134,239,172,0.12)"
                : "transparent",
              color: mode === v
                ? v === "broken" ? "#f87171" : "#6ee7b7"
                : "rgba(240,240,240,0.2)",
              border: "none",
              borderRight: v === "broken" ? "1px solid rgba(240,240,240,0.1)" : "none",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {v === "broken" ? "✕ broken" : "✓ fixed"}
            </button>
          ))}
        </div>

        {/* Confidence */}
        <span style={{
          fontFamily: "var(--font-mono), monospace", fontSize: "0.44rem",
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(134,239,172,0.5)", border: "1px solid rgba(134,239,172,0.15)",
          padding: "3px 10px",
        }}>high confidence</span>
      </div>

      {/* ── Carousel viewport — FULL WIDTH ── */}
      <div style={{
        position: "relative",
        height: 240,
        border: "1px solid rgba(240,240,240,0.09)",
        borderBottom: "none",
        overflow: "hidden",
      }}>
        {mode === "broken" ? <BrokenCarousel /> : <FixedCarousel />}

        {/* Mode watermark */}
        <div style={{
          position: "absolute", top: 12, left: 16, zIndex: 20,
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.42rem", letterSpacing: "0.16em", textTransform: "uppercase",
          color: mode === "broken" ? "rgba(248,113,113,0.6)" : "rgba(110,231,183,0.6)",
          border: `1px solid ${mode === "broken" ? "rgba(248,113,113,0.2)" : "rgba(110,231,183,0.18)"}`,
          padding: "3px 8px",
          background: mode === "broken" ? "rgba(239,68,68,0.06)" : "rgba(134,239,172,0.05)",
        }}>
          {mode === "broken" ? "⚠ overshoot bug" : "✓ spring fixed"}
        </div>
      </div>

      {/* ── Bottom: diagnosis + code ── */}
      <div className="motif-bottom" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        border: "1px solid rgba(240,240,240,0.09)",
      }}>
        {/* Diagnosis panel */}
        <div style={{
          borderRight: "1px solid rgba(240,240,240,0.08)",
          background: "#080808",
          padding: "1.4rem 1.6rem",
          display: "flex", flexDirection: "column", gap: "1.3rem",
        }}>
          <div style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.44rem", letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(240,240,240,0.14)",
            paddingBottom: "0.8rem",
            borderBottom: "1px solid rgba(240,240,240,0.06)",
          }}>motif · diagnosis</div>

          {/* WHAT I SEE */}
          <div>
            <div style={LBL}>WHAT I SEE</div>
            <p style={{ fontSize: "0.76rem", color: "rgba(240,240,240,0.65)", lineHeight: 1.65, margin: 0, minHeight: 52 }}>
              {t1}{!d1 && t1.length > 0 && <Cursor />}
            </p>
          </div>

          {/* ROOT CAUSE */}
          <div>
            <div style={LBL}>ROOT CAUSE</div>
            <p style={{ fontSize: "0.76rem", color: "rgba(248,113,113,0.75)", lineHeight: 1.65, margin: 0, minHeight: 40 }}>
              {t2}{t2.length > 0 && t2.length < 88 && <Cursor color="rgba(248,113,113,0.5)" />}
            </p>
          </div>

          {/* FIX */}
          <div>
            <div style={LBL}>FIX</div>
            <div style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.64rem",
              color: "rgba(134,239,172,0.9)",
              background: "rgba(134,239,172,0.05)",
              border: "1px solid rgba(134,239,172,0.12)",
              borderLeft: "3px solid rgba(134,239,172,0.35)",
              padding: "8px 12px", lineHeight: 1.5, minHeight: 28,
            }}>
              {t3}{t3.length > 0 && !d3 && <Cursor color="rgba(134,239,172,0.6)" />}
            </div>
          </div>
        </div>

        {/* Code diff panel */}
        <div style={{ background: "#050505", display: "flex", flexDirection: "column" }}>
          <div style={{
            padding: "8px 16px",
            borderBottom: "1px solid rgba(240,240,240,0.06)",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.44rem", letterSpacing: "0.16em", textTransform: "uppercase",
            display: "flex", justifyContent: "space-between",
            color: "rgba(240,240,240,0.15)",
          }}>
            <span>Carousel.tsx</span>
            <span style={{ color: mode === "broken" ? "rgba(248,113,113,0.45)" : "rgba(134,239,172,0.45)" }}>
              {mode === "broken" ? "before" : "after motif"}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <Code code={mode === "broken" ? CODE_BROKEN : CODE_FIXED} variant={mode} />
          </div>

          {/* Diff strip */}
          <div style={{
            padding: "8px 16px",
            borderTop: "1px solid rgba(240,240,240,0.06)",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.46rem", display: "flex", gap: 14, flexWrap: "wrap",
          }}>
            <span style={{ color: "rgba(248,113,113,0.5)" }}>− "transform 0.3s linear"</span>
            <span style={{ color: "rgba(240,240,240,0.1)" }}>·</span>
            <span style={{ color: "rgba(134,239,172,0.5)" }}>+ cubic-bezier(0.34, 1.56, 0.64, 1)</span>
          </div>
        </div>
      </div>

      <style>{`
        /* BROKEN: slams past target, bounces back 3 times — unmistakably wrong */
        @keyframes broken-slide-in {
          0%   { transform: translateX(100%); }
          38%  { transform: translateX(-14%); }
          54%  { transform: translateX(7%); }
          68%  { transform: translateX(-4%); }
          80%  { transform: translateX(2%); }
          100% { transform: translateX(0); }
        }
        /* Ghost flares past the slide on entry — the visual artifact */
        @keyframes broken-ghost {
          0%   { transform: translateX(100%); opacity: 0; }
          30%  { transform: translateX(-20%); opacity: 1; }
          55%  { transform: translateX(5%); opacity: 0.4; }
          100% { transform: translateX(0); opacity: 0; }
        }
        /* FIXED: glides in from right, one gentle spring settle, done */
        @keyframes fixed-slide-in {
          0%   { transform: translateX(100%); opacity: 0.5; }
          70%  { transform: translateX(-2%); opacity: 1; }
          85%  { transform: translateX(0.5%); }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes motif-blink {
          0%,100% { opacity: 0.7; } 50% { opacity: 0; }
        }
        @media (max-width: 700px) {
          .motif-bottom { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const LBL: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: "0.44rem", letterSpacing: "0.22em", textTransform: "uppercase",
  color: "rgba(240,240,240,0.18)", marginBottom: "0.35rem",
};
