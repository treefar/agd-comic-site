(function (root) {
  'use strict';

  // ==========================================================================
  // 方向與向量：0: 上, 1: 右, 2: 下, 3: 左
  // ==========================================================================
  var DIRS = [
    { dx: 0, dy: -1 }, // 0: 上
    { dx: 1, dy: 0 },  // 1: 右
    { dx: 0, dy: 1 },  // 2: 下
    { dx: -1, dy: 0 }  // 3: 左
  ];

  function opposite(d) {
    return (d + 2) % 4;
  }

  // ==========================================================================
  // 管件定義（四個方向開放性：[上, 右, 下, 左]）
  // ==========================================================================
  var PIECES = {
    v:  { open: [1, 0, 1, 0], name: '直管', label: 'EXEC ↕', desc: '指令直行' },
    h:  { open: [0, 1, 0, 1], name: '直管', label: 'EXEC ↔', desc: '指令直行' },
    tr: { open: [1, 1, 0, 0], name: '彎管', label: 'IF ↱',   desc: '條件轉向' }, // 上、右
    rb: { open: [0, 1, 1, 0], name: '彎管', label: 'IF ↳',   desc: '條件轉向' }, // 右、下
    bl: { open: [0, 0, 1, 1], name: '彎管', label: 'IF ↲',   desc: '條件轉向' }, // 下、左
    lt: { open: [1, 0, 0, 1], name: '彎管', label: 'IF ↖',   desc: '條件轉向' }, // 左、上
    x:  { open: [1, 1, 1, 1], name: '十字', label: 'LOOP ✛', desc: '迴圈交叉' }  // 十字（可雙軸穿越）
  };

  var BAG = ['v', 'h', 'tr', 'rb', 'bl', 'lt', 'v', 'h', 'x'];

  // ==========================================================================
  // 關卡難度三階參數
  // 第 1 關 4×4、預看 3 塊、水 12 秒後才流
  // 第 2 關 5×5、預看 2 塊、8 秒
  // 第 3 關 6×6、預看 1 塊、6 秒並有一格「Bug」障礙
  // ==========================================================================
  var STAGES = [
    {
      stage: 1,
      name: '第一階：循序管線',
      cols: 4,
      rows: 4,
      previewCount: 3,
      prepTime: 12,
      flowSpeed: 0.8,
      bugCount: 0,
      start: { c: 0, r: 0, dir: 1 }, // (0,0) 朝右
      goal: { c: 3, r: 3 }           // (3,3)
    },
    {
      stage: 2,
      name: '第二階：分支轉向',
      cols: 5,
      rows: 5,
      previewCount: 2,
      prepTime: 8,
      flowSpeed: 0.65,
      bugCount: 0,
      start: { c: 0, r: 1, dir: 1 },
      goal: { c: 4, r: 4 }
    },
    {
      stage: 3,
      name: '第三階：異常除錯',
      cols: 6,
      rows: 6,
      previewCount: 1,
      prepTime: 6,
      flowSpeed: 0.5,
      bugCount: 1,
      start: { c: 0, r: 1, dir: 1 },
      goal: { c: 5, r: 4 }
    }
  ];

  // ==========================================================================
  // 建立關卡網格（純資料結構）
  // ==========================================================================
  function createStageGrid(stageIndex, rng) {
    var randFn = typeof rng === 'function' ? rng : Math.random;
    var idx = Math.max(0, Math.min(STAGES.length - 1, stageIndex || 0));
    var def = STAGES[idx];
    var grid = [];

    for (var r = 0; r < def.rows; r++) {
      var row = [];
      for (var c = 0; c < def.cols; c++) {
        row.push(null);
      }
      grid.push(row);
    }

    // 起點
    grid[def.start.r][def.start.c] = {
      type: 'start',
      dir: def.start.dir,
      filled: 1
    };

    // 終點
    grid[def.goal.r][def.goal.c] = {
      type: 'goal',
      filled: 0
    };

    // Bug 障礙格
    if (def.bugCount > 0) {
      var placed = 0;
      var attempts = 0;
      var frontC = def.start.c + DIRS[def.start.dir].dx;
      var frontR = def.start.r + DIRS[def.start.dir].dy;

      while (placed < def.bugCount && attempts < 200) {
        attempts++;
        var bc = Math.floor(randFn() * def.cols);
        var br = Math.floor(randFn() * def.rows);

        // 不能在起點、終點或起點正前方第一格
        if (bc === def.start.c && br === def.start.r) continue;
        if (bc === def.goal.c && br === def.goal.r) continue;
        if (bc === frontC && br === frontR) continue;

        if (!grid[br][bc]) {
          grid[br][bc] = { type: 'bug', block: true };
          placed++;
        }
      }
    }

    return grid;
  }

  // ==========================================================================
  // 預覽隊列生成
  // ==========================================================================
  function createQueue(count, rng) {
    var randFn = typeof rng === 'function' ? rng : Math.random;
    var q = [];
    for (var i = 0; i < count; i++) {
      var pickIdx = Math.floor(randFn() * BAG.length);
      q.push(BAG[pickIdx]);
    }
    return q;
  }

  function getNextPiece(queue, rng) {
    var randFn = typeof rng === 'function' ? rng : Math.random;
    var next = queue.shift();
    var pickIdx = Math.floor(randFn() * BAG.length);
    queue.push(BAG[pickIdx]);
    return next;
  }

  // ==========================================================================
  // 放置合法性判定
  // ==========================================================================
  function isPlacementValid(grid, cols, rows, c, r) {
    if (c < 0 || c >= cols || r < 0 || r >= rows) return false;
    var cell = grid[r][c];
    if (!cell) return true; // 空格可放
    if (cell.type === 'start' || cell.type === 'goal' || cell.type === 'bug' || cell.block) {
      return false; // 特殊格不可放置
    }
    if (cell.filled && cell.filled > 0) {
      return false; // 資料流已通過的管件不可覆蓋
    }
    return true; // 未流通的既有管件可覆蓋
  }

  // ==========================================================================
  // 從起點沿管走的路徑計算（回傳能走幾格、是否到終點）
  // ==========================================================================
  function tracePath(grid, cols, rows, start, goal) {
    var steps = [];
    var curC = start.c;
    var curR = start.r;
    var curDir = start.dir;
    var reachedGoal = false;
    var leakReason = null;

    var visits = [];
    for (var r = 0; r < rows; r++) {
      var vrow = [];
      for (var c = 0; c < cols; c++) {
        vrow.push(0);
      }
      visits.push(vrow);
    }
    visits[curR][curC] = 1;

    var maxSteps = cols * rows * 2;
    var count = 0;

    while (count < maxSteps) {
      count++;
      var nextC = curC + DIRS[curDir].dx;
      var nextR = curR + DIRS[curDir].dy;
      var fromDir = opposite(curDir);

      // 出界
      if (nextC < 0 || nextC >= cols || nextR < 0 || nextR >= rows) {
        leakReason = 'out_of_bounds';
        break;
      }

      // 到達終點
      if (nextC === goal.c && nextR === goal.r) {
        reachedGoal = true;
        steps.push({
          c: nextC,
          r: nextR,
          fromDir: fromDir,
          outDir: null,
          isGoal: true
        });
        break;
      }

      var cell = grid[nextR][nextC];

      // 撞上 Bug 障礙
      if (cell && (cell.type === 'bug' || cell.block)) {
        leakReason = 'hit_bug';
        break;
      }

      // 無管件
      if (!cell || !cell.kind) {
        leakReason = 'no_pipe';
        break;
      }

      var pieceDef = PIECES[cell.kind];
      if (!pieceDef) {
        leakReason = 'unknown_pipe';
        break;
      }

      // 檢查入口方向是否連通
      if (!pieceDef.open[fromDir]) {
        leakReason = 'mismatch';
        break;
      }

      // 計算出水方向
      var outDir = -1;
      if (cell.kind === 'x') {
        outDir = opposite(fromDir);
        if (visits[nextR][nextC] >= 2) {
          leakReason = 'loop_overflow';
          break;
        }
      } else {
        for (var d = 0; d < 4; d++) {
          if (pieceDef.open[d] && d !== fromDir) {
            outDir = d;
            break;
          }
        }
        if (visits[nextR][nextC] >= 1) {
          leakReason = 'loop_overflow';
          break;
        }
      }

      if (outDir < 0) {
        leakReason = 'dead_end';
        break;
      }

      visits[nextR][nextC]++;
      steps.push({
        c: nextC,
        r: nextR,
        kind: cell.kind,
        fromDir: fromDir,
        outDir: outDir
      });

      curC = nextC;
      curR = nextR;
      curDir = outDir;
    }

    return {
      steps: steps,
      cellsCount: steps.length,
      reachedGoal: reachedGoal,
      leakReason: leakReason
    };
  }

  // ==========================================================================
  // 計分與勝負判定
  // ==========================================================================
  function evaluateGame(clearedStages, score, totalStages) {
    var tot = totalStages || 3;
    var win = clearedStages >= 2;
    return {
      win: win,
      clearedStages: clearedStages,
      totalStages: tot,
      score: Math.max(0, Math.floor(score || 0)),
      quote: '這就是 Unity／程式 在做的事：寫程式就是安排資料流的路徑，先想好流程再動手，比事後除錯省時間。'
    };
  }

  function calculateScore(clearedStages, pipeCount, prepLeft, timeLeft, overwrites) {
    var stageBonus = Math.max(0, clearedStages || 0) * 1000;
    var pipeBonus = Math.max(0, pipeCount || 0) * 50;
    var prepBonus = Math.max(0, Math.floor(prepLeft || 0)) * 30;
    var timeBonus = Math.max(0, Math.floor(timeLeft || 0)) * 20;
    var penalty = Math.max(0, overwrites || 0) * 50;
    return Math.max(0, stageBonus + pipeBonus + prepBonus + timeBonus - penalty);
  }

  // ==========================================================================
  // 漏水後同一關重來狀態（純函式，不改變已過關數，不結束遊戲）
  // ==========================================================================
  function afterLeak(state, rng) {
    if (!state) return state;
    var randFn = typeof rng === 'function' ? rng : (typeof state.rng === 'function' ? state.rng : Math.random);
    var stageIdx = state.currentStageIdx !== undefined ? state.currentStageIdx : (state.stageIndex !== undefined ? state.stageIndex : (state.stage !== undefined ? state.stage : 0));
    var safeIdx = Math.max(0, Math.min(STAGES.length - 1, stageIdx));
    var def = STAGES[safeIdx];

    var newGrid = createStageGrid(safeIdx, randFn);
    var previewCount = def ? def.previewCount : 3;
    var newQueue = createQueue(previewCount + 4, randFn);
    var prepTime = def ? def.prepTime : 12;

    return {
      currentStageIdx: safeIdx,
      stageIndex: safeIdx,
      clearedStages: state.clearedStages || 0,
      totalTime: state.totalTime !== undefined ? state.totalTime : (state.timeLeft !== undefined ? state.timeLeft : 60),
      timeLeft: state.timeLeft !== undefined ? state.timeLeft : (state.totalTime !== undefined ? state.totalTime : 60),
      score: state.score !== undefined ? state.score : (state.currentScore || 0),
      currentScore: state.currentScore !== undefined ? state.currentScore : (state.score || 0),
      grid: newGrid,
      queue: newQueue,
      prepTimeLeft: prepTime,
      isFlowing: false,
      flowTimer: 0,
      flowStepIdx: 0,
      stageCleared: false,
      stageLeaked: false,
      leakReason: null,
      gameOver: false
    };
  }

  // ==========================================================================
  // 匯出物件
  // ==========================================================================
  var R = {
    DIRS: DIRS,
    opposite: opposite,
    PIECES: PIECES,
    BAG: BAG,
    STAGES: STAGES,
    createStageGrid: createStageGrid,
    createQueue: createQueue,
    getNextPiece: getNextPiece,
    isPlacementValid: isPlacementValid,
    tracePath: tracePath,
    evaluateGame: evaluateGame,
    calculateScore: calculateScore,
    afterLeak: afterLeak
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_MG_CODE = R;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
