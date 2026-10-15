// 《六樓出口》第二階段回歸測試：時間光線、六樓尋址、按鈕座標不重疊
// 用法：node --test scripts/test-exit6-phase2.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { periodOf, stepFor, hourAt, gradeFor, NIGHT_BY_LAP, BRIGHT_FLOOR } from "../exit6/time.mjs";
import { ITEMS, TARGETS, createQuests, takeItems, deliver, pending } from "../exit6/quests.mjs";
import { STATIONS, ANOMALIES } from "../exit6/data.mjs";

const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

test("時段：邊界小時歸類正確", () => {
  const cases = { 0: "night", 5: "night", 6: "day", 16: "day", 17: "dusk", 18: "dusk", 19: "night", 23: "night" };
  for (const [h, p] of Object.entries(cases)) assert.equal(periodOf(+h), p, `${h} 點`);
});

test("時鐘：0～23 點開局，第 1～4 圈內一定有一圈是晚上（時段線索碰得到）", () => {
  for (let start = 0; start < 24; start++) {
    const laps = Array.from({ length: NIGHT_BY_LAP }, (_, i) => hourAt(start, i + 1));
    assert.ok(laps.some((h) => periodOf(h) === "night"), `${start} 點開局：${laps.join(",")}`);
  }
});

test("時鐘：每圈不倒退、晚上開局每圈 +1、凌晨開局時鐘停住", () => {
  assert.equal(stepFor(20), 1);
  assert.equal(stepFor(3), 0);
  assert.equal(hourAt(3, 5), 3);
  for (let start = 0; start < 24; start++) assert.ok(stepFor(start) >= 0);
  assert.equal(hourAt(9, 0), 9);              // 導覽圈＝開局時間
});

test("光線：任何時段與樓層，亮度都不低於下限", () => {
  for (let h = 0; h < 24; h++) for (let c = 0; c <= 6; c++) {
    const g = gradeFor(h, c);
    assert.ok(g.brightness >= BRIGHT_FLOOR, `${h} 點 ${c}F 亮度 ${g.brightness}`);
    assert.ok(g.vig <= 0.85);
  }
  assert.equal(gradeFor(10, 0).filter, "brightness(1.000) saturate(1.000)");
});

test("尋址：要先領委託；送錯給說明不扣分；3 件送對拿紀念章", () => {
  const qs = createQuests();
  assert.equal(deliver(qs, "tablet", "lab").ok, false, "沒領委託不能送");
  takeItems(qs);
  assert.equal(pending(qs).length, 3);
  const wrong = deliver(qs, "tablet", "office");
  assert.equal(wrong.ok, false);
  assert.match(wrong.text, /陳慶鴻/);
  assert.equal(pending(qs).length, 3, "送錯不會消耗物品");
  assert.equal(deliver(qs, "tablet", "lab").ok, true);
  assert.equal(deliver(qs, "tablet", "lab").ok, false, "同一件不能送兩次");
  assert.equal(deliver(qs, "motion", "office").ok, true);
  const last = deliver(qs, "poster", "window");
  assert.equal(last.ok, true);
  assert.equal(last.stamp?.id, "postman");
  assert.equal(pending(qs).length, 0);
});

test("尋址：每件物品都有對應的交付點，每個交付點都在畫面內", () => {
  for (const i of ITEMS) assert.ok(TARGETS.some((t) => t.id === i.to), i.id);
  for (const t of TARGETS) {
    const b = t.box;
    assert.ok(STATIONS[t.station] && b.x >= 0 && b.y >= 0 && b.x + b.w <= 100 && b.y + b.h <= 100, t.id);
  }
});

test("輪廓：每個調查點、交付點、異常都有 SAM 輪廓，座標在畫面內", async () => {
  const { OUTLINES } = await import("../exit6/outlines.mjs");
  const keys = [...STATIONS.flatMap((s, i) => s.spots.map((_, k) => `S${i}:${k}`)), ...TARGETS.map((t) => `T:${t.id}`), ...ANOMALIES.map((a) => a.id)];
  for (const k of keys) {
    assert.ok(OUTLINES[k]?.length, `${k} 沒有輪廓`);
    for (const poly of OUTLINES[k]) {
      assert.ok(poly.length >= 3, `${k} 多邊形點數不足`);
      assert.ok(poly.every(([x, y]) => x >= 0 && x <= 100 && y >= 0 && y <= 100), `${k} 超出畫面`);
    }
  }
});

test("座標：交付點不和同站異常點擊範圍重疊、不和導覽調查點重疊", () => {
  for (const t of TARGETS) {
    for (const a of ANOMALIES.filter((x) => x.station === t.station))
      for (const h of a.hits) assert.ok(!overlap(t.box, h), `${t.id} 壓到 ${a.id}`);
    for (const s of STATIONS[t.station].spots) assert.ok(!overlap(t.box, s), `${t.id} 壓到調查點 ${s.label}`);
  }
});
