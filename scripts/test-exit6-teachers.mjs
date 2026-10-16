// 《六樓出口》老師關卡回歸測試：老師與站點對應、發卡、集滿、名字同意閘門、檔案齊全
// 用法：node --test scripts/test-exit6-teachers.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEACHERS, CONSENTED, displayName, createCards, award, allCollected, teacherAt, scriptsFor, THREE_URL } from "../exit6/teachers.mjs";
import { STATIONS } from "../exit6/data.mjs";

const EXIT6 = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "exit6");

test("老師：5 位、id 與小遊戲不重複、各在不同站、站點存在", () => {
  assert.equal(TEACHERS.length, 5);
  for (const k of ["id", "mg", "station"]) assert.equal(new Set(TEACHERS.map((t) => t[k])).size, 5, `${k} 重複`);
  for (const t of TEACHERS) assert.ok(STATIONS[t.station], `${t.id} 的站 ${t.station} 不存在`);
});

test("名字閘門：沒有本人同意的老師不得出現本名，畫面顯示專長代稱", () => {
  for (const t of TEACHERS) {
    assert.ok(t.name === null || CONSENTED.includes(t.name), `${t.id} 用了未登記同意的名字 ${t.name}`);
    assert.equal(displayName(t), t.name || t.title);
    assert.match(t.title, /老師$/);
  }
});

test("每位老師的小遊戲檔與卡面圖都在 exit6 底下", () => {
  for (const t of TEACHERS) {
    for (const f of scriptsFor(t)) if (!f.startsWith("http")) assert.ok(fs.existsSync(path.join(EXIT6, f)), `${t.id} 缺 ${f}`);
    assert.ok(fs.existsSync(path.join(EXIT6, t.card)), `${t.id} 缺卡面 ${t.card}`);
  }
  const t3 = TEACHERS.find((t) => t.mg === "mg-3d");
  assert.equal(scriptsFor(t3)[0], THREE_URL, "3D 關卡要先載 Three.js");
  assert.match(THREE_URL, /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\//);
});

test("發卡：只有贏才發；同一張不重複，但最高分會更新", () => {
  const st = createCards();
  assert.equal(award(st, "anim", { win: false, score: 999 }).got, false);
  assert.equal(st.cards.length, 0);
  const a = award(st, "anim", { win: true, score: 100 });
  assert.equal(a.got, true); assert.equal(a.first, true);
  const b = award(st, "anim", { win: true, score: 300 });
  assert.equal(b.first, false);
  assert.equal(st.cards.length, 1);
  assert.equal(st.cards[0].best, 300);
  award(st, "anim", { win: true, score: 50 });
  assert.equal(st.cards[0].best, 300, "低分不覆蓋最高分");
  assert.equal(award(st, "nobody", { win: true, score: 1 }).got, false, "不存在的老師不發卡");
});

test("集滿：5 張都拿到才算；第 5 張回報 completed 一次", () => {
  const st = createCards();
  let done = 0;
  TEACHERS.forEach((t, i) => { const r = award(st, t.id, { win: true, score: i }); if (r.completed) done++; });
  assert.ok(allCollected(st));
  assert.equal(done, 1);
  assert.equal(award(st, TEACHERS[0].id, { win: true, score: 9 }).completed, false, "已集滿後再贏不再觸發");
});

test("讀舊存檔：壞資料不會讓遊戲壞掉", () => {
  assert.deepEqual(createCards(undefined).cards, []);
  assert.deepEqual(createCards("亂碼").cards, []);
  assert.deepEqual(createCards([{ id: "anim", best: 5 }, { id: "ghost", best: 1 }, null]).cards.map((c) => c.id), ["anim"]);
});

test("老師只在循環圈出現，導覽圈不出現", () => {
  for (const t of TEACHERS) {
    assert.equal(teacherAt(t.station, "loop")?.id, t.id);
    assert.equal(teacherAt(t.station, "tour"), null);
  }
  const empty = STATIONS.map((_, i) => i).find((i) => !TEACHERS.some((t) => t.station === i));
  assert.equal(teacherAt(empty, "loop"), null);
});
