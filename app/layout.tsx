import type { Metadata } from "next";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

export const metadata: Metadata = {
  title: "BCN Mobility Assistant",
  description: "Assistent de mobilitat urbana de Barcelona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className="dark">
      <body>{children}</body>
    </html>
  );
}
