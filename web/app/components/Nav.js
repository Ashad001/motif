"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Nav;
function Nav() {
    return (<nav style={{
            borderBottom: "1px solid var(--border)",
            background: "rgba(10,10,10,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 200,
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 6%",
        }}>
      {/* Logo */}
      <a href="#" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "var(--fg)",
            textDecoration: "none",
            display: "flex",
            alignItems: "baseline",
            gap: 2,
        }}>
        motif
        <sup style={{
            fontSize: "0.45rem",
            color: "rgba(240,240,240,0.4)",
            letterSpacing: "0.15em",
            marginLeft: 2,
        }}>
          MCP
        </sup>
      </a>

      {/* Links */}
      <ul style={{
            display: "flex",
            alignItems: "center",
            gap: "2.4rem",
            listStyle: "none",
        }} className="hidden md:flex">
        {[
            { label: "How It Works", href: "#how" },
            { label: "Output", href: "#output" },
            { label: "Install", href: "#install" },
            { label: "GitHub ↗", href: "https://github.com/Ashad001/motif" },
        ].map(({ label, href }) => (<li key={label}>
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.68rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(240,240,240,0.4)",
                textDecoration: "none",
                transition: "color 0.2s",
            }} onMouseEnter={(e) => (e.target.style.color = "var(--fg)")} onMouseLeave={(e) => (e.target.style.color = "rgba(240,240,240,0.4)")}>
              {label}
            </a>
          </li>))}
      </ul>

      {/* CTA */}
      <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            padding: "8px 16px",
            background: "var(--fg)",
            color: "var(--bg)",
            textDecoration: "none",
            transition: "opacity 0.2s",
            whiteSpace: "nowrap",
        }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
        Get API Key
      </a>
    </nav>);
}
//# sourceMappingURL=Nav.js.map