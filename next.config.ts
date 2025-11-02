import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // từ react 18 hay nextjs 16 nó có hổi trợ cái babel mới để biên dịch react nhanh hơn
  // và nó reduce render những cái không cần thiết
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true
  },

  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*'
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*'
      }
    ]
  },

  // Cấu hình để cho phép load ảnh từ Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true
}

export default nextConfig
