const test = require('node:test');
const assert = require('node:assert');
const R = require('./rules.js');

// 浮點數容許誤差比對輔助函式
function assertClose(actual, expected, tolerance = 1e-6, message = '') {
  const diff = Math.abs(actual - expected);
  assert.ok(diff <= tolerance, `${message} 實際值 ${actual} 與期望值 ${expected} 差距 ${diff} 超過容許誤差 ${tolerance}`);
}

test('1. 管件連通表與反向向量正確性', () => {
  // 檢查反向方向
  assert.strictEqual(R.opposite(0), 2, '上(0)的反向應為下(2)');
  assert.strictEqual(R.opposite(1), 3, '右(1)的反向應為左(3)');
  assert.strictEqual(R.opposite(2), 0, '下(2)的反向應為上(0)');
  assert.strictEqual(R.opposite(3), 1, '左(3)的反向應為右(1)');

  // 檢查直管、彎管、十字管的連通端口
  assert.deepStrictEqual(R.PIECES.v.open, [1, 0, 1, 0], '直管 v 應開放上下');
  assert.deepStrictEqual(R.PIECES.h.open, [0, 1, 0, 1], '直管 h 應開放左右');
  assert.deepStrictEqual(R.PIECES.tr.open, [1, 1, 0, 0], '彎管 tr 應開放上右');
  assert.deepStrictEqual(R.PIECES.rb.open, [0, 1, 1, 0], '彎管 rb 應開放右下');
  assert.deepStrictEqual(R.PIECES.bl.open, [0, 0, 1, 1], '彎管 bl 應開放下左');
  assert.deepStrictEqual(R.PIECES.lt.open, [1, 0, 0, 1], '彎管 lt 應開放左上');
  assert.deepStrictEqual(R.PIECES.x.open, [1, 1, 1, 1], '十字管 x 應開放四向');
});

test('2. 難度三階的參數會遞增與收緊', () => {
  assert.strictEqual(R.STAGES.length, 3, '應有三個難度階級');

  const s1 = R.STAGES[0];
  const s2 = R.STAGES[1];
  const s3 = R.STAGES[2];

  // 網格維度遞增
  assert.ok(s1.cols < s2.cols && s2.cols < s3.cols, '網格欄數應逐階遞增 (4 -> 5 -> 6)');
  assert.ok(s1.rows < s2.rows && s2.rows < s3.rows, '網格列數應逐階遞增 (4 -> 5 -> 6)');

  // 預看塊數遞減收緊難度
  assert.ok(s1.previewCount > s2.previewCount && s2.previewCount > s3.previewCount, '預覽塊數應逐階遞減 (3 -> 2 -> 1)');

  // 放水前置倒數時間遞減收緊難度
  assert.ok(s1.prepTime > s2.prepTime && s2.prepTime > s3.prepTime, '放水前置時間應逐階縮短 (12s -> 8s -> 6s)');

  // 水流速度加快（每格秒數遞減）
  assert.ok(s1.flowSpeed > s2.flowSpeed && s2.flowSpeed > s3.flowSpeed, '水流每格秒數應逐階縮減以加快速度');

  // Bug 障礙格數遞增
  assert.strictEqual(s1.bugCount, 0, '第一階無 Bug 障礙');
  assert.strictEqual(s2.bugCount, 0, '第二階無 Bug 障礙');
  assert.strictEqual(s3.bugCount, 1, '第三階有 1 格 Bug 障礙');
});

test('3. 放置合法性判定（邊界值、特殊格、流通保護）', () => {
  const grid = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
  ];
  grid[0][0] = { type: 'start', dir: 1, filled: 1 };
  grid[3][3] = { type: 'goal', filled: 0 };
  grid[1][1] = { type: 'bug', block: true };
  grid[0][1] = { kind: 'h', filled: 1 }; // 已流通
  grid[0][2] = { kind: 'v', filled: 0 }; // 未流通普通管

  // 邊界外
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, -1, 0), false, 'X 負邊界應不合法');
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 0, -1), false, 'Y 負邊界應不合法');
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 4, 2), false, 'X 超界應不合法');
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 2, 4), false, 'Y 超界應不合法');

  // 特殊格不可放
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 0, 0), false, 'Start 格不可覆蓋');
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 3, 3), false, 'Goal 格不可覆蓋');
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 1, 1), false, 'Bug 格不可覆蓋');

  // 已流通管件保護
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 1, 0), false, '已流通水流之管件不可覆蓋');

  // 空白格與未流通管件
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 2, 1), true, '空白格應為合法放置');
  assert.strictEqual(R.isPlacementValid(grid, 4, 4, 2, 0), true, '未流通之既有管件可覆蓋');
});

test('4. 純函式路徑計算 tracePath：成功連通至終點 Goal', () => {
  // 建立 4x4 網格並鋪設一條通往 Goal 的路徑
  // Start: (0,0) dir:1(右)
  // (1,0): h (左右)
  // (2,0): rb (右下) -> 轉向下
  // (2,1): v (上下)
  // (2,2): bl (下左) -> 轉向左，等等，改用十字或直接到 goal
  // 重新規劃簡單清晰路徑：
  // (0,0) Start -> (1,0) h -> (2,0) h -> (3,0) rb (轉下) -> (3,1) v -> (3,2) v -> (3,3) Goal!
  const grid = Array.from({ length: 4 }, () => Array(4).fill(null));
  grid[0][0] = { type: 'start', dir: 1, filled: 1 };
  grid[3][3] = { type: 'goal', filled: 0 };

  grid[0][1] = { kind: 'h', filled: 0 };
  grid[0][2] = { kind: 'h', filled: 0 };
  grid[0][3] = { kind: 'bl', filled: 0 };  // 主控修正：左進下出要用 bl（原寫 rb 是測試錯）
  grid[1][3] = { kind: 'v', filled: 0 };
  grid[2][3] = { kind: 'v', filled: 0 };

  const start = { c: 0, r: 0, dir: 1 };
  const goal = { c: 3, r: 3 };

  const res = R.tracePath(grid, 4, 4, start, goal);
  assert.strictEqual(res.reachedGoal, true, '水流應成功抵達 Goal');
  assert.strictEqual(res.leakReason, null, '成功時不應有漏水原因');
  assert.strictEqual(res.cellsCount, 6, '路徑應經過 (1,0), (2,0), (3,0), (3,1), (3,2), (3,3) 共 6 格');
  assert.strictEqual(res.steps[res.steps.length - 1].isGoal, true, '最後一格應為 Goal');
});

test('5. 純函式路徑計算 tracePath：斷路、方向不符、出界與撞 Bug 障礙之漏水判定', () => {
  const start = { c: 0, r: 0, dir: 1 };
  const goal = { c: 3, r: 3 };

  // 情況 A：前進第一格為空（斷頭無管件）
  const gridA = Array.from({ length: 4 }, () => Array(4).fill(null));
  gridA[0][0] = { type: 'start', dir: 1 };
  const resA = R.tracePath(gridA, 4, 4, start, goal);
  assert.strictEqual(resA.reachedGoal, false);
  assert.strictEqual(resA.leakReason, 'no_pipe', '空管應判定 no_pipe 漏水');

  // 情況 B：前進管件方向不符（例如右方放了一根直管 v，只有上下開口）
  const gridB = Array.from({ length: 4 }, () => Array(4).fill(null));
  gridB[0][0] = { type: 'start', dir: 1 };
  gridB[0][1] = { kind: 'v' }; // 需要左開口，但 v 只有 [1, 0, 1, 0]
  const resB = R.tracePath(gridB, 4, 4, start, goal);
  assert.strictEqual(resB.reachedGoal, false);
  assert.strictEqual(resB.leakReason, 'mismatch', '介面不符應判定 mismatch');

  // 情況 C：出界（一直向右衝出盤面）
  const gridC = Array.from({ length: 4 }, () => Array(4).fill(null));
  gridC[0][0] = { type: 'start', dir: 1 };
  gridC[0][1] = { kind: 'h' };
  gridC[0][2] = { kind: 'h' };
  gridC[0][3] = { kind: 'h' }; // 繼續往右出界 (4,0)
  const resC = R.tracePath(gridC, 4, 4, start, goal);
  assert.strictEqual(resC.reachedGoal, false);
  assert.strictEqual(resC.leakReason, 'out_of_bounds', '出界應判定 out_of_bounds');

  // 情況 D：撞上 Bug 障礙格
  const gridD = Array.from({ length: 4 }, () => Array(4).fill(null));
  gridD[0][0] = { type: 'start', dir: 1 };
  gridD[0][1] = { kind: 'h' };
  gridD[0][2] = { type: 'bug', block: true };
  const resD = R.tracePath(gridD, 4, 4, start, goal);
  assert.strictEqual(resD.reachedGoal, false);
  assert.strictEqual(resD.leakReason, 'hit_bug', '撞到 Bug 應判定 hit_bug');
});

test('6. 亂數用傳入的 rng 產出結果可重現', () => {
  // 建立確定性線性同餘虛擬亂數產生器 (LCG)
  function createPrng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  const rng1 = createPrng(42);
  const q1 = R.createQueue(5, rng1);

  const rng2 = createPrng(42);
  const q2 = R.createQueue(5, rng2);

  assert.deepStrictEqual(q1, q2, '相同種子 rng 生成的隊列序列應完全一致');

  // 測試關卡生成盤面在相同 rng 下一致
  const rng3 = createPrng(999);
  const gridA = R.createStageGrid(2, rng3);

  const rng4 = createPrng(999);
  const gridB = R.createStageGrid(2, rng4);

  assert.deepStrictEqual(gridA, gridB, '相同種子 rng 生成之含 Bug 盤面應完全一致');
});

test('7. 勝負判定（過 2 關以上算贏）與計分容許誤差', () => {
  // 0 關與 1 關失敗
  const eval0 = R.evaluateGame(0, 100);
  assert.strictEqual(eval0.win, false, '過 0 關應判定失敗');
  assert.ok(eval0.quote.includes('Unity／程式'), '結束應包含專長說明');

  const eval1 = R.evaluateGame(1, 1200);
  assert.strictEqual(eval1.win, false, '過 1 關應判定失敗');

  // 2 關與 3 關勝利
  const eval2 = R.evaluateGame(2, 2800);
  assert.strictEqual(eval2.win, true, '過 2 關應判定勝利');

  const eval3 = R.evaluateGame(3, 4500);
  assert.strictEqual(eval3.win, true, '過 3 關應判定勝利');

  // 計分計算與浮點數容許誤差比對
  // calculateScore(clearedStages, pipeCount, prepLeft, timeLeft, overwrites)
  // 預期：2 * 1000 + 8 * 50 + 4.5 * 30 (floor->4*30=120) + 18.2 * 20 (floor->18*20=360) - 1 * 50 = 2000 + 400 + 120 + 360 - 50 = 2830
  const score = R.calculateScore(2, 8, 4.5, 18.2, 1);
  assertClose(score, 2830, 1e-6, '計分計算');
});

test('8. 漏水後同一關重來 afterLeak 純函式測試：關卡編號不變、已過關數不變、遊戲未結束', () => {
  const stateBefore = {
    currentStageIdx: 1, // 第 2 階
    clearedStages: 1,   // 已過 1 關
    totalTime: 42.5,
    currentScore: 1250,
    gameOver: false,
    leakReason: 'mismatch'
  };

  const stateAfter = R.afterLeak(stateBefore);

  // 1. 漏水後關卡編號不變
  assert.strictEqual(stateAfter.currentStageIdx, 1, '漏水後關卡編號應維持不變 (第 2 階)');

  // 2. 漏水後已過關數不變
  assert.strictEqual(stateAfter.clearedStages, 1, '漏水後已過關數應維持不變 (1 關)');

  // 3. 漏水後遊戲未結束
  assert.strictEqual(stateAfter.gameOver, false, '漏水後遊戲應未結束');

  // 4. 水流倒數應重設為該關前置秒數 (第 2 階為 8 秒)
  assert.strictEqual(stateAfter.prepTimeLeft, R.STAGES[1].prepTime, '水流倒數應重設為該關前置秒數');

  // 5. 資料流狀態應重設為未流動且無漏水
  assert.strictEqual(stateAfter.isFlowing, false, '資料流應重設為未流動');
  assert.strictEqual(stateAfter.stageLeaked, false, '漏水狀態應重設為 false');
  assert.strictEqual(stateAfter.leakReason, null, 'leakReason 應重設為 null');

  // 6. 網格應重新初始化且具備起點與終點
  assert.ok(Array.isArray(stateAfter.grid), '網格應為陣列');
  assert.strictEqual(stateAfter.grid.length, R.STAGES[1].rows, '網格列數應符合關卡定義');
  assert.strictEqual(stateAfter.grid[0].length, R.STAGES[1].cols, '網格欄數應符合關卡定義');
  assert.strictEqual(stateAfter.grid[R.STAGES[1].start.r][R.STAGES[1].start.c].type, 'start', '起點應存在');
  assert.strictEqual(stateAfter.grid[R.STAGES[1].goal.r][R.STAGES[1].goal.c].type, 'goal', '終點應存在');

  // 7. 預覽隊列應重新抽取生成
  assert.ok(Array.isArray(stateAfter.queue), '預覽隊列應為陣列');
  assert.ok(stateAfter.queue.length >= R.STAGES[1].previewCount, '預覽隊列長度足夠');
});
