import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
