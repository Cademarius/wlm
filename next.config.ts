import withPWA from "next-pwa";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const baseConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {}, // Turbopack options (currently no known options to disable)
  },
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "ton-domaine.com",
      port: "",
      pathname: "/**"
    }
  ]
}
};

export default withPWA({
  dest: "public",
  disable: isDev, // désactive le service worker en développement
  register: true,
  skipWaiting: true,
})(baseConfig);
