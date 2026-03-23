import type { NextConfig } from "next";

const distDir = process.platform === "win32" ? ".next-local" : ".next";

const nextConfig: NextConfig = {
  distDir,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "maplibre-gl$": "maplibre-gl/dist/maplibre-gl.js",
    };
    return config;
  },
};

export default nextConfig;
