// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

import { withAxiom } from "next-axiom";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * Externalize pdfkit, fontkit, and handlebars to prevent bundling issues.
   * These packages have native file dependencies that need to be loaded at runtime.
   */
  serverExternalPackages: ["pdfkit", "fontkit", "handlebars"],

  /**
   * App Router is enabled by default in Next.js 13.4+.
   * Note: i18n config is commented out as it's not compatible with App Router.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
};

export default withPWA(withAxiom(config));