/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*',  destination: 'http://localhost:8000/api/:path*' },
      { source: '/auth/:path*', destination: 'http://localhost:8000/api/auth/:path*' },
    ];
  },
};
module.exports = nextConfig;
