import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/*  ⚠️ 只有這一行需要你改。
 *  GitHub Pages 會把網站放在 https://<你的帳號>.github.io/<repo 名稱>/
 *  所以 base 必須等於 "/<repo 名稱>/"，前後的斜線都不能少。
 *  如果你的 repo 叫 quantum-xp，就維持原樣。
 *  如果 repo 名稱是 <你的帳號>.github.io，請改成 "/"。
 */
const REPO_NAME = "quantum-xp";

export default defineConfig({
  base: process.env.VITE_BASE ?? `/${REPO_NAME}/`,
  plugins: [react()],
  build: { outDir: "dist", sourcemap: false },
});
