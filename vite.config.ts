import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      lib: "/lib",
      "lib/*": "/lib/*",
      store: "/src/store",
      components: "/src/components",
    },
  },
  server: {
    allowedHosts: ["640f-200-117-56-63.ngrok-free.app"],
  },
});
