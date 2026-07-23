import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  // Unique prefix so this zone's assets don't clash with `web`
  assetPrefix: "/docs-static",
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
