declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface PWAOptions {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    [key: string]: any;
  }

  function withPWA(options: PWAOptions): (config: NextConfig) => NextConfig;

  export default withPWA;
}
