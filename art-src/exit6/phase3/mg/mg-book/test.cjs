const test = require('node:test');
const assert = require('node:assert');
const R = require('./rules.js');

const EPSILON = 1e-4;

function approxEqual(a, b, eps = EPSILON) {
  return Math.abs(a - b) < eps;
}

function makeLcg(seed) {
  let s = (seed || 1) >>> 0;
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

test('1. 勝利條件：爬升高度達到封面頁目標即判定為勝利', () => {
  const target = R.TARGET_HEIGHT; // 80m

  // 爬到 80m
  const resExact = R.checkGameStatus(80, target, 35, 200, 100, 600);
  assert.strictEqual(resExact.over, true);
  assert.strictEqual(resExact.win, true);
  assert.strictEqual(resExact.reason, 'reach_cover');

  // 超過 80m
  const resAbove = R.checkGameStatus(82.5, target, 20, 150, 80, 600);
  assert.strictEqual(resAbove.over, true);
  assert.strictEqual(resAbove.win, true);

  // 勝利分數計算包含時間加成與通關獎勵
  const scoreWin = R.calculateScore(80, 4, 30, true);
  const scoreBase = R.calculateScore(80, 4, 0, false);
  assert.ok(scoreWin > scoreBase);
});

test('2. 失敗條件：角色墜落低於鏡頭下緣或 60 秒時間耗盡判定為失敗', () => {
  const target = R.TARGET_HEIGHT;
  const camY = 100;
  const screenH = 600;

  // 角色墜落到底部鏡頭外 (playerY > camY + screenH + 20 = 720)
  const resFall = R.checkGameStatus(35, target, 40, 725, camY, screenH);
  assert.strictEqual(resFall.over, true);
  assert.strictEqual(resFall.win, false);
  assert.strictEqual(resFall.reason, 'fall');

  // 時間到 (timeLeft <= 0)
  const resTimeout = R.checkGameStatus(60, target, 0, 300, camY, screenH);
  assert.strictEqual(resTimeout.over, true);
  assert.strictEqual(resTimeout.win, false);
  assert.strictEqual(resTimeout.reason, 'timeout');

  // 正常遊戲中
  const resPlaying = R.checkGameStatus(40, target, 25, 300, camY, screenH);
  assert.strictEqual(resPlaying.over, false);
  assert.strictEqual(resPlaying.win, false);
  assert.strictEqual(resPlaying.reason, 'playing');
});

test('3. 難度三階：參數隨階段推進遞增挑戰（平台寬度遞減、移動比例與速度遞增）', () => {
  // 時間映射到階數
  assert.strictEqual(R.getTier(0), 1);
  assert.strictEqual(R.getTier(19.9), 1);
  assert.strictEqual(R.getTier(20.0), 2);
  assert.strictEqual(R.getTier(39.9), 2);
  assert.strictEqual(R.getTier(40.0), 3);
  assert.strictEqual(R.getTier(59.9), 3);

  const cfg1 = R.getTierConfig(1);
  const cfg2 = R.getTierConfig(2);
  const cfg3 = R.getTierConfig(3);

  // 平台寬度由寬變窄 (90 -> 68 -> 50)
  assert.ok(cfg1.platWidth > cfg2.platWidth);
  assert.ok(cfg2.platWidth > cfg3.platWidth);

  // 移動平台比例由 0 遞增到 0.5
  assert.ok(cfg1.moveRatio < cfg2.moveRatio);
  assert.ok(cfg2.moveRatio < cfg3.moveRatio);

  // 移動平台速度遞增 (0 -> 55 -> 85)
  assert.ok(cfg1.moveSpeed < cfg2.moveSpeed);
  assert.ok(cfg2.moveSpeed < cfg3.moveSpeed);

  // 間距上限由小變大
  assert.ok(cfg1.gapMax <= cfg2.gapMax);
  assert.ok(cfg2.gapMax <= cfg3.gapMax);
});

test('4. 亂數決定性：傳入固定 rng 函式時平台生成完全可重現', () => {
  const rngA = makeLcg(42);
  const stateA = { tier: 1, topY: 500, topX: 200 };
  const platsA = [];
  for (let i = 0; i < 15; i++) {
    stateA.tier = i < 5 ? 1 : (i < 10 ? 2 : 3);
    platsA.push(R.generatePlatform(stateA, rngA, 400));
  }

  const rngB = makeLcg(42);
  const stateB = { tier: 1, topY: 500, topX: 200 };
  const platsB = [];
  for (let i = 0; i < 15; i++) {
    stateB.tier = i < 5 ? 1 : (i < 10 ? 2 : 3);
    platsB.push(R.generatePlatform(stateB, rngB, 400));
  }

  assert.strictEqual(platsA.length, platsB.length);
  for (let i = 0; i < platsA.length; i++) {
    assert.ok(approxEqual(platsA[i].x, platsB[i].x, EPSILON));
    assert.ok(approxEqual(platsA[i].y, platsB[i].y, EPSILON));
    assert.strictEqual(platsA[i].w, platsB[i].w);
    assert.strictEqual(platsA[i].kind, platsB[i].kind);
    assert.strictEqual(platsA[i].dir, platsB[i].dir);
    if (platsA[i].part) {
      assert.ok(platsB[i].part);
      assert.strictEqual(platsA[i].part.type, platsB[i].part.type);
    } else {
      assert.strictEqual(platsB[i].part, null);
    }
  }
});

test('5. 邊界值與跳躍保證：相鄰平台垂直距離嚴格小於等於理論跳躍高度上限', () => {
  // 理論極限 jumpHeight = v^2 / 2g = (-560)^2 / (2 * 1200) = 313600 / 2400 ≈ 130.6667
  const maxTheoryJump = R.getMaxJumpHeight(R.BOUNCE_SPEED, R.GRAVITY);
  assert.ok(approxEqual(maxTheoryJump, 313600 / 2400, 1e-2));

  // 實測生成 100 塊平台，每兩塊相鄰垂直距離不能超過 maxTheoryJump * 0.75
  const rng = makeLcg(12345);
  const state = { tier: 1, topY: 1000, topX: 200 };
  let prevY = state.topY;

  for (let i = 0; i < 100; i++) {
    state.tier = (i % 3) + 1;
    const plat = R.generatePlatform(state, rng, 400);
    const verticalGap = prevY - plat.y;

    assert.ok(verticalGap > 0, '相鄰平台必須往上爬升');
    assert.ok(
      verticalGap <= maxTheoryJump + EPSILON,
      `垂直間距 ${verticalGap} 超出理論跳躍極限 ${maxTheoryJump}`
    );
    // 同時必須小於等於設定的安全上限 (maxTheoryJump * 0.75 ≈ 98)
    assert.ok(verticalGap <= maxTheoryJump * 0.75 + EPSILON);

    prevY = plat.y;
  }

  // 邊界值：高度剛好在 79.999 (未達) vs 80.0 (到達)
  const resBefore = R.checkGameStatus(79.999, 80, 10, 200, 100, 600);
  assert.strictEqual(resBefore.over, false);
  const resAt = R.checkGameStatus(80.0, 80, 10, 200, 100, 600);
  assert.strictEqual(resAt.over, true);
  assert.strictEqual(resAt.win, true);

  // 邊界值：時間剛好在 0.0001 (未超時) vs 0.0000 (超時)
  const resTimeLeft = R.checkGameStatus(50, 80, 0.0001, 200, 100, 600);
  assert.strictEqual(resTimeLeft.over, false);
  const resTimeOut = R.checkGameStatus(50, 80, 0.0, 200, 100, 600);
  assert.strictEqual(resTimeOut.over, true);
  assert.strictEqual(resTimeOut.win, false);
});

test('6. 碰撞與收集判定：落點在平台頂部有效反彈、零件接觸時正確收集', () => {
  const platform = R.createPlatform(100, 200, 68, 'normal');

  // 下墜中且腳底觸碰平台頂部 -> 判定踩中
  const playerLanding = { x: 120, y: 170, w: 24, h: 30, vy: 150 };
  assert.strictEqual(R.checkPlatformLanding(playerLanding, platform), true);

  // 上升中穿過平台 (vy < 0) -> 不阻擋不反彈
  const playerRising = { x: 120, y: 170, w: 24, h: 30, vy: -200 };
  assert.strictEqual(R.checkPlatformLanding(playerRising, platform), false);

  // 水平位置落在平台外 -> 不會踩中
  const playerFarLeft = { x: 50, y: 170, w: 24, h: 30, vy: 150 };
  assert.strictEqual(R.checkPlatformLanding(playerFarLeft, platform), false);

  // 零件收集判定
  const part = { type: 'hat', collected: false };
  platform.part = part;

  // 玩家碰觸零件
  const playerTouchPart = { x: 120, y: 165, w: 24, h: 30 };
  assert.strictEqual(R.checkPartCollect(playerTouchPart, part, platform), true);

  // 玩家距離零件太遠
  const playerFarAway = { x: 250, y: 165, w: 24, h: 30 };
  assert.strictEqual(R.checkPartCollect(playerFarAway, part, platform), false);

  // 零件若已收集過則不可重複收集
  part.collected = true;
  assert.strictEqual(R.checkPartCollect(playerTouchPart, part, platform), false);
});

test('7. 剪影評語選擇：依據收集到的零件提供對應專業角色造型回饋', () => {
  // 4 樣齊全
  const critiqueAll = R.getSilhouetteCritique({ hat: true, eyes: true, scarf: true, accessory: true });
  assert.ok(critiqueAll.includes('全齊'));
  assert.ok(critiqueAll.includes('外輪廓'));

  // 帽子與圍巾
  const critiqueHatScarf = R.getSilhouetteCritique({ hat: true, scarf: true });
  assert.ok(critiqueHatScarf.includes('帽子'));
  assert.ok(critiqueHatScarf.includes('圍巾'));

  // 帽子與配件
  const critiqueHatAcc = R.getSilhouetteCritique({ hat: true, accessory: true });
  assert.ok(critiqueHatAcc.includes('帽子'));
  assert.ok(critiqueHatAcc.includes('配件'));

  // 0 樣零件（純幾何原型）
  const critiqueNone = R.getSilhouetteCritique({});
  assert.ok(critiqueNone.includes('幾何原型'));
  assert.ok(critiqueNone.includes('剪影'));
});

test('8. 共通修正驗證：遊戲結束畫面移除遊戲內「再玩一次」按鈕，重玩由宿主 index.html 負責', () => {
  const fs = require('node:fs');
  const path = require('node:path');

  const gameJs = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  // 1. game.js 遊戲內不應有「再玩一次」按鈕繪製與字串
  assert.strictEqual(
    /再玩一次/.test(gameJs),
    false,
    'game.js 結算畫面應移除遊戲內的「再玩一次」按鈕文字'
  );

  // 2. index.html 宿主層必須保留「再玩一次」按鈕與重啟機制
  assert.ok(
    /id=["']host-replay-btn["']/.test(indexHtml),
    'index.html 應保留 host-replay-btn 宿主按鈕'
  );
  assert.ok(
    /再玩一次/.test(indexHtml),
    'index.html 應保留「再玩一次」按鈕文字'
  );

  // 3. 結算畫面元素完整保留：勝負、分數、專長知識
  assert.ok(typeof R.calculateScore === 'function', '分數計算函式需存在');
  assert.ok(typeof R.checkGameStatus === 'function', '勝負狀態判定需存在');
  assert.ok(typeof R.getSilhouetteCritique === 'function', '造型評語回饋需存在');
  assert.ok(
    typeof R.DOMAIN_LESSON === 'string' && R.DOMAIN_LESSON.length > 0,
    '專長核心知識句需完整保留'
  );
  assert.ok(
    R.DOMAIN_LESSON.includes('剪影') && R.DOMAIN_LESSON.includes('特徵配件'),
    '專長知識內容需包含核心概念'
  );
});
