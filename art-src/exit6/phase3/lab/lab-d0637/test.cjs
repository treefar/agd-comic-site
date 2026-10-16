/**
 * lab-d0637「影格接龍」單元測試
 * 執行方式：node --test lab/lab-d0637/test.cjs
 * 遵守 orders/_lab-contract.md 與 orders/_mg-contract.md
 */
const test = require("node:test");
const assert = require("node:assert");
const R = require("./rules.js");

// 偽隨機數產生器（固定 seed，保證可重現）
function createLCG(seed) {
  let s = seed >>> 0;
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

test("1. 勝利條件：完成第 1、2 輪為勝利，未滿 2 輪為未勝", () => {
  assert.strictEqual(R.isGameWin(0), false, "0 輪未勝");
  assert.strictEqual(R.isGameWin(1), false, "只完成 1 輪未勝");
  assert.strictEqual(R.isGameWin(2), true, "完成 1、2 輪即獲勝");
  assert.strictEqual(R.isGameWin(3), true, "完成 3 輪亦獲勝");
});

test("2. 失敗條件：超時或未達成完成 2 輪為失敗", () => {
  assert.strictEqual(R.isGameWin(-1), false);
  assert.strictEqual(R.isGameWin(null), false);
  assert.strictEqual(R.isGameWin(undefined), false);

  // 結算狀態判定
  const loseStats = { win: false, completedBands: 1, remainingSeconds: 0, wrongDrops: 2 };
  assert.strictEqual(loseStats.win, false, "結算狀態為失敗");
  const stars = R.calcStars(loseStats);
  assert.strictEqual(stars.count, 0, "失敗者獲得 0 顆星");
  assert.strictEqual(stars.star1, false);
});

test("3. 三階參數嚴格遞增：帶數、卡牌數、蓋牌數隨輪次遞增", () => {
  assert.strictEqual(R.ROUNDS.length, 3, "共有三階（三輪）");
  const r1 = R.ROUNDS[0];
  const r2 = R.ROUNDS[1];
  const r3 = R.ROUNDS[2];

  // 帶數遞增：1 -> 2 -> 3
  assert.ok(r1.bands.length < r2.bands.length, "第 2 輪帶數大於第 1 輪");
  assert.ok(r2.bands.length < r3.bands.length, "第 3 輪帶數大於第 2 輪");

  // 卡牌總數遞增：6 -> 12 -> 18
  assert.ok(r1.cardCount < r2.cardCount, "第 2 輪卡牌數大於第 1 輪");
  assert.ok(r2.cardCount < r3.cardCount, "第 3 輪卡牌數大於第 2 輪");

  // 蓋牌數遞增：0 -> 2 -> 5
  assert.ok(r1.faceDownCount < r2.faceDownCount, "第 2 輪蓋牌數大於第 1 輪");
  assert.ok(r2.faceDownCount < r3.faceDownCount, "第 3 輪蓋牌數大於第 2 輪");

  // 牌疊欄位數適度增加
  assert.ok(r1.pileCount <= r2.pileCount);
  assert.ok(r2.pileCount <= r3.pileCount);
});

test("4. 固定 rng 可重現：傳入相同 seed 的亂數函式產出一致盤面", () => {
  const rngA = createLCG(12345);
  const rngB = createLCG(12345);

  const boardA = R.createSolvableBoard(1, rngA);
  const boardB = R.createSolvableBoard(1, rngB);

  assert.strictEqual(boardA.piles.length, boardB.piles.length, "欄位數一致");
  for (let p = 0; p < boardA.piles.length; p++) {
    assert.strictEqual(boardA.piles[p].length, boardB.piles[p].length, `欄位 ${p} 牌數一致`);
    for (let c = 0; c < boardA.piles[p].length; c++) {
      assert.strictEqual(boardA.piles[p][c].color, boardB.piles[p][c].color);
      assert.strictEqual(boardA.piles[p][c].rank, boardB.piles[p][c].rank);
      assert.strictEqual(boardA.piles[p][c].up, boardB.piles[p][c].up);
    }
  }
});

test("5. isFlawless 正反例：零失誤且獲勝才為 true", () => {
  // 正例：獲勝且放錯 0 次
  assert.strictEqual(R.isFlawless({ win: true, wrongDrops: 0 }), true);

  // 反例：獲勝但有放錯
  assert.strictEqual(R.isFlawless({ win: true, wrongDrops: 1 }), false);
  assert.strictEqual(R.isFlawless({ win: true, wrongDrops: 5 }), false);

  // 反例：未獲勝即使 0 放錯
  assert.strictEqual(R.isFlawless({ win: false, wrongDrops: 0 }), false);
  assert.strictEqual(R.isFlawless(null), false);
  assert.strictEqual(R.isFlawless(undefined), false);
});

test("6. score2 是正整數且設定合理", () => {
  assert.ok(typeof R.SCORE2 === "number", "SCORE2 必須為數字");
  assert.ok(Number.isInteger(R.SCORE2), "SCORE2 必須為整數");
  assert.ok(R.SCORE2 > 0, "SCORE2 必須為正整數");
  assert.strictEqual(R.SCORE2, 1000, "SCORE2 設為 1000 分，符合兩輪完成水準");
});

test("7. 保證有解：isSolvable 驗證盤面可解性與死局反例", () => {
  // 7-1.（主控 2026-10-16 改）每輪 200 個種子：只用「疊頂 → 時間軸」貪婪解，必須全部解完；而且牌局要有變化
  const greedy = (board, bands) => {
    const b = R.cloneBoard(board);
    for (let moved = true; moved;) {
      moved = false;
      for (const pile of b.piles) {
        const top = pile[pile.length - 1];
        if (top && b.timelines[top.color].length === top.rank - 1) {
          b.timelines[top.color].push(pile.pop()); moved = true;
          if (pile.length) pile[pile.length - 1].up = true;
        }
      }
    }
    return bands.every((c) => b.timelines[c].length === 6);
  };
  for (let r = 0; r < 3; r++) {
    const seen = new Set();
    for (let s = 0; s < 200; s++) {
      const board = R.createSolvableBoard(r, createLCG(9876 + r * 100 + s * 7));
      assert.strictEqual(greedy(board, R.ROUNDS[r].bands), true, `第 ${r + 1} 輪種子 ${s} 要能解完`);
      const downs = board.piles.flat().filter((c) => !c.up).length;
      assert.strictEqual(downs, R.ROUNDS[r].faceDownCount, `第 ${r + 1} 輪蓋牌數`);
      assert.ok(board.piles.every((p) => !p.length || p[p.length - 1].up), "疊頂一定翻開");
      seen.add(JSON.stringify(board.piles.map((p) => p.map((c) => c.id))));
    }
    assert.ok(seen.size > 150, `第 ${r + 1} 輪牌局要有變化（實際 ${seen.size} 種）`);
  }

  // 7-2. 構造無解反例（死局）：
  // 只有 1 欄，且紅 2 壓在紅 1 上，且紅 1 是蓋牌；無其他空欄也無其他牌
  // 此時紅 2 不能進時間軸（因為時間軸需要紅 1），紅 2 也無法移往其他地方，永遠無法翻開紅 1
  const deadEndBoard = {
    piles: [
      [
        { id: "r1", color: "red", rank: 1, up: false },
        { id: "r2", color: "red", rank: 2, up: true }
      ]
    ],
    timelines: { red: [], blue: [], yellow: [] }
  };
  const isDeadSolvable = R.isSolvable(deadEndBoard, ["red"], 200);
  assert.strictEqual(isDeadSolvable, false, "死局盤面回傳 false");
});

test("8. 計分公式精準測試：完成帶數×300＋剩餘秒數×10－放錯次數×20（最低 0）", () => {
  // 3 帶、剩餘 25 秒、放錯 2 次：3*300 + 25*10 - 2*20 = 900 + 250 - 40 = 1110
  const score1 = R.calcScore({ completedBands: 3, remainingSeconds: 25, wrongDrops: 2 });
  assert.strictEqual(score1, 1110);

  // 極端放錯過多扣至負數時，保證最低 0 分
  const score2 = R.calcScore({ completedBands: 0, remainingSeconds: 5, wrongDrops: 50 });
  assert.strictEqual(score2, 0);

  // 空值防禦
  assert.strictEqual(R.calcScore(null), 0);
});

test("9. 時間軸槽放置規則：必須同色且從 1 依序放到 6", () => {
  const redCard1 = { color: "red", rank: 1 };
  const redCard2 = { color: "red", rank: 2 };
  const redCard3 = { color: "red", rank: 3 };
  const blueCard1 = { color: "blue", rank: 1 };

  // 空槽只能放同色 1
  assert.strictEqual(R.canStackTimeline(redCard1, [], "red"), true);
  assert.strictEqual(R.canStackTimeline(redCard2, [], "red"), false, "空槽不可直接放 2");
  assert.strictEqual(R.canStackTimeline(blueCard1, [], "red"), false, "顏色不合不可放");

  // 已有紅 1 的槽，只能放紅 2
  const timelineWithRed1 = [redCard1];
  assert.strictEqual(R.canStackTimeline(redCard2, timelineWithRed1, "red"), true);
  assert.strictEqual(R.canStackTimeline(redCard3, timelineWithRed1, "red"), false);
  assert.strictEqual(R.canStackTimeline(redCard1, timelineWithRed1, "red"), false);
});

test("10. 牌疊疊放規則：只能疊在同色上一格號碼「大 1」的牌上，空欄可放任意牌", () => {
  const red4 = { color: "red", rank: 4, up: true };
  const red3 = { color: "red", rank: 3, up: true };
  const red2 = { color: "red", rank: 2, up: true };
  const blue3 = { color: "blue", rank: 3, up: true };
  const red4Down = { color: "red", rank: 4, up: false };

  // 紅 3 疊在紅 4 上：合法
  assert.strictEqual(R.canStackTableau(red3, [red4]), true);

  // 紅 2 疊在紅 4 上：非法（差 2 號）
  assert.strictEqual(R.canStackTableau(red2, [red4]), false);

  // 藍 3 疊在紅 4 上：非法（不同色）
  assert.strictEqual(R.canStackTableau(blue3, [red4]), false);

  // 疊在蓋著的牌上：非法
  assert.strictEqual(R.canStackTableau(red3, [red4Down]), false);

  // 空欄可以放任何牌方便暫放
  assert.strictEqual(R.canStackTableau(red3, []), true);
  assert.strictEqual(R.canStackTableau(blue3, []), true);
});
