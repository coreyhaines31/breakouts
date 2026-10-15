import type { Metadata, Viewport } from "next";
import { Ambient } from "@/components/ambient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Choose Your Breakout",
  description: "Pick the breakout session you'd like to attend tonight.",
};

export const viewport: Viewport = {
  themeColor: "#eef1f7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="relative isolate min-h-full flex flex-col overflow-x-hidden">
        <Ambient />
        {children}
      </body>
    </html>
  );
}
