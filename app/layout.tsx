import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// Metadata helps browsers and search engines understand this application.
export const metadata: Metadata = {
  title: "Sahakari Nexus",
  description: "AI Powered Cooperative Intelligence Platform",
};

type RootLayoutProps = {
  // `children` represents the page currently being displayed.
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}