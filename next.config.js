/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    instrumentationHook: false,
    serverComponentsExternalPackages: [],
    optimizePackageImports: ['lucide-react'],
    optimizeCss: true,
  },
  images: {
    domains: ['xgbdwdlmtdmqypggocfr.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    minimumCacheTTL: 60, // 60 seconds
    deviceSizes: [640, 750, 1080, 1280], // Reduced set of sizes
    imageSizes: [64, 128, 256], // Reduced set of sizes
  },
  webpack: (config, { isServer }) => {
    // Reduce chunk size for better performance
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 90000,
        cacheGroups: {
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](?!@ai-sdk)(?!@anthropic)(?!@supabase)/,
            priority: 40,
            reuseExistingChunk: true,
          },
          aiComponents: {
            name: 'ai-components',
            test: /[\\/]node_modules[\\/](@ai-sdk|@anthropic)/,
            priority: 30,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        }
      };
    }
    return config;
  },
};

module.exports = nextConfig; 