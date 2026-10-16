// 《六樓出口》主角旁白與第一輪減量回歸測試（2026-10-16 使用者：出電梯要有劇情銜接、第一輪每站只點 1 個、點了主角說一句）
// 用法：node --test scripts/test-exit6-story.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { STATIONS } from "../exit6/data.mjs";
import { mustIndex, narrFor, spotAt, SAY_MAX } from "../exit6/story.mjs";

test("第一輪：每站剛好 1 個必點物件；系辦門口的必點是系辦委託（尋址任務要靠它開始）", () => {
  STATIONS.forEach((s, i) => {
    assert.equal(s.spots.filter((p) => p.must).length, 1, `${s.id} 必點數量`);
    assert.equal(mustIndex(i), s.spots.findIndex((p) => p.must));
  });
  assert.equal(STATIONS[1].spots[mustIndex(1)].action, "takeItems");
});

test("主角台詞：每個物件都有一句，簡短、不帶佔位字、不出現未同意的老師本名", () => {
  for (const s of STATIONS) for (const p of s.spots) {
    assert.ok(p.say && p.say.length <= SAY_MAX, `${s.id} ${p.label}：「${p.say}」`);
    assert.ok(!/待老師|待確認/.test(p.say), `${s.id} ${p.label} 有佔位字`);
    assert.ok(!/陳慶鴻|鄧樹遠/.test(p.say), `${s.id} ${p.label} 出現老師本名`);
  }
});

test("旁白：每站導覽圈與循環圈各一句，循環圈跟導覽圈不同句", () => {
  STATIONS.forEach((s, i) => {
    const t = narrFor(i, "tour"), l = narrFor(i, "loop");
    assert.ok(t && l, `${s.id} 缺旁白`);
    assert.notEqual(t, l, `${s.id} 兩圈旁白一樣`);
  });
  assert.equal(narrFor(0, "ending"), null, "結局階段不出旁白");
});

test("彩蛋點擊：點到物件範圍回傳那個物件；點空白回 null", () => {
  STATIONS.forEach((s, i) => s.spots.forEach((p, k) => {
    assert.equal(spotAt(i, p.x + p.w / 2, p.y + p.h / 2), k, `${s.id} ${p.label} 中心`);
  }));
  assert.equal(spotAt(2, 95, 5), null);
});
