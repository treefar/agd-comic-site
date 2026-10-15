/**
 * mg-type「字體對撞」（專長：視覺傳達設計）純規則模組
 * 不碰 DOM、不用 window，供 node 測試與 game.js 共用
 */
(function (root) {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // 衝刺冷卻下限、開局示範時長與提前獲勝結算時間門檻
  const MIN_DASH_COOLDOWN = 1.2;
  const DEMO_DURATION = 3.0;
  const MIN_EARLY_WIN_SECONDS = 10;

  // 四種字體風格參數表
  const FONTS = {
    bold: {
      id: "bold",
      name: "粗黑體",
      weight: "900",
      fontFamily: '"Microsoft JhengHei", sans-serif',
      fallback: "sans-serif",
      mass: 2.0,
      kickPower: 85,
      elasticity: 0.9,
      counterPower: 15,
      turnSpeed: 2.2,
      speed: 75,
      dashCooldown: 2.5,
      trait: "重、撞得遠",
      designRole: "粗黑體結構沉穩扎實、視覺震撼度高，最適合用於大標題、警示號誌、戶外廣告與需要展現力量感的傳播場合。",
    },
    serif: {
      id: "serif",
      name: "明體",
      weight: "700",
      fontFamily: '"PMingLiU", serif',
      fallback: "serif",
      mass: 1.25,
      kickPower: 60,
      elasticity: 0.95,
      counterPower: 35, // 銳利反擊強，受撞時對對手造成大幅反作用衝擊
      turnSpeed: 2.8,
      speed: 85,
      dashCooldown: 2.2,
      trait: "銳利、反擊強",
      designRole: "明體橫細豎粗、末端有精緻襯線，具備極高的易讀性與人文氣息，最適合書籍長篇閱讀、文化雜誌與典雅內文排版。",
    },
    round: {
      id: "round",
      name: "圓體",
      weight: "900",
      fontFamily: '"Arial Rounded MT Bold", "Microsoft JhengHei", sans-serif',
      fallback: '"Microsoft JhengHei", sans-serif',
      mass: 1.05,
      kickPower: 52,
      elasticity: 1.35, // 高彈性，受撞後迅速彈射復原
      counterPower: 18,
      turnSpeed: 3.2,
      speed: 95,
      dashCooldown: 1.2, // 圓體回彈快，衝刺冷卻最短，依規範下限設為 1.2 秒
      trait: "彈性、回彈快",
      designRole: "圓體筆畫轉角皆為圓弧，呈現親和、友善且溫暖的氛圍，廣泛應用於兒童出版品、食品包裝、社群親和指標與休閒設計。",
    },
    script: {
      id: "script",
      name: "楷體",
      weight: "700",
      fontFamily: '"DFKai-SB", "BiauKai", serif',
      fallback: "serif",
      mass: 0.9,
      kickPower: 48,
      elasticity: 1.05,
      counterPower: 20,
      turnSpeed: 5.0, // 轉向極快、靈活
      speed: 110,
      dashCooldown: 1.8,
      trait: "靈活、轉向快",
      designRole: "楷體傳承毛筆書法的筋骨氣韻，端莊中見流動靈性，最適合傳統節慶、文創商品、證書獎狀與古典意境營造。",
    },
  };

  // 三階難度參數配置
  const STAGE_CONFIGS = [
    {
      stage: 1,
      name: "第 1 階：暖身對撞",
      desc: "擂台開闊，電腦對手反應遲緩",
      startSec: 0,
      endSec: 20,
      arenaRadius: 280,
      aiSpeed: 50,
      aiTurnSpeed: 1.6,
      aiDashInterval: 6.5,
      aiAggression: 0.25,
      aiMassMultiplier: 3.0, // 第 1 階電腦字陣質量提高
      aiKnockbackResistance: 0.7, // 抗擊退提高（受撞衝量吸收減免 70%）
      aiDamping: 1.6, // 提高阻尼，單次衝刺最多被擊退 1 個字出界
    },
    {
      stage: 2,
      name: "第 2 階：電腦追擊",
      desc: "電腦鎖定目標主動追撞",
      startSec: 20,
      endSec: 40,
      arenaRadius: 250,
      aiSpeed: 95,
      aiTurnSpeed: 3.2,
      aiDashInterval: 4.0,
      aiAggression: 0.7,
      aiMassMultiplier: 1.0,
      aiKnockbackResistance: 0.0,
      aiDamping: 0.25,
    },
    {
      stage: 3,
      name: "第 3 階：決死縮圈",
      desc: "擂台劇烈縮小，電腦高速猛攻",
      startSec: 40,
      endSec: 60,
      arenaRadius: 190,
      aiSpeed: 135,
      aiTurnSpeed: 4.6,
      aiDashInterval: 2.6,
      aiAggression: 1.0,
      aiMassMultiplier: 1.0,
      aiKnockbackResistance: 0.0,
      aiDamping: 0.25,
    },
  ];

  /**
   * 取得字體衝刺冷卻時間（下限至少 1.2 秒）
   */
  function getDashCooldown(fontKey) {
    const font = typeof fontKey === "string" ? FONTS[fontKey] : fontKey;
    const cd = (font && font.dashCooldown) ? font.dashCooldown : 2.0;
    return Math.max(MIN_DASH_COOLDOWN, cd);
  }

  /**
   * 判定是否為開局示範時間（前 3 秒）
   */
  function isDemoTime(secondsElapsed) {
    return secondsElapsed < DEMO_DURATION;
  }

  /**
   * 取得指定秒數對應的階級設定
   */
  function getStage(secondsElapsed) {
    if (secondsElapsed < 20) return STAGE_CONFIGS[0];
    if (secondsElapsed < 40) return STAGE_CONFIGS[1];
    return STAGE_CONFIGS[2];
  }

  /**
   * 計算即時擂台半徑（第 3 階平滑縮圈）
   */
  function getArenaRadius(secondsElapsed) {
    const s = clamp(secondsElapsed, 0, 60);
    if (s <= 20) {
      return 280;
    } else if (s <= 40) {
      // 20~40秒微調半徑 280 -> 250
      const ratio = (s - 20) / 20;
      return 280 - ratio * 30;
    } else {
      // 40~60秒加速縮圈 250 -> 190
      const ratio = (s - 40) / 20;
      return 250 - ratio * 60;
    }
  }

  /**
   * 解析輸入文字（1～3 個字，過濾空白與無效字符，若空則預設「動遊系」）
   */
  function parseCharacters(input) {
    if (typeof input !== "string") {
      return ["動", "遊", "系"];
    }
    const chars = Array.from(input.trim()).filter((ch) => !/[\s\p{C}\p{M}]/u.test(ch));
    if (chars.length === 0) {
      return ["動", "遊", "系"];
    }
    return chars.slice(0, 3);
  }

  /**
   * 計算字陣各頂點位置
   * 1 字：中心單點
   * 2 字：兩端對稱
   * 3 字：正三角形佈局
   */
  function computeGlyphPositions(centerX, centerY, angle, count, radius = 38) {
    if (count <= 1) {
      return [{ x: centerX, y: centerY, angle, index: 0 }];
    }
    if (count === 2) {
      return [
        {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          angle,
          index: 0,
        },
        {
          x: centerX + Math.cos(angle + Math.PI) * radius,
          y: centerY + Math.sin(angle + Math.PI) * radius,
          angle,
          index: 1,
        },
      ];
    }
    // 3 字三角形
    return [
      {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        angle,
        index: 0,
      },
      {
        x: centerX + Math.cos(angle + (Math.PI * 2) / 3) * radius,
        y: centerY + Math.sin(angle + (Math.PI * 2) / 3) * radius,
        angle,
        index: 1,
      },
      {
        x: centerX + Math.cos(angle + (Math.PI * 4) / 3) * radius,
        y: centerY + Math.sin(angle + (Math.PI * 4) / 3) * radius,
        angle,
        index: 2,
      },
    ];
  }

  /**
   * 出界判定
   * 判定字元中心距離原點是否超出擂台半徑
   */
  function isOutOfBounds(x, y, arenaRadius, glyphRadius = 24) {
    const dist = Math.hypot(x, y);
    return dist + glyphRadius * 0.35 > arenaRadius;
  }

  /**
   * 碰撞偵測（圓形檢測）
   */
  function checkGlyphCollision(posA, posB, radiusA = 26, radiusB = 26) {
    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;
    const dist = Math.hypot(dx, dy);
    const limit = radiusA + radiusB;
    if (dist < limit) {
      const nx = dist > 0.0001 ? dx / dist : 1;
      const ny = dist > 0.0001 ? dy / dist : 0;
      return {
        collided: true,
        dist,
        nx,
        ny,
        penetration: limit - dist,
      };
    }
    return {
      collided: false,
      dist,
      nx: 0,
      ny: 0,
      penetration: 0,
    };
  }

  /**
   * 碰撞與擊退衝量計算
   * 考量質量、彈性、反擊力道與衝撞加成，以及階段質量倍率與抗擊退
   */
  function calcKnockback(
    velA,
    velB,
    fontA,
    fontB,
    nx,
    ny,
    isDashingA = false,
    isDashingB = false,
    stageConfig = null
  ) {
    let mA = fontA.mass || 1.0;
    let mB = fontB.mass || 1.0;
    if (stageConfig && stageConfig.aiMassMultiplier) {
      mB *= stageConfig.aiMassMultiplier;
    }
    const elasticity = Math.max(0.5, ((fontA.elasticity || 1.0) + (fontB.elasticity || 1.0)) * 0.5);

    // 接觸面上的相對接近速度
    const closingSpeed = (velB.vx - velA.vx) * nx + (velB.vy - velA.vy) * ny;

    let impulse = 0;
    if (closingSpeed < 0) {
      impulse = (-(1 + elasticity) * closingSpeed) / (1 / mA + 1 / mB);
    }

    // 附加字體特性衝擊力（黑體撞得遠、明體反擊強）
    const kickA = (fontA.kickPower || 50) * (isDashingA ? 1.5 : 1.0);
    const kickB = (fontB.kickPower || 50) * (isDashingB ? 1.5 : 1.0);
    const baseKick = 30 + (kickA + kickB) * 0.25;

    // 明體反擊力：若 A 是明體且承受撞擊，額外反彈 B
    const counterA = fontA.counterPower || 10;
    const counterB = fontB.counterPower || 10;

    let impulseA = impulse / mA + (baseKick / mA) * (1 + counterB * 0.02);
    let impulseB = impulse / mB + (baseKick / mB) * (1 + counterA * 0.02);

    if (stageConfig && stageConfig.aiKnockbackResistance) {
      impulseB *= Math.max(0.05, 1 - stageConfig.aiKnockbackResistance);
    }

    return {
      deltaVelA: {
        vx: -nx * impulseA,
        vy: -ny * impulseA,
      },
      deltaVelB: {
        vx: nx * impulseB,
        vy: ny * impulseB,
      },
      damageA: Math.round(5 + (kickB * 0.12 * (1.2 / mA))),
      damageB: Math.round(5 + (kickA * 0.12 * (1.2 / mB))),
      totalImpulse: impulse + baseKick,
    };
  }

  /**
   * 電腦 AI 行為邏輯計算（純函式，給固定 rng 可重現）
   * @param {Object} enemyTeam 電腦團隊狀態
   * @param {Object} playerTeam 玩家團隊狀態
   * @param {Object} stageConfig 階段參數
   * @param {number} dt 時間微量
   * @param {Function} rng 亂數產生器 [0, 1)
   * @param {number} secondsElapsed 開局經過秒數（前 3 秒為示範時間）
   */
  function updateAI(enemyTeam, playerTeam, stageConfig, dt, rng, secondsElapsed = 0) {
    const dx = playerTeam.x - enemyTeam.x;
    const dy = playerTeam.y - enemyTeam.y;
    const dist = Math.hypot(dx, dy) || 1;

    // 目標角度與轉向
    const targetAngle = Math.atan2(dy, dx);
    let diffAngle = targetAngle - enemyTeam.angle;
    while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
    while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;

    const turnStep = stageConfig.aiTurnSpeed * dt;
    const newAngle = enemyTeam.angle + clamp(diffAngle, -turnStep, turnStep);

    // 逼近速度
    const speed = stageConfig.aiSpeed;
    const accel = speed * dt * stageConfig.aiAggression;
    const newVx = enemyTeam.vx + (dx / dist) * accel;
    const newVy = enemyTeam.vy + (dy / dist) * accel;

    // 阻尼（第 1 階採用更高阻尼提升抗擊退穩定度）
    const damping = (stageConfig && stageConfig.aiDamping) ? stageConfig.aiDamping : 0.25;
    const drag = Math.exp(-damping * dt);

    // 衝刺觸發判定（開局 3 秒示範時間嚴禁衝刺）
    let shouldDash = false;
    let nextDashTimer = enemyTeam.dashTimer - dt;
    const inDemo = secondsElapsed < DEMO_DURATION;
    if (nextDashTimer <= 0 && !inDemo) {
      // 依距離與隨機性判定是否發動衝刺
      if (dist < 220 && rng() < stageConfig.aiAggression) {
        shouldDash = true;
      }
      nextDashTimer = stageConfig.aiDashInterval * (0.8 + rng() * 0.4);
    } else if (inDemo) {
      nextDashTimer = Math.max(nextDashTimer, 0.5);
    }

    return {
      x: enemyTeam.x + newVx * dt,
      y: enemyTeam.y + newVy * dt,
      vx: newVx * drag,
      vy: newVy * drag,
      angle: newAngle,
      dashTimer: nextDashTimer,
      shouldDash,
    };
  }

  /**
   * 勝負與分數判定
   * 1. 電腦全員出界 => 玩家勝（提前獲勝結算時間不得早於 10 秒）
   * 2. 玩家全員出界 => 玩家敗
   * 3. 60秒到 => 比留存字數，字數多者勝；相同比剩餘總 HP
   */
  function evaluateMatchResult(playerLivingCount, enemyLivingCount, playerTotalHp, enemyTotalHp, secondsElapsed, maxSeconds = 60, minWinSeconds = MIN_EARLY_WIN_SECONDS) {
    if (enemyLivingCount <= 0 && playerLivingCount > 0) {
      // 提前獲勝結算時間不得早於開局後 10 秒（10 秒內打光需等待至第 10 秒再結算，期間顯示「完勝！」）
      if (secondsElapsed < minWinSeconds) {
        return {
          finished: false,
          pendingWin: true,
          win: true,
          draw: false,
          statusText: "完勝！",
          reason: "電腦字陣全員出圈，達成完勝！等待至第 10 秒結算...",
          score: 0,
          settlementTime: minWinSeconds,
        };
      }

      const settlementTime = Math.max(minWinSeconds, secondsElapsed);
      const timeBonus = Math.max(0, Math.round((maxSeconds - settlementTime) * 25));
      const glyphBonus = playerLivingCount * 200;
      return {
        finished: true,
        pendingWin: false,
        win: true,
        draw: false,
        statusText: "完勝！",
        reason: "完勝！將對手文字全員擊飛出擂台！",
        score: 1000 + timeBonus + glyphBonus,
        settlementTime,
      };
    }

    if (playerLivingCount <= 0 && enemyLivingCount > 0) {
      return {
        finished: true,
        win: false,
        draw: false,
        reason: "我方文字全員被擊出圈外！",
        score: Math.max(50, Math.round(secondsElapsed * 8)),
      };
    }

    if (playerLivingCount <= 0 && enemyLivingCount <= 0) {
      return {
        finished: true,
        win: false,
        draw: true,
        reason: "雙方同時出界，同歸於盡！",
        score: 300,
      };
    }

    // 時間結束判定
    if (secondsElapsed >= maxSeconds) {
      if (playerLivingCount > enemyLivingCount) {
        return {
          finished: true,
          win: true,
          draw: false,
          reason: "時間到！我方留存字數優勢獲勝",
          score: 800 + playerLivingCount * 100,
        };
      } else if (playerLivingCount < enemyLivingCount) {
        return {
          finished: true,
          win: false,
          draw: false,
          reason: "時間到！對手留存字數較多",
          score: Math.max(100, playerLivingCount * 80),
        };
      } else {
        // 字數相同比體力
        if (playerTotalHp > enemyTotalHp) {
          return {
            finished: true,
            win: true,
            draw: false,
            reason: "時間到！字數相同，我方字陣殘存耐久度較高勝出",
            score: 650 + Math.round(playerTotalHp),
          };
        } else if (playerTotalHp < enemyTotalHp) {
          return {
            finished: true,
            win: false,
            draw: false,
            reason: "時間到！字數相同，對手字陣殘存耐久度較高",
            score: Math.max(150, Math.round(playerTotalHp)),
          };
        } else {
          return {
            finished: true,
            win: true,
            draw: true,
            reason: "時間到！雙方存活字數與耐久完全旗鼓相當",
            score: 500,
          };
        }
      }
    }

    return {
      finished: false,
      win: false,
      draw: false,
      reason: "",
      score: 0,
    };
  }

  /**
   * 模擬單次衝刺擊退後的電腦出界字數（供測試與規則驗證）
   */
  function simulateSingleDash(playerFont = FONTS.bold, enemyFont = FONTS.serif, stageConfig = STAGE_CONFIGS[0], options = {}) {
    const pFont = typeof playerFont === "string" ? FONTS[playerFont] : playerFont;
    const eFont = typeof enemyFont === "string" ? FONTS[enemyFont] : enemyFont;
    const cfg = stageConfig || STAGE_CONFIGS[0];

    const arenaRadius = options.arenaRadius || cfg.arenaRadius || 280;
    const enemyStartX = options.startX !== undefined ? options.startX : 90;
    const enemyStartY = options.startY !== undefined ? options.startY : 0;
    const enemyAngle = options.enemyAngle !== undefined ? options.enemyAngle : Math.PI;
    const enemyCount = options.enemyCount !== undefined ? options.enemyCount : 3;

    // 玩家以衝刺速度直線撞擊電腦
    const dashSpeed = 220 * (pFont.speed / 80);
    const velA = { vx: dashSpeed, vy: 0 };
    const velB = { vx: 0, vy: 0 };

    const knock = calcKnockback(velA, velB, pFont, eFont, 1, 0, true, false, cfg);

    const damping = cfg.aiDamping || 1.6;
    const deltaX = knock.deltaVelB.vx / damping;
    const deltaY = knock.deltaVelB.vy / damping;

    const finalEnemyX = enemyStartX + deltaX;
    const finalEnemyY = enemyStartY + deltaY;

    const positions = computeGlyphPositions(finalEnemyX, finalEnemyY, enemyAngle, enemyCount, 38);

    let outCount = 0;
    positions.forEach((pos) => {
      if (isOutOfBounds(pos.x, pos.y, arenaRadius, 24)) {
        outCount++;
      }
    });

    return {
      outCount,
      livingCount: enemyCount - outCount,
      deltaVel: knock.deltaVelB,
      finalEnemyX,
      finalEnemyY,
      positions,
    };
  }

  const R = {
    clamp,
    MIN_DASH_COOLDOWN,
    DEMO_DURATION,
    MIN_EARLY_WIN_SECONDS,
    FONTS,
    STAGE_CONFIGS,
    getDashCooldown,
    isDemoTime,
    getStage,
    getArenaRadius,
    parseCharacters,
    computeGlyphPositions,
    isOutOfBounds,
    checkGlyphCollision,
    calcKnockback,
    updateAI,
    evaluateMatchResult,
    simulateSingleDash,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_MG_TYPE = R;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
