import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/openapi-query",
  plugins: [react(), nodePolyfills(
    {
      globals: {
        Buffer: true,
      },
      include: ["buffer"],
    }
  )],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
