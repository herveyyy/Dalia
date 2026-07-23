/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  // Unique prefix so this zone's assets don't clash with `web`
  assetPrefix: "/docs-static",
};

export default nextConfig;
