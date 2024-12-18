import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Editor",
  description: "A NextJs Markdown editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
