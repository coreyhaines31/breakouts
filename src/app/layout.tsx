import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Choose Your Breakout",
  description: "Pick the breakout session you'd like to attend tonight.",
};

export const viewport: Viewport = {
  themeColor: "#f5f5f7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
