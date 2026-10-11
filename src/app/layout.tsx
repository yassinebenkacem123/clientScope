import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClientScope",
  description: "Client project scope and delivery management",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
