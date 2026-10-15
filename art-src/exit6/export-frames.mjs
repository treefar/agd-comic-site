// 《六樓出口》把 Codex 生的 PNG 轉成網頁用 WebP（1280×720，只做尺寸與格式轉換，不改畫面內容）
// 用法：node art-src/exit6/export-frames.mjs   需要 ffmpeg 在 PATH 上
// 對應：gen/s1_stop.png → exit6/frames/s1.webp；gen/s1_a.png → s1_a.webp；gen/s1_a01.png → s1_a01.webp
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GEN = path.join(HERE, "gen");
const OUT = path.resolve(HERE, "..", "..", "exit6", "frames");
fs.mkdirSync(OUT, { recursive: true });

let n = 0;
for (const f of fs.readdirSync(GEN).filter((x) => /^s\d_(stop|a|b|a\d\d)\.png$/.test(x)).sort()) {
  const name = f.replace("_stop", "").replace(".png", ".webp");
  const out = path.join(OUT, name);
  const src = path.join(GEN, f);
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libwebp", "-quality", "82", out]);
  n++;
  console.log(`[export] ${f} → frames/${name} ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}
console.log(`[export] 完成，新轉 ${n} 張`);
