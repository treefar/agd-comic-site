// 產生 ui-art-manifest.json（game-ui-art 契約）：登記實際用到的 UI 素材、雜湊、提示詞與生成來源
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(path.join(root, p))).digest("hex");
const log = fs.readFileSync(path.join(root, "art/gen-log.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const when = (name) => (log.filter((x) => x.name === name && x.code === 0).pop() || {}).at;
const gen = (name) => ({ producer: "codex", entry: "codex-image", generated_at: when(name), source_sheet: `art/${name}.png` });

const ui = ["btnPrimary", "btnSecondary", "btnPause", "btnSound", "btnMute", "btnBack", "panelCard", "panelResult"];
const assets = [
  { id: "ui_sheet", path: "art/ui_sheet.png", sha256: sha("art/ui_sheet.png"), prompt_file: "art/prompts/ui_sheet.txt", generator: gen("ui_sheet"), post: "原稿" },
  ...ui.map((k) => ({ id: k, path: `art/ui/${k}.png`, sha256: sha(`art/ui/${k}.png`), prompt_file: "art/prompts/ui_sheet.txt", generator: gen("ui_sheet"), post: "tools/prep-art.mjs：洋紅底去背、連通區域裁切、縮至長邊 640" })),
  { id: "cover", path: "art/web/cover.png", sha256: sha("art/web/cover.png"), prompt_file: "art/prompts/cover.txt", generator: gen("cover"), post: "tools/prep-art.mjs：縮至 600x900" },
];
const manifest = {
  schema_version: 1,
  theme: "少年漫畫風：粗黑墨線、網點陰影、米色紙底，朱紅／寶藍／亮黃點色；動畫與遊戲設計系校園主題",
  ui_targets: ["game.js", "index.html"],
  assets,
  screens: [
    { id: "cover", asset_ids: ["cover", "btnPrimary"] },
    { id: "hud", asset_ids: ["btnPause", "btnSound", "btnMute"] },
    { id: "course_card", asset_ids: ["panelCard", "btnPrimary", "btnSecondary"] },
    { id: "result", asset_ids: ["panelResult", "btnPrimary", "btnSecondary"] },
  ],
  review: "待使用者於對話確認（尚未通過）",
};
const json = JSON.stringify(manifest, null, 2);
if (!json || !json.trim()) throw new Error("manifest 序列化為空");
fs.writeFileSync(path.join(root, "ui-art-manifest.json"), json + "\n");
console.log("ui-art-manifest.json 已寫入，素材", assets.length, "筆");
