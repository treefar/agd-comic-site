// 《六樓出口》漫畫風批次生圖：只走核准管線 Codex CLI（codex-image 包裝腳本），程式不畫任何像素
// 用法：node art-src/exit6/gen-batch.mjs <stops|mids|anomalies> [只跑某幾個 id]
// 帳本：art-src/exit6/ledger.jsonl（日期、管線、prompt、結果）。已存在的成品會跳過，要重生就先刪檔
// 風格基準：gen/s1_stop_v1.png（使用者 2026-10-15 於對話確認）
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const WRAPPER = "C:/Users/USER/.claude/skills/codex-image/scripts/run-codex-image.mjs";
const CONCURRENCY = 3;
const STYLE_REF = "art-src/exit6/gen/s1_stop_v1.png";
const LEDGER = path.join(ROOT, "art-src/exit6/ledger.jsonl");

const STYLE = "hand-drawn Japanese manga / comic-book illustration: bold black ink outlines, screentone halftone dot shading, flat colors, " +
  "cream paper tone #f4ecd8 on walls, ink black #0f0d0a lines, red #e63946 / blue #1d4ed8 / yellow #ffd60a accents only where the photo already has color. " +
  "Slightly eerie, quiet, empty school corridor mood. No people, no characters, no speech bubbles, no added text. Landscape 16:9.";
const KEEP = "HARD RULE: keep the exact same camera angle, perspective, framing, and the position and size of every object in the photo. " +
  "Do not add or remove any object. STRAIGHTEN THE VIEW: every vertical architectural line (door frames, wall corners, pillars) must be perfectly vertical, not leaning.";
// 正對牆面的站：水平線也要拉平（2026-10-15 使用者指出系辦門口畫面有歪）
const FRONTAL = { s1: true, s4: true, s6: true, s7: true };
const LEVEL = "The wall faces the camera head-on: the door top edge, wall seams and the floor line must be perfectly horizontal.";

// 每站必須正確的字（錯了就重生）
const TEXT = {
  s0: "The elevator floor display must show a single red digit 6.",
  s1: "Wall lettering must read exactly 'Department of Animation and Game Design, STU' and '動畫與遊戲設計系'. The small door plate above the door window must read exactly 'D0634' (capital letter D, not zero). " +
    "Add exactly one thing: a white A4 paper sign taped at eye level on the right door leaf, reading '請勿回頭' in bold red brush letters.", // 遊戲開場告示，異常 A01 會改它
  s2: "", s3: "", s5: "Keep poster artwork as in the photo; small poster text may be simplified.",
  s4: "The door plate must read exactly 'D0604'. The cabinet text reads '消防栓 HYDRANT'.",
  s6: "The name plate must read exactly 'D0646' and '陳慶鴻', with 'IN' and 'OUT' labels at the bottom.",
  s7: "The large digit on the wall above the elevators must be exactly '6'. If the department wall lettering on the far left is visible (it may be cut off by the frame edge), it must read '...Animation and Game Design, STU' and '...動畫與遊戲設計系' exactly as in the photo, never any other school or department name.",
};

const stopJob = (s) => ({
  id: `${s}_stop`, out: `art-src/exit6/gen/${s}_stop.png`,
  prompt: `Open and look at the reference photo art-src/exit6/ref/${s}_stop.jpg and the STYLE reference ${STYLE_REF}. ` +
    `Redraw the photo in exactly the same style as the STYLE reference (copy its line weight, halftone screentone, palette and coloring; do NOT copy its content). ` +
    `${KEEP} ${FRONTAL[s] ? LEVEL : ""} ${TEXT[s]} Style: ${STYLE}`,
});
const midJob = (s, k) => ({
  id: `${s}_${k}`, out: `art-src/exit6/gen/${s}_${k}.png`,
  prompt: `Open and look at the reference photo art-src/exit6/ref/${s}_${k}.jpg and the STYLE reference art-src/exit6/gen/${s}_stop.png ` +
    `(the same place a few steps later, already redrawn). Redraw the photo so it looks like an earlier frame of the same animation: ` +
    `same rendering, colors, line weight and screentone as the STYLE reference. ${KEEP} ${FRONTAL[s] ? LEVEL : ""} ${TEXT[s]} Style: ${STYLE}`,
});

// 異常：對已通過的停站圖做局部修改，其餘一律不動
const ANOM = [
  ["A01", "s1", "Change only the text of the white paper sign on the right door leaf from '請勿回頭' to '請回頭看看嘛♡' (same paper, same red brush letters)."],
  ["A02", "s1", "Swap the two posters: the poster left of the door moves to the right of the door and the right-side posters move to the left."],
  ["A03", "s1", "Rotate only the patterned floor mat in the foreground by 180 degrees (the printed characters are now upside down)."],
  ["A04", "s2", "Add only a pair of black school shoes standing in the middle of the colorful floor painting on the bridge."],
  ["A05", "s3", "Add only one long wooden corridor bench directly under the wooden archway, in the center."],
  ["A06", "s4", "Change only the door plate number from 'D0604' to 'D0640'."],
  ["A07", "s4", "Add only a white A4 paper taped on the left door leaf reading 'D0604 電繪食驗室' in black marker."],
  ["A08", "s5", "Turn only the second poster from the left upside down (rotate that one poster 180 degrees)."],
  // A09 人像依系網官方照片（使用者 2026-10-15 指定），不可虛構臉
  ["A09", "s5", "Also open the portrait reference art-src/exit6/ref/dean_photo.jpg. Replace only the third poster from the left with a poster drawn in the same comic style showing THE SAME MAN as in that reference (keep his face shape, eyes, nose, mouth, black bowl haircut, black hooded velvet cloak and white sweater so he is clearly recognizable). Head-and-shoulders, his eyes looking straight out at the viewer, an unsettling wide grin. No text on that poster."],
  ["A10", "s6", "Move only the colored round magnets at the bottom of the name plate so they are all clustered on the 'IN' side."],
  ["A11", "s6", "Change only the name on the plate from '陳慶鴻' to '鄧樹遠'."],
  ["A12", "s7", "Change only the large wall digit above the elevators from '6' to '8'."],
];
const anomJob = ([id, s, change]) => ({
  id, out: `art-src/exit6/gen/${s}_${id.toLowerCase()}.png`,
  prompt: `Open and look at the image art-src/exit6/gen/${s}_stop.png. Make a copy of this exact image with ONE change: ${change} ` +
    `Everything else must stay pixel-identical in position, color and style: same framing, same lines, same screentone. ` +
    `The change must be drawn in the same comic style. Landscape 16:9, same size as the input.`,
});

const STATIONS = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"];
const SETS = {
  stops: () => STATIONS.map(stopJob),
  mids: () => STATIONS.flatMap((s) => ["a", "b"].map((k) => midJob(s, k))),
  anomalies: () => ANOM.map(anomJob),
};

const [set, ...only] = process.argv.slice(2);
if (!SETS[set]) { console.error("用法：node art-src/exit6/gen-batch.mjs <stops|mids|anomalies> [id…]"); process.exit(1); }
const jobs = SETS[set]().filter((j) => (!only.length || only.includes(j.id)) && !fs.existsSync(path.join(ROOT, j.out)));
console.log(`[gen] ${set}: ${jobs.length} 張待生`);

function run(job) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const p = spawn(process.execPath, [WRAPPER, "--cwd", ROOT, "--output", job.out, "--prompt", job.prompt], { cwd: ROOT });
    let out = "";
    p.stdout.on("data", (d) => (out += d)); p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => {
      const m = out.match(/\{"ok":.*\}\s*$/m);
      const res = m ? JSON.parse(m[0]) : null;
      const row = { date: new Date().toISOString(), pipeline: "codex-cli/imagegen", id: job.id, out: job.out, code,
        ok: !!res?.ok, size: res ? `${res.width}x${res.height}` : null, recoveredFrom: res?.recoveredFrom ?? null,
        sec: Math.round((Date.now() - t0) / 1000), prompt: job.prompt, error: res?.ok ? null : out.slice(-400) };
      fs.appendFileSync(LEDGER, JSON.stringify(row) + "\n");
      console.log(`[gen] ${job.id} ${row.ok ? "OK" : "FAIL"} ${row.sec}s ${row.size ?? ""}`);
      resolve(row);
    });
  });
}

const queue = [...jobs];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (queue.length) await run(queue.shift()); }));
console.log("[gen] 完成");
