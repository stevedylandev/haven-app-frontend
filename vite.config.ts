import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": "/src",
      buffer: "buffer",
    },
  },
  server: {
    proxy: {
      "/audius": {
        target: "https://api.audius.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/audius/, ""),
      },
    },
  },
});
