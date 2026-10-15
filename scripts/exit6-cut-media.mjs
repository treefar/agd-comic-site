// 《六樓出口》影片剪輯：從原始實拍影片剪出 720p 走路片段＋停站畫面（片段最後一格），當漫畫風重繪的參考（art-src/exit6/ref）
// 用法：node scripts/exit6-cut-media.mjs "<原片資料夾>" [只剪某幾段，例如 s0 s6]
// 需要 ffmpeg 在 PATH 上。原片不進 git（2026-10-15 存於桌面「系網企畫」）
// 剪完要重抽參考圖與轉正：抽圖見 art-src/exit6（ref/ 由片段 25%、60% 與最後一格抽出），再跑 python art-src/exit6/level_refs.py
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC = {
  A: "20261015_134951.mp4", // 慢、有停留與門牌特寫
  B: "20261015_140325.mp4", // 快、穩，走路主幹
};

// [輸出名, 原片, 起點秒, 終點秒]；改過的理由寫在旁邊
export const CLIPS = [
  ["s0", "B", 9, 13.4],     // 停在樓層顯示「6」
  ["s1", "B", 13, 19.5],
  ["s2", "B", 30, 40.5],
  ["s3", "B", 210, 219.5],  // 195–201 秒有路人，避開
  ["s4", "A", 436, 446.5],
  ["s5", "A", 450, 461.5],
  ["s6", "A", 668, 674.5],  // 667 秒前拍到 D0645 門牌，避開
  ["s7", "B", 358, 370.5],
];

const dir = process.argv[2];
if (!dir) { console.error("請給原片資料夾路徑"); process.exit(1); }
const only = new Set(process.argv.slice(3));
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "art-src", "exit6", "clips");   // 只當生圖參考，不發布
fs.mkdirSync(OUT, { recursive: true });

for (const [name, src, start, end] of CLIPS) {
  if (only.size && !only.has(name)) continue;
  const input = path.join(dir, SRC[src] ?? src);
  const mp4 = path.join(OUT, `${name}.mp4`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(start), "-t", String(end - start), "-i", input,
    "-an", "-vf", "scale=1280:720,fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "27",
    "-pix_fmt", "yuv420p", "-g", "30", "-movflags", "+faststart", mp4]);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.2", "-i", mp4, "-frames:v", "1", "-q:v", "4", "-update", "1",
    path.join(OUT, `${name}.jpg`)]);
  console.log(`[cut] ${name} ← ${src} ${start}–${end}s`);
}
