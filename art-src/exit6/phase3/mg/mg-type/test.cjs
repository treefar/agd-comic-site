/**
 * mg-type「字體對撞」單元測試
 * 執行指令：node --test mg/mg-type/test.cjs
 */
const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const R = require("./rules.js");

describe("mg-type「字體對撞」純規則與物理計算測試", () => {
  test("1. 四種字體風格參數特性檢驗（粗黑、明體、圓體、楷體）", () => {
    const { bold, serif, round, script } = R.FONTS;

    // 粗黑體：重量最重、擊退力道最高
    assert.ok(bold.mass > serif.mass && bold.mass > round.mass && bold.mass > script.mass);
    assert.ok(bold.kickPower > serif.kickPower && bold.kickPower > round.kickPower);

    // 明體：反擊強，反擊參數最高
    assert.ok(serif.counterPower > bold.counterPower && serif.counterPower > round.counterPower);
    assert.ok(serif.counterPower > script.counterPower);

    // 圓體：彈性最高
    assert.ok(round.elasticity > bold.elasticity && round.elasticity > serif.elasticity);
    assert.ok(round.elasticity > script.elasticity);

    // 楷體：轉向最靈活、角速度最快
    assert.ok(script.turnSpeed > bold.turnSpeed && script.turnSpeed > serif.turnSpeed);
    assert.ok(script.turnSpeed > round.turnSpeed);
  });

  test("2. 輸入文字解析與字陣頂點計算邊界值", () => {
    // 空字串或非字串預設為「動遊系」
    assert.deepEqual(R.parseCharacters(""), ["動", "遊", "系"]);
    assert.deepEqual(R.parseCharacters("   "), ["動", "遊", "系"]);
    assert.deepEqual(R.parseCharacters(null), ["動", "遊", "系"]);

    // 1 個字、2 個字與 3 個字
    assert.deepEqual(R.parseCharacters("字"), ["字"]);
    assert.deepEqual(R.parseCharacters("視覺"), ["視", "覺"]);  // 主控修正：原期望自相矛盾
    assert.deepEqual(R.parseCharacters("傳達設"), ["傳", "達", "設"]);

    // 超過 3 個字截斷為前 3 字
    assert.deepEqual(R.parseCharacters("視覺傳達設計"), ["視", "覺", "傳"]);

    // 頂點佈局計算
    const p1 = R.computeGlyphPositions(100, 100, 0, 1, 40);
    assert.equal(p1.length, 1);
    assert.ok(Math.abs(p1[0].x - 100) < 1e-4);

    const p3 = R.computeGlyphPositions(0, 0, 0, 3, 40);
    assert.equal(p3.length, 3);
    for (const pt of p3) {
      const dist = Math.hypot(pt.x, pt.y);
      assert.ok(Math.abs(dist - 40) < 1e-4, "頂點到中心距離應為半徑 40");
    }
  });

  test("3. 出界判定與擂台半徑縮圈計算", () => {
    const r280 = 280;
    // 中心點不出界
    assert.equal(R.isOutOfBounds(0, 0, r280), false);
    // 擂台內部不出界
    assert.equal(R.isOutOfBounds(100, 100, r280), false);
    // 臨界邊緣出界判定
    assert.equal(R.isOutOfBounds(275, 0, r280), true);
    assert.equal(R.isOutOfBounds(300, 0, r280), true);

    // 擂台縮圈計算（0~20秒為 280，隨時間縮小，60秒為 190）
    assert.ok(Math.abs(R.getArenaRadius(0) - 280) < 1e-4);
    assert.ok(Math.abs(R.getArenaRadius(20) - 280) < 1e-4);
    assert.ok(Math.abs(R.getArenaRadius(60) - 190) < 1e-4);
    assert.ok(R.getArenaRadius(50) < R.getArenaRadius(30), "第 3 階擂台半徑必須縮小");
  });

  test("4. 三階難度參數遞增驗證", () => {
    const s1 = R.getStage(5);
    const s2 = R.getStage(25);
    const s3 = R.getStage(45);

    assert.equal(s1.stage, 1);
    assert.equal(s2.stage, 2);
    assert.equal(s3.stage, 3);

    // 電腦追擊速度與侵略性三階遞增
    assert.ok(s1.aiSpeed < s2.aiSpeed && s2.aiSpeed < s3.aiSpeed, "電腦速度需三階遞增");
    assert.ok(s1.aiAggression < s2.aiAggression && s2.aiAggression < s3.aiAggression, "電腦侵略性需三階遞增");
    assert.ok(s1.aiTurnSpeed < s2.aiTurnSpeed && s2.aiTurnSpeed < s3.aiTurnSpeed, "轉向速度需三階遞增");
    assert.ok(s1.aiDashInterval > s2.aiDashInterval && s2.aiDashInterval > s3.aiDashInterval, "衝刺冷卻三階縮短");
  });

  test("5. 固定亂數（RNG）重現性與 AI 行為驗證", () => {
    // 簡易確定性 RNG
    function makeRng(seed) {
      let s = seed;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    }

    const stage = R.getStage(25);
    const player = { x: 50, y: 0 };
    const enemyInit = { x: -50, y: 0, vx: 0, vy: 0, angle: 0, dashTimer: 0.1 };

    const rng1 = makeRng(12345);
    const res1 = R.updateAI(enemyInit, player, stage, 0.05, rng1);

    const rng2 = makeRng(12345);
    const res2 = R.updateAI(enemyInit, player, stage, 0.05, rng2);

    // 相同種子結果完全一致
    assert.ok(Math.abs(res1.x - res2.x) < 1e-6);
    assert.ok(Math.abs(res1.y - res2.y) < 1e-6);
    assert.ok(Math.abs(res1.vx - res2.vx) < 1e-6);
    assert.ok(Math.abs(res1.angle - res2.angle) < 1e-6);
    assert.equal(res1.shouldDash, res2.shouldDash);
  });

  test("6. 碰撞偵測與不同字體質量擊退計算", () => {
    // 碰撞偵測
    const hit = R.checkGlyphCollision({ x: 0, y: 0 }, { x: 30, y: 0 }, 20, 20);
    assert.equal(hit.collided, true);
    assert.ok(Math.abs(hit.penetration - 10) < 1e-4);

    const miss = R.checkGlyphCollision({ x: 0, y: 0 }, { x: 50, y: 0 }, 20, 20);
    assert.equal(miss.collided, false);

    // 粗黑體（重）撞擊楷體（輕）
    const bold = R.FONTS.bold;
    const script = R.FONTS.script;
    const knockback = R.calcKnockback(
      { vx: 100, vy: 0 },
      { vx: -50, vy: 0 },
      bold,
      script,
      1,
      0
    );

    // 楷體質量較小，獲得的反向衝擊速度增量（絕對值）應大於粗黑體
    const deltaVBold = Math.abs(knockback.deltaVelA.vx);
    const deltaVScript = Math.abs(knockback.deltaVelB.vx);
    assert.ok(deltaVScript > deltaVBold, "輕質量的楷體受撞擊退速度變化應大於粗黑體");
  });

  test("7. 勝負與結算規則全涵蓋測試", () => {
    // 勝利條件 1：電腦全員被撞出場
    const r1 = R.evaluateMatchResult(2, 0, 150, 0, 30);
    assert.equal(r1.finished, true);
    assert.equal(r1.win, true);

    // 失敗條件 1：我方全員被撞出場
    const r2 = R.evaluateMatchResult(0, 2, 0, 150, 30);
    assert.equal(r2.finished, true);
    assert.equal(r2.win, false);

    // 勝利條件 2：60 秒時間到，我方字數較多
    const r3 = R.evaluateMatchResult(3, 1, 200, 80, 60);
    assert.equal(r3.finished, true);
    assert.equal(r3.win, true);

    // 失敗條件 2：60 秒時間到，對手字數較多
    const r4 = R.evaluateMatchResult(1, 2, 90, 160, 60);
    assert.equal(r4.finished, true);
    assert.equal(r4.win, false);

    // 勝利條件 3：時間到字數相同，我方耐久較高
    const r5 = R.evaluateMatchResult(2, 2, 180, 120, 60);
    assert.equal(r5.finished, true);
    assert.equal(r5.win, true);

    // 失敗條件 3：時間到字數相同，對手耐久較高
    const r6 = R.evaluateMatchResult(2, 2, 110, 170, 60);
    assert.equal(r6.finished, true);
    assert.equal(r6.win, false);

    // 平手條件：字數與耐久皆相同
    const r7 = R.evaluateMatchResult(2, 2, 100, 100, 60);
    assert.equal(r7.finished, true);
    assert.equal(r7.draw, true);

    // 未結束狀態
    const r8 = R.evaluateMatchResult(2, 2, 150, 150, 35);
    assert.equal(r8.finished, false);
  });

  test("8. 第 1 階單次衝刺擊退後，最多 1 個字出界", () => {
    const s1 = R.STAGE_CONFIGS[0];
    assert.equal(s1.stage, 1);
    // 驗證第 1 階質量與抗擊退設定
    assert.ok(s1.aiMassMultiplier >= 2.0, "第 1 階電腦字陣質量倍率需 >= 2.0");
    assert.ok(s1.aiKnockbackResistance >= 0.5, "第 1 階電腦抗擊退係數需 >= 0.5");

    // 四種玩家字體對四種電腦字體，從起始位置（x=90）發動單次衝刺
    for (const pKey of Object.keys(R.FONTS)) {
      for (const eKey of Object.keys(R.FONTS)) {
        const sim = R.simulateSingleDash(R.FONTS[pKey], R.FONTS[eKey], s1, { startX: 90 });
        assert.ok(
          sim.outCount <= 1,
          `第 1 階單次衝刺擊退後最多 1 個字出界（${pKey} 撞 ${eKey} 出界數：${sim.outCount}）`
        );
      }
    }

    // 驗證衝刺冷卻下限至少 1.2 秒
    assert.ok(R.MIN_DASH_COOLDOWN >= 1.2, "衝刺冷卻下限需 >= 1.2 秒");
    for (const key of Object.keys(R.FONTS)) {
      assert.ok(
        R.getDashCooldown(key) >= 1.2,
        `${key} 衝刺冷卻需 >= 1.2 秒，實際為 ${R.getDashCooldown(key)}`
      );
    }
  });

  test("9. 提前獲勝的結算時間 ≥ 10 秒與開局 3 秒示範時間", () => {
    // 開局 3 秒示範時間驗證
    assert.equal(R.DEMO_DURATION, 3.0, "示範時間應為 3.0 秒");
    assert.equal(R.isDemoTime(0), true);
    assert.equal(R.isDemoTime(2.9), true);
    assert.equal(R.isDemoTime(3.0), false);

    // 示範時間內電腦 AI 不得衝刺
    const stage1 = R.STAGE_CONFIGS[0];
    const aiInDemo = R.updateAI(
      { x: 90, y: 0, vx: 0, vy: 0, angle: Math.PI, dashTimer: 0 },
      { x: -90, y: 0 },
      stage1,
      0.05,
      () => 0.01,
      1.5 // 處於 1.5 秒示範時間
    );
    assert.equal(aiInDemo.shouldDash, false, "示範時間內電腦 AI 嚴禁衝刺");

    // 提前獲勝結算時間 ≥ 10 秒
    // 狀況 A：開局 2 秒把對手全撞飛出圈，不可立即結算，需等待並標註「完勝！」
    const earlyRes = R.evaluateMatchResult(3, 0, 300, 0, 2.0);
    assert.equal(earlyRes.finished, false, "開局 2 秒全出圈不得結算");
    assert.equal(earlyRes.pendingWin, true, "應處於提前獲勝等待狀態");
    assert.equal(earlyRes.statusText, "完勝！");

    // 狀況 B：開局 8 秒把對手全撞飛出圈，不可立即結算
    const earlyRes8 = R.evaluateMatchResult(3, 0, 300, 0, 8.0);
    assert.equal(earlyRes8.finished, false, "開局 8 秒全出圈不得結算");
    assert.equal(earlyRes8.pendingWin, true);
    assert.equal(earlyRes8.statusText, "完勝！");

    // 狀況 C：時間到達 10 秒，正式結算獲勝
    const settleRes10 = R.evaluateMatchResult(3, 0, 300, 0, 10.0);
    assert.equal(settleRes10.finished, true, "到達 10 秒時應觸發正式結算");
    assert.equal(settleRes10.win, true);
    assert.ok(settleRes10.settlementTime >= 10, "提前獲勝結算時間需 >= 10 秒");
    assert.equal(settleRes10.statusText, "完勝！");

    // 狀況 D：時間 15 秒打光，結算時間為 15 秒（>= 10 秒）
    const settleRes15 = R.evaluateMatchResult(3, 0, 300, 0, 15.0);
    assert.equal(settleRes15.finished, true);
    assert.equal(settleRes15.win, true);
    assert.ok(settleRes15.settlementTime >= 10, "提前獲勝結算時間需 >= 10 秒");
  });
});
