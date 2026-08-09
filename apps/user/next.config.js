/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  assetPrefix: "/user-static",
};

export default nextConfig;
