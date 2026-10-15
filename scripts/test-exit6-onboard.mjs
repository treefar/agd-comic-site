// 《六樓出口》由淺入深回歸測試：異常明顯度排程、第 2 圈固定正常、提示線索與分層提示
// 用法：node --test scripts/test-exit6-onboard.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { createGame, step, startLap, mulberry32, LAST_STATION } from "../exit6/game-core.mjs";
import { ANOMALIES } from "../exit6/data.mjs";
import { cueFor, hintStage, areaOf, HINT_TEXT } from "../exit6/coach.mjs";

const walkTour = (g) => { for (let i = 0; i <= LAST_STATION; i++) step(g, "forward"); };
const tierOf = (id) => ANOMALIES.find((a) => a.id === id).tier;

test("異常都有明顯度 1～3，三級都有", () => {
  for (const a of ANOMALIES) assert.ok([1, 2, 3].includes(a.tier), a.id);
  for (const t of [1, 2, 3]) assert.ok(ANOMALIES.some((a) => a.tier === t), `缺第 ${t} 級`);
});

test("排程：第 1 圈出最明顯的、第 2 圈固定正常、第 3 圈不超過第 2 級（200 個種子）", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const g = createGame(ANOMALIES, mulberry32(seed));
    walkTour(g);
    assert.equal(g.lap, 1);
    assert.equal(tierOf(g.anomaly), 1, `seed ${seed} 第 1 圈 ${g.anomaly}`);
    startLap(g);
    assert.equal(g.anomaly, null, `seed ${seed} 第 2 圈應該正常`);
    startLap(g);
    if (g.anomaly) assert.ok(tierOf(g.anomaly) <= 2, `seed ${seed} 第 3 圈 ${g.anomaly}`);
  }
});

test("排程：細微的異常之後一定會出現（不會永遠只出簡單的）", () => {
  const g = createGame(ANOMALIES, mulberry32(3));
  walkTour(g);
  const seen = new Set();
  for (let i = 0; i < 60; i++) { if (g.anomaly) seen.add(g.anomaly); startLap(g); }
  assert.equal(seen.size, ANOMALIES.length);
});

test("提示線索：第 1 圈強、第 3 圈弱、第 4 圈起沒有；連錯兩次後重新給弱線索", () => {
  assert.equal(cueFor(1, 0), 2);
  assert.equal(cueFor(2, 0), 1);
  assert.equal(cueFor(3, 0), 1);
  assert.equal(cueFor(4, 0), 0);
  assert.equal(cueFor(9, 1), 0);
  assert.equal(cueFor(9, 2), 1);
});

test("分層提示：停越久、點錯越多，提示越具體；沒進提示模式就不給", () => {
  assert.equal(hintStage(3, 0, true), 0);
  assert.equal(hintStage(9, 0, true), 1);
  assert.equal(hintStage(3, 2, true), 1);
  assert.equal(hintStage(17, 0, true), 2);
  assert.equal(hintStage(28, 0, true), 3);
  assert.equal(hintStage(99, 9, false), 0);
  for (const k of [1, 2, 3]) assert.ok(HINT_TEXT[k], `第 ${k} 層提示文字`);
});

test("方位描述：依點擊範圍中心說上下左右", () => {
  assert.equal(areaOf({ x: 0, y: 74, w: 100, h: 26 }), "畫面下方");
  assert.equal(areaOf({ x: 39, y: 0, w: 14, h: 17 }), "畫面上方");
  assert.equal(areaOf({ x: 10, y: 37, w: 22, h: 27 }), "畫面左邊");
  assert.equal(areaOf({ x: 70, y: 40, w: 20, h: 20 }), "畫面右邊");
  assert.equal(areaOf({ x: 41, y: 40, w: 20, h: 20 }), "畫面中間");
});

test("主動求救：有異常時提示升一層、最多第 3 層；沒異常只說這站沒問題", async () => {
  const { helpReply, HELP_COOLDOWN_MS, HELP_CLEAR } = await import("../exit6/coach.mjs");
  assert.deepEqual(helpReply(true, 0), { kind: "hint", stage: 1 });
  assert.deepEqual(helpReply(true, 2), { kind: "hint", stage: 3 });
  assert.deepEqual(helpReply(true, 3), { kind: "hint", stage: 3 });
  assert.deepEqual(helpReply(false, 2), { kind: "clear" });
  assert.ok(HELP_CLEAR && HELP_COOLDOWN_MS >= 5000);
});
