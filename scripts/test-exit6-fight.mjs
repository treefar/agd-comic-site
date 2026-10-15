// 《六樓出口》片場對決回歸測試：指令辨識容錯、時間窗、對戰流程
// 用法：node --test scripts/test-exit6-fight.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { matches, MOVES, ATTACKS, FINISHER, createFight, nextRound, input, timeout, windowFor, GAP_MS, QIU_HP, PLAYER_HP } from "../exit6/fight.mjs";

// 依序輸入，間隔 step 毫秒
const seq = (keys, step = 150, t0 = 1000) => keys.map((k, i) => ({ k, t: t0 + i * step }));

test("辨識：完整指令成立", () => {
  for (const m of Object.values(MOVES)) assert.ok(matches(seq(m.cmd), m.cmd), m.name);
});

test("辨識：斜方向可省略（↓ → A 算推軌連段；→ ↓ A 算荷蘭角迴旋）", () => {
  assert.ok(matches(seq(["D", "R", "A"]), MOVES.dolly.cmd));
  assert.ok(matches(seq(["R", "D", "A"]), MOVES.dutch.cmd));
});

test("辨識：前面多按的雜鍵與重複方向不影響", () => {
  assert.ok(matches(seq(["U", "L", "D", "D", "DR", "R", "A"]), MOVES.dolly.cmd));
  assert.ok(matches(seq(["R", "R", "L", "A"]), MOVES.pan.cmd));
});

test("辨識：方向錯或順序錯不成立", () => {
  assert.ok(!matches(seq(["R", "A"]), MOVES.pan.cmd));
  assert.ok(!matches(seq(["R", "DR", "D", "A"]), MOVES.dolly.cmd));
  assert.ok(!matches(seq(["D", "A"]), MOVES.low.cmd));
});

test("辨識：按太慢（間隔超過上限）不成立；中間夾動作鍵會斷掉", () => {
  assert.ok(!matches(seq(["D", "DR", "R", "A"], GAP_MS + 50), MOVES.dolly.cmd));
  assert.ok(!matches(seq(["D", "A", "R", "A"]), MOVES.dolly.cmd));
});

test("對戰：血剩 1 時一定出大絕，要用荷蘭角迴旋收尾", () => {
  const f = createFight(() => 0);
  f.qiu = 1;
  assert.equal(nextRound(f, 0).id, FINISHER.id);
  assert.equal(FINISHER.counter, "dutch");
});

test("對戰：反擊成功扣邱老師血；打完 5 下獲勝", () => {
  const f = createFight(() => 0);
  let t = 0, last;
  for (let i = 0; i < QIU_HP; i++) {
    const atk = nextRound(f, t);
    for (const k of MOVES[atk.counter].cmd) last = input(f, k, (t += 120));
    assert.equal(last.type, "hit");
    t += 1000;
  }
  assert.equal(f.qiu, 0);
  assert.equal(last.over, "win");
});

test("對戰：按錯動作鍵或時間到都扣玩家血；3 次失敗輸掉", () => {
  const f = createFight(() => 0);
  nextRound(f, 0);
  assert.equal(input(f, "A", 100).type, "miss");      // 沒對上就按動作鍵
  nextRound(f, 1000);
  assert.equal(timeout(f, 500), null, "還沒到時間");
  assert.equal(timeout(f, 1000 + windowFor(2)).type, "miss");
  nextRound(f, 9000);
  const r = timeout(f, 9000 + windowFor(3));
  assert.equal(r.over, "lose");
  assert.equal(f.me, 0);
  assert.equal(PLAYER_HP, 3);
});

test("對戰：同一招不會連續兩回合出現（固定亂數也一樣）", () => {
  for (const r of [() => 0, () => 0.99, () => 0.5]) {
    const f = createFight(r);
    let prev = null;
    for (let i = 0; i < 20; i++) {
      f.qiu = QIU_HP;                     // 不讓它進大絕
      const a = nextRound(f, i * 1000);
      assert.notEqual(a.id, prev, `第 ${i + 1} 回合重複 ${a.id}`);
      prev = a.id;
    }
  }
});

test("對戰：時間窗越來越短但不低於 1.5 秒；每招都有對應反擊", () => {
  assert.ok(windowFor(1) > windowFor(5));
  assert.equal(windowFor(30), 1500);
  for (const a of [...ATTACKS, FINISHER]) assert.ok(MOVES[a.counter], a.id);
});
