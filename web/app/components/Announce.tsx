export default function Announce() {
  return (
    <div
      style={{
        background: "#161616",
        borderBottom: "1px solid rgba(240,240,240,0.1)",
        textAlign: "center",
        padding: "8px 16px",
        fontFamily: "var(--font-mono), monospace",
        fontSize: "0.68rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(240,240,240,0.5)",
      }}
    >
      Now in Beta — MCP server for AI-powered UI bug diagnosis
      <a
        href="#install"
        style={{
          color: "var(--fg)",
          marginLeft: 10,
          textDecoration: "underline",
          textUnderlineOffset: 3,
          textDecorationColor: "rgba(240,240,240,0.35)",
        }}
      >
        Install now →
      </a>
    </div>
  );
}
