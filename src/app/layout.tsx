import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FairScale Trust",
  description: "Onchain trust, made legible.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grain">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
