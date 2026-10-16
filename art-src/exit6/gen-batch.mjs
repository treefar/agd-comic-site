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
const LEVEL_TEXT = LEVEL;

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

// 系主任立繪：依系網官方照片（使用者 2026-10-15 指定），純綠背景方便去背
const DEAN_BASE = "Open and look at the portrait reference art-src/exit6/ref/dean_photo.jpg and the STYLE reference art-src/exit6/gen/s5_a09.png " +
  "(the poster of him in the middle). Draw THE SAME MAN (same face, eyes, nose, mouth, black bowl haircut, black hooded velvet cloak tied at the neck, white sweater) " +
  "as a comedic manga character, in the same comic style as the poster: bold black ink outlines, screentone shading, flat colors. " +
  "Waist-up, centered, fully inside the frame with margin. The ENTIRE background must be one flat pure green #00FF00 with no shading, no floor, no shadow, no text, no speech bubble. Square image.";
const DEAN = [
  ["dean_plead", "Pose: leaning forward, palms pressed together begging, teary puppy-dog eyes, exaggerated pleading pout — funny, not scary."],
  ["dean_cheer", "Pose: big proud grin, one hand giving a thumbs up toward the viewer, the other on his hip."],
  ["dean_welcome", "Pose: both arms spread wide open in welcome, warm happy smile, cloak spread like wings."],
  ["dean_peek", "Pose: peeking from the right edge of the frame, only half of his face and one hand visible, wide mischievous grin, one eye staring at the viewer."],
];
const deanJob = ([id, pose]) => ({ id, out: `art-src/exit6/gen/${id}.png`, prompt: `${DEAN_BASE} ${pose}` });

// 第二批：D0647 支線＋邱士展老師立繪（使用者 2026-10-15 於對話表示邱老師已同意；參考系網官方照片）
const D0647 = [
  { id: "s8_stop", out: "art-src/exit6/gen/s8_stop.png",
    prompt: `Open and look at the reference photo art-src/exit6/ref/s8_stop.jpg and the STYLE reference art-src/exit6/gen/s6_stop.png. ` +
      `Redraw the photo in exactly the same style as the STYLE reference. ${KEEP} ${LEVEL_TEXT} ` +
      `The name plate must read exactly 'D0647' and '邱士展'. The colorful stickers and small cards stuck on the board must be redrawn as ORIGINAL ` +
      `generic designs (film clapperboard, camera, star, arrow, game controller doodles) — do not copy any existing character, logo or brand. Style: ${STYLE}` },
  { id: "s8_a", out: "art-src/exit6/gen/s8_a.png",
    prompt: `Open and look at the reference photo art-src/exit6/ref/s8_a.jpg and the STYLE reference art-src/exit6/gen/s6_a.png (same corridor, already redrawn). ` +
      `Redraw the photo in exactly the same style as the STYLE reference. ${KEEP} Keep it a calm, dim but readable office corridor, not scary. Style: ${STYLE}` },
];
const QIU_BASE = "Open and look at the portrait reference art-src/exit6/ref/qiu_photo.jpg and the STYLE reference art-src/exit6/gen/dean_cheer.png. " +
  "Draw THE SAME MAN as in the portrait reference (same face shape, eyes behind the same thin metal octagonal glasses, short black hair, black hooded velvet cloak tied at the neck, light grey button shirt) " +
  "as a comedic manga character in exactly the same comic style as the STYLE reference: bold black ink outlines, screentone shading, flat colors. " +
  "He is a cheerful animation director. Waist-up or full upper body, fully inside the frame with margin. The ENTIRE background must be one flat pure green #00FF00 " +
  "with no shading, no floor, no shadow, no text, no speech bubble. Original design only: do not imitate any existing fighting-game character, costume, headband or special-move effect. Square image.";
const QIU = [
  ["qiu_greet", "Pose: friendly wave with one hand, holding a small film clapperboard in the other, confident smile."],
  ["qiu_ready", "Pose: playful martial-arts ready stance facing the viewer, fists up, cloak flaring, determined grin, glasses glinting."],
  ["qiu_attack", "Pose: dynamic forward punch toward the viewer with comic speed lines around the arm (speed lines drawn in ink only), shouting mouth."],
  ["qiu_ko", "Pose: comedic defeat — dizzy swirly eyes, glasses askew, holding the clapperboard closed above his head as if calling 'cut', big laughing mouth."],
];
const qiuJob = ([id, pose]) => ({ id, out: `art-src/exit6/gen/${id}.png`, prompt: `${QIU_BASE} ${pose}` });

// 老師簽名卡卡面（2026-10-16 使用者選「現在就用 Codex 生卡面插圖」）：專長主題的工作桌靜物，不畫人、不放可讀文字（老師名字要本人同意，先不出現）
const CARD_BASE = `Open and look at the STYLE reference ${STYLE_REF}. Draw a NEW still-life illustration in exactly the same comic style ` +
  "(copy its line weight, halftone screentone, cream paper tone, ink black lines and limited red/blue/yellow accents; do NOT copy its content). " +
  "Square 1:1 composition, a close-up of a creative workspace on a desk seen from a 3/4 high angle, warm and inviting, a little playful. " +
  "No people, no hands, no faces, no readable letters or words anywhere, no logos or brand names. Subject: ";
const CARDS = [
  ["card_anim", "an animator's light table with a stack of paper sheets showing a red ball bouncing in successive drawings (squash and stretch), a pencil, a timing chart drawn as tick marks, a small flipbook fanned open."],
  ["card_book", "an open picture-book sketchbook with several solid black character silhouettes and one colored cute round character wearing a tall hat and a long scarf, colored pencils, a little paper hat prop."],
  ["card_code", "a laptop whose screen shows colorful pipes and connected node blocks forming a flowing path from a yellow start block to a blue goal block, a glowing blue liquid running through the pipes, a coffee mug."],
  ["card_3d", "a desktop 3D printer in the middle of printing a small stylized figurine, a spool of filament, a few printed blocky L-shaped and T-shaped parts lying beside it."],
  ["card_type", "a typography workbench: wooden letterpress type blocks with abstract unreadable glyph shapes, an ink roller, red/blue/yellow color swatch cards fanned out, a round bold shape and a sharp thin shape contrasting."],
];
const cardJob = ([id, subj]) => ({ id, out: `art-src/exit6/gen/${id}.png`, prompt: CARD_BASE + subj });

const STATIONS = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"];
const SETS = {
  stops: () => STATIONS.map(stopJob),
  mids: () => STATIONS.flatMap((s) => ["a", "b"].map((k) => midJob(s, k))),
  anomalies: () => ANOM.map(anomJob),
  dean: () => DEAN.map(deanJob),
  d0647: () => [...D0647, ...QIU.map(qiuJob)],
  cards: () => CARDS.map(cardJob),
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
