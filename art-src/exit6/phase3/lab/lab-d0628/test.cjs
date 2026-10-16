const test = require('node:test');
const assert = require('node:assert');
const R = require('./rules.js');

test('1. 勝利條件：60 秒內完成 8 層（消 8 行）判定獲勝', () => {
  // 剛好達標 8 層且時間大於 0
  assert.strictEqual(R.checkWin(8, 25), true);
  // 超過 8 層
  assert.strictEqual(R.checkWin(10, 5), true);
  // 邊界值：剛好 0 秒完成第 8 層
  assert.strictEqual(R.checkWin(8, 0), true);
  // 未達 8 層不獲勝
  assert.strictEqual(R.checkWin(7, 30), false);
  assert.strictEqual(R.checkWin(0, 60), false);
});

test('2. 失敗條件：方塊堆疊到頂（Top-Out）或時間耗盡未滿 8 層', () => {
  // 時間耗盡但未滿 8 層
  assert.strictEqual(R.checkWin(7, -0.1), false);
  assert.strictEqual(R.checkWin(5, 0), false);

  // 頂出（Top-Out）：出生點被佔滿碰撞
  const board = R.createBoard(10, 16);
  // 將出生點（row 0, row 1 的 x=3..6）佔滿
  board[0][3] = '#1d4ed8';
  board[0][4] = '#1d4ed8';
  board[0][5] = '#1d4ed8';
  const spawnPiece = { type: 'T', rot: 0, x: 3, y: 0 };
  const isBlocked = R.collide(board, spawnPiece, 0, 0, 0);
  assert.strictEqual(isBlocked, true, '出生位置有阻擋時必須觸發碰撞頂出');
});

test('3. 三階參數遞增：隨時間前進，下落間隔縮短（速度遞增）', () => {
  const tier1 = R.getTier(5);  // 0~20s
  const tier2 = R.getTier(25); // 20~40s
  const tier3 = R.getTier(45); // 40~60s

  assert.strictEqual(tier1.tier, 1);
  assert.strictEqual(tier2.tier, 2);
  assert.strictEqual(tier3.tier, 3);

  // 驗證速度隨階級上升（下落間隔秒數遞減）
  assert.ok(tier1.dropInterval > tier2.dropInterval, '第二階下落速度應快於第一階');
  assert.ok(tier2.dropInterval > tier3.dropInterval, '第三階下落速度應快於第二階');
  assert.strictEqual(tier1.dropInterval, 0.8);
  assert.strictEqual(tier2.dropInterval, 0.5);
  assert.strictEqual(tier3.dropInterval, 0.25);
});

test('4. 固定 rng 可重現：自訂偽隨機數產生器序列一致性', () => {
  // 建立確定性線性同餘產生器 (LCG)
  function createLcg(seed) {
    let s = seed;
    return function () {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  }

  const rng1 = createLcg(12345);
  const bag1 = R.shuffleBag(rng1);

  const rng2 = createLcg(12345);
  const bag2 = R.shuffleBag(rng2);

  // 驗證完全重現
  assert.deepStrictEqual(bag1, bag2, '相同種子產生的 7-bag 必須完全一致');
  // 驗證 7 種形狀無遺漏
  assert.strictEqual(bag1.length, 7);
  for (const t of R.TYPES) {
    assert.ok(bag1.includes(t), `7-bag 必須包含 ${t}`);
  }
});

test('5. isFlawless 正反例：過關且全程堆疊最高點從未超過盤面一半（8 格）', () => {
  // 正例 1：獲勝，最高堆疊剛好 8 格（未超過一半）
  assert.strictEqual(R.isFlawless({ won: true, maxStackHeight: 8 }), true);

  // 正例 2：獲勝，最高堆疊僅 4 格
  assert.strictEqual(R.isFlawless({ won: true, maxStackHeight: 4 }), true);

  // 正例 3：以 exceededHalf: false 表示
  assert.strictEqual(R.isFlawless({ won: true, exceededHalf: false }), true);

  // 反例 1：獲勝，但堆疊高達 9 格（超過 8 格盤面一半）
  assert.strictEqual(R.isFlawless({ won: true, maxStackHeight: 9 }), false);

  // 反例 2：獲勝，但 exceededHalf 為 true
  assert.strictEqual(R.isFlawless({ won: true, exceededHalf: true }), false);

  // 反例 3：堆疊很低（3 格）但遊戲失敗（win=false）
  assert.strictEqual(R.isFlawless({ won: false, maxStackHeight: 3 }), false);

  // 反例 4：無效參數
  assert.strictEqual(R.isFlawless(null), false);
  assert.strictEqual(R.isFlawless({ won: false }), false);
});

test('6. score2 是正整數且高於純單行通關的基本分', () => {
  assert.strictEqual(typeof R.SCORE2, 'number');
  assert.strictEqual(Number.isInteger(R.SCORE2), true);
  assert.ok(R.SCORE2 > 0);
  // 單消 8 行的基準分為 8 * 100 = 800 分，二星 1000 分需要至少雙消或多消
  assert.ok(R.SCORE2 > 800, 'score2 必須高於消 8 行的純單行底分');
});

test('7. 計分公式：層數×100＋一次消多行加成（2 行 +100、3 行 +300、4 行 +600）', () => {
  // 消除 1 行：1 * 100 + 0 = 100
  assert.strictEqual(R.calculateLineScore(1), 100);

  // 消除 2 行：2 * 100 + 100 = 300
  assert.strictEqual(R.calculateLineScore(2), 300);

  // 消除 3 行：3 * 100 + 300 = 600
  assert.strictEqual(R.calculateLineScore(3), 600);

  // 消除 4 行：4 * 100 + 600 = 1000
  assert.strictEqual(R.calculateLineScore(4), 1000);

  // 邊界值
  assert.strictEqual(R.calculateLineScore(0), 0);
});

test('8. 星等計算：依勝負、score2 與 flawless 判定 0～3 顆星', () => {
  // 未獲勝：0 星
  assert.strictEqual(R.calculateStars({ win: false, score: 1500, flawless: true }), 0);

  // ★1：僅獲勝（分數未達 1000 且有溢料）
  assert.strictEqual(R.calculateStars({ win: true, score: 800, flawless: false }), 1);

  // ★★：獲勝且分數達標（無無暇）
  assert.strictEqual(R.calculateStars({ win: true, score: 1000, flawless: false }), 2);

  // ★★：獲勝且無暇（分數未達標）
  assert.strictEqual(R.calculateStars({ win: true, score: 800, flawless: true }), 2);

  // ★★★：獲勝、分數達標且無暇
  assert.strictEqual(R.calculateStars({ win: true, score: 1200, flawless: true }), 3);
});

test('9. 盤面尺寸與堆疊高度計算驗證', () => {
  assert.strictEqual(R.COLS, 10, '盤面寬度為 10 格');
  assert.strictEqual(R.ROWS, 16, '盤面高度為 16 格');

  const board = R.createBoard(10, 16);
  assert.strictEqual(R.getStackHeight(board), 0, '空盤面高度為 0');

  // 填入最底下一排（row 15）
  board[15][0] = '#1d4ed8';
  assert.strictEqual(R.getStackHeight(board), 1, '底層一排高度為 1');

  // 填入 row 8（從底部數來第 8 格，盤面一半）
  board[8][4] = '#ffd60a';
  assert.strictEqual(R.getStackHeight(board), 8, '堆到第 8 格高度為 8');

  // 填入 row 7（超過一半）
  board[7][4] = '#e63946';
  assert.strictEqual(R.getStackHeight(board), 9, '堆到第 7 格高度為 9（超過盤面一半）');
});
