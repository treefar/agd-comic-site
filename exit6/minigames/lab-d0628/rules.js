(function (root) {
  'use strict';

  // 盤面規格：10 寬 16 高
  var COLS = 10;
  var ROWS = 16;
  var TOTAL_SECONDS = 60;
  var TARGET_LAYERS = 8;
  var MAX_STACK_LIMIT = 8; // 盤面一半（8 格）
  var SCORE2 = 1000; // 二星基準分

  // 三階下落速度配置（秒）
  var TIERS = [
    { tier: 1, maxTime: 20, dropInterval: 0.8 },
    { tier: 2, maxTime: 40, dropInterval: 0.5 },
    { tier: 3, maxTime: 60, dropInterval: 0.25 }
  ];

  // 一次消多行加成
  var MULTI_LINE_BONUS = {
    1: 0,
    2: 100,
    3: 300,
    4: 600
  };

  // 七種方塊形狀（SRS 標準旋轉座標）
  // 配色限定規格六色：紙 #f4ecd8、墨 #0f0d0a、紅 #e63946、黃 #ffd60a、藍 #1d4ed8、灰 #8a948e
  var SHAPES = {
    I: {
      color: '#1d4ed8', // 藍
      cells: [
        [[0,1],[1,1],[2,1],[3,1]],
        [[2,0],[2,1],[2,2],[2,3]],
        [[0,2],[1,2],[2,2],[3,2]],
        [[1,0],[1,1],[1,2],[1,3]]
      ]
    },
    J: {
      color: '#1d4ed8', // 藍
      cells: [
        [[0,0],[0,1],[1,1],[2,1]],
        [[1,0],[2,0],[1,1],[1,2]],
        [[0,1],[1,1],[2,1],[2,2]],
        [[1,0],[1,1],[0,2],[1,2]]
      ]
    },
    L: {
      color: '#ffd60a', // 黃
      cells: [
        [[2,0],[0,1],[1,1],[2,1]],
        [[1,0],[1,1],[1,2],[2,2]],
        [[0,1],[1,1],[2,1],[0,2]],
        [[0,0],[1,0],[1,1],[1,2]]
      ]
    },
    O: {
      color: '#ffd60a', // 黃
      cells: [
        [[1,0],[2,0],[1,1],[2,1]],
        [[1,0],[2,0],[1,1],[2,1]],
        [[1,0],[2,0],[1,1],[2,1]],
        [[1,0],[2,0],[1,1],[2,1]]
      ]
    },
    S: {
      color: '#e63946', // 紅
      cells: [
        [[1,0],[2,0],[0,1],[1,1]],
        [[1,0],[1,1],[2,1],[2,2]],
        [[1,1],[2,1],[0,2],[1,2]],
        [[0,0],[0,1],[1,1],[1,2]]
      ]
    },
    T: {
      color: '#8a948e', // 灰
      cells: [
        [[1,0],[0,1],[1,1],[2,1]],
        [[1,0],[1,1],[2,1],[1,2]],
        [[0,1],[1,1],[2,1],[1,2]],
        [[1,0],[0,1],[1,1],[1,2]]
      ]
    },
    Z: {
      color: '#e63946', // 紅
      cells: [
        [[0,0],[1,0],[1,1],[2,1]],
        [[2,0],[1,1],[2,1],[1,2]],
        [[0,1],[1,1],[1,2],[2,2]],
        [[1,0],[0,1],[1,1],[0,2]]
      ]
    }
  };

  var TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  // SRS 踢牆表（JLSTZ 與 I）
  var KICKS_JLSTZ = {
    '0>1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '1>0': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    '1>2': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    '2>1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '2>3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    '3>2': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '3>0': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '0>3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]]
  };

  var KICKS_I = {
    '0>1': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
    '1>0': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
    '1>2': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
    '2>1': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
    '2>3': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
    '3>2': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
    '3>0': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
    '0>3': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]]
  };

  function createBoard(cols, rows) {
    var c = typeof cols === 'number' ? cols : COLS;
    var r = typeof rows === 'number' ? rows : ROWS;
    var b = [];
    for (var y = 0; y < r; y++) {
      var row = [];
      for (var x = 0; x < c; x++) row.push(null);
      b.push(row);
    }
    return b;
  }

  function getTier(elapsedSeconds) {
    var t = Math.max(0, elapsedSeconds || 0);
    if (t < TIERS[0].maxTime) return TIERS[0];
    if (t < TIERS[1].maxTime) return TIERS[1];
    return TIERS[2];
  }

  function calculateLineScore(lineCount) {
    if (!lineCount || lineCount <= 0) return 0;
    var base = lineCount * 100;
    var bonus = MULTI_LINE_BONUS[lineCount] || 0;
    return base + bonus;
  }

  function getStackHeight(board) {
    if (!board || !board.length) return 0;
    var rows = board.length;
    var cols = board[0].length;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        if (board[y][x] !== null && board[y][x] !== undefined) {
          return rows - y;
        }
      }
    }
    return 0;
  }

  function isFlawless(stats) {
    if (!stats || !stats.won) return false;
    if (typeof stats.maxStackHeight === 'number') {
      return stats.maxStackHeight <= MAX_STACK_LIMIT;
    }
    if (typeof stats.exceededHalf === 'boolean') {
      return !stats.exceededHalf;
    }
    return false;
  }

  function checkWin(layersCleared, timeRemaining) {
    return (layersCleared || 0) >= TARGET_LAYERS && (timeRemaining === undefined || timeRemaining >= 0);
  }

  function calculateStars(result) {
    if (!result || !result.win) return 0;
    var count = 1;
    if (typeof result.score === 'number' && result.score >= SCORE2) count++;
    if (result.flawless === true) count++;
    return count;
  }

  function shuffleBag(rng) {
    var r = typeof rng === 'function' ? rng : Math.random;
    var b = TYPES.slice();
    for (var i = b.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var temp = b[i];
      b[i] = b[j];
      b[j] = temp;
    }
    return b;
  }

  function cellsOf(piece, rotOffset, dx, dy) {
    var rot = (((piece.rot + (rotOffset || 0)) % 4) + 4) % 4;
    var shapeData = SHAPES[piece.type];
    if (!shapeData) return [];
    var raw = shapeData.cells[rot];
    var out = [];
    var ox = piece.x + (dx || 0);
    var oy = piece.y + (dy || 0);
    for (var i = 0; i < raw.length; i++) {
      out.push([ox + raw[i][0], oy + raw[i][1]]);
    }
    return out;
  }

  function collide(board, piece, dx, dy, rotOffset) {
    var c = cellsOf(piece, rotOffset, dx, dy);
    var rows = board.length;
    var cols = board[0].length;
    for (var i = 0; i < c.length; i++) {
      var x = c[i][0];
      var y = c[i][1];
      if (x < 0 || x >= cols || y >= rows) return true;
      if (y >= 0 && board[y][x] !== null && board[y][x] !== undefined) return true;
    }
    return false;
  }

  var R = {
    COLS: COLS,
    ROWS: ROWS,
    TOTAL_SECONDS: TOTAL_SECONDS,
    TARGET_LAYERS: TARGET_LAYERS,
    MAX_STACK_LIMIT: MAX_STACK_LIMIT,
    SCORE2: SCORE2,
    TIERS: TIERS,
    MULTI_LINE_BONUS: MULTI_LINE_BONUS,
    SHAPES: SHAPES,
    TYPES: TYPES,
    KICKS_JLSTZ: KICKS_JLSTZ,
    KICKS_I: KICKS_I,
    createBoard: createBoard,
    getTier: getTier,
    calculateLineScore: calculateLineScore,
    getStackHeight: getStackHeight,
    isFlawless: isFlawless,
    checkWin: checkWin,
    calculateStars: calculateStars,
    shuffleBag: shuffleBag,
    cellsOf: cellsOf,
    collide: collide
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_LAB_D0628 = R;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
