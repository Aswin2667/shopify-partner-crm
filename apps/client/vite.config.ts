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
    host: process.env.HOST||"0.0.0.0",
    port: Number(process.env.PORT) || 3000,
  },
  preview:{
    host: process.env.HOST||"0.0.0.0",
    port: Number(process.env.PORT) || 3000,
  }
});