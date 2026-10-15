(function (root) {
  'use strict';

  var GRAVITY = 1200;
  var BOUNCE_SPEED = -560;
  var SPRING_BOUNCE_SPEED = -880;
  var MOVE_SPEED = 260;
  var PLAYER_W = 24;
  var PLAYER_H = 30;
  var PLATFORM_H = 12;
  var TARGET_HEIGHT = 80; // 80 公尺到達繪本封面
  var MAX_TIME = 60; // 60 秒上限

  var PART_TYPES = ['hat', 'eyes', 'scarf', 'accessory'];

  var TIER_CONFIGS = {
    1: {
      tier: 1,
      name: '起草打底',
      platWidth: 90,
      gapMin: 48,
      gapMax: 64,
      moveRatio: 0.0,
      moveSpeed: 0,
      partChance: 0.75
    },
    2: {
      tier: 2,
      name: '剪影修邊',
      platWidth: 68,
      gapMin: 56,
      gapMax: 74,
      moveRatio: 0.25,
      moveSpeed: 55,
      partChance: 0.60
    },
    3: {
      tier: 3,
      name: '封面著色',
      platWidth: 50,
      gapMin: 65,
      gapMax: 82,
      moveRatio: 0.50,
      moveSpeed: 85,
      partChance: 0.50
    }
  };

  function getMaxJumpHeight(bounceSpeed, gravity) {
    var v = typeof bounceSpeed === 'number' ? bounceSpeed : BOUNCE_SPEED;
    var g = typeof gravity === 'number' ? gravity : GRAVITY;
    return (v * v) / (2 * g);
  }

  function getTier(timeElapsed) {
    if (timeElapsed < 20) return 1;
    if (timeElapsed < 40) return 2;
    return 3;
  }

  function getTierConfig(tier) {
    var t = tier;
    if (t < 1) t = 1;
    if (t > 3) t = 3;
    var base = TIER_CONFIGS[t];
    return {
      tier: base.tier,
      name: base.name,
      platWidth: base.platWidth,
      gapMin: base.gapMin,
      gapMax: base.gapMax,
      moveRatio: base.moveRatio,
      moveSpeed: base.moveSpeed,
      partChance: base.partChance
    };
  }

  function createPlatform(x, y, width, kind, part) {
    return {
      x: x,
      y: y,
      w: typeof width === 'number' ? width : 68,
      h: PLATFORM_H,
      kind: kind || 'normal',
      dir: 1,
      part: part || null
    };
  }

  function generatePlatform(state, rng, screenWidth) {
    var sw = typeof screenWidth === 'number' ? screenWidth : 400;
    var currentTier = typeof state.tier === 'number' ? state.tier : 1;
    var tierCfg = getTierConfig(currentTier);

    // 理論跳躍高度與 75% 餘裕安全上限
    var maxRise = getMaxJumpHeight(BOUNCE_SPEED, GRAVITY) * 0.75;
    var minGap = tierCfg.gapMin;
    var maxGap = Math.min(tierCfg.gapMax, maxRise);
    var r = typeof rng === 'function' ? rng() : Math.random();
    var gap = minGap + r * (maxGap - minGap);
    if (gap > maxRise) gap = maxRise;

    var y = state.topY - gap;

    // 水平可達距離：一次跳躍滯空時間約 0.7s，留 140px 射程
    var reach = 140;
    var prevX = typeof state.topX === 'number' ? state.topX : (sw / 2 - tierCfg.platWidth / 2);
    var minX = Math.max(8, prevX - reach);
    var maxX = Math.min(sw - tierCfg.platWidth - 8, prevX + reach);
    if (minX > maxX) {
      minX = 8;
      maxX = Math.max(8, sw - tierCfg.platWidth - 8);
    }
    var rx = typeof rng === 'function' ? rng() : Math.random();
    var x = minX + rx * (maxX - minX);

    var rm = typeof rng === 'function' ? rng() : Math.random();
    var isMove = rm < tierCfg.moveRatio;
    var kind = isMove ? 'move' : 'normal';

    var part = null;
    var rp = typeof rng === 'function' ? rng() : Math.random();
    if (rp < tierCfg.partChance) {
      var rType = typeof rng === 'function' ? rng() : Math.random();
      var typeIdx = Math.floor(rType * PART_TYPES.length);
      if (typeIdx >= PART_TYPES.length) typeIdx = PART_TYPES.length - 1;
      part = {
        type: PART_TYPES[typeIdx],
        collected: false
      };
    }

    state.topY = y;
    state.topX = x;

    var rDir = typeof rng === 'function' ? rng() : Math.random();
    return {
      x: x,
      y: y,
      w: tierCfg.platWidth,
      h: PLATFORM_H,
      kind: kind,
      dir: rDir < 0.5 ? -1 : 1,
      part: part
    };
  }

  function checkPlatformLanding(player, platform) {
    if (!player || !platform) return false;
    // 只有下墜時才會踩上平台（由下往上穿過不阻擋）
    if (player.vy <= 0) return false;

    var feet = player.y + player.h;
    var withinVertical = feet >= platform.y && feet <= platform.y + platform.h + 10;
    var withinHorizontal = (player.x + player.w) > (platform.x + 2) && player.x < (platform.x + platform.w - 2);

    return withinVertical && withinHorizontal;
  }

  function checkPartCollect(player, part, platform) {
    if (!player || !part || part.collected || !platform) return false;

    var cx = platform.x + platform.w / 2;
    var cy = platform.y - 14;
    var radius = 16;

    var closestX = Math.max(player.x, Math.min(cx, player.x + player.w));
    var closestY = Math.max(player.y, Math.min(cy, player.y + player.h));

    var dx = cx - closestX;
    var dy = cy - closestY;
    return (dx * dx + dy * dy) <= (radius * radius);
  }

  function updatePlayerPosition(player, ax, dt, screenWidth, gravity) {
    var sw = typeof screenWidth === 'number' ? screenWidth : 400;
    var g = typeof gravity === 'number' ? gravity : GRAVITY;

    player.vx = ax * MOVE_SPEED;
    player.x += player.vx * dt;

    // 左右螢幕邊緣相通
    if (player.x + player.w < 0) {
      player.x = sw;
    } else if (player.x > sw) {
      player.x = -player.w;
    }

    player.vy += g * dt;
    player.y += player.vy * dt;
  }

  function getSilhouetteCritique(collected) {
    var parts = {};
    if (Array.isArray(collected)) {
      for (var i = 0; i < collected.length; i++) {
        parts[collected[i]] = true;
      }
    } else if (collected && typeof collected === 'object') {
      parts = collected;
    }

    var hasHat = !!parts.hat;
    var hasEyes = !!parts.eyes;
    var hasScarf = !!parts.scarf;
    var hasAcc = !!parts.accessory;

    var count = (hasHat ? 1 : 0) + (hasEyes ? 1 : 0) + (hasScarf ? 1 : 0) + (hasAcc ? 1 : 0);

    if (count === 4) {
      return '頂部、臉部、頸部與側邊特徵全齊！剪影外輪廓極具故事性與辨識度，在繪本翻頁時一眼就能烙印在讀者心中！';
    }
    if (hasHat && hasScarf && hasAcc) {
      return '帽子拉高頭頂、圍巾添動態、手持配件拉開側邊剪影，三個維度的輪廓層次極為分明！';
    }
    if (hasHat && hasScarf) {
      return '有帽子和圍巾，剪影辨識度很高！頭部與頸部打破了單純圓柱感，線條層次分明。';
    }
    if (hasHat && hasAcc) {
      return '帽子塑造了垂直高度、配件拉開了水平寬度，剪影形成了非常生動的對角幾何平衡！';
    }
    if (hasScarf && hasAcc) {
      return '圍巾的動態感加上側邊手持配件，剪影視覺重心鮮明，角色走動時輪廓非常有戲！';
    }
    if (hasHat && hasEyes) {
      return '高聳的帽子配上聚焦的雙眼，角色神情生動，剪影上半部特徵鮮明！';
    }
    if (hasEyes && hasScarf) {
      return '眼神凝聚了神態，搭配飄逸圍巾帶動了角色動態線，剪影韻味十足。';
    }
    if (hasHat) {
      return '抓到了頭頂剪影的核心！一頂好帽子能讓角色在遠景也容易辨認，若能添上圍巾或配件輪廓會更豐富。';
    }
    if (hasScarf) {
      return '圍巾帶來了流暢的飄逸線條！在動態繪本中這會是很有魅力的動態剪影。';
    }
    if (hasAcc) {
      return '側邊手持配件讓角色的職業與性格一目了然！下回試著再替它戴上一頂個性帽子。';
    }
    if (hasEyes) {
      return '眼神是角色的靈魂！雖然外輪廓稍顯簡樸，但神情已經躍然紙上，再補上配件能大幅強化剪影識別度。';
    }
    return '純粹的幾何原型！繪本角色造型的第一步就是穩固的基礎幾何，下次試著在跳躍中收集特徵配件來拉開剪影吧！';
  }

  var DOMAIN_LESSON = '角色造型靠「剪影＋特徵配件」讓人一眼記住！繪本角色即使抽離顏色化為純黑剪影，也能光憑頂部帽子、飄揚圍巾或獨特側邊配件一眼辨別。';

  function checkGameStatus(height, targetHeight, timeLeft, playerY, camY, screenHeight) {
    var th = typeof targetHeight === 'number' ? targetHeight : TARGET_HEIGHT;
    var sh = typeof screenHeight === 'number' ? screenHeight : 600;

    if (height >= th) {
      return { over: true, win: true, reason: 'reach_cover' };
    }
    if (playerY > camY + sh + 20) {
      return { over: true, win: false, reason: 'fall' };
    }
    if (timeLeft <= 0) {
      return { over: true, win: false, reason: 'timeout' };
    }
    return { over: false, win: false, reason: 'playing' };
  }

  function calculateScore(height, partsCount, timeLeft, win) {
    var hScore = Math.floor(Math.max(0, height) * 10);
    var pScore = (partsCount || 0) * 80;
    var tScore = win ? Math.floor(Math.max(0, timeLeft) * 20) : 0;
    var winBonus = win ? 500 : 0;
    return hScore + pScore + tScore + winBonus;
  }

  var R = {
    GRAVITY: GRAVITY,
    BOUNCE_SPEED: BOUNCE_SPEED,
    SPRING_BOUNCE_SPEED: SPRING_BOUNCE_SPEED,
    MOVE_SPEED: MOVE_SPEED,
    PLAYER_W: PLAYER_W,
    PLAYER_H: PLAYER_H,
    PLATFORM_H: PLATFORM_H,
    TARGET_HEIGHT: TARGET_HEIGHT,
    MAX_TIME: MAX_TIME,
    PART_TYPES: PART_TYPES,
    TIER_CONFIGS: TIER_CONFIGS,
    getMaxJumpHeight: getMaxJumpHeight,
    getTier: getTier,
    getTierConfig: getTierConfig,
    createPlatform: createPlatform,
    generatePlatform: generatePlatform,
    checkPlatformLanding: checkPlatformLanding,
    checkPartCollect: checkPartCollect,
    updatePlayerPosition: updatePlayerPosition,
    getSilhouetteCritique: getSilhouetteCritique,
    DOMAIN_LESSON: DOMAIN_LESSON,
    checkGameStatus: checkGameStatus,
    calculateScore: calculateScore
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_MG_BOOK = R;
    root['EXIT6_RULES_MG-BOOK'] = R;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
