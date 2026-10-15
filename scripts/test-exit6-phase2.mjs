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

test("線索：4 條線索的數字依序拼起來等於密碼；只在循環圈出現；路燈限晚上", async () => {
  const { CLUES, CODE, visibleClues } = await import("../exit6/clues.mjs");
  assert.equal(CLUES.map((c) => c.digit).join(""), CODE);
  assert.equal(visibleClues(3, 21, "tour").length, 0, "導覽圈不出現線索");
  assert.equal(visibleClues(3, 10, "loop").length, 0, "白天看不到路燈線索");
  assert.equal(visibleClues(3, 21, "loop").length, 1, "晚上看得到路燈線索");
  assert.equal(CLUES.filter((c) => !c.night).every((c) => visibleClues(c.station, 10, "loop").includes(c)), true);
});

test("線索：點擊範圍不和同站異常、交付點重疊，且都有輪廓", async () => {
  const { CLUES } = await import("../exit6/clues.mjs");
  const { OUTLINES } = await import("../exit6/outlines.mjs");
  for (const c of CLUES) {
    for (const a of ANOMALIES.filter((x) => x.station === c.station)) for (const h of a.hits) assert.ok(!overlap(c.box, h), `${c.id} 壓到 ${a.id}`);
    for (const t of TARGETS.filter((x) => x.station === c.station)) assert.ok(!overlap(c.box, t.box), `${c.id} 壓到交付點 ${t.id}`);
    assert.ok(OUTLINES[c.outline]?.length, `${c.id} 沒有輪廓 ${c.outline}`);
  }
});

test("密碼門：沒集齊不能開；位數不對、部分正確都有提示；正確才開", async () => {
  const { CLUES, CODE, createClues, collect, tryCode, allFound } = await import("../exit6/clues.mjs");
  const st = createClues();
  assert.equal(tryCode(st, CODE).ok, false);
  for (const c of CLUES) assert.equal(collect(st, c.id), true);
  assert.equal(collect(st, CLUES[0].id), false, "同一條不重複收");
  assert.ok(allFound(st));
  assert.match(tryCode(st, "12").text, /4 個數字/);
  assert.match(tryCode(st, CODE.slice(0, 2) + "99").text, /2 碼/);
  assert.equal(st.opened, false);
  assert.equal(tryCode(st, CODE).ok, true);
  assert.equal(st.opened, true);
});

test("座標：同一站的導覽調查點互不重疊（2026-10-15 系辦門口「兩側海報」蓋住「門上告示」導致卡關）", () => {
  for (const s of STATIONS) {
    for (let i = 0; i < s.spots.length; i++) for (let j = i + 1; j < s.spots.length; j++)
      assert.ok(!overlap(s.spots[i], s.spots[j]), `${s.id}「${s.spots[i].label}」和「${s.spots[j].label}」重疊`);
  }
});

test("座標：可點物件的中心不被畫面角落的手帳鈕、岔路鈕蓋住", async () => {
  const { CLUES } = await import("../exit6/clues.mjs");
  const corners = [{ x: 84, y: 84, w: 16, h: 16 }, { x: 0, y: 84, w: 22, h: 16 }];   // 右下手帳、左下岔路（約略範圍）
  const center = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2, w: 0.01, h: 0.01 });
  const all = [...STATIONS.flatMap((s) => s.spots.map((p) => [`${s.id} ${p.label}`, p])), ...TARGETS.map((t) => [`交付 ${t.id}`, t.box]), ...CLUES.map((c) => [`線索 ${c.id}`, c.box])];
  for (const [name, b] of all) for (const c of corners) assert.ok(!overlap(center(b), c), `${name} 的中心被角落按鈕蓋住`);
});

test("座標：交付點不和同站異常點擊範圍重疊、不和導覽調查點重疊", () => {
  for (const t of TARGETS) {
    for (const a of ANOMALIES.filter((x) => x.station === t.station))
      for (const h of a.hits) assert.ok(!overlap(t.box, h), `${t.id} 壓到 ${a.id}`);
    for (const s of STATIONS[t.station].spots) assert.ok(!overlap(t.box, s), `${t.id} 壓到調查點 ${s.label}`);
  }
});
