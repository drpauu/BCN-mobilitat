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
      <head>
        <link rel="dns-prefetch" href="//a.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="//b.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="//c.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="//d.basemaps.cartocdn.com" />
        <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://c.basemaps.cartocdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://d.basemaps.cartocdn.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
