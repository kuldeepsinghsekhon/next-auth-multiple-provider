/** @type {import("next").NextConfig} */
module.exports = {
  output: "standalone",
}
const nextConfig = {
  images: {
    domains: [
      'uwja77bygk2kgfqe.public.blob.vercel-storage.com'
    ]
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    return config
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "img-src 'self' blob: data: https://*",
            "media-src 'self' blob: data: https://*"
          ].join('; ')
        }
      ]
    }
  ]
}

module.exports = nextConfig