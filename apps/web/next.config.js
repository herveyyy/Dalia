import { rewritesFromZones } from "../../zones.config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/db", "@repo/auth"],
  async rewrites() {
    return rewritesFromZones();
  },
};

export default nextConfig;
