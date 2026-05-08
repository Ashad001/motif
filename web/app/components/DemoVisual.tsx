"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── Real motif output — carousel overshoot bug ──────────────────────────
const ANALYSIS = {
  file: "Carousel.tsx",
  frames: 74,
  model: "gemini-2.5-flash",
  what_i_see: 'Clicking "Next" causes the slide to overshoot its target at ~0.3s — slides past the destination, snaps back. Visible on every transition.',
  root_cause: "translateX uses a linear easing with no overshoot correction. The slide position jumps past 100% before settling.",
  fix_before: `transition: "transform 0.3s linear"`,
  fix_after:  `transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"`,
  confidence: "high" as const,
};

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
          transition:           // ✓ spring easing
            "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
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

// ── Slide data ────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    tag: "NEW ARRIVAL",
    tagColor: "#a78bfa",
    title: "Velocity Pro",
    subtitle: "Running Shoes",
    desc: "Engineered mesh upper with adaptive cushioning. Built for the long run.",
    price: "$148",
    cta: "Shop Now",
    accent: "#a78bfa",
    bg: "linear-gradient(135deg, #1a1228 0%, #0f0a1e 100%)",
    icon: "👟",
  },
  {
    id: 1,
    tag: "BESTSELLER",
    tagColor: "#34d399",
    title: "Summit Ridge",
    subtitle: "Hiking Boots",
    desc: "Waterproof full-grain leather. Vibram® outsole. Ready for anything.",
    price: "$219",
    cta: "View Details",
    accent: "#34d399",
    bg: "linear-gradient(135deg, #0a1a14 0%, #060f0c 100%)",
    icon: "🥾",
  },
  {
    id: 2,
    tag: "LIMITED",
    tagColor: "#fb923c",
    title: "Urban Drift",
    subtitle: "Street Sneakers",
    desc: "Retro silhouette, modern materials. From the court to the concrete.",
    price: "$112",
    cta: "Buy Now",
    accent: "#fb923c",
    bg: "linear-gradient(135deg, #1a1008 0%, #0f0a04 100%)",
    icon: "👟",
  },
];

// ── Typewriter ────────────────────────────────────────────────────────────
function useTypewriter(text: string, delayMs: number, speed: number, active: boolean) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    setOut(""); setDone(false);
    const wait = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delayMs);
    return () => clearTimeout(wait);
  }, [active, text, delayMs, speed]);
  return { out, done };
}

function Cursor({ color = "rgba(240,240,240,0.6)" }: { color?: string }) {
  return (
    <span style={{
      display: "inline-block",
      width: 2,
      height: "0.85em",
      background: color,
      marginLeft: 2,
      verticalAlign: "text-bottom",
      animation: "demo-cursor-blink 0.9s step-end infinite",
    }} />
  );
}

// ── Syntax highlight (simple) ─────────────────────────────────────────────
function CodeBlock({ code, variant }: { code: string; variant: "broken" | "fixed" }) {
  const lines = code.split("\n");
  const isBroken = variant === "broken";

  return (
    <div style={{
      fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Courier New', monospace",
      fontSize: "0.67rem",
      lineHeight: 1.75,
      padding: "1rem 1.2rem",
      flex: 1,
      overflowX: "auto",
      overflowY: "auto",
    }}>
      {lines.map((line, i) => {
        const isBugLine = isBroken && line.includes("linear");
        const isFixLine = !isBroken && line.includes("cubic-bezier");
        const isComment = line.trim().startsWith("//");

        let color = "rgba(240,240,240,0.55)";
        if (isComment) color = "#4a5568";
        else if (isBugLine) color = "rgba(252,165,165,0.9)";
        else if (isFixLine) color = "rgba(134,239,172,0.9)";

        return (
          <div key={i} style={{
            display: "flex",
            gap: "1rem",
            padding: "0 0.2rem",
            background: isBugLine ? "rgba(239,68,68,0.07)"
              : isFixLine ? "rgba(134,239,172,0.07)"
              : "transparent",
            borderLeft: isBugLine ? "2px solid rgba(239,68,68,0.45)"
              : isFixLine ? "2px solid rgba(134,239,172,0.45)"
              : "2px solid transparent",
            marginLeft: "-0.2rem",
          }}>
            <span style={{
              color: "rgba(240,240,240,0.1)",
              userSelect: "none",
              minWidth: "1.4rem",
              textAlign: "right",
              fontSize: "0.58rem",
              paddingTop: "0.08rem",
              flexShrink: 0,
            }}>{i + 1}</span>
            <span style={{ color, whiteSpace: "pre" }}>{line}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Broken carousel (overshoots) ──────────────────────────────────────────
function BrokenCarousel() {
  const [idx, setIdx] = useState(0);
  const [ghost, setGhost] = useState<null | "left" | "right">(null);

  const goNext = () => {
    if (idx >= SLIDES.length - 1) return;
    setGhost("right");
    setTimeout(() => setGhost(null), 500);
    setTimeout(() => setIdx(i => i + 1), 80);
  };
  const goPrev = () => {
    if (idx <= 0) return;
    setGhost("left");
    setTimeout(() => setGhost(null), 500);
    setTimeout(() => setIdx(i => i - 1), 80);
  };

  const slide = SLIDES[idx];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Ghost overshoot artifact */}
      {ghost && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: SLIDES[ghost === "right" ? Math.min(idx + 1, SLIDES.length - 1) : Math.max(idx - 1, 0)].bg,
          animation: ghost === "right" ? "overshoot-ghost-r 0.5s ease forwards" : "overshoot-ghost-l 0.5s ease forwards",
          zIndex: 3,
          opacity: 0.6,
        }} />
      )}

      {/* Slide content */}
      <div
        key={idx}
        style={{
          position: "absolute",
          inset: 0,
          background: slide.bg,
          padding: "20px 20px 16px",
          display: "flex",
          flexDirection: "column",
          animation: "slide-jerk 0.4s cubic-bezier(0.4,0,1,1)",
        }}
      >
        <SlideContent slide={slide} />
      </div>

      <CarouselControls idx={idx} onPrev={goPrev} onNext={goNext} />
    </div>
  );
}

// ── Fixed carousel (smooth spring) ───────────────────────────────────────
function FixedCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<"left" | "right" | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const goNext = () => {
    if (idx >= SLIDES.length - 1) return;
    setDir("right");
    setAnimKey(k => k + 1);
    setIdx(i => i + 1);
  };
  const goPrev = () => {
    if (idx <= 0) return;
    setDir("left");
    setAnimKey(k => k + 1);
    setIdx(i => i - 1);
  };

  const slide = SLIDES[idx];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        key={animKey}
        style={{
          position: "absolute",
          inset: 0,
          background: slide.bg,
          padding: "20px 20px 16px",
          display: "flex",
          flexDirection: "column",
          animation: dir === "right"
            ? "slide-in-right 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : dir === "left"
            ? "slide-in-left 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : "none",
        }}
      >
        <SlideContent slide={slide} />
      </div>

      <CarouselControls idx={idx} onPrev={goPrev} onNext={goNext} />
    </div>
  );
}

function SlideContent({ slide }: { slide: typeof SLIDES[0] }) {
  return (
    <>
      {/* Tag */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--font-mono), monospace",
        fontSize: "0.46rem",
        letterSpacing: "0.2em",
        color: slide.accent,
        border: `1px solid ${slide.accent}44`,
        padding: "3px 8px",
        alignSelf: "flex-start",
        marginBottom: 10,
      }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: slide.accent, display: "inline-block" }} />
        {slide.tag}
      </div>

      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{slide.icon}</span>
        <div>
          <div style={{
            fontFamily: "var(--font-bebas), 'Impact', sans-serif",
            fontSize: "1.1rem",
            letterSpacing: "0.04em",
            color: "#f0f0f0",
            lineHeight: 1,
          }}>{slide.title}</div>
          <div style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.5rem",
            color: "rgba(240,240,240,0.35)",
            letterSpacing: "0.12em",
            marginTop: 2,
          }}>{slide.subtitle}</div>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: "0.62rem",
        color: "rgba(240,240,240,0.45)",
        lineHeight: 1.6,
        marginBottom: "auto",
        flex: 1,
      }}>{slide.desc}</p>

      {/* Price + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{
          fontFamily: "var(--font-bebas), 'Impact', sans-serif",
          fontSize: "1.2rem",
          color: "#f0f0f0",
          letterSpacing: "0.04em",
        }}>{slide.price}</span>
        <button style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "6px 14px",
          background: slide.accent,
          color: "#000",
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
        }}>{slide.cta}</button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 10 }}>
        {SLIDES.map((s, i) => (
          <span key={i} style={{
            width: i === SLIDES.indexOf(slide) ? 14 : 4,
            height: 4,
            background: i === SLIDES.indexOf(slide) ? slide.accent : "rgba(240,240,240,0.15)",
            borderRadius: 2,
            transition: "width 0.3s, background 0.3s",
            display: "inline-block",
          }} />
        ))}
      </div>
    </>
  );
}

function CarouselControls({ idx, onPrev, onNext }: { idx: number; onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <button
        onClick={onPrev}
        disabled={idx === 0}
        style={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          width: 28,
          height: 28,
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(240,240,240,0.12)",
          color: idx === 0 ? "rgba(240,240,240,0.15)" : "rgba(240,240,240,0.7)",
          cursor: idx === 0 ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.7rem",
          zIndex: 10,
          backdropFilter: "blur(4px)",
        }}
      >‹</button>
      <button
        onClick={onNext}
        disabled={idx === SLIDES.length - 1}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          width: 28,
          height: 28,
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(240,240,240,0.12)",
          color: idx === SLIDES.length - 1 ? "rgba(240,240,240,0.15)" : "rgba(240,240,240,0.7)",
          cursor: idx === SLIDES.length - 1 ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.7rem",
          zIndex: 10,
          backdropFilter: "blur(4px)",
        }}
      >›</button>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function DemoVisual() {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<"broken" | "fixed">("broken");
  const ref = useRef<HTMLDivElement>(null);

  const { out: diagText, done: diagDone } = useTypewriter(ANALYSIS.what_i_see, 700, 15, visible);
  const { out: causeText, done: causeDone } = useTypewriter(ANALYSIS.root_cause, 2600, 13, visible);
  const { out: fixText, done: fixDone } = useTypewriter(ANALYSIS.fix_after, 4600, 11, visible);

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

  // Auto-flip to fixed tab after full analysis revealed
  useEffect(() => {
    if (!fixDone) return;
    const t = setTimeout(() => setTab("fixed"), 1200);
    return () => clearTimeout(t);
  }, [fixDone]);

  return (
    <div
      ref={ref}
      style={{
        maxWidth: 980,
        margin: "3rem auto 0",
        width: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* Window bar */}
      <div style={{
        background: "#111",
        border: "1px solid rgba(240,240,240,0.1)",
        borderBottom: "none",
        padding: "9px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        {["#ff5f56","#ffbd2e","#27c93f"].map((c, i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.75, display: "inline-block" }} />
        ))}
        <span style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.5rem",
          color: "rgba(240,240,240,0.2)",
          letterSpacing: "0.12em",
          flex: 1,
          marginLeft: 6,
        }}>
          motif · {ANALYSIS.file} · {ANALYSIS.frames} frames · {ANALYSIS.model}
        </span>
        <span style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.46rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(134,239,172,0.55)",
          border: "1px solid rgba(134,239,172,0.18)",
          padding: "2px 8px",
        }}>
          {ANALYSIS.confidence} confidence
        </span>
      </div>

      {/* Body: 3 columns */}
      <div className="demo-main-cols" style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr",
        border: "1px solid rgba(240,240,240,0.1)",
        minHeight: 400,
      }}>

        {/* ── Col 1: Live carousel ── */}
        <div style={{
          borderRight: "1px solid rgba(240,240,240,0.08)",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(240,240,240,0.08)" }}>
            {(["broken","fixed"] as const).map(v => (
              <button
                key={v}
                onClick={() => setTab(v)}
                style={{
                  flex: 1,
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "9px 0",
                  background: tab === v
                    ? v === "broken" ? "rgba(239,68,68,0.06)" : "rgba(134,239,172,0.06)"
                    : "transparent",
                  color: tab === v
                    ? v === "broken" ? "rgba(239,68,68,0.85)" : "rgba(134,239,172,0.85)"
                    : "rgba(240,240,240,0.2)",
                  border: "none",
                  borderBottom: tab === v
                    ? `2px solid ${v === "broken" ? "rgba(239,68,68,0.55)" : "rgba(134,239,172,0.55)"}`
                    : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {v === "broken" ? "✕ broken" : "✓ fixed"}
              </button>
            ))}
          </div>

          {/* Carousel viewport */}
          <div style={{ flex: 1, position: "relative", minHeight: 280 }}>
            {tab === "broken" ? <BrokenCarousel /> : <FixedCarousel />}

            {/* Bug badge */}
            {tab === "broken" && (
              <div style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.42rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(239,68,68,0.7)",
                border: "1px solid rgba(239,68,68,0.25)",
                padding: "3px 7px",
                background: "rgba(239,68,68,0.06)",
                zIndex: 20,
              }}>
                ⚠ overshoot
              </div>
            )}
            {tab === "fixed" && (
              <div style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.42rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(134,239,172,0.7)",
                border: "1px solid rgba(134,239,172,0.2)",
                padding: "3px 7px",
                background: "rgba(134,239,172,0.05)",
                zIndex: 20,
              }}>
                ✓ smooth
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div style={{
            padding: "8px 14px",
            borderTop: "1px solid rgba(240,240,240,0.06)",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.46rem",
            color: "rgba(240,240,240,0.16)",
            letterSpacing: "0.08em",
          }}>
            click ‹ › to see the {tab === "broken" ? "overshoot" : "smooth transition"}
          </div>
        </div>

        {/* ── Col 2: Diagnosis ── */}
        <div style={{
          borderRight: "1px solid rgba(240,240,240,0.08)",
          background: "#080808",
          padding: "1.3rem 1.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}>
          <div style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.46rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.16)",
            paddingBottom: "0.7rem",
            borderBottom: "1px solid rgba(240,240,240,0.06)",
          }}>
            motif · diagnosis
          </div>

          <div>
            <div style={LABEL}>WHAT I SEE</div>
            <div style={{ ...VAL, minHeight: 60 }}>
              {diagText}
              {!diagDone && diagText.length > 0 && <Cursor />}
            </div>
          </div>

          <div>
            <div style={LABEL}>ROOT CAUSE</div>
            <div style={{ ...VAL, color: "rgba(252,165,165,0.8)", minHeight: 42 }}>
              {causeText}
              {causeText.length > 0 && causeText.length < ANALYSIS.root_cause.length && (
                <Cursor color="rgba(252,165,165,0.5)" />
              )}
            </div>
          </div>

          <div>
            <div style={LABEL}>FIX</div>
            <div style={{
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontSize: "0.6rem",
              color: "rgba(134,239,172,0.9)",
              background: "rgba(134,239,172,0.05)",
              border: "1px solid rgba(134,239,172,0.12)",
              padding: "7px 10px",
              lineHeight: 1.55,
              minHeight: 30,
              wordBreak: "break-all",
            }}>
              {fixText}
              {fixText.length > 0 && fixText.length < ANALYSIS.fix_after.length && (
                <Cursor color="rgba(134,239,172,0.5)" />
              )}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={LABEL}>CONFIDENCE</div>
            <span style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              color: "rgba(134,239,172,0.75)",
              border: "1px solid rgba(134,239,172,0.2)",
              padding: "2px 10px",
            }}>{ANALYSIS.confidence}</span>
          </div>
        </div>

        {/* ── Col 3: Code diff ── */}
        <div style={{
          background: "#060606",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            padding: "8px 14px",
            borderBottom: "1px solid rgba(240,240,240,0.06)",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.46rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.16)",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <span>{ANALYSIS.file}</span>
            <span style={{ color: tab === "broken" ? "rgba(239,68,68,0.5)" : "rgba(134,239,172,0.5)" }}>
              {tab === "broken" ? "before" : "after motif"}
            </span>
          </div>

          <CodeBlock code={tab === "broken" ? CODE_BROKEN : CODE_FIXED} variant={tab} />

          <div style={{
            padding: "9px 14px",
            borderTop: "1px solid rgba(240,240,240,0.06)",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.48rem",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}>
            <span style={{ color: "rgba(239,68,68,0.55)" }}>− linear</span>
            <span style={{ color: "rgba(240,240,240,0.12)" }}>·</span>
            <span style={{ color: "rgba(134,239,172,0.55)" }}>+ cubic-bezier(0.34, 1.56, 0.64, 1)</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes overshoot-ghost-r {
          0%   { transform: translateX(110%); opacity: 0.5; }
          40%  { transform: translateX(-8%); opacity: 0.4; }
          70%  { transform: translateX(3%); opacity: 0.2; }
          100% { transform: translateX(0%); opacity: 0; }
        }
        @keyframes overshoot-ghost-l {
          0%   { transform: translateX(-110%); opacity: 0.5; }
          40%  { transform: translateX(8%); opacity: 0.4; }
          70%  { transform: translateX(-3%); opacity: 0.2; }
          100% { transform: translateX(0%); opacity: 0; }
        }
        @keyframes slide-jerk {
          0%   { transform: translateX(60%); }
          55%  { transform: translateX(-6%); }
          75%  { transform: translateX(3%); }
          100% { transform: translateX(0); }
        }
        @keyframes slide-in-right {
          0%   { transform: translateX(60%); opacity: 0.6; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-left {
          0%   { transform: translateX(-60%); opacity: 0.6; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes demo-cursor-blink {
          0%,100% { opacity: 0.7; }
          50%     { opacity: 0; }
        }
        @media (max-width: 860px) {
          .demo-main-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// style constants
const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: "0.44rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "rgba(240,240,240,0.2)",
  marginBottom: "0.3rem",
};

const VAL: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "rgba(240,240,240,0.72)",
  lineHeight: 1.62,
};
