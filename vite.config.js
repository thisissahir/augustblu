import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        // landing page at /  (BLU_OS boot/login/film)
        main: resolve(__dirname, "index.html"),
        // the Win98 desktop app at /desktop
        desktop: resolve(__dirname, "desktop/index.html"),
        // the Blu Blocks game page at /play (embeds public/blu-blocks.html)
        play: resolve(__dirname, "play/index.html"),
      },
    },
  },
});
