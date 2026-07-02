import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 静的デプロイ(GitHub Pages 等)前提。base は相対パスにしてサブパス配信でも動くようにする。
export default defineConfig({
  plugins: [react()],
  base: "./",
});
