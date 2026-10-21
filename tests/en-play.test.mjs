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

test("創作不斷線：碰撞遮罩三段都從起點連到終點", () => {
  const src = fs.readFileSync(path.join(root, "play/creative-line/masks.js"), "utf8");
  const MASKS = JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));
  for (const name of ["lab_d0637", "lab_d0604", "lab_d0633"]) {
    const m = MASKS[name];
    assert.ok(m, `缺 ${name}`);
    for (const plane of ["normal", "coarse"]) {
      const bits = Buffer.from(m[plane], "base64");
      const ok = (x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && (bits[(y * m.w + x) >> 3] >> ((y * m.w + x) & 7)) & 1;
      const s = m.start.map((v) => Math.round(v / m.cell)), e = m.end.map((v) => v / m.cell);
      assert.ok(ok(s[0], s[1]), `${name}/${plane} 起點不在可走區`);
      const seen = new Set([s.join()]), q = [s];
      let reach = false;
      while (q.length && !reach) {
        const [x, y] = q.shift();
        if (Math.hypot(x - e[0], y - e[1]) < 9) reach = true;
        for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = [x + a, y + b]; if (ok(...k) && !seen.has(k.join())) { seen.add(k.join()); q.push(k); } }
      }
      assert.ok(reach, `${name}/${plane} 起點走不到終點`);
      // 障礙一定要存在：可走格不能超過全畫面的 45%（防止遮罩漏到牆上或整張圖）
      let n = 0; for (let i = 0; i < m.w * m.h; i++) n += (bits[i >> 3] >> (i & 7)) & 1;
      assert.ok(n < m.w * m.h * 0.45, `${name}/${plane} 可走區過大（${n} 格），可能漏色`);
    }
  }
});

test("創作不斷線：用到的素材檔都存在，課程名稱都在 curriculum.json 裡", () => {
  const base = path.join(root, "play/creative-line");
  for (const k of ["orb", "spark", "confetti", "stamp"]) assert.ok(fs.existsSync(path.join(base, `art/fx2/${k}.png`)), `缺 art/fx2/${k}.png`);
  for (const k of ["lab_d0637", "lab_d0604", "lab_d0633", "s0"]) assert.ok(fs.existsSync(path.join(base, `art/scene/${k}.webp`)), `缺 art/scene/${k}.webp`);
  const lv = fs.readFileSync(path.join(base, "levels.js"), "utf8");
  const cur = read("data/curriculum.json").tracks.flatMap((t) => t.courses.flat().map((c) => c.name));
  for (const m of lv.matchAll(/course: \{ name: "([^"]+)"/g)) assert.ok(cur.includes(m[1]), `課程「${m[1]}」不在 curriculum.json`);
  for (const m of lv.matchAll(/labSlug: "([^"]+)"/g)) assert.ok(read("data/labs.json").some((x) => x.slug === m[1]), `labs 沒有 ${m[1]}`);
  assert.ok(read("data/faculty.json").some((x) => x.slug === "chiangyamei"), "faculty 沒有 chiangyamei");
  // 三關要有三種不同的玩法
  assert.deepEqual([...lv.matchAll(/twist: "(\w+)"/g)].map((m) => m[1]), ["step", "ink", "spring"]);
  assert.ok(read("data/works.json").some((x) => x.id === "stolen-recipe"), "works 沒有 stolen-recipe");
});

test("bundle.js 已包含英文頁與試玩區", () => {
  const b = fs.readFileSync(path.join(root, "bundle.js"), "utf8");
  for (const s of ["PlayZone", "EnglishIntro", "en/faculty", "play/zone"]) assert.ok(b.includes(s), `bundle 缺 ${s}`);
});

test('試玩區：五款都有雙語製作與授權欄位',()=>{
  for(const g of read('data/play.json').games)for(const k of ['team','year','license','credit'])for(const lang of ['zh','en']){
    assert.equal(typeof g[k]?.[lang],'string',`${g.id}.${k}.${lang}`);assert.ok(g[k][lang].trim(),`${g.id}.${k}.${lang} 空白`);
  }
});
