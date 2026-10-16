// 殺青派對規則：抽遊戲、輪流順序、同輪名次與並列、總排名、分享文字
import test from "node:test";
import assert from "node:assert/strict";
import { mulberry32 } from "../exit6/game-core.mjs";
import { PARTY_POOL, PARTY_ROUNDS, cleanNames, createParty, current, submit, isDone, roundRanking, standings, champions, partyShareText } from "../exit6/party.mjs";

const playAll = (p, scoreOf) => { while (!isDone(p)) { const c = current(p); submit(p, { score: scoreOf(c), win: false }); } };

test("名字：人數夾在 2～4、空白補預設、過長截斷", () => {
  assert.deepEqual(cleanNames([], 1), ["玩家 1", "玩家 2"]);
  assert.deepEqual(cleanNames(["  小明  ", "", "一二三四五六七八九十"], 3), ["小明", "玩家 2", "一二三四五六七八"]);
  assert.equal(cleanNames([], 9).length, 4);
});

test("抽 3 款不重複、都在遊戲池裡；10 個種子看抽法有變化", () => {
  const ids = new Set(PARTY_POOL.map((g) => g.mg));
  const combos = new Set();
  for (let s = 1; s <= 10; s++) {
    const p = createParty(["A", "B"], mulberry32(s));
    assert.equal(p.games.length, PARTY_ROUNDS);
    assert.equal(new Set(p.games).size, PARTY_ROUNDS);
    assert.ok(p.games.every((g) => ids.has(g)));
    assert.ok(p.games.every((g) => g !== "mg-3d" && g !== "lab-d0637"), "排除要連網與太長的兩款");
    combos.add(p.games.join(","));
  }
  assert.ok(combos.size >= 7, `組合要有變化（${combos.size}）`);
});

test("輪流順序：每輪每人一次，同一輪同一個種子，玩完回 null", () => {
  const p = createParty(["A", "B", "C"], mulberry32(7));
  const seen = [];
  while (!isDone(p)) { const c = current(p); seen.push(`${c.round}${c.player}`); assert.equal(c.seed, p.seeds[c.round]); const r = submit(p, { score: 1 }); if (c.turn === 2) assert.equal(r.roundDone, true); }
  assert.deepEqual(seen, ["0A", "0B", "0C", "1A", "1B", "1C", "2A", "2B", "2C"]);
  assert.equal(current(p), null);
  assert.deepEqual(submit(p, { score: 5 }), { roundDone: false, done: true });
});

test("同輪名次：分數高者先，同分並列拿同樣積分；壞分數當 0", () => {
  const p = createParty(["A", "B", "C", "D"], mulberry32(3));
  [{ score: 50 }, { score: 80 }, { score: 50 }, undefined].forEach((r) => submit(p, r));
  const rk = roundRanking(p, 0);
  assert.deepEqual(rk.map((r) => [r.name, r.place, r.points]), [["B", 1, 3], ["A", 2, 2], ["C", 2, 2], ["D", 4, 0]]);
});

test("總排名與冠軍：積分加總、同積分比第一次數、全同就並列冠軍", () => {
  const p = createParty(["A", "B"], mulberry32(5));
  const table = { A: [10, 0, 10], B: [0, 10, 0] };
  playAll(p, (c) => table[c.player][c.round]);
  assert.deepEqual(standings(p).map((t) => [t.name, t.points, t.place]), [["A", 8, 1], ["B", 7, 2]]);
  assert.deepEqual(champions(p).map((t) => t.name), ["A"]);
  const q = createParty(["A", "B"], mulberry32(5));
  playAll(q, () => 3);
  assert.deepEqual(champions(q).map((t) => t.name), ["A", "B"]);
  assert.match(partyShareText(q), /冠軍是 A、B/);
});
