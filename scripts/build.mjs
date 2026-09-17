// 建置：把 6 支 JSX 預先編譯成單一 production bundle，並用 react-dom/server 預渲染首頁到 dist/index.html
// 用法：npm run build
// 原始 index.html 保留為「開發版」（瀏覽器端 Babel），直接開就能預覽；dist/ 才是發布版。
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// --dev：React development 版、不壓縮，輸出到 .build-dev/（只供本機查 hydration 警告，不發布）
const DEV = process.argv.includes("--dev");
const DIST = path.join(ROOT, DEV ? ".build-dev" : "dist");
const NODE_ENV = JSON.stringify(DEV ? "development" : "production");
const TMP = path.join(ROOT, ".build-tmp");

// 載入順序必須和 index.html 的 text/babel script 一致（彼此靠全域名稱串接）
const SOURCES = ["tweaks-panel.jsx", "comic-components.jsx", "chapters-1.jsx", "chapters-2.jsx", "pages.jsx", "app.jsx"];
// 首頁一定要出現在預渲染 HTML 的章節錨點
const REQUIRED_IDS = ["hero", "news", "about", "works", "faculty", "labs", "join", "contact"];
// 不複製進 dist 的來源/建置檔
const EXCLUDE = new Set([
  ".git", ".github", ".gitignore", "node_modules", "dist", ".build-dev", "scripts", ".build-tmp", "_prerender-check",
  "package.json", "package-lock.json", "index.html", "README.md", "CLAUDE.md", "AGENTS.md", "docs", "uploads", ".claude",
  ...SOURCES,
]);

const fail = (msg) => { console.error("[build] 失敗：" + msg); process.exit(1); };

// 讀全部 JSX，依序接成同一個模組（等同原本多支 classic script 共用全域作用域）
const body = SOURCES.map((f) => `// ---- ${f} ----\n` + fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n\n");

const CLIENT_PRELUDE = `import React from "react";
import * as ReactDOM from "react-dom/client";
`;
// 伺服端沒有 window/document：給最小替身，只供 render 階段讀到的屬性（effect 不會在伺服端執行）
const SERVER_PRELUDE = `import React from "react";
import { renderToString } from "react-dom/server";
const ReactDOM = {};
const window = { location: { hash: "" }, parent: { postMessage() {} }, __AGD_PRERENDERED__: true };
`;
const SERVER_EPILOGUE = `
export const renderApp = () => renderToString(React.createElement(App));
`;

// 清空輸出資料夾的內容（不刪資料夾本身：Windows 上若有本機伺服器開在裡面，刪資料夾會 EPERM）
fs.mkdirSync(DIST, { recursive: true });
for (const n of fs.readdirSync(DIST)) fs.rmSync(path.join(DIST, n), { recursive: true, force: true });
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });

const common = { bundle: true, jsx: "transform", charset: "utf8", logLevel: "warning", legalComments: "none" };

// 1) 伺服端 bundle → 預渲染
await build({
  ...common,
  stdin: { contents: SERVER_PRELUDE + body + SERVER_EPILOGUE, loader: "jsx", resolveDir: ROOT, sourcefile: "ssr-entry.jsx" },
  platform: "node", format: "cjs",
  define: { "process.env.NODE_ENV": NODE_ENV },
  outfile: path.join(TMP, "ssr.cjs"),
});
const { renderApp } = createRequire(import.meta.url)(path.join(TMP, "ssr.cjs"));
const appHtml = renderApp();
for (const id of REQUIRED_IDS) if (!appHtml.includes(`id="${id}"`)) fail(`預渲染結果缺少章節 #${id}`);

// 2) 瀏覽器 bundle（React production，一併打包，不再依賴 unpkg 與 Babel）
const result = await build({
  ...common,
  stdin: { contents: CLIENT_PRELUDE + body, loader: "jsx", resolveDir: ROOT, sourcefile: "client-entry.jsx" },
  platform: "browser", format: "iife", target: ["es2019"], minify: !DEV,
  define: { "process.env.NODE_ENV": NODE_ENV },
  entryNames: "app-[hash]", outdir: DIST, write: true, metafile: true,
});
const bundleName = path.basename(Object.keys(result.metafile.outputs).find((o) => o.endsWith(".js")));

// 3) 組 HTML：以原 index.html 為模板，<head> 一字不動，只換 root 內容與 script 載入方式
let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const scriptRe = /[ \t]*<script\b[^>]*\bsrc="https:\/\/unpkg\.com\/[^"]*"[^>]*><\/script>\r?\n?/g;
const babelRe = /[ \t]*<script type="text\/babel"[^>]*><\/script>\r?\n?/g;
const nUnpkg = (html.match(scriptRe) || []).length;
const nBabel = (html.match(babelRe) || []).length;
if (nUnpkg !== 3) fail(`預期 3 個 unpkg script，實際 ${nUnpkg}`);
if (nBabel !== SOURCES.length) fail(`預期 ${SOURCES.length} 個 text/babel script，實際 ${nBabel}（SOURCES 清單要和 index.html 同步）`);
const MARK = "<!--__AGD_BUNDLE__-->";
html = html.replace(scriptRe, "").replace(babelRe, "");
// 把 bundle 放在原本 BUILD_VER 註解的位置（iframe bridge 之前，與原順序相同）
const verComment = /<!-- BUILD_VER:[^\n]*-->\r?\n/;
if (!verComment.test(html)) fail("找不到 BUILD_VER 註解，無法定位 script 插入點");
html = html.replace(verComment, MARK + "\n");
html = html.replace(MARK, `<script>window.__AGD_PRERENDERED__ = true;</script>\n<script src="${bundleName}"></script>`);
// unpkg preconnect 已無用
html = html.replace(/[ \t]*<!-- 預先連線到 React \/ Babel CDN[^\n]*-->\r?\n/, "").replace(/[ \t]*<link rel="preconnect" href="https:\/\/unpkg\.com"[^>]*\/>\r?\n/, "");
if (!html.includes('<div id="root"></div>')) fail("模板找不到 <div id=\"root\"></div>");
// styles.css 的手機版規則大量用 [style*="font-size: 32"]、[style*="border: 3px solid"] 這類選擇器，
// 依賴「瀏覽器 CSSOM 序列化」的格式（冒號後有空白）。renderToString 輸出的是 font-size:32px（無空白），
// hydrate 也不會改寫 style 屬性 → 手機版排版會跑掉。
// 解法：root 內容解析完立刻用瀏覽器自己的 el.style.cssText 重寫一次，格式與原版（React 在瀏覽器端設定 style）完全一致。
// 這段在 bundle 之前同步執行、首次繪製之前完成；只影響 style 屬性字串格式，不改任何值。
const STYLE_NORMALIZER = `<script>(function(){var n=document.getElementById("root").querySelectorAll("[style]");for(var i=0;i<n.length;i++){n[i].setAttribute("style",n[i].style.cssText)}})();</script>`;
// --no-style-normalize 只給本機查 hydration 用：React 18 dev 只印第一則 mismatch，正規化後的 style 字串會佔掉那一則
const NORMALIZE = !process.argv.includes("--no-style-normalize");
html = html.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>` + (NORMALIZE ? `\n${STYLE_NORMALIZER}` : ""));
fs.writeFileSync(path.join(DIST, "index.html"), html, "utf8");

// 4) 複製靜態資源：根目錄下 EXCLUDE 以外的全部（目前是 styles.css、data/、images/、.nojekyll；日後新增的資源資料夾自動帶上）
for (const name of fs.readdirSync(ROOT)) {
  if (EXCLUDE.has(name)) continue;
  fs.cpSync(path.join(ROOT, name), path.join(DIST, name), { recursive: true });
}
fs.rmSync(TMP, { recursive: true, force: true });

const kb = (n) => (n / 1024).toFixed(1) + " KB";
console.log(`[build] 完成：${path.relative(ROOT, DIST)}/index.html ${kb(Buffer.byteLength(html))}、${bundleName} ${kb(fs.statSync(path.join(DIST, bundleName)).size)}`);
