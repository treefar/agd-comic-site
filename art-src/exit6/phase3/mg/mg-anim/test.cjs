const test = require("node:test");
const assert = require("node:assert");
const R = require("./rules.js");

test("勝利條件：60 秒內通過 3 座關鍵影格旗即判定勝利", () => {
  const resultEarlyWin = R.checkGameResult({
    flagsPassed: 3,
    targetFlags: 3,
    elapsedSeconds: 45.2,
    maxTime: 60
  });
  assert.strictEqual(resultEarlyWin.over, true);
  assert.strictEqual(resultEarlyWin.win, true);
  assert.strictEqual(resultEarlyWin.reason, "passed_all_flags");

  const resultMaxTimeWin = R.checkGameResult({
    flagsPassed: 3,
    targetFlags: 3,
    elapsedSeconds: 60.0,
    maxTime: 60
  });
  assert.strictEqual(resultMaxTimeWin.over, true);
  assert.strictEqual(resultMaxTimeWin.win, true);
});

test("失敗條件：時間達到 60 秒且未達成目標旗數判定失敗", () => {
  const resultTimeUp = R.checkGameResult({
    flagsPassed: 2,
    targetFlags: 3,
    elapsedSeconds: 60.0,
    maxTime: 60
  });
  assert.strictEqual(resultTimeUp.over, true);
  assert.strictEqual(resultTimeUp.win, false);
  assert.strictEqual(resultTimeUp.reason, "time_up");

  const resultPlaying = R.checkGameResult({
    flagsPassed: 1,
    targetFlags: 3,
    elapsedSeconds: 30.0,
    maxTime: 60
  });
  assert.strictEqual(resultPlaying.over, false);
  assert.strictEqual(resultPlaying.win, false);
  assert.strictEqual(resultPlaying.reason, "playing");
});

test("難度三階：參數隨階數遞增（坡度起伏加劇、頻率與粗糙度提高）", () => {
  const s1 = R.STAGE_CONFIGS[1];
  const s2 = R.STAGE_CONFIGS[2];
  const s3 = R.STAGE_CONFIGS[3];

  // 第 2 階主振幅顯著大於第 1 階（坡變陡）
  assert.ok(s2.amp > s1.amp, "第 2 階坡度振幅應大於第 1 階");

  // 第 3 階頻率大於第 2 階與第 1 階（連續小丘，波形更密集）
  assert.ok(s3.freq > s2.freq, "第 3 階頻率應高於第 2 階");
  assert.ok(s3.freq > s1.freq, "第 3 階頻率應高於第 1 階");

  // 粗糙度隨階數遞增（高頻諧波比例提升）
  assert.ok(s2.rough > s1.rough, "第 2 階粗糙度應大於第 1 階");
  assert.ok(s3.rough > s2.rough, "第 3 階粗糙度應大於第 2 階");
});

test("階段判定：依秒數正確切換 1/2/3 階且邊界值正確", () => {
  // 0~20 秒為第 1 階
  assert.strictEqual(R.getStage(0), 1);
  assert.strictEqual(R.getStage(10.5), 1);
  assert.strictEqual(R.getStage(19.99), 1);

  // 20~40 秒為第 2 階
  assert.strictEqual(R.getStage(20.0), 2);
  assert.strictEqual(R.getStage(30.0), 2);
  assert.strictEqual(R.getStage(39.99), 2);

  // 40~60 秒為第 3 階
  assert.strictEqual(R.getStage(40.0), 3);
  assert.strictEqual(R.getStage(55.2), 3);
  assert.strictEqual(R.getStage(60.0), 3);
  assert.strictEqual(R.getStage(75.0), 3);
});

test("亂數重現性：給定固定種子 rng 生成的地形高度完全一致可重現", () => {
  const rngA = R.createSeededRng(42);
  const hillsA = R.createHills(R.STAGE_CONFIGS[1], rngA);

  const rngB = R.createSeededRng(42);
  const hillsB = R.createHills(R.STAGE_CONFIGS[1], rngB);

  // 相同種子：在多個取樣點高度與斜率誤差小於 1e-6
  const samplePoints = [0, 50, 150, 400, 1200, 3500];
  for (const x of samplePoints) {
    const yA = R.groundAt(x, hillsA, 300);
    const yB = R.groundAt(x, hillsB, 300);
    const slopeA = R.slopeAt(x, hillsA);
    const slopeB = R.slopeAt(x, hillsB);
    assert.ok(Math.abs(yA - yB) < 1e-6, `x=${x} 時相同種子高度應完全一致`);
    assert.ok(Math.abs(slopeA - slopeB) < 1e-6, `x=${x} 時相同種子斜率應完全一致`);
  }

  // 不同種子：高度數值具有明顯差異
  const rngC = R.createSeededRng(9999);
  const hillsC = R.createHills(R.STAGE_CONFIGS[1], rngC);
  let hasDifference = false;
  for (const x of samplePoints) {
    const yA = R.groundAt(x, hillsA, 300);
    const yC = R.groundAt(x, hillsC, 300);
    if (Math.abs(yA - yC) > 1.0) {
      hasDifference = true;
      break;
    }
  }
  assert.ok(hasDifference, "不同種子生成的地形應有實質差異");
});

test("速度更新：下坡按住獲得更強加速度，上坡放開觸發起飛拋射", () => {
  const dt = 1 / 60;
  const downhillSlope = 0.35; // 下坡（往右下傾斜，slope > 0）

  const basePlayer = {
    x: 100,
    y: 200,
    vx: 200,
    vy: 0,
    onGround: true,
    airTime: 0,
    r: 12
  };

  // 1. 下坡俯衝 (dive: true) vs 放開 (dive: false)
  const diveRes = R.updatePhysics(
    { ...basePlayer },
    { dive: true },
    downhillSlope,
    212,
    dt,
    R.PHY
  );
  const glideRes = R.updatePhysics(
    { ...basePlayer },
    { dive: false },
    downhillSlope,
    212,
    dt,
    R.PHY
  );

  assert.ok(
    diveRes.vx > glideRes.vx,
    `俯衝下坡速度 (${diveRes.vx}) 應大於放開滑行速度 (${glideRes.vx})`
  );

  // 2. 上坡起飛測試：速度充足且在陡上坡時放開俯衝
  const uphillSlope = -0.32; // 陡上坡（slope < takeOffSlope: -0.25）
  const fastPlayer = {
    x: 500,
    y: 200,
    vx: 320, // 超越 takeOffSpd: 260
    vy: 0,
    onGround: true,
    airTime: 0,
    r: 12
  };

  // 放開俯衝 -> 起飛
  const launchRes = R.updatePhysics(
    { ...fastPlayer },
    { dive: false },
    uphillSlope,
    212,
    dt,
    R.PHY
  );
  assert.strictEqual(launchRes.tookOff, true, "在上坡放開俯衝應觸發起飛");
  assert.strictEqual(launchRes.onGround, false, "起飛後玩家應處於空中");
  assert.ok(launchRes.vy < 0, "起飛後垂直速度應向上 (vy < 0)");

  // 持續按住俯衝 -> 錯過起飛
  const suppressRes = R.updatePhysics(
    { ...fastPlayer },
    { dive: true },
    uphillSlope,
    212,
    dt,
    R.PHY
  );
  assert.strictEqual(suppressRes.tookOff, false, "按住俯衝時不應觸發起飛");
});

test("邊界值與速度極限限制：速度嚴格夾在 minSpd 與 maxSpd 之間", () => {
  const dt = 1 / 60;
  // 超高速測試：不應突破 maxSpd
  const ultraFastPlayer = {
    x: 100,
    y: 200,
    vx: R.PHY.maxSpd + 500,
    vy: 0,
    onGround: true,
    airTime: 0,
    r: 12
  };
  const fastRes = R.updatePhysics(
    ultraFastPlayer,
    { dive: true },
    0.5,
    212,
    dt,
    R.PHY
  );
  assert.ok(
    fastRes.vx <= R.PHY.maxSpd + 1e-4,
    `速度不應超過上限 ${R.PHY.maxSpd}`
  );

  // 超慢速度測試：不應低於 minSpd
  const slowPlayer = {
    x: 100,
    y: 200,
    vx: 10,
    vy: 0,
    onGround: true,
    airTime: 0,
    r: 12
  };
  const slowRes = R.updatePhysics(
    slowPlayer,
    { dive: false },
    -0.4,
    212,
    dt,
    R.PHY
  );
  assert.ok(
    slowRes.vx >= R.PHY.minSpd - 1e-4,
    `速度不應低於下限 ${R.PHY.minSpd}`
  );
});

test("結算與分數計算：獲勝獲得剩餘時間加成與完美著陸加分", () => {
  const winFastScore = R.calculateScore({
    win: true,
    flagsPassed: 3,
    perfectLands: 4,
    maxCombo: 3,
    elapsedSeconds: 35.0,
    distance: 16500
  });

  const winSlowScore = R.calculateScore({
    win: true,
    flagsPassed: 3,
    perfectLands: 4,
    maxCombo: 3,
    elapsedSeconds: 58.0,
    distance: 16500
  });

  assert.ok(
    winFastScore > winSlowScore,
    "較快通關（剩餘時間較多）應獲得更高的分數"
  );

  const lossScore = R.calculateScore({
    win: false,
    flagsPassed: 1,
    perfectLands: 1,
    maxCombo: 1,
    elapsedSeconds: 60.0,
    distance: 7200
  });
  assert.ok(lossScore > 0, "失敗結算仍應給予基本表現積分");
  assert.ok(winFastScore > lossScore, "獲勝分數應明顯高於失敗分數");
});

test("共通修正：結束畫面保留勝負、分數、專長知識，且不包含內建再玩一次按鈕", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const gameSrc = fs.readFileSync(path.join(__dirname, "game.js"), "utf8");

  // 1. 確認不包含遊戲內的「再玩一次」按鈕生成
  assert.ok(!gameSrc.includes('replayBtn.innerText = "再玩一次"'), "遊戲內結算視窗不應建立再玩一次按鈕");

  // 2. 確認結束畫面保留「勝負」資訊
  assert.ok(gameSrc.includes("★ 挑戰成功！") && gameSrc.includes("未達終點影格"), "結束畫面應包含勝負判定文字");

  // 3. 確認結束畫面保留「分數」
  assert.ok(gameSrc.includes("最終分數："), "結束畫面應包含最終分數");

  // 4. 確認結束畫面保留「一句專長知識」
  assert.ok(gameSrc.includes("這就是「電腦動畫」在做的事"), "結束畫面應保留電腦動畫專長知識傳達");
});

