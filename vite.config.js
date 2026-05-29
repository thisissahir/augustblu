import { defineConfig } from "vite";
export default defineConfig({
  // single-page static site; assets in /public served at root
  build: { outDir: "dist", assetsInlineLimit: 0 },
});
