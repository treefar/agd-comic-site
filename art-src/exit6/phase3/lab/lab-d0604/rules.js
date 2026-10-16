(function (root) {
  "use strict";

  const LEVELS = [
    {
      id: 1,
      name: "第一關 · 滑行斜坡",
      hint: "在畫面上拖曳畫線，按『出發』讓角色沿線滑下去",
      start: { x: 60, y: 70 },
      startAngle: 6,
      goal: { x: 420, y: 240 },
      ink: Infinity,
      tools: ["blue"],
      par: 9,
      difficulty: 1,
      terrain: [[[36, 70], [100, 76]]],
      solution: [{ t: "blue", pts: [[100, 78], [425, 238]] }]
    },
    {
      id: 2,
      name: "第二關 · 跨越斷層",
      hint: "中間斷開了！畫出流暢的曲線接起橋樑，引導小球跨越斷崖",
      start: { x: 44, y: 70 },
      startAngle: 31,
      goal: { x: 428, y: 208 },
      ink: 520,
      tools: ["blue"],
      par: 10,
      difficulty: 2,
      terrain: [[[26, 64], [170, 150]], [[300, 208], [456, 214]]],
      solution: [{ t: "blue", pts: [[164, 148], [310, 206]] }]
    },
    {
      id: 3,
      name: "第三關 · 向上加速",
      hint: "終點在高處！切換紅線筆刷，沿著畫線方向給予強大推力衝上平台",
      start: { x: 52, y: 82 },
      startAngle: 38,
      goal: { x: 430, y: 136 },
      ink: 640,
      tools: ["blue", "red"],
      par: 12,
      difficulty: 3,
      terrain: [[[36, 74], [240, 236]], [[398, 142], [462, 142]]],
      solution: [
        { t: "blue", pts: [[198, 206], [224, 222], [250, 228], [276, 222], [298, 210]] },
        { t: "red", pts: [[298, 210], [400, 140]] }
      ]
    }
  ];

  const STARS = {
    score2: 2500,
    flawless: "每關一次成功"
  };

  const GAME_INFO = {
    id: "lab-d0604",
    title: "繪圖板描線救援",
    lab: "D0604 電繪實驗室",
    skill: "數位繪圖",
    seconds: 60,
    knowledge: "電繪不只是畫圖，線條的走向與力道決定畫面怎麼「流動」，就像這條線決定角色怎麼滑。"
  };

  function isWin(stats) {
    if (!stats) return false;
    return (stats.passedCount || 0) >= 2;
  }

  function calcScore(stats) {
    if (!stats) return 0;
    const passed = Math.max(0, Math.floor(stats.passedCount || 0));
    const inkRatio = Math.max(0, Math.min(1, typeof stats.inkRatio === "number" ? stats.inkRatio : 0));
    const sec = Math.max(0, Math.floor(stats.remainingSeconds || 0));
    return passed * 1000 + Math.round(inkRatio * 500) + sec * 10;
  }

  function isFlawless(stats) {
    if (!stats) return false;
    if (!isWin(stats)) return false;
    if ((stats.crashes || 0) > 0) return false;
    if ((stats.resets || 0) > 0) return false;
    if ((stats.failedAttempts || 0) > 0) return false;
    if (Array.isArray(stats.attempts)) {
      if (stats.attempts.length < stats.passedCount) return false;
      for (let i = 0; i < stats.passedCount; i++) {
        if (stats.attempts[i] !== 1) return false;
      }
    } else if (stats.totalAttempts !== undefined) {
      if (stats.totalAttempts !== stats.passedCount) return false;
    }
    return true;
  }

  function calcStars(stats) {
    if (!isWin(stats)) return 0;
    const score = calcScore(stats);
    const flawless = isFlawless(stats);
    let stars = 1;
    if (score >= STARS.score2) stars++;
    if (flawless) stars++;
    return stars;
  }

  function evaluateRngTrial(rng, count) {
    const n = count || 5;
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(Math.floor(rng() * 100));
    }
    return arr;
  }

  const R = {
    LEVELS,
    STARS,
    GAME_INFO,
    isWin,
    calcScore,
    isFlawless,
    calcStars,
    evaluateRngTrial
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_LAB_D0604 = R;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
