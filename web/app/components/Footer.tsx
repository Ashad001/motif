"use client";

export default function Footer() {
  const mono: React.CSSProperties = {
    fontFamily: "var(--font-mono), monospace",
  };

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "2.4rem 6%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem",
      }}
    >
      <div>
        <div style={{ ...mono, fontSize: "0.95rem", fontWeight: 700, color: "var(--fg)" }}>
          motif.
        </div>
        <div
          style={{
            ...mono,
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.22)",
            marginTop: 4,
          }}
        >
          motion + fix · the pattern that repeats until you find it
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {[
          { label: "GitHub", href: "https://github.com/Ashad001/motif" },
          { label: "Get API Key", href: "https://ai.google.dev" },
          { label: "Docs", href: "#how" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{
              ...mono,
              fontSize: "0.68rem",
              color: "rgba(240,240,240,0.35)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "var(--fg)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "rgba(240,240,240,0.35)")
            }
          >
            {label}
          </a>
        ))}
      </div>

      <div
        style={{
          ...mono,
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(240,240,240,0.2)",
        }}
      >
        MIT License
      </div>
    </footer>
  );
}
