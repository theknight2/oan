/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    // The next settings have changed in Next.js 15
  },
  serverExternalPackages: [],
  images: {
    domains: ['xgbdwdlmtdmqypggocfr.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.*'],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Uncomment to debug
  // webpack: (config, { isServer }) => {
  //   // Only on the server side
  //   if (isServer) {
  //     console.log('Webpack config:', JSON.stringify(config, null, 2));
  //   }
  //   return config;
  // },
};

module.exports = nextConfig; 