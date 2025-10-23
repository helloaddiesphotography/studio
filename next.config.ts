import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  // In a future version of Next.js, the dev server will require this to be configured.
  // We are allowing all origins here to simplify the developer experience,
  // as the origin can be different depending on the developer's local setup.
  // For more details, see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  experimental: {
    allowedDevOrigins: ['**'],
  },
};

export default nextConfig;
