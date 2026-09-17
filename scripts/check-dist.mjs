// 發布前檢查：不執行 JavaScript，直接看 dist/index.html 的靜態文字是否完整
// 用法：npm run check（CI 在 build 之後跑；任一條件不過就以非 0 結束）
// 加 --report 會額外印出 h1/h2、前 300 字與原版 index.html 的字數對比
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = process.argv.includes("--report");

const decode = (s) => s
  .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, "&");

// 取 <body> 可見文字：去掉 script/style/template/svg 與所有標籤
export const visibleText = (html) => {
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, html])[1];
  return decode(body
    .replace(/<(script|style|template|svg|noscript)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ").trim();
};
const countChars = (t) => t.replace(/\s/g, "").length;
const headings = (html) => [...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)]
  .map((m) => `${m[1]}: ${decode(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()}`);
const headOf = (html) => (html.match(/<head>([\s\S]*?)<\/head>/i) || [, ""])[1];

const distHtml = fs.readFileSync(path.join(ROOT, "dist", "index.html"), "utf8");
const srcHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const text = visibleText(distHtml);
const errors = [];

// 1) 所有首頁章節都在靜態 HTML 裡
for (const id of ["hero", "news", "about", "works", "faculty", "labs", "join", "contact"]) {
  if (!distHtml.includes(`id="${id}"`)) errors.push(`缺少章節 #${id}`);
}
// 2) 靜態文字量下限（目前約數千字；掉到 1500 以下代表預渲染壞了）
if (countChars(text) < 1500) errors.push(`靜態文字只有 ${countChars(text)} 字`);
// 3) 不再依賴瀏覽器端 Babel / unpkg
if (/text\/babel|unpkg\.com|babel(\.min)?\.js/.test(distHtml)) errors.push("dist 仍引用 Babel 或 unpkg");
// 4) <head> 的 SEO 標記與原版一致（title、description、canonical、og:*、twitter:*）
const pick = (h) => (h.match(/<title>[\s\S]*?<\/title>|<meta (name="(description|keywords|author|twitter:[a-z:]+)"|property="og:[a-z:]+")[^>]*>|<link rel="canonical"[^>]*>/g) || []).join("\n");
if (pick(headOf(distHtml)) !== pick(headOf(srcHtml))) errors.push("<head> 的 title/meta/canonical 與原版 index.html 不一致");
if (!pick(headOf(distHtml)).includes('href="https://www.dgd.stu.edu.tw/"')) errors.push("canonical 遺失");
// 5) 手機版 CSS 依賴 CSSOM 格式的 style 屬性，正規化腳本必須緊接在 root 之後
if (!distHtml.includes('</div>\n<script>(function(){var n=document.getElementById("root").querySelectorAll("[style]")')) errors.push("缺少 root 之後的 style 正規化腳本（手機版排版會跑掉）");
// 6) bundle 檔存在
const bundle = (distHtml.match(/<script src="(app-[A-Z0-9]+\.js)"><\/script>/) || [])[1];
if (!bundle || !fs.existsSync(path.join(ROOT, "dist", bundle))) errors.push("找不到 app bundle");

if (REPORT) {
  const srcText = visibleText(srcHtml);
  const hs = headings(distHtml);
  console.log(`== h1~h6 標籤（h1/h2 共 ${hs.filter((h) => /^h[12]:/.test(h)).length} 個）==`);
  hs.forEach((h) => console.log("  " + h));
  console.log("== 章節標題（.chapter-header .title，原站以 div 呈現標題）==");
  [...distHtml.matchAll(/<div class="title h-display">([\s\S]*?)<\/div>/g)]
    .forEach((m) => console.log("  " + decode(m[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()));
  console.log("== 前 300 字 ==");
  console.log("  " + [...text].slice(0, 300).join(""));
  console.log("== 字數（去空白）==");
  console.log(`  原版 index.html：${countChars(srcText)} 字（內容：「${srcText.slice(0, 40)}」）`);
  console.log(`  預渲染 dist/index.html：${countChars(text)} 字`);
}

if (errors.length) {
  console.error("[check] 未通過：\n  - " + errors.join("\n  - "));
  process.exit(1);
}
console.log(`[check] 通過：8 個章節、${countChars(text)} 字、head 標記一致、bundle ${bundle}`);
