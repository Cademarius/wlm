import withPWA from "next-pwa";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const baseConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ton-domaine.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const nextConfig = withPWA({
  dest: "public",
  disable: isDev,
})(baseConfig);

export default nextConfig;