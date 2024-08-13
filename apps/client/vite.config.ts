import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.VITE_FRONTEND_PORT as string) || 3001,
  },
});
