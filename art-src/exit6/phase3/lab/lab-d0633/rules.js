(function (root) {
  "use strict";

  var R = {
    ID: "lab-d0633",
    TITLE: "VR 跑步機衝刺",
    LAB: "D0633 體感互動實驗室",
    SKILL: "體感互動",
    SECONDS: 60,
    WIN_RULE_EXPLANATION: "玩家在 60 秒限時內保持在虛擬城市屋頂奔馳且未失足墜樓即判定獲勝（win = true）。若中途失足墜樓則立即失敗結束（win = false）。此設定呼應體感跑步機強調的持續耐力與節奏掌控，60 秒完走象徵完成體感模擬衝刺挑戰。",

    // 星等規格：宿主依此計算 1～3 星
    // ★1 ＝ win === true
    // ★2 ＝ score >= STARS.score2
    // ★3 ＝ onEnd 回傳 flawless === true
    STARS: {
      score2: 1000,
      flawless: "全程未撞障礙"
    },

    // 核心物理手感參數（繼承 Canabalt 之跳躍包絡線物理架構）
    PHYSICS: {
      gravity: 1500,
      jumpV: -500,
      jumpCut: 0.38,
      playerW: 18,
      playerH: 30,
      minTop: 95,
      maxTop: 215,
      slowOnCrate: 0.82
    },

    // 由淺入深三階難度配置（0～20秒 / 20～40秒 / 40～60秒）
    // 速度、缺口寬度、障礙機率隨階段嚴格遞增
    STAGES: [
      {
        tier: 1,
        name: "初階暖身",
        timeRange: [0, 20],
        speedStart: 200,
        speedEnd: 280,
        accel: 4.0,
        minGap: 26,
        maxGapRatio: 0.60,
        crateChance: 0.10
      },
      {
        tier: 2,
        name: "進階提速",
        timeRange: [20, 40],
        speedStart: 280,
        speedEnd: 360,
        accel: 4.0,
        minGap: 38,
        maxGapRatio: 0.72,
        crateChance: 0.16
      },
      {
        tier: 3,
        name: "極限衝刺",
        timeRange: [40, 60],
        speedStart: 360,
        speedEnd: 440,
        accel: 4.0,
        minGap: 52,
        maxGapRatio: 0.82,
        crateChance: 0.22
      }
    ],

    /**
     * 依遊戲已進行秒數取得對應階段設定
     * @param {number} elapsedSeconds - 已進行秒數
     * @returns {object} 階段設定
     */
    getStage: function (elapsedSeconds) {
      var t = Math.max(0, elapsedSeconds);
      if (t < 20) return R.STAGES[0];
      if (t < 40) return R.STAGES[1];
      return R.STAGES[2];
    },

    /**
     * 跳躍包絡線物理計算（純函式）
     * 根據當前水平速度、跳躍初速與重力，精準計算最大滯空時間與水平可達距離
     * @param {number} speed - 當前水平奔跑速度
     * @param {number} [jumpV] - 跳躍初速
     * @param {number} [gravity] - 重力加速度
     * @returns {object} { apex, airTime, reachFor }
     */
    calculateEnvelope: function (speed, jumpV, gravity) {
      var v = typeof jumpV === "number" ? jumpV : R.PHYSICS.jumpV;
      var g = typeof gravity === "number" ? gravity : R.PHYSICS.gravity;
      var sp = Math.max(1, speed);
      var tUp = -v / g;
      var apex = (v * v) / (2 * g);

      function airTime(drop) {
        // y(t) = v*t + 0.5*g*t^2 = drop
        // 解 0.5*g*t^2 + v*t - drop = 0
        var a = 0.5 * g;
        var b = v;
        var c = -drop;
        var disc = b * b - 4 * a * c;
        if (disc < 0) return tUp * 2;
        return (-b + Math.sqrt(disc)) / (2 * a);
      }

      return {
        apex: apex,
        airTime: airTime,
        reachFor: function (drop) {
          return sp * airTime(drop);
        }
      };
    },

    /**
     * 數值邊界限制
     */
    clamp: function (val, min, max) {
      return val < min ? min : (val > max ? max : val);
    },

    /**
     * 程序生成下一棟建築物與障礙物（純函式）
     * 保證缺口不超過跳躍包絡線之可達範圍
     * @param {object} prevBuilding - 前一棟建築物 { x, w, top }
     * @param {object} stage - 當前階段設定
     * @param {number} currentSpeed - 當前奔跑速度
     * @param {function} [rng] - 亂數產生器（回傳 0～1）
     * @returns {object} 新建築物資料 { x, w, top, gap, crates }
     */
    generateBuilding: function (prevBuilding, stage, currentSpeed, rng) {
      var rand = typeof rng === "function" ? rng : Math.random;
      var env = R.calculateEnvelope(currentSpeed);
      var maxRise = env.apex * 0.70;
      var rise = -60 + rand() * (maxRise - (-60));
      var top = Math.round(R.clamp(prevBuilding.top - rise, R.PHYSICS.minTop, R.PHYSICS.maxTop));
      var drop = top - prevBuilding.top;

      var theoreticalMax = env.reachFor(drop) * stage.maxGapRatio - R.PHYSICS.playerW;
      var maxGap = Math.max(stage.minGap, Math.min(260, theoreticalMax));
      var gap = Math.round(stage.minGap + rand() * (maxGap - stage.minGap));
      var width = Math.round(140 + rand() * 120);

      var building = {
        x: prevBuilding.x + prevBuilding.w + gap,
        w: width,
        top: top,
        gap: gap,
        crates: []
      };

      if (width > 160 && rand() < stage.crateChance) {
        var crateX = Math.round(building.x + 45 + rand() * (width - 90));
        building.crates.push({
          x: crateX,
          y: top,
          hit: false
        });
      }

      return building;
    },

    /**
     * 判定勝負（純函式）
     * 跑滿 60 秒且未墜樓判定為獲勝
     * @param {object} stats - { elapsed, dead }
     * @returns {boolean} 是否獲勝
     */
    checkWin: function (stats) {
      if (!stats) return false;
      return stats.elapsed >= R.SECONDS && !stats.dead;
    },

    /**
     * 計算跑動距離分數（取整數公尺）
     * @param {number} distance - 奔跑距離
     * @returns {number} 整數公尺
     */
    calculateScore: function (distance) {
      if (typeof distance !== "number" || isNaN(distance)) return 0;
      return Math.floor(Math.max(0, distance));
    },

    /**
     * 完美表現判定（純函式）：通關且全程未撞障礙
     * @param {object} stats - { win, collisions }
     * @returns {boolean} 是否無暇過關
     */
    isFlawless: function (stats) {
      if (!stats) return false;
      return stats.win === true && stats.collisions === 0;
    },

    /**
     * 計算三顆星獲取狀況
     * @param {object} stats - { win, score, collisions }
     * @returns {object} { star1, star2, star3, count }
     */
    evaluateStars: function (stats) {
      var star1 = stats ? stats.win === true : false;
      var score = stats && typeof stats.score === "number" ? stats.score : 0;
      var star2 = score >= R.STARS.score2;
      var star3 = R.isFlawless(stats);
      return {
        star1: star1,
        star2: star2,
        star3: star3,
        count: (star1 ? 1 : 0) + (star2 ? 1 : 0) + (star3 ? 1 : 0)
      };
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_LAB_D0633 = R;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
