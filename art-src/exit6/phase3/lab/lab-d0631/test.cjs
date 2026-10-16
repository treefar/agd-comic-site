const test = require("node:test");
const assert = require("node:assert/strict");
const R = require("./rules.js");

test("1. 勝利條件：得分達到或超過 WIN_SCORE (60) 判定為勝利", () => {
  assert.equal(R.isWin(60), true);
  assert.equal(R.isWin(61), true);
  assert.equal(R.isWin(120), true);
});

test("2. 失敗條件：得分未達 WIN_SCORE (60) 判定為失敗", () => {
  assert.equal(R.isWin(59), false);
  assert.equal(R.isWin(0), false);
  assert.equal(R.isWin(-10), false);
  assert.equal(R.isWin(null), false);
  assert.equal(R.isWin(undefined), false);
});

test("3. 三階參數遞增：距離與難度遞增，靶面大小逐階縮小", () => {
  assert.equal(R.STAGES.length, 3);
  const [s1, s2, s3] = R.STAGES;

  // 距離逐階增加
  assert.ok(s1.distanceM < s2.distanceM);
  assert.ok(s2.distanceM < s3.distanceM);

  // 靶大小逐階縮小（難度提高）
  assert.ok(s1.targetScale > s2.targetScale);
  assert.ok(s2.targetScale > s3.targetScale);

  // 風速絕對值第 3 階最大
  assert.ok(Math.abs(s3.windMps) > Math.abs(s2.windMps));
  assert.ok(Math.abs(s2.windMps) > Math.abs(s1.windMps));

  // 關卡時間銜接完整 0~60 秒
  assert.equal(R.getStageIndex(0), 0);
  assert.equal(R.getStageIndex(19.9), 0);
  assert.equal(R.getStageIndex(20), 1);
  assert.equal(R.getStageIndex(39.9), 1);
  assert.equal(R.getStageIndex(40), 2);
  assert.equal(R.getStageIndex(60), 2);
});

test("4. 固定 rng 可重現：使用相同的 pseudo rng 產生完全相同的彈道與落點", () => {
  function makeMockRng(values) {
    let i = 0;
    return () => {
      const v = values[i % values.length];
      i += 1;
      return v;
    };
  }

  const seq = [0.25, 0.49, 0.1, 0.8];
  const rngA = makeMockRng(seq);
  const rngB = makeMockRng(seq);

  const aim = { x: 0.1, y: -0.05 };
  const stage = R.STAGES[1];
  const shotA = R.calculateShotImpact(aim, 1.2, stage, rngA);
  const shotB = R.calculateShotImpact(aim, 1.2, stage, rngB);

  assert.ok(Math.abs(shotA.impactX - shotB.impactX) < 1e-9);
  assert.ok(Math.abs(shotA.impactY - shotB.impactY) < 1e-9);
  assert.ok(Math.abs(shotA.flightTime - shotB.flightTime) < 1e-9);
  assert.ok(Math.abs(shotA.jitterX - shotB.jitterX) < 1e-9);
});

test("5. isFlawless 正反例：每箭都上靶判定", () => {
  // 正例：射出多箭且全部上靶、無失誤
  assert.equal(R.isFlawless({ shotsFired: 12, hits: 12, misses: 0 }), true);
  assert.equal(R.isFlawless({ shotsFired: 1, hits: 1, misses: 0 }), true);

  // 反例：有脫靶
  assert.equal(R.isFlawless({ shotsFired: 12, hits: 11, misses: 1 }), false);
  assert.equal(R.isFlawless({ shotsFired: 10, hits: 0, misses: 10 }), false);

  // 反例：未射出任何箭
  assert.equal(R.isFlawless({ shotsFired: 0, hits: 0, misses: 0 }), false);

  // 反例：空值或無效物件
  assert.equal(R.isFlawless(null), false);
  assert.equal(R.isFlawless({}), false);
});

test("6. score2 是正整數且大於 WIN_SCORE", () => {
  assert.equal(Number.isInteger(R.SCORE2), true);
  assert.ok(R.SCORE2 > 0);
  assert.ok(R.SCORE2 > R.WIN_SCORE);
  assert.equal(R.SCORE2, 100);
});

test("7. 命中環數與計分判定：正中靶心為 10 分、外環為 1 分、超出為 0 分脫靶", () => {
  const targetPos = { x: 0, y: 0 };
  const targetScale = 1.0;

  // 正中靶心 (radial < 0.1)
  const bullseye = R.judgeImpact({ impactX: 0.02, impactY: 0.03 }, targetPos, targetScale);
  assert.equal(bullseye.isHit, true);
  assert.equal(bullseye.score, 10);

  // 中圈 (radial 約 0.55，應得 10 - 5 = 5 分)
  const mid = R.judgeImpact({ impactX: 0.55, impactY: 0 }, targetPos, targetScale);
  assert.equal(mid.isHit, true);
  assert.equal(mid.score, 5);

  // 壓邊外環 (radial 約 0.95，應得 1 分)
  const edge = R.judgeImpact({ impactX: 0.95, impactY: 0 }, targetPos, targetScale);
  assert.equal(edge.isHit, true);
  assert.equal(edge.score, 1);

  // 脫靶 (radial >= 1.0)
  const miss = R.judgeImpact({ impactX: 1.05, impactY: 0 }, targetPos, targetScale);
  assert.equal(miss.isHit, false);
  assert.equal(miss.score, 0);
});

test("8. 蓄力手感曲線：在 FOCUS_BEST_AT (1.15s) 達到最佳聚光半徑", () => {
  const startRadius = R.calculateFocusRadius(0);
  const bestRadius = R.calculateFocusRadius(1.15);
  const lateRadius = R.calculateFocusRadius(4.60);

  assert.ok(Math.abs(startRadius - R.FOCUS_START_RADIUS) < 1e-6);
  assert.ok(Math.abs(bestRadius - R.FOCUS_BEST_RADIUS) < 1e-6);
  assert.ok(bestRadius < startRadius);
  assert.ok(bestRadius < lateRadius);

  // 力道隨蓄力時間增長至 1.0
  const power0 = R.calculateDrawPower(0);
  const powerFull = R.calculateDrawPower(1.0);
  assert.equal(power0, R.MIN_DRAW_POWER);
  assert.equal(powerFull, 1.0);
});
