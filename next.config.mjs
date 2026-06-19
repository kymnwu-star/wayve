/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['google-spreadsheet', 'google-auth-library'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jasonteale.com',
      },
      {
        protocol: 'https',
        hostname: 'www.lemon8-app.com',
      },
      {
        protocol: 'https',
        hostname: 'ak-d.tripcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      }
    ],
  },
};

export default nextConfig;
