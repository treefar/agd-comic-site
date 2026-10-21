// 產生 ui-art-manifest.json（v2）：記錄畫面素材來源、雜湊，以及使用者對介面規則的例外決定
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(path.join(root, p))).digest("hex");
const log = fs.readFileSync(path.join(root, "art/gen-log.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const when = (name) => (log.filter((x) => x.name === name && x.code === 0).pop() || {}).at;

const fx = ["orb", "spark", "confetti", "stamp"].map((k) => ({
  id: "fx_" + k, path: `art/fx2/${k}.png`, sha256: sha(`art/fx2/${k}.png`), prompt_file: "art/prompts/fx_sheet2.txt",
  generator: { producer: "codex", entry: "codex-image", generated_at: when("fx_sheet2"), source_sheet: "art/fx_sheet2.png" },
  post: "tools/prep-art.mjs：洋紅底去背、去洋紅溢色、連通區域裁切、長邊縮至 320",
}));
const scenes = ["lab_d0637", "lab_d0604", "lab_d0633", "s0"].map((k) => ({
  id: "scene_" + k, path: `art/scene/${k}.webp`, sha256: sha(`art/scene/${k}.webp`),
  source: `play/six-floor-exit/frames/${k}.webp（六樓出口的實景照片轉漫畫圖，風格使用者 2026-10-15 確認；原樣複製，未再處理）`,
}));
const manifest = {
  schema_version: 1,
  theme: "實景轉漫畫：樹德科大動遊系實驗室照片轉成寫實漫畫風，米色紙底、細網點、黑墨線（比照《六樓出口》）",
  ui_targets: ["game.js", "index.html"],
  ui_policy_exception: {
    decided_by: "使用者",
    date: "2026-10-21",
    where: "Claude Code 對話（TF-GO）",
    decision: "本遊戲按鈕與面板比照《六樓出口》改用純文字按鈕（CSS 紙卡樣式），不套用「遊戲 UI 一律 Codex 生圖」規則；理由：受眾不喜歡 AI 生成圖，改以實景後製為主",
  },
  assets: [...fx, ...scenes],
  screens: [
    { id: "cover", asset_ids: ["scene_s0", "fx_orb"] },
    { id: "play", asset_ids: ["scene_lab_d0637", "scene_lab_d0604", "scene_lab_d0633", "fx_orb", "fx_spark", "fx_confetti", "fx_stamp"] },
    { id: "course_card", asset_ids: ["fx_stamp"] },
    { id: "final", asset_ids: ["fx_stamp"] },
  ],
  review: "特效圖待使用者於對話確認（尚未通過）",
};
const json = JSON.stringify(manifest, null, 2);
if (!json || !json.trim()) throw new Error("manifest 序列化為空");
fs.writeFileSync(path.join(root, "ui-art-manifest.json"), json + "\n");
console.log("ui-art-manifest.json 已寫入，素材", manifest.assets.length, "筆");
