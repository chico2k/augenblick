import type { MetadataRoute } from "next";

/**
 * PWA Manifest for Augenblick Office
 * Native Next.js 15 manifest support (replaces next-pwa)
 *
 * @see https://nextjs.org/docs/app/guides/progressive-web-apps
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Augenblick Office",
    short_name: "Office",
    description: "Kundenverwaltung und Terminplanung für Augenblick Chiemgau",
    start_url: "/office",
    scope: "/office",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d946ef",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
