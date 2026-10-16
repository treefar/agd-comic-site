"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const R = require("./rules.js");

// 簡易線性同餘偽隨機數產生器（固定種子以測試可重現性）
function createDeterministicRng(seed) {
  let s = (seed || 123456789) >>> 0;
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

test("1. 勝利條件：跑滿 60 秒且未墜落即為獲勝", () => {
  const winStat = { elapsed: 60.0, dead: false };
  assert.equal(R.checkWin(winStat), true, "達到 60 秒且未墜樓應判定為獲勝");

  const winOvertime = { elapsed: 60.5, dead: false };
  assert.equal(R.checkWin(winOvertime), true, "超過 60 秒且未墜樓應判定為獲勝");
});

test("2. 失敗條件：中途失足墜樓或未達 60 秒即為失敗", () => {
  const deadStat = { elapsed: 35.2, dead: true };
  assert.equal(R.checkWin(deadStat), false, "墜樓時即便未到 60 秒也應為失敗");

  const prematureStat = { elapsed: 59.9, dead: false };
  assert.equal(R.checkWin(prematureStat), false, "未滿 60 秒前不應判定過關");

  const overtimeDead = { elapsed: 60.0, dead: true };
  assert.equal(R.checkWin(overtimeDead), false, "若已死亡則不判定為勝利");

  assert.equal(R.checkWin(null), false, "傳入 null 應回傳 false");
});

test("3. 三階難度參數遞增：速度、缺口寬度、最大包絡比例與障礙機率隨階段嚴格遞增", () => {
  const s1 = R.STAGES[0];
  const s2 = R.STAGES[1];
  const s3 = R.STAGES[2];

  assert.equal(s1.tier, 1);
  assert.equal(s2.tier, 2);
  assert.equal(s3.tier, 3);

  // 速度遞增
  assert.ok(s1.speedStart < s2.speedStart, "階段 2 起始速度應大於階段 1");
  assert.ok(s2.speedStart < s3.speedStart, "階段 3 起始速度應大於階段 2");
  assert.ok(s1.speedEnd < s2.speedEnd, "階段 2 結束速度應大於階段 1");
  assert.ok(s2.speedEnd < s3.speedEnd, "階段 3 結束速度應大於階段 2");

  // 最小缺口遞增
  assert.ok(s1.minGap < s2.minGap, "階段 2 最小缺口應大於階段 1");
  assert.ok(s2.minGap < s3.minGap, "階段 3 最小缺口應大於階段 2");

  // 最大缺口比例遞增（越後期越接近跳躍極限）
  assert.ok(s1.maxGapRatio < s2.maxGapRatio, "階段 2 包絡比例應大於階段 1");
  assert.ok(s2.maxGapRatio < s3.maxGapRatio, "階段 3 包絡比例應大於階段 2");

  // 障礙箱機率遞增
  assert.ok(s1.crateChance < s2.crateChance, "階段 2 障礙率應大於階段 1");
  assert.ok(s2.crateChance < s3.crateChance, "階段 3 障礙率應大於階段 2");

  // getStage 階段時間劃分驗證
  assert.equal(R.getStage(0).tier, 1);
  assert.equal(R.getStage(19.9).tier, 1);
  assert.equal(R.getStage(20.0).tier, 2);
  assert.equal(R.getStage(39.9).tier, 2);
  assert.equal(R.getStage(40.0).tier, 3);
  assert.equal(R.getStage(59.9).tier, 3);
});

test("4. 固定 rng 可重現：相同隨機種子生成完全一致的地形與障礙序列", () => {
  const initialBuilding = { x: 0, w: 420, top: 170 };
  const stage = R.STAGES[0];
  const speed = 240;

  const rngA = createDeterministicRng(998877);
  const sequenceA = [];
  let currA = initialBuilding;
  for (let i = 0; i < 6; i++) {
    currA = R.generateBuilding(currA, stage, speed, rngA);
    sequenceA.push(currA);
  }

  const rngB = createDeterministicRng(998877);
  const sequenceB = [];
  let currB = initialBuilding;
  for (let i = 0; i < 6; i++) {
    currB = R.generateBuilding(currB, stage, speed, rngB);
    sequenceB.push(currB);
  }

  assert.equal(sequenceA.length, sequenceB.length);
  for (let i = 0; i < sequenceA.length; i++) {
    const a = sequenceA[i];
    const b = sequenceB[i];
    assert.equal(a.x, b.x, `第 ${i} 棟樓 X 座標應完全一致`);
    assert.equal(a.w, b.w, `第 ${i} 棟樓寬度應完全一致`);
    assert.equal(a.top, b.top, `第 ${i} 棟樓高度應完全一致`);
    assert.equal(a.gap, b.gap, `第 ${i} 棟樓間隔應完全一致`);
    assert.equal(a.crates.length, b.crates.length, `第 ${i} 棟樓障礙數應完全一致`);
    if (a.crates.length > 0) {
      assert.equal(a.crates[0].x, b.crates[0].x, `第 ${i} 棟樓箱子座標應一致`);
    }
  }
});

test("5. isFlawless 正例：過關且全程未撞障礙為 true", () => {
  const perfectRun = { win: true, collisions: 0 };
  assert.equal(R.isFlawless(perfectRun), true, "贏得遊戲且 0 次碰撞應為 flawless");
});

test("6. isFlawless 反例：撞到障礙或未過關皆為 false", () => {
  const hitCrateWin = { win: true, collisions: 1 };
  assert.equal(R.isFlawless(hitCrateWin), false, "有撞到箱子即非 flawless");

  const hitManyWin = { win: true, collisions: 4 };
  assert.equal(R.isFlawless(hitManyWin), false, "多次撞箱非 flawless");

  const zeroCollisionLose = { win: false, collisions: 0 };
  assert.equal(R.isFlawless(zeroCollisionLose), false, "墜樓失敗即使沒撞箱亦非 flawless");

  assert.equal(R.isFlawless(null), false, "傳入 null 應回傳 false");
  assert.equal(R.isFlawless({}), false, "傳入空物件應回傳 false");
});

test("7. score2 是正整數且符合難度中位設定", () => {
  assert.ok(Number.isInteger(R.STARS.score2), "STARS.score2 必須為整數");
  assert.ok(R.STARS.score2 > 0, "STARS.score2 必須大於 0");
  assert.ok(R.STARS.score2 >= 600 && R.STARS.score2 <= 1400, "STARS.score2 應落在合理奔馳範圍");
});

test("8. 跳躍包絡線物理計算：最高點與跨越距離計算精確且大於零", () => {
  const env = R.calculateEnvelope(300, -500, 1500);
  // apex = (-500)^2 / (2 * 1500) = 250000 / 3000 ≈ 83.33px
  assert.ok(Math.abs(env.apex - 83.33) < 0.5, "滯空爬升最高點計算應接近 83.3px");

  // 同高度 (drop = 0) 飛行時間 = 2 * (500 / 1500) = 2/3 秒 ≈ 0.667s
  // 水平距離 = 300 * 0.667 = 200px
  const reachFlat = env.reachFor(0);
  assert.ok(Math.abs(reachFlat - 200) < 1.0, "平地跳躍水平可達距離應接近 200px");

  // 下落 40px (drop = 40) 可達距離應更遠
  const reachDown = env.reachFor(40);
  assert.ok(reachDown > reachFlat, "往下跳時水平距離應大於平地跳躍");
});

test("9. 分數計算：距離四捨五入取整數公尺且保底不為負數", () => {
  assert.equal(R.calculateScore(123.4), 123);
  assert.equal(R.calculateScore(567.8), 567);
  assert.equal(R.calculateScore(0), 0);
  assert.equal(R.calculateScore(-15), 0);
  assert.equal(R.calculateScore(NaN), 0);
});

test("10. evaluateStars 綜合星等評定邏輯正確", () => {
  // 三星完美過關
  const r3 = R.evaluateStars({ win: true, score: 1100, collisions: 0 });
  assert.equal(r3.star1, true);
  assert.equal(r3.star2, true);
  assert.equal(r3.star3, true);
  assert.equal(r3.count, 3);

  // 二星（有撞箱但分數達標過關）
  const r2 = R.evaluateStars({ win: true, score: 1050, collisions: 2 });
  assert.equal(r2.star1, true);
  assert.equal(r2.star2, true);
  assert.equal(r2.star3, false);
  assert.equal(r2.count, 2);

  // 一星（過關但分數未達標且有撞箱）
  const r1 = R.evaluateStars({ win: true, score: 850, collisions: 3 });
  assert.equal(r1.star1, true);
  assert.equal(r1.star2, false);
  assert.equal(r1.star3, false);
  assert.equal(r1.count, 1);

  // 零星（未過關且低分）
  const r0 = R.evaluateStars({ win: false, score: 400, collisions: 1 });
  assert.equal(r0.star1, false);
  assert.equal(r0.star2, false);
  assert.equal(r0.star3, false);
  assert.equal(r0.count, 0);
});
