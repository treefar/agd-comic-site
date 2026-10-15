/**
 * mg-anim - 時間曲線滑翔 (純規則函式庫)
 * 專長：電腦動畫 (Computer Animation)
 *
 * 核心原理：
 * 動畫師在動畫編輯器（Graph Editor）中使用「時間曲線（Timing / Value Curve）」
 * 透過「緩入緩出（Slow In & Slow Out）」調整物體的加速度與慣性，賦予動作重量感。
 */
(function (root) {
  "use strict";

  // ---------------------------------------------------------------------------
  // 物理常數與配置
  // ---------------------------------------------------------------------------
  const TOTAL_SECONDS = 60;
  const TARGET_FLAGS = 3;
  const FLAG_DISTANCES = [4800, 10500, 16200];
  const GROUND_BASE_Y = 320;

  const PHY = {
    gravity: 1500,          // 基礎重力（放開時維持滑翔）
    diveGravity: 3400,      // 俯衝重力（按住時角色變重，下坡加速）
    minSpd: 90,             // 保底速度
    maxSpd: 780,            // 極速上限
    slideFriction: 0.10,    // 貼地摩擦力
    airDrag: 0.012,         // 空中阻力
    launchBoost: 1.5,       // 拋射垂直速度倍率
    takeOffSlope: -0.25,    // 起飛斜率門檻（夠陡的上坡放手才能飛出）
    takeOffSpd: 260         // 起飛速度門檻
  };

  const STAGE_CONFIGS = {
    1: {
      id: 1,
      name: "第 1 階：平緩曲線",
      desc: "坡道平緩，適合掌握「下坡按住、上坡前放開」的基礎節奏",
      amp: 40,
      freq: 0.0052,
      rough: 0.25
    },
    2: {
      id: 2,
      name: "第 2 階：起伏加劇",
      desc: "坡度顯著變陡，下坡俯衝衝力大幅提升，騰空滯空感更強",
      amp: 65,
      freq: 0.0068,
      rough: 0.45
    },
    3: {
      id: 3,
      name: "第 3 階：連續小丘",
      desc: "連續高頻起伏，動作節奏變快，需極為精準的緩入緩出時機",
      amp: 54,
      freq: 0.0108,
      rough: 0.80
    }
  };

  // ---------------------------------------------------------------------------
  // 輔助函式：線性夾取與可重現亂數產生器
  // ---------------------------------------------------------------------------
  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function createSeededRng(seed) {
    let s = (Math.floor(seed) || 1) >>> 0;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  // ---------------------------------------------------------------------------
  // 1. 階段判定（秒數 → 1/2/3 階）
  // ---------------------------------------------------------------------------
  function getStage(elapsedSeconds) {
    const s = Math.max(0, Number(elapsedSeconds) || 0);
    if (s < 20) return 1;
    if (s < 40) return 2;
    return 3;
  }

  // ---------------------------------------------------------------------------
  // 2. 地形高度與斜率函式（給 rng 可重現）
  // ---------------------------------------------------------------------------
  function createHills(stageConfig, rng) {
    const rand = typeof rng === "function" ? rng : createSeededRng(Number(rng) || 1);
    const amp = stageConfig.amp;
    const freq = stageConfig.freq;
    const rough = stageConfig.rough;
    return [
      { amp: amp, freq: freq, phase: rand() * Math.PI * 2 },
      { amp: amp * 0.45 * rough, freq: freq * 2.3, phase: rand() * Math.PI * 2 },
      { amp: amp * 0.18 * rough, freq: freq * 5.1, phase: rand() * Math.PI * 2 }
    ];
  }

  function groundAt(x, hills, baseY) {
    let y = baseY !== undefined ? baseY : GROUND_BASE_Y;
    if (!hills || !hills.length) return y;
    for (let i = 0; i < hills.length; i++) {
      const h = hills[i];
      y += Math.sin(x * h.freq + h.phase) * h.amp;
    }
    return y;
  }

  function slopeAt(x, hills) {
    let d = 0;
    if (!hills || !hills.length) return 0;
    for (let i = 0; i < hills.length; i++) {
      const h = hills[i];
      d += Math.cos(x * h.freq + h.phase) * h.amp * h.freq;
    }
    return d;
  }

  // 建立連貫的三階段賽道地形（以平滑過渡融合 1、2、3 階）
  function createContinuousTrack(rng) {
    const rand = typeof rng === "function" ? rng : createSeededRng(Number(rng) || 1);
    const hills1 = createHills(STAGE_CONFIGS[1], rand);
    const hills2 = createHills(STAGE_CONFIGS[2], rand);
    const hills3 = createHills(STAGE_CONFIGS[3], rand);
    return {
      hills1,
      hills2,
      hills3,
      flags: FLAG_DISTANCES.slice()
    };
  }

  function trackGroundAt(x, track, baseY) {
    const by = baseY !== undefined ? baseY : GROUND_BASE_Y;
    if (!track) return by;
    const f1 = track.flags[0];
    const f2 = track.flags[1];
    const blendSpan = 800;

    if (x <= f1 - blendSpan / 2) {
      return groundAt(x, track.hills1, by);
    } else if (x < f1 + blendSpan / 2) {
      const t = (x - (f1 - blendSpan / 2)) / blendSpan;
      const smooth = t * t * (3 - 2 * t);
      const y1 = groundAt(x, track.hills1, by);
      const y2 = groundAt(x, track.hills2, by);
      return y1 * (1 - smooth) + y2 * smooth;
    } else if (x <= f2 - blendSpan / 2) {
      return groundAt(x, track.hills2, by);
    } else if (x < f2 + blendSpan / 2) {
      const t = (x - (f2 - blendSpan / 2)) / blendSpan;
      const smooth = t * t * (3 - 2 * t);
      const y2 = groundAt(x, track.hills2, by);
      const y3 = groundAt(x, track.hills3, by);
      return y2 * (1 - smooth) + y3 * smooth;
    } else {
      return groundAt(x, track.hills3, by);
    }
  }

  function trackSlopeAt(x, track) {
    if (!track) return 0;
    const f1 = track.flags[0];
    const f2 = track.flags[1];
    const blendSpan = 800;

    if (x <= f1 - blendSpan / 2) {
      return slopeAt(x, track.hills1);
    } else if (x < f1 + blendSpan / 2) {
      const t = (x - (f1 - blendSpan / 2)) / blendSpan;
      const smooth = t * t * (3 - 2 * t);
      const s1 = slopeAt(x, track.hills1);
      const s2 = slopeAt(x, track.hills2);
      return s1 * (1 - smooth) + s2 * smooth;
    } else if (x <= f2 - blendSpan / 2) {
      return slopeAt(x, track.hills2);
    } else if (x < f2 + blendSpan / 2) {
      const t = (x - (f2 - blendSpan / 2)) / blendSpan;
      const smooth = t * t * (3 - 2 * t);
      const s2 = slopeAt(x, track.hills2);
      const s3 = slopeAt(x, track.hills3);
      return s2 * (1 - smooth) + s3 * smooth;
    } else {
      return slopeAt(x, track.hills3);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. 速度與物理更新函式（按住俯衝／放開滑翔、坡度反饋）
  // ---------------------------------------------------------------------------
  function updatePhysics(player, input, slope, groundY, dt, phyConfig) {
    const phy = phyConfig || PHY;
    const isDive = Boolean(input && input.dive);
    const radius = player.r || 12;

    let vx = player.vx;
    let vy = player.vy;
    let onGround = Boolean(player.onGround);
    let airTime = player.airTime || 0;
    let tookOff = false;
    let landed = false;
    let landQuality = null;

    if (onGround) {
      // 貼地滑行
      const g = isDive ? phy.diveGravity : phy.gravity;
      // 沿坡重力加速度：下坡 (slope > 0) 為正向加速，俯衝放大重力
      const along = -slope / Math.sqrt(1 + slope * slope);
      vx += (-along) * g * dt * 0.5;

      // 摩擦阻力：俯衝按住時減小摩擦以利衝刺
      const frictionRate = phy.slideFriction * (isDive ? 0.5 : 1.0);
      vx -= vx * frictionRate * dt;
      vx = clamp(vx, phy.minSpd, phy.maxSpd);

      // 貼著坡面，垂直速度由斜率主導
      vy = vx * slope;

      // 起飛條件：上坡、放開俯衝鍵、速度超越門檻
      if (slope < phy.takeOffSlope && !isDive && vx > phy.takeOffSpd) {
        const ang = Math.atan(slope);
        const spd = vx / Math.cos(ang);
        vx = Math.cos(ang) * spd;
        vy = Math.sin(ang) * spd * phy.launchBoost;
        onGround = false;
        tookOff = true;
        airTime = 0;
      } else {
        airTime = 0;
      }
    } else {
      // 空中滑翔
      const ga = isDive ? phy.diveGravity : phy.gravity;
      vy += ga * dt;
      vx -= vx * phy.airDrag * dt;
      vx = clamp(vx, phy.minSpd, phy.maxSpd);
      airTime += dt;
    }

    // 更新坐標
    let x = player.x + vx * dt;
    let y = player.y + vy * dt;

    // 落地碰撞判定
    if (!onGround && y >= groundY - radius) {
      y = groundY - radius;
      onGround = true;
      landed = true;
      // 落在下坡 (slope > 0.15) 且有足夠滯空時間視為完美著陸 (緩入成功)
      if (airTime >= 0.22 && slope > 0.15) {
        landQuality = "perfect";
        vx = clamp(vx * 1.08, phy.minSpd, phy.maxSpd); // 完美節奏獎勵衝刺
      } else {
        landQuality = "normal";
      }
      airTime = 0;
      vy = vx * slope;
    } else if (onGround) {
      y = groundY - radius;
    }

    return {
      x,
      y,
      vx,
      vy,
      onGround,
      airTime,
      tookOff,
      landed,
      landQuality,
      isDive
    };
  }

  // ---------------------------------------------------------------------------
  // 4. 勝負與結算判定
  // ---------------------------------------------------------------------------
  function checkGameResult(state) {
    const flagsPassed = state.flagsPassed || 0;
    const targetFlags = state.targetFlags || TARGET_FLAGS;
    const elapsedSeconds = state.elapsedSeconds || 0;
    const maxTime = state.maxTime || TOTAL_SECONDS;

    if (flagsPassed >= targetFlags) {
      return { over: true, win: true, reason: "passed_all_flags" };
    }
    if (elapsedSeconds >= maxTime) {
      return { over: true, win: false, reason: "time_up" };
    }
    return { over: false, win: false, reason: "playing" };
  }

  function calculateScore(state) {
    const flags = state.flagsPassed || 0;
    const perfectLands = state.perfectLands || 0;
    const maxCombo = state.maxCombo || 0;
    const elapsed = Math.min(TOTAL_SECONDS, state.elapsedSeconds || 0);
    const win = Boolean(state.win);
    const distance = Math.max(0, state.distance || 0);

    let score = flags * 1200 + perfectLands * 150 + maxCombo * 100;
    if (win) {
      const remainingSeconds = Math.max(0, TOTAL_SECONDS - elapsed);
      score += Math.round(remainingSeconds * 50) + 1500;
    } else {
      score += Math.round(distance * 0.1);
    }
    return Math.max(0, Math.round(score));
  }

  // ---------------------------------------------------------------------------
  // 匯出物件
  // ---------------------------------------------------------------------------
  const R = {
    TOTAL_SECONDS,
    TARGET_FLAGS,
    FLAG_DISTANCES,
    GROUND_BASE_Y,
    PHY,
    STAGE_CONFIGS,
    clamp,
    createSeededRng,
    getStage,
    createHills,
    groundAt,
    slopeAt,
    createContinuousTrack,
    trackGroundAt,
    trackSlopeAt,
    updatePhysics,
    checkGameResult,
    calculateScore
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_MG_ANIM = R;
    root["EXIT6_RULES_mg-anim"] = R;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
