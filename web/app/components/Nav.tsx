"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "How It Works", href: "#how" },
  { label: "Output", href: "#output" },
  { label: "Install", href: "#install" },
  { label: "GitHub ↗", href: "https://github.com/Ashad001/motif" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        style={{
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
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "var(--fg)",
            textDecoration: "none",
            display: "flex",
            alignItems: "baseline",
            gap: 2,
          }}
        >
          motif
          <sup
            style={{
              fontSize: "0.45rem",
              color: "rgba(240,240,240,0.4)",
              letterSpacing: "0.15em",
              marginLeft: 2,
            }}
          >
            MCP
          </sup>
        </a>

        {/* Links — desktop */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.4rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgba(240,240,240,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--fg)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "rgba(240,240,240,0.4)")
                }
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          {/* CTA */}
          <a
            href="https://ai.google.dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{
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
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            Get API Key
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "block",
                width: 20,
                height: 1.5,
                background: "var(--fg)",
                transition: "transform 0.2s, opacity 0.2s",
                transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 20,
                height: 1.5,
                background: "var(--fg)",
                transition: "opacity 0.2s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 20,
                height: 1.5,
                background: "var(--fg)",
                transition: "transform 0.2s, opacity 0.2s",
                transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="flex md:hidden"
          style={{
            position: "fixed",
            top: 58,
            left: 0,
            right: 0,
            zIndex: 199,
            background: "rgba(10,10,10,0.97)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
            flexDirection: "column",
            padding: "1rem 6%",
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(240,240,240,0.5)",
                textDecoration: "none",
                padding: "0.85rem 0",
                borderBottom: "1px solid var(--border)",
                display: "block",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
