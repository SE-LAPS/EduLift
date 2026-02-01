/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization configuration
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'production', // Required for static export
  },
  
  // Environment variables
  env: {
    API_URL: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  
  // Static export configuration for cPanel deployment
  // Uncomment this for static export if Node.js server is not available
  // output: 'export',
  // trailingSlash: true,
  
  // Development proxy only
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*', // Proxy to Backend
        },
      ];
    }
    return [];
  },
}

module.exports = nextConfig
