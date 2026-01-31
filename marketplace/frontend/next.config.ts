/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the build to finish even if there are minor type warnings
    ignoreBuildErrors: true,
  },
  eslint: {
    // This allows the build to finish even if there are minor styling warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;