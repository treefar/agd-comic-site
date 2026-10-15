const test = require("node:test");
const assert = require("node:assert");
const R = require("./rules.js");

test("規則 1：單軸旋轉四次回到原座標與形狀", () => {
  const p = { x: 2, y: 3, z: -4 };
  let px = p;
  for (let i = 0; i < 4; i++) px = R.rotateX(px);
  assert.deepStrictEqual(px, p, "繞 X 軸轉 4 次必須回到原點");

  let py = p;
  for (let i = 0; i < 4; i++) py = R.rotateY(py);
  assert.deepStrictEqual(py, p, "繞 Y 軸轉 4 次必須回到原點");

  let pz = p;
  for (let i = 0; i < 4; i++) pz = R.rotateZ(pz);
  assert.deepStrictEqual(pz, p, "繞 Z 軸轉 4 次必須回到原點");

  const shape = [
    { x: 1, y: 2, z: 0 },
    { x: 2, y: 2, z: 0 },
    { x: 1, y: 3, z: 1 },
  ];
  let s = shape;
  for (let i = 0; i < 4; i++) s = R.rotateShapeY(s);
  assert.strictEqual(
    R.areShapesEqual(s, shape),
    true,
    "形狀繞 Y 轉 4 次正規化後必須與原形狀相等"
  );
});

test("規則 2：正規化與平移排序不變性", () => {
  const shapeA = [
    { x: 10, y: 20, z: 30 },
    { x: 11, y: 20, z: 30 },
  ];
  const shapeB = [
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ];
  assert.strictEqual(
    R.areShapesEqual(shapeA, shapeB),
    true,
    "不同平移但相對幾何相同的形狀正規化後必須相等"
  );

  const shapeC = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
  ];
  assert.strictEqual(
    R.areShapesEqual(shapeA, shapeC),
    false,
    "不同方向的形狀不可判定為相等"
  );
});

test("規則 3：每道題目保證至少有一個有效旋轉能吻合缺口", () => {
  const questions = R.createQuestions();
  assert.strictEqual(questions.length, 5, "題庫必須剛好有 5 題");

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const allRots = R.getAllRotations(q.blocks);
    const hasMatch = allRots.some((rot) =>
      R.areShapesEqual(rot, q.targetBlocks)
    );
    assert.strictEqual(
      hasMatch,
      true,
      `題目 ${q.id} (${q.title}) 必須能在 24 個旋轉中找到完全吻合缺口之解`
    );

    // 初始狀態不可直接吻合缺口，玩家必須先行動旋轉
    assert.strictEqual(
      R.areShapesEqual(q.blocks, q.targetBlocks),
      false,
      `題目 ${q.id} 初始狀態不可直接等於目標缺口`
    );
  }
});

test("規則 4：難度三階的參數與方塊數遞增", () => {
  const questions = R.createQuestions();

  // 第 1 階：2~3 塊
  assert.strictEqual(questions[0].tier, 1);
  assert.strictEqual(questions[1].tier, 1);
  assert.ok(questions[0].blockCount >= 2 && questions[0].blockCount <= 3);
  assert.ok(questions[1].blockCount >= 2 && questions[1].blockCount <= 3);

  // 第 2 階：4 塊
  assert.strictEqual(questions[2].tier, 2);
  assert.strictEqual(questions[3].tier, 2);
  assert.strictEqual(questions[2].blockCount, 4);
  assert.strictEqual(questions[3].blockCount, 4);

  // 第 3 階：5 塊
  assert.strictEqual(questions[4].tier, 3);
  assert.strictEqual(questions[4].blockCount, 5);

  // 難度與方塊數量階層非遞減驗證
  for (let i = 1; i < questions.length; i++) {
    assert.ok(questions[i].tier >= questions[i - 1].tier, "難度階級必須遞增或持平");
    assert.ok(
      questions[i].blockCount >= questions[i - 1].blockCount,
      "方塊數量必須遞增或持平"
    );
  }
  assert.ok(
    questions[4].blockCount > questions[0].blockCount,
    "第 3 階方塊數應大於第 1 階"
  );
  assert.ok(
    questions[4].tier > questions[0].tier,
    "第 3 階難度應大於第 1 階"
  );
});

test("規則 5：傳入固定 rng 亂數產生題目可重現", () => {
  let seedA = 42;
  const rngA = () => {
    seedA = (seedA * 9301 + 49297) % 233280;
    return seedA / 233280;
  };

  let seedB = 42;
  const rngB = () => {
    seedB = (seedB * 9301 + 49297) % 233280;
    return seedB / 233280;
  };

  const qA = R.createQuestions(rngA);
  const qB = R.createQuestions(rngB);
  assert.deepStrictEqual(qA, qB, "相同 seed 的 rng 產生的題庫必須完全一致");
});

test("規則 6：錯誤放下扣 2 秒、時間耗盡為失敗條件", () => {
  let state = R.createInitialState();
  assert.strictEqual(state.timeRemaining, 60);

  // 初始狀態下直接放下（初始不吻合）
  state = R.submitCurrent(state);
  assert.strictEqual(state.lastAction, "wrong");
  assert.strictEqual(state.timeRemaining, 58, "答錯應立即扣 2 秒");
  assert.strictEqual(state.score, 0);

  // 時間流逝至 0 秒判定失敗
  state = R.tick(state, 58);
  assert.strictEqual(state.timeRemaining, 0);
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isWin, false);
  assert.strictEqual(R.evaluateWin(state), false);
});

test("規則 7：完成 5 題判定為獲勝條件", () => {
  let state = R.createInitialState();

  for (let i = 0; i < 5; i++) {
    assert.strictEqual(state.currentIndex, i);
    // 模擬玩家正確轉到與目標相符
    state.currentBlocks = R.normalizeShape(state.questions[i].targetBlocks);
    state = R.submitCurrent(state);
    assert.strictEqual(state.lastAction, "correct");
  }

  assert.strictEqual(state.score, 5);
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isWin, true);
  assert.strictEqual(R.evaluateWin(state), true);
});

test("規則 8：邊界值與時間流逝浮點容許誤差", () => {
  let state = R.createInitialState();
  const delta = 1 / 60;
  for (let f = 0; f < 60; f++) {
    state = R.tick(state, delta);
  }
  // 60 幀後時間應接近 59 秒，浮點比較容許誤差 0.001
  assert.ok(
    Math.abs(state.timeRemaining - 59) < 0.001,
    `浮點時間流逝計算誤差應小於容許值 (實際值: ${state.timeRemaining})`
  );

  // 扣秒扣到負數時自動截斷至 0
  state.timeRemaining = 1.5;
  state = R.submitCurrent(state); // 扣 2 秒
  assert.strictEqual(state.timeRemaining, 0, "時間扣減至負值應截斷為 0");
  assert.strictEqual(state.isGameOver, true);
});

test("規則 9：canDrop 冷卻狀態判斷", () => {
  // 未鎖定或無 lockUntil 時可放下
  assert.strictEqual(R.canDrop(1000, 0), true);
  assert.strictEqual(R.canDrop(1000, null), true);
  assert.strictEqual(R.canDrop(1000, undefined), true);

  // 冷卻鎖定期間 (now < lockUntil) 不可放下
  assert.strictEqual(R.canDrop(1000, 2000), false);
  assert.strictEqual(R.canDrop(1999.9, 2000), false);

  // 冷卻時間到達或超過 (now >= lockUntil) 解除鎖定
  assert.strictEqual(R.canDrop(2000, 2000), true);
  assert.strictEqual(R.canDrop(2001, 2000), true);
});

test("規則 10：hintAxis 提示軸向與最短旋轉步數驗證", () => {
  const questions = R.createQuestions();

  // 若零件已吻合凹槽，hintAxis 應回傳 null
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    assert.strictEqual(
      R.hintAxis(q.targetBlocks, q.targetBlocks),
      null,
      `題目 ${q.id} 已吻合時 hintAxis 必須回傳 null`
    );
  }

  // 驗證題庫每道題：hintAxis 轉一次後的最少步數要比轉前少或已吻合
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const initialPiece = q.blocks;
    const slot = q.targetBlocks;

    const initialSteps = R.minStepsToMatch(initialPiece, slot);
    assert.ok(initialSteps > 0, `題目 ${q.id} 初始狀態步數應大於 0`);

    const axis = R.hintAxis(initialPiece, slot);
    assert.ok(
      axis === "x" || axis === "y" || axis === "z",
      `題目 ${q.id} 的 hintAxis 必須為 'x'|'y'|'z' 其中之一 (實際值: ${axis})`
    );

    // 依據 hintAxis 旋轉一次
    let nextPiece;
    if (axis === "x") nextPiece = R.rotateShapeX(initialPiece);
    else if (axis === "y") nextPiece = R.rotateShapeY(initialPiece);
    else if (axis === "z") nextPiece = R.rotateShapeZ(initialPiece);

    const isMatchNow = R.areShapesEqual(nextPiece, slot);
    const nextSteps = R.minStepsToMatch(nextPiece, slot);

    assert.ok(
      isMatchNow || nextSteps < initialSteps,
      `題目 ${q.id} 經 hintAxis(${axis}) 轉一次後，步數應減少或已吻合 (轉前: ${initialSteps}, 轉後: ${nextSteps})`
    );
  }

  // 針對第 1 階前兩題（q1, q2）具體驗證
  // q1 是 rotateShapeY，hintAxis 應為 'y'
  assert.strictEqual(R.hintAxis(questions[0].blocks, questions[0].targetBlocks), "y");
  // q2 是 rotateShapeZ，hintAxis 應為 'z'
  assert.strictEqual(R.hintAxis(questions[1].blocks, questions[1].targetBlocks), "z");
});
