/* ============================================================
 * Canvas 渲染：地板、路線、建造格、單位、特效、演出
 * ============================================================ */
'use strict';
var CD = window.CD || (window.CD = {});

CD.Render = (function () {
  let cv, ctx;
  const W = CD.CONFIG.NATIVE_W, H = CD.CONFIG.NATIVE_H, T = CD.CONFIG.TILE;

  /* 雙幀動畫切換：altId 存在且 on 為真時用第二幀，否則回退基準幀 */
  function anim2(baseId, altId, on) {
    return (on && CD.Sprites.has(altId)) ? altId : baseId;
  }

  let bgImg = null;      // 預設 assets/BG.png（手繪工作室地圖）
  let defaultBg = null;  // 快取預設圖（setBg(null) 時切回）
  function init(canvas) {
    cv = canvas; cv.width = W; cv.height = H;
    ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const img = new Image();
    img.onload = function () { defaultBg = img; if (!bgImg) { bgImg = img; floorCache = null; } };
    img.onerror = function () { /* 無 BG 圖，使用程式繪製備援 */ };
    img.src = 'assets/BG.png';
  }
  /* 戰役 2.0：依關卡切換場景圖（name=null 用預設手繪 BG）。
   * 註：所有場景共用現行路網幾何；各圖走道細節不同屬可接受誤差，逐圖精修路網另案。 */
  let bgName = null;     // 給 CD.BG_DIM 查表用
  function setBg(name) {
    bgName = name || null;
    if (!name) { bgImg = defaultBg; floorCache = null; return; }
    const img = new Image();
    img.onload = function () { bgImg = img; floorCache = null; };
    img.onerror = function () { bgImg = defaultBg; floorCache = null; };
    img.src = 'assets/sprites/' + name + '.png';
  }

  /* ---------- 地圖底層（畫一次進離屏快取） ---------- */
  let floorCache = null;
  function buildFloor() {
    floorCache = document.createElement('canvas');
    floorCache.width = W; floorCache.height = H;
    const c = floorCache.getContext('2d');
    if (bgImg) {   // 手繪地圖：直接鋪滿，不畫程式版地板與走道
      c.imageSmoothingEnabled = false;
      c.drawImage(bgImg, 0, 0, W, H);
      // 過亮背景壓暗（見 CD.BG_DIM 的量測與理由）。烤進 floorCache＝每幀零成本，
      // 而且遮罩只蓋到背景這一層：路徑導引、建造格、單位、特效都在這之後畫，亮度不受影響。
      const dim = (CD.BG_DIM && CD.BG_DIM[bgName]) || 0;
      if (dim > 0) {
        c.fillStyle = 'rgba(20,22,43,' + dim + ')';
        c.fillRect(0, 0, W, H);
      }
      return;
    }
    // 地板棋盤
    for (let y = 0; y < H; y += T) {
      for (let x = 0; x < W; x += T) {
        c.fillStyle = ((x / T + y / T) % 2 === 0) ? '#2b2f44' : '#282c40';
        c.fillRect(x, y, T, T);
      }
    }
    // 走道（敵人路線）
    CD.MAP.routes.forEach(function (route) {
      c.strokeStyle = '#3a3f5c'; c.lineWidth = 30; c.lineCap = 'round'; c.lineJoin = 'round';
      drawPath(c, route); c.stroke();
      c.strokeStyle = '#454b6e'; c.lineWidth = 24;
      drawPath(c, route); c.stroke();
      // 中線虛線
      c.strokeStyle = '#565d85'; c.lineWidth = 2;
      c.setLineDash([8, 10]);
      drawPath(c, route); c.stroke();
      c.setLineDash([]);
    });
    // 桌子
    CD.MAP.desks.forEach(function (d) {
      c.fillStyle = '#1e2338'; c.fillRect(d.x + 3, d.y + 5, d.w, d.h);
      c.fillStyle = '#3d4463'; c.fillRect(d.x, d.y, d.w, d.h);
      c.fillStyle = '#4a527a'; c.fillRect(d.x, d.y, d.w, 6);
      // 桌上小螢幕
      if (d.w >= 40) {
        c.fillStyle = '#14162b'; c.fillRect(d.x + 6, d.y + 12, 14, 10);
        c.fillStyle = '#41f2e6'; c.fillRect(d.x + 8, d.y + 14, 10, 6);
      }
    });
    // 盆栽點綴
    [[700, 330], [790, 105], [505, 55], [60, 435]].forEach(function (p) {
      c.fillStyle = '#5c4430'; c.fillRect(p[0] - 5, p[1], 10, 7);
      c.fillStyle = '#3fa855';
      c.beginPath(); c.arc(p[0], p[1] - 4, 6, 0, 6.29); c.fill();
      c.fillStyle = '#68d16f';
      c.beginPath(); c.arc(p[0] - 3, p[1] - 7, 4, 0, 6.29); c.fill();
      c.beginPath(); c.arc(p[0] + 4, p[1] - 6, 3, 0, 6.29); c.fill();
    });
    // 白板（牆上）
    c.fillStyle = '#e8ecf7'; c.fillRect(330, 26, 96, 30);
    c.strokeStyle = '#8a94b8'; c.lineWidth = 2; c.strokeRect(330, 26, 96, 30);
    c.strokeStyle = '#ff5d5d'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(338, 38); c.lineTo(378, 34); c.stroke();
    c.strokeStyle = '#4f9dff';
    c.beginPath(); c.moveTo(338, 46); c.lineTo(402, 44); c.stroke();
    c.fillStyle = '#ff5d5d'; c.font = 'bold 9px monospace';
    c.fillText('DEADLINE!', 338, 52);
    // 外牆
    c.strokeStyle = '#14162b'; c.lineWidth = 8; c.strokeRect(0, 0, W, H);
  }
  function drawPath(c, route) {
    c.beginPath();
    c.moveTo(route[0].x, route[0].y);
    for (let i = 1; i < route.length; i++) c.lineTo(route[i].x, route[i].y);
  }

  /* ---------- 主繪製 ---------- */
  function draw(game) {
    const G = game.G;
    if (!floorCache) buildFloor();
    ctx.clearRect(0, 0, W, H);
    // 全域屏震：對整個畫布位移（強度隨剩餘時間衰減）
    let shX = 0, shY = 0;
    if (G.shake && G.shake.t > 0 && G.shake.dur) {
      const k = G.shake.t / G.shake.dur;
      shX = (Math.random() - 0.5) * 2 * G.shake.mag * k;
      shY = (Math.random() - 0.5) * 2 * G.shake.mag * k;
    }
    ctx.save();
    ctx.translate(Math.round(shX), Math.round(shY));
    ctx.drawImage(floorCache, 0, 0);

    drawRouteGuide(G);
    drawReviewProps(G);
    drawEntrances(G);
    drawTiles(G);
    drawCore(G);

    // 依 y 排序繪製單位（偽深度）
    const units = [];
    G.towers.forEach(function (t, i) { units.push({ y: t.y, kind: 'tower', obj: t, idx: i }); });
    G.enemies.forEach(function (e) { if (!e.dead) units.push({ y: e.y, kind: 'enemy', obj: e }); });
    units.sort(function (a, b) { return a.y - b.y; });
    units.forEach(function (u) {
      if (u.kind === 'tower') drawTower(G, u.obj, u.idx);
      else drawEnemy(G, u.obj);
    });

    drawFeuds(G);
    drawProjectiles(G);
    drawParticles(G);
    drawDmgNums(G);
    ctx.restore();   // 屏震只影響戰場層；橫幅與演出不跟著抖
    drawBanner(G);
    drawOverlays(G);
    drawCutin(G);
  }

  /* ---------- 場景專屬動線：把敵人路徑變成展場地貼，不再像穿越家具 ---------- */
  function drawRouteGuide(G) {
    if (!bgImg || G.mode !== 'campaign') return;
    const lv = CD.LEVELS[G.levelIdx];
    if (!lv || !lv.bg) return;
    const exhibit = G.levelIdx >= 7;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    CD.MAP.routes.forEach(function (route) {
      // R1 新背景已把走道畫進圖裡：壓暗地貼大幅調淡（只留一點層次），
      // 保留中線流動虛線回答「往哪走」。
      ctx.strokeStyle = 'rgba(8,10,24,0.18)';
      ctx.lineWidth = exhibit ? 26 : 22;
      drawPath(ctx, route); ctx.stroke();
      // 中線流動虛線（朝主機方向移動）
      ctx.strokeStyle = 'rgba(65,242,230,0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 12]);
      ctx.lineDashOffset = -G.time * 26;
      drawPath(ctx, route); ctx.stroke();
      ctx.setLineDash([]);
    });
    ctx.restore();
  }

  /* ---------- 六次審查的場景道具：讓每關不是只換背景 ---------- */
  function drawReviewProps(G) {
    if (G.mode !== 'campaign') return;
    const lv = CD.LEVELS[G.levelIdx];
    const props = (lv && CD.REVIEW_PROPS[lv.id]) || [];
    props.forEach(function (p) {
      if (p.glow) {
        ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = p.glow;
        ctx.beginPath(); ctx.ellipse(p.x, p.y + 4, 38, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      if (CD.Sprites.has(p.id)) CD.Sprites.draw(ctx, p.id, p.x, p.y, { scale: p.s || 2 });
    });
    const wave = lv && lv.waves[G.waveIdx % lv.waves.length];
    const bossWave = wave && wave.groups.some(function (g) {
      return CD.ENEMIES[g[0]] && CD.ENEMIES[g[0]].cat === 'BOSS';
    });
    if (bossWave && CD.Sprites.has('PROP_timer')) {
      const pulse = 2.2 + Math.max(0, Math.sin(G.time * 7)) * 0.35;
      CD.Sprites.draw(ctx, 'PROP_timer', 418, 86, { scale: pulse, flash: Math.sin(G.time * 7) > 0.6 });
      ctx.fillStyle = 'rgba(20,22,43,0.82)'; ctx.fillRect(383, 105, 70, 15);
      ctx.fillStyle = '#ff5d5d'; ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('審查倒數', 418, 116); ctx.textAlign = 'left';
    }
  }

  /* ---------- 吵架爆氣：嘴砲泡泡＋爆氣槽 ---------- */
  function drawFeuds(G) {
    G.feuds.forEach(function (f) {
      const a = CD.Game.towerAt(f.tileA), b = CD.Game.towerAt(f.tileB);
      if (!a || !b) return;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;

      // 吵架中：兩人頭上輪流蹦嘴砲泡泡
      if (f.quarreling) {
        const lines = f.def.lines[f.lineSet];
        const speakB = (Math.floor(f.lineT / 0.75) % 2) === 1;  // 0.75 秒換人
        const who = speakB ? b : a;
        const txt = lines[speakB ? 1 : 0];
        drawSpeech(who.x, who.y - 34, txt, speakB);
        // 火花符號（v3 FEUD_spark 圖優先，未載入用 emoji）
        const jitter = Math.sin(G.time * 30) * 2;
        if (CD.Sprites.has('FEUD_spark')) {
          CD.Sprites.draw(ctx, 'FEUD_spark', mx + jitter, my - 26, { scale: 2 }); // 整數縮放（1.6 會半像素糊邊）
        } else {
          ctx.font = 'bold 13px monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ff5d5d';
          ctx.fillText('💢', mx + jitter, my - 22);
          ctx.textAlign = 'left';
        }
      }

      // 爆氣槽（兩人中點下方）：滿了變成可點的爆氣圖示
      // 往下推到 +34：R5 圖示 24×24（顯示 48px），維持與舊版相同的塔身重疊量；
      // 誤發組合技是不可逆損失，命中仍以 hitTower 優先
      const pct = f.charge / CD.FEUD_CFG.MAX;
      f.iconX = mx; f.iconY = my + 34;                     // 給 ui.js 命中判定
      if (pct >= 1) {
        const pulse = Math.sin(G.time * 6) > 0 ? 1 : 0;    // 脈動改用上下位移，縮放保持整數
        if (CD.Sprites.has('FEUD_ready')) {
          // v3 拳頭對碰圖示
          CD.Sprites.draw(ctx, 'FEUD_ready', Math.round(f.iconX), Math.round(f.iconY - pulse), { scale: 2 });
        } else {
          ctx.save();
          ctx.translate(f.iconX, f.iconY - pulse);
          ctx.fillStyle = 'rgba(20,22,43,0.92)';
          ctx.strokeStyle = f.def.color;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(0, 0, 13, 0, 6.29); ctx.fill(); ctx.stroke();
          ctx.font = 'bold 14px monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = f.def.color;
          ctx.fillText('!!', 0, 5);
          ctx.restore();
          ctx.textAlign = 'left';
        }
      } else if (f.quarreling) {
        // 吵架中：圖示位置變成可點的「勸架」按鈕（提前止戰換 +15 爆氣）
        ctx.save();
        ctx.fillStyle = 'rgba(20,22,43,0.92)';
        ctx.strokeStyle = '#41f2e6';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(f.iconX, f.iconY, 12, 0, 6.29); ctx.fill(); ctx.stroke();
        ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#41f2e6';
        ctx.fillText('勸', f.iconX, f.iconY + 4);
        ctx.fillStyle = 'rgba(65,242,230,0.85)';
        ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
        ctx.fillText('勸架 +15', f.iconX, f.iconY + 22);
        ctx.restore();
        ctx.textAlign = 'left';
        // 充能條照畫在按鈕下方
        const bw = 34;
        ctx.fillStyle = 'rgba(20,22,43,0.85)';
        ctx.fillRect(mx - bw / 2 - 1, f.iconY + 26, bw + 2, 6);
        ctx.fillStyle = f.def.color;
        ctx.fillRect(mx - bw / 2, f.iconY + 27, bw * pct, 4);
      } else if (pct > 0.02) {
        const bw = 34;
        ctx.fillStyle = 'rgba(20,22,43,0.85)';
        ctx.fillRect(mx - bw / 2 - 1, f.iconY - 3, bw + 2, 6);
        ctx.fillStyle = f.def.color;
        ctx.fillRect(mx - bw / 2, f.iconY - 2, bw * pct, 4);
      }
    });
  }
  function drawSpeech(x, y, txt, flip) {
    ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
    const w = ctx.measureText(txt).width + 12;
    const bx = Math.max(4, Math.min(W - w - 4, x - w / 2));
    const r = 4, by = y - 16, bh = 18;
    const bubble = CD.Sprites.get('FEUD_bubble');
    if (bubble && bubble.normal) {
      drawBubble9Slice(bubble.normal, bx, by, w, bh, x, flip);
    } else {
      ctx.fillStyle = 'rgba(244,246,251,0.96)';
      ctx.strokeStyle = '#14162b'; ctx.lineWidth = 1.5; ctx.beginPath();
      ctx.moveTo(bx + r, by); ctx.arcTo(bx + w, by, bx + w, by + bh, r);
      ctx.arcTo(bx + w, by + bh, bx, by + bh, r); ctx.arcTo(bx, by + bh, bx, by, r);
      ctx.arcTo(bx, by, bx + w, by, r); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 3, by + bh); ctx.lineTo(x + (flip ? 4 : -4), by + bh + 6); ctx.lineTo(x + 3, by + bh);
      ctx.fillStyle = 'rgba(244,246,251,0.96)'; ctx.fill();
    }
    ctx.fillStyle = '#14162b';
    ctx.fillText(txt, bx + 6, by + 13);
  }

  /* FEUD_bubble 是 24×22（R5）：y0..14 為可九宮格拉伸的泡泡本體，
     (11,15)-(18,21) 是完整畫出的 8×7 尾巴——1:1 貼上不拉伸，頂列蓋住本體底邊
     描邊形成動態開口（素材底邊本身無開口，開口若畫死在素材裡會被拉伸帶著漂移）。 */
  function drawBubble9Slice(img, x, y, w, h, tailX, flip) {
    const sw = 24, bodyH = 15, s = 4;
    const midSW = sw - s * 2, midSH = bodyH - s * 2;
    const midDW = Math.max(1, w - s * 2), midDH = Math.max(1, h - s * 2);
    ctx.save(); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, s, s, x, y, s, s);
    ctx.drawImage(img, sw - s, 0, s, s, x + w - s, y, s, s);
    ctx.drawImage(img, 0, bodyH - s, s, s, x, y + h - s, s, s);
    ctx.drawImage(img, sw - s, bodyH - s, s, s, x + w - s, y + h - s, s, s);
    ctx.drawImage(img, s, 0, midSW, s, x + s, y, midDW, s);
    ctx.drawImage(img, s, bodyH - s, midSW, s, x + s, y + h - s, midDW, s);
    ctx.drawImage(img, 0, s, s, midSH, x, y + s, s, midDH);
    ctx.drawImage(img, sw - s, s, s, midSH, x + w - s, y + s, s, midDH);
    ctx.drawImage(img, s, s, midSW, midSH, x + s, y + s, midDW, midDH);
    // 夾住尾巴讓開口白段（tx+1..tx+6）落在本體底邊直線段內，不侵入四角圓角區
    const tx = Math.max(x + 3, Math.min(x + w - 11, tailX + (flip ? 3 : -7)));
    ctx.drawImage(img, 11, 15, 8, 7, Math.round(tx), y + h - 1, 8, 7);
    ctx.restore();
  }

  /* ---------- 立繪 cut-in 演出（4張=通宵爆發、2張=吵架組合技） ---------- */
  function drawCutin(G) {
    const m = G.cutin;
    if (!m) return;
    const ids = m.ids;
    if (!ids.some(function (id) { return CD.Sprites.has(id); })) return; // 立繪未載入則不演出
    const accent = m.color || '#41f2e6';
    const p = m.t / m.dur;                       // 0..1 全程進度
    let slide;                                   // 0=場外 1=就位
    if (p < 0.20) slide = p / 0.20;
    else if (p > 0.82) slide = (1 - p) / 0.18;
    else slide = 1;
    slide = Math.max(0, Math.min(1, slide));
    const ease = 1 - Math.pow(1 - slide, 3);     // easeOutCubic

    const bandY = H / 2, bandH = 156;
    ctx.save();
    // 全螢幕暗化
    ctx.globalAlpha = 0.5 * slide;
    ctx.fillStyle = '#0a0a16';
    ctx.fillRect(0, 0, W, H);

    // 速度線橫帶
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, bandY - bandH / 2, W, bandH); ctx.clip();
    const grad = ctx.createLinearGradient(0, bandY - bandH / 2, 0, bandY + bandH / 2);
    grad.addColorStop(0, 'rgba(20,22,43,0)');
    grad.addColorStop(0.5, 'rgba(29,95,138,0.9)');
    grad.addColorStop(1, 'rgba(20,22,43,0)');
    ctx.globalAlpha = slide;
    ctx.fillStyle = grad;
    ctx.fillRect(0, bandY - bandH / 2, W, bandH);
    // 斜向速度線捲動
    ctx.strokeStyle = 'rgba(65,242,230,0.45)';
    ctx.lineWidth = 2;
    const scroll = (G.time * 700) % 44;
    for (let x = -44; x < W + 44; x += 44) {
      ctx.beginPath();
      ctx.moveTo(x + scroll, bandY - bandH / 2);
      ctx.lineTo(x + scroll - 34, bandY + bandH / 2);
      ctx.stroke();
    }
    // 上下邊線（用演出主色）
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, bandY - bandH / 2); ctx.lineTo(W, bandY - bandH / 2);
    ctx.moveTo(0, bandY + bandH / 2); ctx.lineTo(W, bandY + bandH / 2); ctx.stroke();
    ctx.restore();

    // 立繪交錯滑入（依張數分格）
    const n = ids.length, slotW = W / n, scale = n <= 2 ? 1.15 : 1.05;
    ids.forEach(function (id, i) {
      if (!CD.Sprites.has(id)) return;
      const dir = i % 2 === 0 ? -1 : 1;
      const homeX = slotW * i + slotW / 2;
      const x = homeX + dir * (1 - ease) * W * 0.65;
      const y = bandY + (i % 2 === 0 ? -8 : 8);
      ctx.globalAlpha = slide;
      CD.Sprites.draw(ctx, id, x, y, { scale: scale });
    });

    // 技名標題（吵架組合技）
    if (m.title) {
      ctx.globalAlpha = slide;
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.fillStyle = '#14162b';
      ctx.fillText(m.title, W / 2 + 2, bandY + bandH / 2 + 34);
      ctx.fillStyle = accent;
      ctx.fillText(m.title, W / 2, bandY + bandH / 2 + 32);
      ctx.textAlign = 'left';
    }
    ctx.restore();
  }

  /* ---------- 入口標示 ---------- */
  function drawEntrances(G) {
    if (!CD.MAP.entrances) return;
    const blink = Math.sin(G.time * 3) > -0.3;
    ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
    CD.MAP.entrances.forEach(function (e) {
      ctx.fillStyle = 'rgba(20,22,43,0.72)';
      ctx.fillRect(e.x - 3, e.y - 11, 52, 15);
      ctx.fillStyle = blink ? '#ffd23f' : '#b8952e';
      ctx.fillText('▶ ' + e.label, e.x, e.y);
    });
  }

  /* ---------- 建造格 ---------- */
  function drawTiles(G) {
    CD.MAP.tiles.forEach(function (tile, i) {
      // 被業界委員的名片佔住：畫名片標記＋倒數
      if (G.blockedTiles && G.blockedTiles[i] > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(244,246,251,0.92)';
        ctx.fillRect(tile.x + 8, tile.y + 12, 24, 14);
        ctx.strokeStyle = '#14162b'; ctx.lineWidth = 1;
        ctx.strokeRect(tile.x + 8, tile.y + 12, 24, 14);
        ctx.fillStyle = '#8a94b8';
        ctx.fillRect(tile.x + 11, tile.y + 16, 14, 2);
        ctx.fillRect(tile.x + 11, tile.y + 20, 10, 2);
        ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
        ctx.fillStyle = '#ffd23f';
        ctx.fillText(Math.ceil(G.blockedTiles[i]), tile.x + 32, tile.y + 38);
        // Boss 反制指令不能是 7px 糊字：拉大、加深色底描邊、移出名片圖
        ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#14162b';
        ctx.fillText('點我撕掉', tile.x + 21, tile.y - 2);
        ctx.fillStyle = '#ff6b57';
        ctx.fillText('點我撕掉', tile.x + 20, tile.y - 3); ctx.textAlign = 'left';
        ctx.restore();
        return;
      }
      const occupied = G.towers.some(function (t) { return t.tile === i; });
      const hover = G.hoverTile === i, sel = G.selectedTile === i;
      const centerX = tile.x + T / 2, centerY = tile.y + T / 2;
      const guide = G.tutorialGate && !occupied && (G.towers.length === 0
        ? i < 4
        : G.towers.some(function (t) { return Math.hypot(centerX - t.x, centerY - t.y) <= CD.FEUD_CFG.ADJ_DIST; }));
      if (occupied && !hover && !sel) return;
      ctx.save();
      if (sel) { ctx.fillStyle = 'rgba(65,242,230,0.22)'; ctx.strokeStyle = '#41f2e6'; }
      else if (hover) { ctx.fillStyle = 'rgba(65,242,230,0.14)'; ctx.strokeStyle = 'rgba(65,242,230,0.9)'; }
      else if (guide) {
        const a = 0.14 + (Math.sin(G.time * 7) + 1) * 0.08;
        ctx.fillStyle = 'rgba(255,210,63,' + a + ')'; ctx.strokeStyle = '#ffd23f';
      }
      else { ctx.fillStyle = 'rgba(65,242,230,0.10)'; ctx.strokeStyle = 'rgba(65,242,230,0.55)'; }
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.fillRect(tile.x, tile.y, T, T);
      ctx.strokeRect(tile.x + 1, tile.y + 1, T - 2, T - 2);
      // 四角 L 型角標：深色背景上也一眼看出「這裡能蓋」
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(65,242,230,0.75)';
      [[0, 0], [T - 3, 0], [0, T - 3], [T - 3, T - 3]].forEach(function (c0) {
        ctx.fillRect(tile.x + c0[0], tile.y + c0[1], 3, 1.5);
        ctx.fillRect(tile.x + (c0[0] === 0 ? 0 : T - 1.5), tile.y + (c0[1] === 0 ? 0 : T - 3), 1.5, 3);
      });
      ctx.restore();
      if ((hover || sel) && !occupied) {
        ctx.fillStyle = 'rgba(65,242,230,0.85)';
        ctx.font = '16px monospace'; ctx.textAlign = 'center';
        ctx.fillText('+', tile.x + T / 2, tile.y + T / 2 + 5);
        ctx.textAlign = 'left';
      }
      if (guide) {
        ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
        ctx.textAlign = 'center'; ctx.fillText('相鄰', tile.x + T / 2, tile.y + T / 2 + 4); ctx.textAlign = 'left';   // 11px×2 字剛好塞進 40px 格
      }
    });
  }

  /* ---------- 核心 ---------- */
  function drawCore(G) {
    const c = CD.MAP.core;
    let ox = 0, oy = 0;
    if (G.coreShake > 0) {
      ox = (Math.random() - 0.5) * 8 * G.coreShake;
      oy = (Math.random() - 0.5) * 8 * G.coreShake;
    }
    // 底座光暈：呼吸增強，讓「要守的東西」在深色場景裡有根
    ctx.save();
    const breath = 0.14 + (Math.sin(Date.now() / 600) + 1) * 0.05;
    ctx.fillStyle = 'rgba(65,242,230,' + breath.toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(c.x, c.y, 50, 0, 6.29); ctx.fill();
    ctx.strokeStyle = 'rgba(65,242,230,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(c.x, c.y, 54, 0, 6.29); ctx.stroke();
    ctx.restore();
    // 主機燈號幀動畫：CORE ↔ CORE_lights2 交替（LED 前進一步）；3 倍整數縮放強化存在感
    const coreId = anim2('CORE', 'CORE_lights2', Math.sin(Date.now() / 450) > 0);
    CD.Sprites.draw(ctx, coreId, Math.round(c.x + ox), Math.round(c.y + oy), { scale: 3 });
    // 呼吸燈
    const blink = Math.sin(Date.now() / 300) > 0;
    ctx.fillStyle = blink ? '#5dd66e' : '#2c8a44';
    ctx.fillRect(c.x - 18 + ox, c.y - 22 + oy, 4, 4);
    // 名稱與血條
    ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#41f2e6';
    ctx.fillText(CD.TEXT.coreName, c.x, c.y - 42);
    const bw = 64, pct = Math.max(0, G.coreHp / CD.CONFIG.CORE_HP);
    ctx.fillStyle = '#14162b'; ctx.fillRect(c.x - bw / 2 - 1, c.y - 38, bw + 2, 7);
    ctx.fillStyle = pct > 0.5 ? '#5dd66e' : (pct > 0.25 ? '#ffd23f' : '#ff5d5d');
    ctx.fillRect(c.x - bw / 2, c.y - 37, bw * pct, 5);
    ctx.textAlign = 'left';
    // 主機受擊：冒冷汗（v5 FX_sweat）
    if (G.coreScratch > 0.4 && CD.Sprites.has('FX_sweat')) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, G.coreScratch);
      CD.Sprites.draw(ctx, 'FX_sweat', c.x + 26 + ox, c.y - 30 + oy, { scale: 1.4 });
      ctx.restore();
    }
    // 受擊刮痕
    if (G.coreScratch > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, G.coreScratch) * 0.7;
      ctx.strokeStyle = '#ff5d5d'; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(c.x - 30 + i * 18, c.y - 30);
        ctx.lineTo(c.x - 10 + i * 18, c.y + 24);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ---------- 塔 ---------- */
  function drawTower(G, tw, idx) {
    // 射程圈要畫升級後的實際射程，不能用基礎值——否則玩家看到的圈是假的
    const def = CD.Game.towerDef(tw);
    // 射程圈
    if (G.selectedTower === idx || (G.hoverTowerIdx === idx && G.selectedTower < 0)) {
      ctx.save();
      ctx.fillStyle = def.color + '18';
      ctx.strokeStyle = def.color + '88';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(tw.x, tw.y, def.range, 0, 6.29);
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    // 影子（像素化：矩形疊層取代抗鋸齒橢圓）
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ctx.fillRect(tw.x - 10, tw.y + 15, 20, 4);
    ctx.fillRect(tw.x - 13, tw.y + 16, 26, 2);
    ctx.restore();
    // 本體：待機呼吸幀＋攻擊出手幀＋攻擊前傾；吵架中氣得發抖
    const phase = Math.sin(G.time * 2.2 + idx * 1.7);
    const bob = phase * 1.5;
    const rage = tw.feuding ? Math.sin(G.time * 28 + idx) * 1.4 : 0;
    const tired = CD.Game.isTired(tw);
    let lean = 0, spriteId;
    if (tw.attackT > 0) {
      lean = tw.facing * 3 * (tw.attackT / 0.18);
      spriteId = anim2(tw.type, tw.type + '_atk', true);       // 出手幀
    } else if (tired && CD.Sprites.has(tw.type + '_tired')) {
      spriteId = tw.type + '_tired';                            // 爆肝立姿（v3 圖）
    } else {
      spriteId = anim2(tw.type, tw.type + '_idle2', phase > 0); // 呼吸幀
    }
    CD.Sprites.draw(ctx, spriteId, Math.round(tw.x + lean + rage), Math.round(tw.y - 4 + bob), { scale: 2, flip: tw.facing < 0 });
    // 被點名：頭上驚嘆號＋暫停標記
    if (tw.silencedT > 0) {
      ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#3fa855';
      ctx.fillText('點我舉手！', tw.x, tw.y - 28);
      ctx.textAlign = 'left';
    }
    // 爆肝標記：頭上飄睡意符號（v5 FX_zzz 圖優先，未載入畫程式 z）
    if (tired && !tw.feuding) {
      const zf = (G.time * 0.9) % 1;
      ctx.globalAlpha = 1 - zf;
      if (CD.Sprites.has('FX_zzz')) {
        CD.Sprites.draw(ctx, 'FX_zzz', tw.x + 11, tw.y - 26 - zf * 8, { scale: 1.2 });
      } else {
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#8a94b8';
        ctx.fillText('z', tw.x + 10, tw.y - 26 - zf * 8);
      }
      ctx.globalAlpha = 1;
    }
    // 攻擊閃光
    if (tw.attackT > 0.1) {
      ctx.fillStyle = def.color;
      const mx = tw.x + tw.facing * 16, my = tw.y - 10;
      ctx.fillRect(mx - 2, my - 2, 4, 4);
      ctx.fillRect(mx - 4, my, 8, 1);
      ctx.fillRect(mx, my - 4, 1, 8);
    }
    // 疲勞條（取代純識別條）：爆肝是核心機制，進度必須看得見
    const tiredAt = 45 + (G.buffs && G.buffs.tiredGrace || 0);
    const fatigue = Math.min(1, tw.workT / tiredAt);
    ctx.fillStyle = 'rgba(20,22,43,0.85)';
    ctx.fillRect(tw.x - 11, tw.y + 19, 22, 4);
    ctx.fillStyle = fatigue >= 1 ? '#ff5d5d' : (fatigue > 0.8 ? '#ffd23f' : def.color);
    ctx.fillRect(tw.x - 10, tw.y + 20, Math.max(2, 20 * (1 - fatigue)), 2);
    if (fatigue > 0.8 && fatigue < 1 && Math.sin(G.time * 8) > 0) {
      ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'center'; ctx.fillStyle = '#ffd23f';
      ctx.fillText('快撐不住', tw.x, tw.y + 33); ctx.textAlign = 'left';
    }
    // 等級標記：升級要在戰場上看得見，否則玩家不知道 DP 花到哪去了。
    // 用實心方點而非數字——16px 網格上的小字會糊，方點放大後仍然是硬邊。
    const lv = tw.lv || 1;
    if (lv > 1) {
      const pips = lv - 1;
      const pw = 3, gap = 2, total = pips * pw + (pips - 1) * gap;
      let px = Math.round(tw.x - total / 2), py = Math.round(tw.y + 14);
      ctx.fillStyle = 'rgba(20,22,43,0.85)';
      ctx.fillRect(px - 2, py - 1, total + 4, pw + 2);
      ctx.fillStyle = def.color;
      for (let i = 0; i < pips; i++) ctx.fillRect(px + i * (pw + gap), py, pw, pw);
    }
  }

  /* ---------- 敵人 ---------- */
  function drawEnemy(G, e) {
    const d = e.def;
    const flying = d.flying;
    // 非 90 度旋轉會破壞像素網格：搖晃改用 1px 上下位移表現
    const bobY = (flying ? Math.sin(e.wobble) * 4 - 8 : 0) + (flying ? 0 : (Math.sin(e.wobble) > 0 ? -1 : 0));
    const alpha = e.hidden ? 0.16 : 1;
    // 受擊視覺擊退：沿彈道方向的繪製偏移（不影響實際路徑進度）
    const hitK = e.hitOffT > 0 ? e.hitOffT / 0.12 : 0;
    const hx = (e.hitOffX || 0) * hitK, hy = (e.hitOffY || 0) * hitK;
    // 影子（像素化：矩形疊層取代抗鋸齒橢圓）
    ctx.save();
    ctx.globalAlpha = alpha * 0.30;
    ctx.fillStyle = '#000';
    const shW = Math.round(d.size * 1.3);
    ctx.fillRect(e.x - shW / 2, e.y + 13, shW, 3);
    ctx.fillRect(e.x - shW / 2 - 3, e.y + 14, shW + 6, 1.5);
    ctx.restore();
    // 面向
    let flip = false;
    const route = CD.MAP.routes[e.route];
    if (e.seg < route.length - 1) flip = route[e.seg + 1].x < route[e.seg].x;
    // REVA／REVB 共用一張 REV 圖；GUARDB 自 R3 起有專屬素材，不再借 GUARD 放大
    const baseId = (e.id === 'REVA' || e.id === 'REVB') ? 'REV' : e.id;
    // 走路兩幀：以 wobble 相位切換 base ↔ <id>_walk2
    const walkId = anim2(baseId, baseId + '_walk2', Math.sin(e.wobble) > 0);
    // Boss 用整數 3 倍（存在感）；一般敵 2 倍；整數縮放保住像素網格
    CD.Sprites.draw(ctx, walkId, Math.round(e.x + hx), Math.round(e.y - 6 + bobY + hy), {
      scale: d.size >= 24 ? 3 : 2.0, flip: flip,
      flash: e.flash > 0.04, alpha: alpha
    });
    if (e.hidden) { // 隱形提示輪廓
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = '#b07ef2';
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(e.x - 12, e.y - 18 + bobY, 24, 24);
      ctx.restore();
    }
    // 讀取圈光環：影響範圍顯示（緩慢旋轉的虛線圈）
    if (d.slowAura && !(d.speech && e.speechDisabledT > 0)) {
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = '#41f2e6';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.lineDashOffset = -G.time * 14;
      ctx.beginPath(); ctx.arc(e.x, e.y, d.slowAura.range, 0, 6.29); ctx.stroke();
      ctx.restore();
    }
    // 沒意見教授：五位委員中唯一沒有畫面提示的——補上（打不動不是壞掉，是要你逼他表態）
    if (d.comboDismiss) {
      const hasReady = G.feuds.some(function (f) { return f.charge >= CD.FEUD_CFG.MAX; });
      drawSpeech(e.x, e.y - d.size - 24 + bobY,
        hasReady ? '點拳頭，逼他表態！' : '一般攻擊無效——需要一次組合技', false);
    }
    // 保全隊長：拖延狀態與可拖延提示
    if (d.stall) {
      if (e.stalledT > 0) {
        ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif'; ctx.textAlign = 'center';
        ctx.fillStyle = '#41f2e6';
        ctx.fillText('「好啦，五分鐘」 ' + Math.ceil(e.stalledT) + 's', e.x, e.y - d.size - 17 + bobY);
        ctx.textAlign = 'left';
      } else if (!(e.stallImmuneT > 0)) {
        drawSpeech(e.x, e.y - d.size - 24 + bobY, '點我拖延（2 DP）', false);
      }
    }
    if (d.speech) {
      if (e.speechOpen) drawSpeech(e.x, e.y - d.size - 24 + bobY, '點我打斷「當年」！', false);
      else if (e.speechDisabledT > 0) {
        ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif'; ctx.textAlign = 'center';
        ctx.fillStyle = '#5dd66e'; ctx.fillText('被打斷 ' + Math.ceil(e.speechDisabledT) + 's', e.x, e.y - d.size - 17 + bobY);
        ctx.textAlign = 'left';
      }
    }
    // 血條（滿分履歷未現形前顯示唬人的假血條）
    if ((e.hp < e.maxHp || (d.fakeHp && !e.exposed)) && !e.hidden) {
      const bw = d.size >= 24 ? 44 : 24;
      const pct = (d.fakeHp && !e.exposed) ? 1 : e.hp / e.maxHp;
      ctx.fillStyle = 'rgba(20,22,43,0.9)';
      ctx.fillRect(e.x - bw / 2 - 1, e.y - d.size - 12 + bobY, bw + 2, 5);
      ctx.fillStyle = (d.fakeHp && !e.exposed) ? '#ffd23f' : (pct > 0.5 ? '#5dd66e' : (pct > 0.25 ? '#ffd23f' : '#ff5d5d'));
      ctx.fillRect(e.x - bw / 2, e.y - d.size - 11 + bobY, bw * pct, 3);
    }
    // 開會中標記（會議循環停下時）
    if (d.stopgo) {
      const cyc = d.stopgo.walk + d.stopgo.stop;
      if (((e.sgT || 0) % cyc) > d.stopgo.walk) {
        ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8a6d3b';
        ctx.fillText('開會中…', e.x, e.y - d.size - 16 + bobY);
        ctx.textAlign = 'left';
      }
    }
    // 狀態圖示：專屬第四組色（不與任何陣營色相撞），加深色描邊確保可讀
    let sx = e.x - 12;
    const sy = e.y - d.size - 20 + bobY;
    function statusBox(fill, hollow) {
      ctx.fillStyle = '#14162b'; ctx.fillRect(sx - 1, sy - 1, 8, 8);
      if (hollow) { ctx.strokeStyle = fill; ctx.lineWidth = 1.5; ctx.strokeRect(sx + 0.5, sy + 0.5, 5, 5); }
      else { ctx.fillStyle = fill; ctx.fillRect(sx, sy, 6, 6); }
      sx += 9;
    }
    if (e.slow > 0 && !e.hidden) statusBox('#a8e6ff');                                   // 減速：冰白青
    if (e.burnT > 0 && !e.hidden) statusBox(Math.random() > 0.5 ? '#ffb86b' : '#fff3c4'); // 燃燒：橘白
    if (e.mark > 0 && !e.hidden) statusBox('#ff5cf0', true);                              // 標記：品紅空心
    if (e.armorBrk > 0 && !e.hidden) statusBox('#e8ecf7');                                // 破甲：銀白
    // 藍屏倒數
    if (e.fuse > 0) {
      const sec = Math.ceil(e.fuse);
      const urgent = e.fuse <= 3;
      ctx.font = 'bold ' + (urgent ? 22 : 11) + 'px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = urgent && Math.sin(Date.now() / 90) > 0 ? '#ff5d5d' : '#9dc4ff';
      ctx.fillText(sec + 's', e.x, e.y - d.size - 16 + bobY);
      ctx.textAlign = 'left';
    }
    // Boss 名牌
    if (d.cat === 'BOSS') {
      ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff5d5d';
      ctx.fillText(d.name, e.x, e.y - d.size - 18);
      ctx.textAlign = 'left';
    }
  }

  /* ---------- 投射物 ---------- */
  function drawProjectiles(G) {
    G.projectiles.forEach(function (p) {
      const dx = p.lastX - p.x, dy = p.lastY - p.y;
      const ang = Math.atan2(dy, dx);
      // C 組：PROJ_ 圖繪（紙片自旋，其餘朝移動方向），未載入才退回手繪
      const projId = 'PROJ_' + p.kind;
      if (CD.Sprites.has(projId)) {
        CD.Sprites.draw(ctx, projId, p.x, p.y, { scale: 2.3, rot: p.kind === 'doc' ? p.t * 10 : ang });
        return;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.kind === 'doc') {          // 規格書：白色小紙片旋轉
        ctx.rotate(p.t * 10);
        ctx.fillStyle = '#f4f6fb'; ctx.fillRect(-4, -5, 8, 10);
        ctx.fillStyle = '#4f9dff'; ctx.fillRect(-3, -3, 6, 1); ctx.fillRect(-3, 0, 6, 1);
      } else if (p.kind === 'bolt') {  // commit：綠色短劃
        ctx.rotate(ang);
        ctx.fillStyle = '#5dd66e'; ctx.fillRect(-6, -1.5, 12, 3);
        ctx.fillStyle = '#c8ffd4'; ctx.fillRect(2, -1.5, 4, 3);
      } else if (p.kind === 'lens') {  // 放大鏡光：黃色圓環
        ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, 5, 0, 6.29); ctx.stroke();
        ctx.fillStyle = 'rgba(255,210,63,0.4)';
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, 6.29); ctx.fill();
      } else {                          // 顏料：紅色團塊＋尾跡
        ctx.fillStyle = '#ff6b57';
        ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, 6.29); ctx.fill();
        ctx.fillStyle = 'rgba(255,107,87,0.4)';
        ctx.beginPath(); ctx.arc(-dx * 0.02, -dy * 0.02, 3, 0, 6.29); ctx.fill();
      }
      ctx.restore();
    });
  }

  /* ---------- 粒子與傷害數字 ---------- */
  function drawParticles(G) {
    G.particles.forEach(function (pt) {
      if (pt.delay > 0) return;
      // F 組：逐幀特效（幀本身已含淡出，直接依進度切幀）
      if (pt.anim) {
        const idx = Math.min(pt.frames.length - 1, Math.floor(pt.t / pt.dur * pt.frames.length));
        const fid = pt.frames[idx];
        if (CD.Sprites.has(fid)) CD.Sprites.draw(ctx, fid, pt.x, pt.y, { scale: pt.scale, alpha: fid === 'FX_spotlight' ? 0.36 : 1 });
        return;
      }
      const k = 1 - pt.t / pt.dur;
      ctx.save();
      ctx.globalAlpha = k;
      if (pt.ring) {
        ctx.strokeStyle = pt.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r * (pt.t / pt.dur), 0, 6.29); ctx.stroke();
      } else {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      }
      ctx.restore();
    });
  }
  function drawDmgNums(G) {
    ctx.textAlign = 'center';
    G.dmgNums.forEach(function (n) {
      ctx.save();
      const life = n.life || 0.9;
      ctx.globalAlpha = 1 - Math.max(0, n.t - life * 0.45) / (life * 0.55);
      // 暴擊／剋制：更大、前 0.12 秒回彈；中文句子用中文字型且停留更久
      let size = n.big ? 22 : 11;
      if (n.big && n.t < 0.12) size = 33;   // 回彈用 11 的整數倍，保住點陣網格
      ctx.font = 'bold ' + size + 'px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.fillStyle = '#14162b';
      ctx.fillText(n.txt, n.x + 1, n.y + 1);
      ctx.fillStyle = n.color;
      ctx.fillText(n.txt, n.x, n.y);
      ctx.restore();
    });
    ctx.textAlign = 'left';
  }

  /* ---------- 橫幅與全域演出 ---------- */
  function drawBanner(G) {
    if (!G.banner) return;
    const b = G.banner;
    let a = 1;
    if (b.t < 0.25) a = b.t / 0.25;
    else if (b.t > b.dur - 0.4) a = Math.max(0, (b.dur - b.t) / 0.4);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(20,22,43,0.88)';
    ctx.fillRect(W / 2 - 240, 34, 480, b.sub ? 64 : 44);
    ctx.strokeStyle = '#41f2e6'; ctx.lineWidth = 1;
    ctx.strokeRect(W / 2 - 240, 34, 480, b.sub ? 64 : 44);
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px "Cubic 11", "Microsoft JhengHei", sans-serif';
    ctx.fillStyle = '#41f2e6';
    ctx.fillText(b.title, W / 2, 62);
    if (b.sub) {
      ctx.font = '11px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.fillStyle = '#c9d2e8';
      ctx.fillText(b.sub, W / 2, 84);
    }
    ctx.restore();
    ctx.textAlign = 'left';
  }

  function drawOverlays(G) {
    // 準備倒數
    if (G.state === 'playing' && G.phase === 'prep' && !G.banner) {
      ctx.textAlign = 'center';
      ctx.font = 'bold 11px "Cubic 11", "Microsoft JhengHei", sans-serif';
      ctx.fillStyle = '#ffd23f';
      ctx.fillText(G.tutorialGate && G.feuds.length === 0
        ? '教學鎖：把不同職種放相鄰，做出第一組吵架搭檔'
        : '下一波 ' + Math.ceil(G.prepLeft) + ' 秒（空白鍵立即開始）', W / 2, 52);
      ctx.textAlign = 'left';
    }
    // 必殺閃光：徑向漸層（中央透明），把敵人成片消失的爽點留給玩家看
    if (G.musouFx > 0) {
      ctx.save();
      const a = Math.min(0.40, G.musouFx);
      const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.75);
      grad.addColorStop(0, 'rgba(65,242,230,0)');
      grad.addColorStop(1, G.musouFx > 0.8 ? 'rgba(244,246,251,' + a + ')' : 'rgba(65,242,230,' + a + ')');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    // 暫停遮罩（選單與文字由 DOM #pause-menu 顯示）
    if (G.paused) {
      ctx.fillStyle = 'rgba(20,22,43,0.5)';
      ctx.fillRect(0, 0, W, H);
    }
  }

  return { init: init, draw: draw, setBg: setBg };
})();
