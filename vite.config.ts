import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `RIFT_BASE` lets the same build be served from a subpath (for example
// `/rift` inside the portfolio site) while the default stays at the root.
export default defineConfig({
  base: process.env.RIFT_BASE ?? "/",
  plugins: [react()],
});
