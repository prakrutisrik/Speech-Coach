import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speech Coach",
  description: "Practice public speaking with timed prompts and AI feedback."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}