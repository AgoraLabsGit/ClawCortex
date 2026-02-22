import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClawCortex — AI Agent Workspace",
  description: "Operating system for autonomous AI teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-white dark:bg-black text-black dark:text-white">
        {children}
      </body>
    </html>
  );
}
