// 回歸測試：英文資料檔與中文版結構一致、受保護欄位未改；試玩區清單指到的檔案都存在
// 執行：node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8").replace(/^﻿/, ""));
const PROTECTED = new Set(["id", "slug", "key", "code", "color", "photo", "photoFallback", "image", "email", "ext", "date", "en", "nameEn", "titleEn"]);

function sameShape(a, b, where) {
  assert.equal(Array.isArray(a), Array.isArray(b), `型別不同 ${where}`);
  if (Array.isArray(a)) {
    assert.equal(a.length, b.length, `陣列長度不同 ${where}`);
    a.forEach((x, i) => sameShape(x, b[i], `${where}[${i}]`));
  } else if (a && typeof a === "object") {
    assert.deepEqual(Object.keys(b), Object.keys(a), `鍵不同 ${where}`);
    for (const k of Object.keys(a)) {
      if (PROTECTED.has(k) && typeof a[k] !== "object") assert.equal(b[k], a[k], `受保護欄位被改 ${where}.${k}`);
      else sameShape(a[k], b[k], `${where}.${k}`);
    }
  } else if (typeof a !== "string") {
    assert.equal(b, a, `非字串值被改 ${where}`);
  }
}

for (const name of ["faculty", "curriculum", "labs", "works", "videos", "stats", "news", "admission"]) {
  test(`data/en/${name}.json 與中文版結構一致`, () => {
    sameShape(read(`data/${name}.json`), read(`data/en/${name}.json`), name);
  });
}

test("play.json 每款遊戲的入口與封面都存在、層級有效", () => {
  const play = read("data/play.json");
  const tiers = new Set(play.tiers.map((t) => t.key));
  assert.ok(play.games.length > 0);
  for (const g of play.games) {
    assert.ok(tiers.has(g.tier), `${g.id} 的 tier 無效`);
    assert.ok(g.title.zh && g.title.en, `${g.id} 缺中英標題`);
    if (g.mode !== "link") assert.ok(fs.existsSync(path.join(root, g.src)), `${g.id} 找不到 ${g.src}`);
    if (g.poster) assert.ok(fs.existsSync(path.join(root, g.poster)), `${g.id} 找不到封面 ${g.poster}`);
  }
});

test("bundle.js 已包含英文頁與試玩區", () => {
  const b = fs.readFileSync(path.join(root, "bundle.js"), "utf8");
  for (const s of ["PlayZone", "EnglishIntro", "en/faculty", "play/zone"]) assert.ok(b.includes(s), `bundle 缺 ${s}`);
});
