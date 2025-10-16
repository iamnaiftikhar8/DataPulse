/** @type {import('next').NextConfig} */
const nextConfig = {
   eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore lint errors on Vercel build
  },
  async rewrites() {
    return [
      { source: '/api/:path*',  destination: 'http://localhost:8000/api/:path*' },
      { source: '/auth/:path*', destination: 'http://localhost:8000/api/auth/:path*' },
    ];
  },
};
module.exports = nextConfig;
