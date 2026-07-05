import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ffellonics",
    short_name: "Ffellonics",
    description:
      "A journal of geometric thought — topology, polyhedra, tessellation, and the mathematics of form.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f6f2",
    theme_color: "#0f2240",
    orientation: "portrait",
    icons: [
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
