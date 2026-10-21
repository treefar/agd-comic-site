/**
 * lab-d0631 虛擬製片靶場 - 純規則邏輯
 * 依據 orders/_lab-contract.md 與 orders/_mg-contract.md
 * 不碰 DOM、不用 window，給 node:test 與 game.js 共用
 */
(function (root) {
  const TOTAL_SECONDS = 60;
  const WIN_SCORE = 60;
  const SCORE2 = 100;

  // 三階難度設定（0~20 秒微風、20~40 秒中風、40~60 秒強風且靶變小）
  const STAGES = Object.freeze([
    {
      id: "STAGE_1",
      name: "第 1 階：微風定點測試",
      timeStart: 0,
      timeEnd: 20,
      windMps: 0.5,
      targetScale: 1.0,
      distanceM: 12,
      targetAmp: 0,
      targetPeriod: 0
    },
    {
      id: "STAGE_2",
      name: "第 2 階：側風動態模擬",
      timeStart: 20,
      timeEnd: 40,
      windMps: -2.5,
      targetScale: 0.85,
      distanceM: 20,
      targetAmp: 0.25,
      targetPeriod: 4.0
    },
    {
      id: "STAGE_3",
      name: "第 3 階：強風微型靶捕捉",
      timeStart: 40,
      timeEnd: 60,
      windMps: 4.5,
      targetScale: 0.65,
      distanceM: 30,
      targetAmp: 0.40,
      targetPeriod: 2.8
    }
  ]);

  // 瞄準與手感常數（繼承自 src/lens/wind-trace-aim-graybox.html）
  const FOCUS_BEST_AT = 1.15;
  const FOCUS_STABLE_UNTIL = 2.80;
  const FOCUS_WARN_AT = 4.60;
  const FOCUS_START_RADIUS = 0.22;
  const FOCUS_BEST_RADIUS = 0.045;
  const FOCUS_LATE_RADIUS = 0.16;
  const MIN_DRAW_POWER = 0.35;
  const WIND_FACTOR = 0.0015;
  const GRAVITY_FACTOR = 0.00013;
  const JITTER_FACTOR = 0.42;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function getStageIndex(elapsedSeconds) {
    const s = clamp(elapsedSeconds, 0, TOTAL_SECONDS);
    if (s < 20) return 0;
    if (s < 40) return 1;
    return 2;
  }

  function getStage(elapsedSeconds) {
    return STAGES[getStageIndex(elapsedSeconds)];
  }

  function calculateDrawPower(holdSeconds) {
    return clamp((holdSeconds - 0.08) / 0.67, MIN_DRAW_POWER, 1.00);
  }

  function calculateFocusRadius(holdSeconds) {
    if (holdSeconds <= FOCUS_BEST_AT) {
      return lerp(FOCUS_START_RADIUS, FOCUS_BEST_RADIUS, holdSeconds / FOCUS_BEST_AT);
    }
    if (holdSeconds <= FOCUS_STABLE_UNTIL) {
      return FOCUS_BEST_RADIUS;
    }
    if (holdSeconds <= FOCUS_WARN_AT) {
      return lerp(
        FOCUS_BEST_RADIUS,
        FOCUS_LATE_RADIUS,
        (holdSeconds - FOCUS_STABLE_UNTIL) / (FOCUS_WARN_AT - FOCUS_STABLE_UNTIL)
      );
    }
    return FOCUS_LATE_RADIUS;
  }

  function getTargetPosition(elapsedSeconds, stageIndex) {
    const s = STAGES[stageIndex !== undefined ? stageIndex : getStageIndex(elapsedSeconds)];
    if (!s || s.targetPeriod <= 0 || s.targetAmp <= 0) {
      return { x: 0, y: 0 };
    }
    const x = s.targetAmp * Math.sin((elapsedSeconds * Math.PI * 2) / s.targetPeriod);
    return { x, y: 0 };
  }

  function calculateShotImpact(aim, holdSeconds, stageConfig, rng) {
    const drawPower = calculateDrawPower(holdSeconds);
    const focusRadius = calculateFocusRadius(holdSeconds);
    const flightTime = (0.35 + stageConfig.distanceM * 0.012) / lerp(0.72, 1.00, drawPower);
    const windDriftX = (stageConfig.windMps * stageConfig.distanceM * WIND_FACTOR) / drawPower;
    const gravityDropY = (stageConfig.distanceM * stageConfig.distanceM * GRAVITY_FACTOR) / (drawPower * drawPower);

    const randFn = typeof rng === "function" ? rng : Math.random;
    const u = randFn();
    const v = randFn();
    const angle = u * Math.PI * 2;
    const radius = Math.sqrt(v);
    const jitterX = Math.cos(angle) * radius * focusRadius * JITTER_FACTOR;
    const jitterY = Math.sin(angle) * radius * focusRadius * JITTER_FACTOR;

    const impactX = aim.x + windDriftX + jitterX;
    const impactY = aim.y + gravityDropY + jitterY;

    return {
      drawPower,
      focusRadius,
      flightTime,
      windDriftX,
      gravityDropY,
      jitterX,
      jitterY,
      impactX,
      impactY
    };
  }

  function judgeImpact(impact, targetPos, targetScale) {
    const scale = (typeof targetScale === "number" && targetScale > 0) ? targetScale : 1.0;
    const dx = (impact.impactX - targetPos.x) / scale;
    const dy = (impact.impactY - targetPos.y) / scale;
    const radial = Math.hypot(dx, dy);

    if (radial >= 1.0) {
      return {
        radial,
        score: 0,
        isHit: false,
        ring: 0
      };
    }

    const ring = clamp(10 - Math.floor(radial * 10), 1, 10);
    return {
      radial,
      score: ring,
      isHit: true,
      ring
    };
  }

  function isWin(score) {
    return typeof score === "number" && score >= WIN_SCORE;
  }

  function isFlawless(stats) {
    if (!stats || typeof stats !== "object") return false;
    const fired = stats.shotsFired || 0;
    const hits = stats.hits || 0;
    const misses = stats.misses || 0;
    return fired > 0 && hits === fired && misses === 0;
  }

  function calculateStars(score, stats) {
    const s1 = isWin(score);
    const s2 = typeof score === "number" && score >= SCORE2;
    const s3 = isFlawless(stats);
    let count = 0;
    if (s1) count += 1;
    if (s2) count += 1;
    if (s3) count += 1;
    return {
      star1: s1,
      star2: s2,
      star3: s3,
      count
    };
  }

  const R = {
    TOTAL_SECONDS,
    WIN_SCORE,
    SCORE2,
    STAGES,
    FOCUS_BEST_AT,
    FOCUS_STABLE_UNTIL,
    FOCUS_WARN_AT,
    FOCUS_START_RADIUS,
    FOCUS_BEST_RADIUS,
    FOCUS_LATE_RADIUS,
    MIN_DRAW_POWER,
    WIND_FACTOR,
    GRAVITY_FACTOR,
    JITTER_FACTOR,
    clamp,
    lerp,
    getStageIndex,
    getStage,
    calculateDrawPower,
    calculateFocusRadius,
    getTargetPosition,
    calculateShotImpact,
    judgeImpact,
    isWin,
    isFlawless,
    calculateStars
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_LAB_D0631 = R;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
