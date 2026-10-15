(function (root) {
  // 純整數座標 90 度旋轉函式
  function rotateX(p) {
    return { x: p.x, y: -p.z, z: p.y };
  }

  function rotateY(p) {
    return { x: p.z, y: p.y, z: -p.x };
  }

  function rotateZ(p) {
    return { x: -p.y, y: p.x, z: p.z };
  }

  function rotateShapeX(blocks) {
    return blocks.map(rotateX);
  }

  function rotateShapeY(blocks) {
    return blocks.map(rotateY);
  }

  function rotateShapeZ(blocks) {
    return blocks.map(rotateZ);
  }

  // 正規化：平移至最小角 (0, 0, 0) 並以 x, y, z 順序確定性排序
  function normalizeShape(blocks) {
    if (!blocks || blocks.length === 0) return [];
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.x < minX) minX = b.x;
      if (b.y < minY) minY = b.y;
      if (b.z < minZ) minZ = b.z;
    }
    const shifted = blocks.map(function (b) {
      return {
        x: b.x - minX,
        y: b.y - minY,
        z: b.z - minZ,
      };
    });
    shifted.sort(function (a, b) {
      if (a.x !== b.x) return a.x - b.x;
      if (a.y !== b.y) return a.y - b.y;
      return a.z - b.z;
    });
    return shifted;
  }

  // 判定兩組多方塊在正規化後是否完全相同
  function areShapesEqual(shapeA, shapeB) {
    const a = normalizeShape(shapeA);
    const b = normalizeShape(shapeB);
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].x !== b[i].x || a[i].y !== b[i].y || a[i].z !== b[i].z) {
        return false;
      }
    }
    return true;
  }

  // 取得該形狀所有可能的 3D 空間旋轉態（最多 24 種旋轉姿態）
  function getAllRotations(blocks) {
    const visited = [];
    const queue = [normalizeShape(blocks)];

    function exists(s) {
      return visited.some(function (v) {
        return areShapesEqual(v, s);
      });
    }

    visited.push(queue[0]);

    while (queue.length > 0) {
      const curr = queue.shift();
      const nexts = [
        normalizeShape(rotateShapeX(curr)),
        normalizeShape(rotateShapeY(curr)),
        normalizeShape(rotateShapeZ(curr)),
      ];
      for (let i = 0; i < nexts.length; i++) {
        const next = nexts[i];
        if (!exists(next)) {
          visited.push(next);
          queue.push(next);
        }
      }
    }
    return visited;
  }

  // 建立三階難度題庫（保證每題缺口都是零件某個非初始的旋轉）
  function createQuestions(rng) {
    // 第 1 階：L 形與雙塊 2～3 塊，只需轉一軸即可吻合
    const q1Blocks = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
    ];
    const q1Target = normalizeShape(rotateShapeY(q1Blocks));

    const q2Blocks = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
    ];
    const q2Target = normalizeShape(rotateShapeZ(q2Blocks));

    // 第 2 階：T 形 4 塊與立體角柱，需轉動兩軸
    const q3Blocks = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 1, y: 1, z: 0 },
    ];
    const q3Target = normalizeShape(rotateShapeY(rotateShapeX(q3Blocks)));

    const q4Blocks = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 0, z: 1 },
    ];
    const q4Target = normalizeShape(rotateShapeZ(rotateShapeY(q4Blocks)));

    // 第 3 階：不對稱 5 塊立體機械零件，需轉動三軸
    const q5Blocks = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 1, y: 2, z: 0 },
      { x: 1, y: 1, z: 1 },
    ];
    const q5Target = normalizeShape(
      rotateShapeZ(rotateShapeY(rotateShapeX(q5Blocks)))
    );

    return [
      {
        id: "q1",
        tier: 1,
        title: "第 1 題：雙聯連桿 (2塊)",
        desc: "只需繞 Y 軸旋轉 90°",
        blockCount: 2,
        blocks: q1Blocks,
        targetBlocks: q1Target,
      },
      {
        id: "q2",
        tier: 1,
        title: "第 2 題：L 型轉向板 (3塊)",
        desc: "只需繞 Z 軸旋轉 90°",
        blockCount: 3,
        blocks: q2Blocks,
        targetBlocks: q2Target,
      },
      {
        id: "q3",
        tier: 2,
        title: "第 3 題：T 型列印承座 (4塊)",
        desc: "需綜合兩軸旋轉",
        blockCount: 4,
        blocks: q3Blocks,
        targetBlocks: q3Target,
      },
      {
        id: "q4",
        tier: 2,
        title: "第 4 題：三向支架卡榫 (4塊)",
        desc: "需綜合兩軸旋轉",
        blockCount: 4,
        blocks: q4Blocks,
        targetBlocks: q4Target,
      },
      {
        id: "q5",
        tier: 3,
        title: "第 5 題：非對稱多向機械接頭 (5塊)",
        desc: "立體五聯塊，考驗空間軸向直覺",
        blockCount: 5,
        blocks: q5Blocks,
        targetBlocks: q5Target,
      },
    ];
  }

  function shapeKey(blocks) {
    const norm = normalizeShape(blocks);
    let key = "";
    for (let i = 0; i < norm.length; i++) {
      key += norm[i].x + "," + norm[i].y + "," + norm[i].z + ";";
    }
    return key;
  }

  function minStepsToMatch(piece, slot) {
    if (!piece || !slot) return Infinity;
    if (areShapesEqual(piece, slot)) return 0;

    const startNorm = normalizeShape(piece);
    const targetNorm = normalizeShape(slot);
    const targetKey = shapeKey(targetNorm);

    const visited = new Set();
    visited.add(shapeKey(startNorm));
    const queue = [{ blocks: startNorm, dist: 0 }];

    const ops = [rotateShapeX, rotateShapeY, rotateShapeZ];

    while (queue.length > 0) {
      const curr = queue.shift();
      for (let i = 0; i < 3; i++) {
        const nextNorm = normalizeShape(ops[i](curr.blocks));
        const k = shapeKey(nextNorm);
        if (k === targetKey) {
          return curr.dist + 1;
        }
        if (!visited.has(k)) {
          visited.add(k);
          queue.push({ blocks: nextNorm, dist: curr.dist + 1 });
        }
      }
    }
    return Infinity;
  }

  function hintAxis(piece, slot) {
    if (!piece || !slot || areShapesEqual(piece, slot)) return null;

    const startNorm = normalizeShape(piece);
    const targetNorm = normalizeShape(slot);
    const targetKey = shapeKey(targetNorm);

    const visited = new Set();
    visited.add(shapeKey(startNorm));

    const ops = [
      { axis: "x", fn: rotateShapeX },
      { axis: "y", fn: rotateShapeY },
      { axis: "z", fn: rotateShapeZ },
    ];

    const queue = [];

    for (let i = 0; i < ops.length; i++) {
      const nextNorm = normalizeShape(ops[i].fn(startNorm));
      const k = shapeKey(nextNorm);
      if (k === targetKey) {
        return ops[i].axis;
      }
      if (!visited.has(k)) {
        visited.add(k);
        queue.push({ blocks: nextNorm, firstAxis: ops[i].axis });
      }
    }

    while (queue.length > 0) {
      const curr = queue.shift();
      for (let i = 0; i < ops.length; i++) {
        const nextNorm = normalizeShape(ops[i].fn(curr.blocks));
        const k = shapeKey(nextNorm);
        if (k === targetKey) {
          return curr.firstAxis;
        }
        if (!visited.has(k)) {
          visited.add(k);
          queue.push({ blocks: nextNorm, firstAxis: curr.firstAxis });
        }
      }
    }
    return null;
  }

  function canDrop(now, lockUntil) {
    if (lockUntil == null) return true;
    return Number(now) >= Number(lockUntil);
  }

  const R = {
    TOTAL_TIME: 60,
    TARGET_SCORE: 5,
    PENALTY_SECONDS: 2,

    rotateX: rotateX,
    rotateY: rotateY,
    rotateZ: rotateZ,
    rotateShapeX: rotateShapeX,
    rotateShapeY: rotateShapeY,
    rotateShapeZ: rotateShapeZ,
    normalizeShape: normalizeShape,
    areShapesEqual: areShapesEqual,
    getAllRotations: getAllRotations,
    createQuestions: createQuestions,
    minStepsToMatch: minStepsToMatch,
    hintAxis: hintAxis,
    canDrop: canDrop,

    createInitialState: function (options) {
      const rng = options && options.rng ? options.rng : Math.random;
      const questions = (options && options.questions) || createQuestions(rng);
      return {
        timeRemaining: R.TOTAL_TIME,
        currentIndex: 0,
        score: 0,
        targetQuestions: questions.length,
        isGameOver: false,
        isWin: false,
        penaltySeconds: R.PENALTY_SECONDS,
        questions: questions,
        currentBlocks: normalizeShape(questions[0].blocks),
        lastAction: null,
      };
    },

    rotateCurrent: function (state, axis) {
      if (state.isGameOver) return state;
      let next;
      const ax = String(axis).toUpperCase();
      if (ax === "X") next = rotateShapeX(state.currentBlocks);
      else if (ax === "Y") next = rotateShapeY(state.currentBlocks);
      else if (ax === "Z") next = rotateShapeZ(state.currentBlocks);
      else return state;

      return {
        timeRemaining: state.timeRemaining,
        currentIndex: state.currentIndex,
        score: state.score,
        targetQuestions: state.targetQuestions,
        isGameOver: state.isGameOver,
        isWin: state.isWin,
        penaltySeconds: state.penaltySeconds,
        questions: state.questions,
        currentBlocks: normalizeShape(next),
        lastAction: null,
      };
    },

    submitCurrent: function (state) {
      if (state.isGameOver) return state;
      const currentQ = state.questions[state.currentIndex];
      const match = areShapesEqual(state.currentBlocks, currentQ.targetBlocks);

      if (match) {
        const nextScore = state.score + 1;
        const nextIndex = state.currentIndex + 1;
        const isWin = nextScore >= state.targetQuestions;
        const isGameOver = isWin;

        return {
          timeRemaining: state.timeRemaining,
          currentIndex: isGameOver ? state.currentIndex : nextIndex,
          score: nextScore,
          targetQuestions: state.targetQuestions,
          isGameOver: isGameOver,
          isWin: isWin,
          penaltySeconds: state.penaltySeconds,
          questions: state.questions,
          currentBlocks: isGameOver
            ? state.currentBlocks
            : normalizeShape(state.questions[nextIndex].blocks),
          lastAction: "correct",
        };
      } else {
        const nextTime = Math.max(0, state.timeRemaining - state.penaltySeconds);
        const isGameOver = nextTime <= 0;
        return {
          timeRemaining: nextTime,
          currentIndex: state.currentIndex,
          score: state.score,
          targetQuestions: state.targetQuestions,
          isGameOver: isGameOver,
          isWin: false,
          penaltySeconds: state.penaltySeconds,
          questions: state.questions,
          currentBlocks: state.currentBlocks,
          lastAction: "wrong",
        };
      }
    },

    tick: function (state, deltaSeconds) {
      if (state.isGameOver) return state;
      const nextTime = Math.max(0, state.timeRemaining - deltaSeconds);
      const isGameOver = nextTime <= 0;
      return {
        timeRemaining: nextTime,
        currentIndex: state.currentIndex,
        score: state.score,
        targetQuestions: state.targetQuestions,
        isGameOver: isGameOver,
        isWin: state.isWin,
        penaltySeconds: state.penaltySeconds,
        questions: state.questions,
        currentBlocks: state.currentBlocks,
        lastAction: state.lastAction,
      };
    },

    evaluateWin: function (state) {
      return state.score >= state.targetQuestions && state.timeRemaining > 0;
    },
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_MG_3D = R;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
