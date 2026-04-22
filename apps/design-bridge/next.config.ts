import type { NextConfig } from "next";
import path from "path";

const monorepoRoot = path.resolve(process.cwd(), "..", "..");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@alation/fabric-theme-morpheus",
    "@alation/fabric-types",
    "@alation/icons-neo",
    "@alation/util",
  ],
  turbopack: {
    root: monorepoRoot,
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
