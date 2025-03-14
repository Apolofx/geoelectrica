import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      manifest: {
        name: "Consolani Geoeléctrica",
        short_name: "Geoeléctrica",
        description: "Aplicación web para Consolani Geoeléctrica",
        theme_color: "#000000",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        lang: "es",
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
      },
    }),
  ],
  resolve: {
    alias: {
      lib: "/lib",
      "lib/*": "/lib/*",
      store: "/src/store",
      components: "/src/components",
    },
  },
});
