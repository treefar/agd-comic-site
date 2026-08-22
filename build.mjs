// X1 打包腳本：把 6 個 jsx 依載入順序合併，esbuild 編成 bundle.js
// 用法：node build.mjs   （需要 npx esbuild 可用；改完任何 .jsx 後執行，再 bump index.html 的 ?v=）
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const ORDER = [
  "tweaks-panel.jsx",
  "comic-components.jsx",
  "chapters-1.jsx",
  "chapters-2.jsx",
  "pages.jsx",
  "app.jsx",
];

const merged = ORDER.map((f) => readFileSync(f, "utf8")).join("\n;\n");
writeFileSync("_all.tmp.jsx", merged);
execSync("npx --yes esbuild _all.tmp.jsx --loader:.jsx=jsx --minify --target=es2018 --outfile=bundle.js --log-level=warning", { stdio: "inherit" });
execSync(process.platform === "win32" ? "del _all.tmp.jsx" : "rm _all.tmp.jsx", { stdio: "ignore", shell: true });
console.log("bundle.js 已更新 — 記得 bump index.html 的 ?v= 版本字串");
