import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
<<<<<<< HEAD
  base: './', // ✅ This is needed for static hosting like Hostinger
=======
>>>>>>> 0235d863782fec9669b955c7da32a84ab33c3ec7
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
