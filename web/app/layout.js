"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const bebas = (0, google_1.Bebas_Neue)({
    weight: "400",
    variable: "--font-bebas",
    subsets: ["latin"],
});
const mono = (0, google_1.JetBrains_Mono)({
    weight: ["400", "500", "700"],
    variable: "--font-mono",
    subsets: ["latin"],
});
const dm = (0, google_1.DM_Sans)({
    weight: ["300", "400", "500", "600"],
    variable: "--font-dm",
    subsets: ["latin"],
});
exports.metadata = {
    title: "motif — your AI watches bugs move",
    description: "MCP server that lets AI coding assistants watch a video or GIF of a UI bug and return a diagnosis + code fix. Powered by Gemini 1.5 Pro.",
};
function RootLayout({ children, }) {
    return (<html lang="en" className={`${bebas.variable} ${mono.variable} ${dm.variable} antialiased`}>
      <body style={{ fontFamily: "var(--font-dm), sans-serif" }}>{children}</body>
    </html>);
}
//# sourceMappingURL=layout.js.map