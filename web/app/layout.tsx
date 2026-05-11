import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const dm = DM_Sans({
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "motif — your AI watches bugs move",
  description:
    "MCP server that lets AI coding assistants watch a video or GIF of a UI bug and return a diagnosis + code fix. Powered by Gemini 2.5 Flash.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${mono.variable} ${dm.variable} antialiased`}
    >
      <body style={{ fontFamily: "var(--font-dm), sans-serif" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
