import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  server: {
    hmr: true,
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  base: "./",
  build: {
    outDir: "dist",
  },
});
