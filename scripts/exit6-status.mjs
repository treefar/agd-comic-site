// 《六樓出口》狀態彙整：所有摘要數字由資料、檔案、帳本、git、測試現場算出，不手填
// 三層狀態：built（資料已建）／verified（工具驗證）／confirmed（使用者在對話確認，只讀 docs/exit6/confirmations.json）
// 用法：node scripts/exit6-status.mjs   → 寫出 docs/exit6/status.json（儀表板 MOD 讀這個檔）
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...p) => path.join(ROOT, ...p);
const has = (rel) => fs.existsSync(P("exit6", rel));
const imp = (rel) => import(pathToFileURL(P("exit6", rel)).href);

const { STATIONS, ANOMALIES, QUIZ, VOICE_TEXT } = await imp("data.mjs");
const { ITEMS, TARGETS } = await imp("quests.mjs");
const { CLUES } = await imp("clues.mjs");
const { MOVES } = await imp("fight.mjs");
const { OUTLINES } = await imp("outlines.mjs");
const conf = JSON.parse(fs.readFileSync(P("docs", "exit6", "confirmations.json"), "utf8"));

// 測試：三組一起跑，解析 ℹ pass / ℹ fail
const testRun = spawnSync(process.execPath, ["--test", "scripts/test-exit6.mjs", "scripts/test-exit6-phase2.mjs", "scripts/test-exit6-fight.mjs"], { cwd: ROOT, encoding: "utf8" });
const out = (testRun.stdout || "") + (testRun.stderr || "");
const num = (re) => Number((out.match(re) || [])[1] ?? NaN);
const tests = { pass: num(/ℹ pass (\d+)/), fail: num(/ℹ fail (\d+)/), failed: [...out.matchAll(/^✖ (.+?) \(/gm)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) === i) };

// 生圖帳本
const ledgerFile = P("art-src", "exit6", "ledger.jsonl");
const ledger = fs.existsSync(ledgerFile) ? fs.readFileSync(ledgerFile, "utf8").trim().split("\n").map((l) => JSON.parse(l)) : [];
const art = { calls: ledger.length, ok: ledger.filter((r) => r.ok).length, fail: ledger.filter((r) => !r.ok).length };

// git
const git = (...a) => { try { return execFileSync("git", a, { cwd: ROOT, encoding: "utf8" }).trim(); } catch { return ""; } };
const repo = { branch: git("rev-parse", "--abbrev-ref", "HEAD"), head: git("log", "-1", "--format=%h %s"), ahead: Number(git("rev-list", "--count", "main..HEAD") || 0), dirty: git("status", "--porcelain").split("\n").filter(Boolean).length, pushed: git("ls-remote", "--heads", "origin", git("rev-parse", "--abbrev-ref", "HEAD")) !== "" };

// 音效授權：AUDIO_LICENSES.md 每列的授權欄
const licText = fs.existsSync(P("AUDIO_LICENSES.md")) ? fs.readFileSync(P("AUDIO_LICENSES.md"), "utf8") : "";
const sfxRows = licText.split("\n").filter((l) => /^\|\s*`?sfx_/.test(l));
const sfx = { files: fs.existsSync(P("exit6", "audio")) ? fs.readdirSync(P("exit6", "audio")).filter((f) => f.startsWith("sfx_")).length : 0, cc0: sfxRows.filter((l) => /CC0/i.test(l)).length, rows: sfxRows.length };
const voices = Object.keys(VOICE_TEXT).filter((id) => has(`audio/${id}.m4a`)).length;

// 「待老師補充／確認」的文字
const dataText = fs.readFileSync(P("exit6", "data.mjs"), "utf8");
const todoTeacher = (dataText.match(/待老師(補充|確認)[^）」]*/g) || []).map((s) => s.trim());

const allFiles = (list) => list.every(has);
const C = (key) => (conf[key] ? `${conf[key].date} ${conf[key].note}` : null);
const row = (name, built, builtNote, verified, verifiedNote, confirmed) => ({ name, built, builtNote, verified, verifiedNote, confirmed });
const testsOk = tests.fail === 0 && tests.pass > 0;

const stationFiles = STATIONS.flatMap((s) => [...s.frames, s.still]);
const deanFiles = ["plead", "cheer", "welcome", "peek"].map((p) => `frames/dean_${p}.webp`);
const qiuFiles = ["greet", "ready", "attack", "ko"].map((p) => `frames/qiu_${p}.webp`);
const outlineKeys = Object.keys(OUTLINES).length;

const features = [
  row("走廊 8 站漫畫風（停站＋中間格）", allFiles(stationFiles), `${stationFiles.filter(has).length}/${stationFiles.length} 張`, testsOk, "素材存在測試", C("style")),
  row("12 個異常圖", allFiles(ANOMALIES.map((a) => a.still)), `${ANOMALIES.filter((a) => has(a.still)).length}/${ANOMALIES.length} 張`, testsOk, "點擊範圍不重疊測試", null),
  row("沿邊框線與浮起（SAM 輪廓）", outlineKeys > 0, `${outlineKeys} 組輪廓`, testsOk, "輪廓齊全測試＋人工逐張看過", null),
  row("系主任立繪", allFiles(deanFiles), `${deanFiles.filter(has).length}/4 張`, testsOk, "素材存在測試", null),
  row("真實時間光線", has("time.mjs"), "白天／黃昏／晚上", testsOk, "0～23 點皆可達晚上、亮度下限", null),
  row("六樓尋址任務", has("quests.mjs"), `${ITEMS.length} 件委託、${TARGETS.length} 個交付點`, testsOk, "送對送錯判定測試", null),
  row("線索鏈與 D0647 密碼門", has("clues.mjs"), `${CLUES.length} 條線索`, testsOk, "數字拼成密碼、晚上限定測試", null),
  row("邱士展老師立繪與 D0647", allFiles([...qiuFiles, "frames/s8.webp", "frames/s8_a.webp"]), `${qiuFiles.filter(has).length}/4 立繪`, testsOk, "素材存在測試", C("qiuConsent")),
  row("片場對決", has("fight.mjs"), `${Object.keys(MOVES).length} 招反擊`, testsOk, "指令容錯紅綠循環", C("qiuLines")),
  row("破關測驗", QUIZ.length >= 5, `${QUIZ.length} 題題庫`, testsOk, "題目格式測試", null),
  row("音效", sfx.files >= 7, `${sfx.files}/9 檔（dean、clear 待補）、CC0 ${sfx.cc0}/${sfx.rows}`, sfx.rows === sfx.files && sfx.cc0 === sfx.rows, "授權帳本全為 CC0", C("audioCC0")),
  row("系主任語音", voices > 0, `${voices}/${Object.keys(VOICE_TEXT).length} 句已錄`, voices === Object.keys(VOICE_TEXT).length, "音檔存在", null),
];

const status = {
  generatedAt: new Date().toISOString(),
  artifact: "https://claude.ai/artifact/TpnGnvUbdWK4UV4QX2imJ5",
  summary: {
    stations: STATIONS.length, anomalies: ANOMALIES.length, outlines: outlineKeys, clues: CLUES.length,
    tests, art, sfx, voices, todoTeacher: todoTeacher.length,
    built: features.filter((f) => f.built).length, verified: features.filter((f) => f.verified).length,
    confirmed: features.filter((f) => f.confirmed).length, total: features.length,
  },
  features,
  todoTeacher: [...new Set(todoTeacher)],
  repo,
};
const outFile = P("docs", "exit6", "status.json");
const json = JSON.stringify(status, null, 2);
if (!json || json.length < 50) { console.error("status 序列化結果異常，不寫檔"); process.exit(1); }
fs.writeFileSync(outFile, json, "utf8");
console.log(`[status] 測試 ${tests.pass} 過 ${tests.fail} 失敗｜功能 已建 ${status.summary.built}/${features.length}、驗證 ${status.summary.verified}、確認 ${status.summary.confirmed}｜寫入 ${path.relative(ROOT, outFile)}`);
