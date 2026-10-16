const test = require("node:test");
const assert = require("node:assert");
const R = require("./rules.js");

test("勝利條件：60 秒內過關數達 2 關或以上判定為勝利", () => {
  assert.strictEqual(R.isWin({ passedCount: 2 }), true);
  assert.strictEqual(R.isWin({ passedCount: 3 }), true);
});

test("失敗條件：過關數少於 2 關判定為失敗", () => {
  assert.strictEqual(R.isWin({ passedCount: 1 }), false);
  assert.strictEqual(R.isWin({ passedCount: 0 }), false);
  assert.strictEqual(R.isWin(null), false);
  assert.strictEqual(R.isWin({}), false);
});

test("三階參數遞增：難度等級與標準時間隨關卡逐階嚴格遞增", () => {
  assert.strictEqual(R.LEVELS.length, 3);
  assert.ok(R.LEVELS[0].difficulty < R.LEVELS[1].difficulty);
  assert.ok(R.LEVELS[1].difficulty < R.LEVELS[2].difficulty);
  assert.ok(R.LEVELS[0].par < R.LEVELS[1].par);
  assert.ok(R.LEVELS[1].par < R.LEVELS[2].par);
  assert.ok(R.LEVELS[0].id < R.LEVELS[1].id && R.LEVELS[1].id < R.LEVELS[2].id);
});

test("固定 rng 可重現：使用固定種子產生器運算結果必定完全相同", () => {
  function makeRng(seed) {
    let s = seed;
    return function () {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  }
  const trialA1 = R.evaluateRngTrial(makeRng(12345), 6);
  const trialA2 = R.evaluateRngTrial(makeRng(12345), 6);
  assert.deepStrictEqual(trialA1, trialA2);

  const trialB = R.evaluateRngTrial(makeRng(67890), 6);
  assert.notDeepStrictEqual(trialA1, trialB);
});

test("isFlawless 正例：達成勝利且每一關皆一次成功抵達終點（無摔倒、無重試）", () => {
  const perfect2 = { passedCount: 2, attempts: [1, 1], crashes: 0, resets: 0 };
  assert.strictEqual(R.isFlawless(perfect2), true);

  const perfect3 = { passedCount: 3, attempts: [1, 1, 1], crashes: 0, resets: 0 };
  assert.strictEqual(R.isFlawless(perfect3), true);

  const perfectTotal = { passedCount: 3, totalAttempts: 3, crashes: 0, resets: 0 };
  assert.strictEqual(R.isFlawless(perfectTotal), true);
});

test("isFlawless 反例：發生摔倒、手動重置、嘗試多次或未達通關標準時不成立", () => {
  // 摔倒過
  assert.strictEqual(R.isFlawless({ passedCount: 2, attempts: [1, 1], crashes: 1, resets: 0 }), false);
  // 重試過
  assert.strictEqual(R.isFlawless({ passedCount: 2, attempts: [1, 1], crashes: 0, resets: 1 }), false);
  // 單關嘗試超過 1 次
  assert.strictEqual(R.isFlawless({ passedCount: 2, attempts: [1, 2], crashes: 0, resets: 0 }), false);
  assert.strictEqual(R.isFlawless({ passedCount: 3, totalAttempts: 4, crashes: 0, resets: 0 }), false);
  // 失敗次數 > 0
  assert.strictEqual(R.isFlawless({ passedCount: 2, attempts: [1, 1], failedAttempts: 1 }), false);
  // 未達過 2 關標準
  assert.strictEqual(R.isFlawless({ passedCount: 1, attempts: [1], crashes: 0, resets: 0 }), false);
  assert.strictEqual(R.isFlawless(null), false);
});

test("score2 是正整數且星等計算規則正確", () => {
  assert.strictEqual(Number.isInteger(R.STARS.score2), true);
  assert.ok(R.STARS.score2 > 0);
  assert.strictEqual(typeof R.STARS.flawless, "string");
  assert.ok(R.STARS.flawless.length > 0 && R.STARS.flawless.length <= 10);

  // 0 星：未獲勝
  assert.strictEqual(R.calcStars({ passedCount: 1, remainingSeconds: 10 }), 0);

  // 1 星：過關但未達 score2 且非 flawless
  assert.strictEqual(R.calcStars({ passedCount: 2, inkRatio: 0.2, remainingSeconds: 10, crashes: 1 }), 1);

  // 2 星：達成 score >= score2 (2500)
  // 2*1000 + 0.8*500 + 20*10 = 2000 + 400 + 200 = 2600 >= 2500
  assert.strictEqual(
    R.calcStars({ passedCount: 2, inkRatio: 0.8, remainingSeconds: 20, crashes: 1 }),
    2
  );

  // 3 星：達成 score >= score2 且 flawless
  assert.strictEqual(
    R.calcStars({ passedCount: 3, inkRatio: 0.8, remainingSeconds: 20, attempts: [1, 1, 1], crashes: 0, resets: 0 }),
    3
  );
});

test("calcScore 計分公式精確度與邊界值驗證", () => {
  // 過關數×1000＋剩餘墨水比例×500（取整）＋剩餘秒數×10
  assert.strictEqual(R.calcScore({ passedCount: 0, inkRatio: 0, remainingSeconds: 0 }), 0);

  // 2 關、剩餘墨水 0.5、剩餘 15 秒: 2000 + 250 + 150 = 2400
  assert.strictEqual(R.calcScore({ passedCount: 2, inkRatio: 0.5, remainingSeconds: 15 }), 2400);

  // 3 關、剩餘墨水 0.333 (166.5 -> 167)、剩餘 25 秒: 3000 + 167 + 250 = 3417
  assert.strictEqual(
    R.calcScore({ passedCount: 3, inkRatio: 0.333, remainingSeconds: 25 }),
    3000 + Math.round(0.333 * 500) + 250
  );

  // 墨水比例邊界夾取驗證
  assert.strictEqual(R.calcScore({ passedCount: 2, inkRatio: 1.5, remainingSeconds: 0 }), 2000 + 500);
  assert.strictEqual(R.calcScore({ passedCount: 2, inkRatio: -0.5, remainingSeconds: 0 }), 2000 + 0);
});
