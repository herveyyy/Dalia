import path from "path";
import { fileURLToPath } from "url";
import { rewritesFromZones } from "../../zones.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/db", "@repo/auth"],
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
  async rewrites() {
    return rewritesFromZones();
  },
};

export default nextConfig;
