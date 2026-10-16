/**
 * lab-d0637「影格接龍」— D0637 偶動畫實驗室
 * 遵守 orders/_lab-contract.md 與 orders/_mg-contract.md
 * 拖曳手感與疊放判定借自 src/retro/games/solitaire.html
 */
window.EXIT6_MG = window.EXIT6_MG || {};

window.EXIT6_MG["lab-d0637"] = {
  title: "影格接龍",
  skill: "定格動畫",
  seconds: 60,
  lab: "D0637 偶動畫實驗室",
  stars: {
    score2: 1000,
    flawless: "零失誤過關"
  },

  mount(root, api) {
    const rules = window.EXIT6_RULES_LAB_D0637;
    const rng = (api && typeof api.rng === "function") ? api.rng : Math.random;

    // 依合約容器規則：絕對不改 root 本身的 style，所有樣式與元素置於 innerContainer
    const container = document.createElement("div");
    container.setAttribute("style", "position:absolute;inset:0;overflow:hidden;background:#f4ecd8;user-select:none;font-family:'Noto Sans TC','Microsoft JhengHei',system-ui,sans-serif;-webkit-user-select:none;touch-action:none;");
    root.appendChild(container);

    const canvas = document.createElement("canvas");
    canvas.setAttribute("style", "position:absolute;left:0;top:0;width:100%;height:100%;display:block;");
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // 規格配色
    const COLORS = {
      paper: "#f4ecd8",
      ink: "#0f0d0a",
      red: "#e63946",
      yellow: "#ffd60a",
      blue: "#1d4ed8",
      gray: "#8a948e",
      white: "#ffffff"
    };

    // 音效引擎（即時 WebAudio 合成，無任何外部音檔）
    let audioCtx = null;
    function getAudio() {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) {
          audioCtx = new AudioClass();
        }
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playSfx(type) {
      try {
        const ac = getAudio();
        if (!ac) return;
        const now = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);

        if (type === "pickup") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(360, now);
          osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === "drop") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
        } else if (type === "coin") {
          osc.type = "square";
          osc.frequency.setValueAtTime(659, now);
          osc.frequency.setValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (type === "error") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.setValueAtTime(110, now + 0.09);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (type === "film") {
          // 定格動畫播放快速噠噠聲
          osc.type = "triangle";
          osc.frequency.setValueAtTime(520, now);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === "fanfare") {
          const notes = [440, 554, 659, 880];
          notes.forEach(function (freq, idx) {
            const o = ac.createOscillator();
            const g = ac.createGain();
            o.connect(g);
            g.connect(ac.destination);
            o.type = "triangle";
            o.frequency.setValueAtTime(freq, now + idx * 0.08);
            g.gain.setValueAtTime(0.2, now + idx * 0.08);
            g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.18);
            o.start(now + idx * 0.08);
            o.stop(now + idx * 0.08 + 0.18);
          });
        }
      } catch (e) {}
    }

    // 粒子系統
    const particles = [];
    function spawnParticles(x, y, color, count) {
      const num = count || 12;
      for (let i = 0; i < num; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 140;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 0.4 + Math.random() * 0.4,
          maxLife: 0.8,
          size: 4 + Math.random() * 4,
          color: color || COLORS.yellow
        });
      }
    }

    // 飛行動畫（放錯退回或自動送牌）
    const flyingCards = [];
    function addFlyingCard(card, startX, startY, endX, endY, onComplete) {
      flyingCards.push({
        card: card,
        x: startX,
        y: startY,
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        progress: 0,
        speed: 5.5,
        onComplete: onComplete
      });
    }

    // 遊戲本體狀態
    const state = {
      roundIndex: 0,
      totalRounds: 3,
      completedRounds: 0,
      completedBands: 0,
      remainingSeconds: 60,
      wrongDrops: 0,
      score: 0,
      isEnded: false,
      win: false,
      flawless: false,

      // 牌局
      board: null,
      drag: null,
      selectedCard: null,

      // 果汁效果
      shakeTimer: 0,
      shakeIntensity: 0,
      hitstopTimer: 0,

      // 定格動畫播放器回饋
      filmPlaying: null, // { color, frame: 1..6, timer, loopsLeft }
      roundTransitionTimer: 0,

      // 開場示範指引
      hintTimer: 3.5,
      hasInteracted: false,

      // 版面配置尺寸（在 resize 時算好）
      cardW: 76,
      cardH: 104,
      timelineSlots: [], // [{ color, x, y, w, h }]
      tableauSlots: []   // [{ colIndex, x, y, w, h }]
    };

    function startRound(rIdx) {
      state.roundIndex = rIdx;
      state.board = rules.createSolvableBoard(rIdx, rng);
      state.drag = null;
      state.filmPlaying = null;
      recalculateLayout();
    }

    // 虛擬畫布與視窗尺寸調整
    let viewW = 960;
    let viewH = 540;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;

    // 主控 2026-10-16 修正：startRound 會呼叫 recalculateLayout 用到上面的 let 變數，必須在宣告之後才開局（原本放在前面，開局就 ReferenceError）
    startRound(0);

    function recalculateLayout() {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cssW = Math.max(320, rect.width);
      const cssH = Math.max(180, rect.height);

      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;

      // 保持 16:9 比例的虛擬坐標系 (960x540)
      const targetRatio = 16 / 9;
      const currentRatio = cssW / cssH;
      if (currentRatio > targetRatio) {
        scale = cssH / 540;
        offsetX = (cssW - 960 * scale) / 2;
        offsetY = 0;
      } else {
        scale = cssW / 960;
        offsetX = 0;
        offsetY = (cssH - 540 * scale) / 2;
      }

      viewW = 960;
      viewH = 540;

      // 計算時間軸槽位座標（上方）
      const rInfo = rules.ROUNDS[state.roundIndex];
      const bands = rInfo.bands;
      state.timelineSlots = [];
      const slotW = 100;
      const slotH = 120;
      const tStartX = (viewW - (bands.length * 130 - 30)) / 2;
      const tY = 70;

      for (let i = 0; i < bands.length; i++) {
        state.timelineSlots.push({
          color: bands[i],
          x: tStartX + i * 130,
          y: tY,
          w: slotW,
          h: slotH
        });
      }

      // 計算下方牌疊座標
      const pileCount = rInfo.pileCount;
      state.tableauSlots = [];
      state.cardW = 80;
      state.cardH = 110;
      const tabGap = 20;
      const totalTabW = pileCount * state.cardW + (pileCount - 1) * tabGap;
      const tabStartX = (viewW - totalTabW) / 2;
      const tabY = 220;

      for (let p = 0; p < pileCount; p++) {
        state.tableauSlots.push({
          colIndex: p,
          x: tabStartX + p * (state.cardW + tabGap),
          y: tabY,
          w: state.cardW,
          h: state.cardH
        });
      }
    }

    window.addEventListener("resize", recalculateLayout);
    recalculateLayout();

    // 座標轉換：螢幕 Client 座標轉虛擬 960x540 座標
    function toVirtualCoord(clientX, clientY) {
      const rect = container.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      return {
        x: (px - offsetX) / scale,
        y: (py - offsetY) / scale
      };
    }

    // 幾何定格角色繪製（6 個分解動作）
    function drawPuppet(ctx, x, y, size, poseFrame, bandColor) {
      ctx.save();
      ctx.translate(x, y);

      const colorMap = {
        red: COLORS.red,
        blue: COLORS.blue,
        yellow: COLORS.yellow
      };
      const accent = colorMap[bandColor] || COLORS.red;

      ctx.strokeStyle = COLORS.ink;
      ctx.fillStyle = accent;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 地平參考微線
      ctx.beginPath();
      ctx.moveTo(-size * 0.7, size * 0.75);
      ctx.lineTo(size * 0.7, size * 0.75);
      ctx.strokeStyle = COLORS.gray;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 2.5;

      const f = poseFrame || 1;
      let headY = 0;
      let bodyY = 0;
      let legOffset = 0;

      if (f === 1) {
        // 站立蓄勢
        headY = -size * 0.45;
        bodyY = -size * 0.15;
        // 頭
        ctx.beginPath();
        ctx.arc(0, headY, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 身
        ctx.beginPath();
        ctx.moveTo(0, headY + size * 0.22);
        ctx.lineTo(0, size * 0.25);
        ctx.stroke();
        // 手
        ctx.beginPath();
        ctx.moveTo(0, bodyY);
        ctx.lineTo(-size * 0.35, bodyY + size * 0.2);
        ctx.moveTo(0, bodyY);
        ctx.lineTo(size * 0.35, bodyY + size * 0.2);
        ctx.stroke();
        // 腿
        ctx.beginPath();
        ctx.moveTo(0, size * 0.25);
        ctx.lineTo(-size * 0.25, size * 0.75);
        ctx.moveTo(0, size * 0.25);
        ctx.lineTo(size * 0.25, size * 0.75);
        ctx.stroke();
      } else if (f === 2) {
        // 下蹲蓄力
        headY = -size * 0.25;
        bodyY = 0;
        ctx.beginPath();
        ctx.arc(0, headY, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 身
        ctx.beginPath();
        ctx.moveTo(0, headY + size * 0.22);
        ctx.lineTo(0, size * 0.35);
        ctx.stroke();
        // 手向後揚
        ctx.beginPath();
        ctx.moveTo(0, bodyY);
        ctx.lineTo(-size * 0.45, -size * 0.05);
        ctx.moveTo(0, bodyY);
        ctx.lineTo(size * 0.45, -size * 0.05);
        ctx.stroke();
        // 彎曲雙膝
        ctx.beginPath();
        ctx.moveTo(0, size * 0.35);
        ctx.lineTo(-size * 0.35, size * 0.55);
        ctx.lineTo(-size * 0.25, size * 0.75);
        ctx.moveTo(0, size * 0.35);
        ctx.lineTo(size * 0.35, size * 0.55);
        ctx.lineTo(size * 0.25, size * 0.75);
        ctx.stroke();
      } else if (f === 3) {
        // 蹬地起跳升空
        headY = -size * 0.65;
        ctx.beginPath();
        ctx.arc(-size * 0.08, headY, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 軀幹往前傾斜
        ctx.beginPath();
        ctx.moveTo(-size * 0.08, headY + size * 0.22);
        ctx.lineTo(0, 0);
        ctx.stroke();
        // 手臂向上向前推
        ctx.beginPath();
        ctx.moveTo(-size * 0.04, -size * 0.3);
        ctx.lineTo(-size * 0.35, -size * 0.65);
        ctx.moveTo(-size * 0.04, -size * 0.3);
        ctx.lineTo(size * 0.35, -size * 0.6);
        ctx.stroke();
        // 雙腳蹬直懸空
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.2, size * 0.45);
        ctx.moveTo(0, 0);
        ctx.lineTo(size * 0.15, size * 0.4);
        ctx.stroke();
      } else if (f === 4) {
        // 滯空最高點
        headY = -size * 0.75;
        ctx.beginPath();
        ctx.arc(0, headY, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 軀幹
        ctx.beginPath();
        ctx.moveTo(0, headY + size * 0.22);
        ctx.lineTo(0, -size * 0.1);
        ctx.stroke();
        // 手臂大字張開
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.4);
        ctx.lineTo(-size * 0.55, -size * 0.35);
        ctx.moveTo(0, -size * 0.4);
        ctx.lineTo(size * 0.55, -size * 0.35);
        ctx.stroke();
        // 雙腿前伸展
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.1);
        ctx.lineTo(-size * 0.35, size * 0.25);
        ctx.moveTo(0, -size * 0.1);
        ctx.lineTo(size * 0.35, size * 0.25);
        ctx.stroke();
      } else if (f === 5) {
        // 落地觸地屈膝緩衝
        headY = -size * 0.35;
        ctx.beginPath();
        ctx.arc(0, headY, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 身
        ctx.beginPath();
        ctx.moveTo(0, headY + size * 0.22);
        ctx.lineTo(0, size * 0.3);
        ctx.stroke();
        // 手向前平衡
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.05);
        ctx.lineTo(-size * 0.4, size * 0.1);
        ctx.moveTo(0, -size * 0.05);
        ctx.lineTo(size * 0.4, size * 0.1);
        ctx.stroke();
        // 雙腳張開踩地
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.lineTo(-size * 0.4, size * 0.75);
        ctx.moveTo(0, size * 0.3);
        ctx.lineTo(size * 0.4, size * 0.75);
        ctx.stroke();
      } else {
        // 站立向觀眾揮手致意！
        headY = -size * 0.48;
        ctx.beginPath();
        ctx.arc(0, headY, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 身
        ctx.beginPath();
        ctx.moveTo(0, headY + size * 0.22);
        ctx.lineTo(0, size * 0.25);
        ctx.stroke();
        // 左手垂下，右手高舉揮手
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.15);
        ctx.lineTo(-size * 0.3, size * 0.2);
        ctx.moveTo(0, -size * 0.15);
        ctx.lineTo(size * 0.35, -size * 0.5);
        ctx.lineTo(size * 0.45, -size * 0.7);
        ctx.stroke();
        // 腿穩健站立
        ctx.beginPath();
        ctx.moveTo(0, size * 0.25);
        ctx.lineTo(-size * 0.2, size * 0.75);
        ctx.moveTo(0, size * 0.25);
        ctx.lineTo(size * 0.2, size * 0.75);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 繪製單張卡牌
    function drawCard(ctx, card, x, y, w, h, isDragging, tiltAngle) {
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);

      if (tiltAngle) {
        ctx.rotate(tiltAngle);
      }

      // 硬陰影
      ctx.fillStyle = COLORS.ink;
      if (isDragging) {
        ctx.fillRect(-w / 2 + 8, -h / 2 + 8, w, h);
      } else {
        ctx.fillRect(-w / 2 + 4, -h / 2 + 4, w, h);
      }

      // 牌面本體
      if (card.up) {
        ctx.fillStyle = COLORS.paper;
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 3;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // 頂部帶色橫條（紅/藍/黃）
        const colorMap = {
          red: COLORS.red,
          blue: COLORS.blue,
          yellow: COLORS.yellow
        };
        ctx.fillStyle = colorMap[card.color] || COLORS.red;
        ctx.fillRect(-w / 2 + 3, -h / 2 + 3, w - 6, 22);

        // 膠卷齒孔細節
        ctx.fillStyle = COLORS.ink;
        ctx.fillRect(-w / 2 + 5, -h / 2 + 7, 5, 8);
        ctx.fillRect(w / 2 - 10, -h / 2 + 7, 5, 8);

        // 影格編號字樣
        ctx.fillStyle = COLORS.ink;
        ctx.font = "bold 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("FRAME #" + card.rank, 0, -h / 2 + 14);

        // 中間照片區底色
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 1.5;
        const photoW = w - 16;
        const photoH = h - 42;
        ctx.fillRect(-photoW / 2, -h / 2 + 30, photoW, photoH);
        ctx.strokeRect(-photoW / 2, -h / 2 + 30, photoW, photoH);

        // 幾何偶人繪製
        drawPuppet(ctx, 0, -h / 2 + 30 + photoH / 2 + 2, 24, card.rank, card.color);

        // 底部大編號標籤
        ctx.fillStyle = COLORS.ink;
        ctx.font = "900 16px system-ui, sans-serif";
        ctx.fillText(String(card.rank), w / 2 - 14, h / 2 - 12);
      } else {
        // 蓋著的牌（暗牌）
        ctx.fillStyle = COLORS.gray;
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 3;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // 膠卷背面幾何條紋
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = -w / 2 + 8; i < w / 2; i += 12) {
          ctx.moveTo(i, -h / 2 + 6);
          ctx.lineTo(i + 14, h / 2 - 6);
        }
        ctx.stroke();

        ctx.fillStyle = COLORS.paper;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = COLORS.ink;
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("?", 0, 1);
      }

      ctx.restore();
    }

    // 命中測試：根據虛擬坐標找出玩家點擊的卡牌
    function hitTest(vx, vy) {
      if (!state.board) return null;
      const cardW = state.cardW;
      const cardH = state.cardH;

      // 1. 檢查牌疊（從頂層往底層檢查）
      for (let pIdx = 0; pIdx < state.board.piles.length; pIdx++) {
        const slot = state.tableauSlots[pIdx];
        if (!slot) continue;
        const pile = state.board.piles[pIdx];

        // 計算每張牌的座標
        let currY = slot.y;
        for (let cIdx = 0; cIdx < pile.length; cIdx++) {
          const card = pile[cIdx];
          const isTop = (cIdx === pile.length - 1);
          const visibleH = isTop ? cardH : (card.up ? 26 : 14);

          // 判斷是否命中
          if (vx >= slot.x && vx <= slot.x + cardW && vy >= currY && vy <= currY + visibleH) {
            // 只有翻開的牌才能抓取
            if (card.up) {
              // 檢查從這張牌到頂端是否為合法同色降序串
              let validSeq = true;
              for (let k = cIdx; k < pile.length - 1; k++) {
                if (pile[k].color !== pile[k + 1].color || pile[k].rank !== pile[k + 1].rank + 1) {
                  validSeq = false;
                  break;
                }
              }
              if (validSeq) {
                return {
                  from: "tableau",
                  pileIndex: pIdx,
                  cardIndex: cIdx,
                  card: card,
                  startX: slot.x,
                  startY: currY
                };
              }
            }
          }
          currY += card.up ? 26 : 14;
        }
      }
      return null;
    }

    // 自動送牌：雙擊或按 A 時呼叫，將任何可進時間軸的牌自動送上去
    function autoSendCard(cardInfo) {
      if (!state.board || state.isEnded) return false;
      const card = cardInfo.card;
      const targetSlot = state.timelineSlots.find(function (s) { return s.color === card.color; });
      if (!targetSlot) return false;

      const timeline = state.board.timelines[card.color];
      if (rules.canStackTimeline(card, timeline, card.color)) {
        // 從來源移除
        state.board.piles[cardInfo.pileIndex].splice(cardInfo.cardIndex, 1);
        // 翻開新頂牌
        const rem = state.board.piles[cardInfo.pileIndex];
        if (rem.length > 0 && !rem[rem.length - 1].up) {
          rem[rem.length - 1].up = true;
        }

        // 動畫飛向時間軸
        addFlyingCard(card, cardInfo.startX, cardInfo.startY, targetSlot.x + 10, targetSlot.y + 10, function () {
          timeline.push(card);
          playSfx("coin");
          state.shakeTimer = 0.05;
          state.shakeIntensity = 2;
          spawnParticles(targetSlot.x + 50, targetSlot.y + 60, COLORS.yellow, 16);
          checkTimelineCompletion(card.color);
        });
        return true;
      }
      return false;
    }

    function autoCompleteAll() {
      if (!state.board || state.isEnded) return;
      let moved = false;
      for (let p = 0; p < state.board.piles.length; p++) {
        const pile = state.board.piles[p];
        if (pile.length > 0) {
          const top = pile[pile.length - 1];
          if (top.up) {
            const slot = state.tableauSlots[p];
            let topY = slot.y;
            for (let i = 0; i < pile.length - 1; i++) {
              topY += pile[i].up ? 26 : 14;
            }
            const did = autoSendCard({
              pileIndex: p,
              cardIndex: pile.length - 1,
              card: top,
              startX: slot.x,
              startY: topY
            });
            if (did) {
              moved = true;
              break;
            }
          }
        }
      }
      if (!moved) {
        playSfx("error");
      }
    }

    // 檢查某條影格帶是否剛集滿 1～6
    function checkTimelineCompletion(color) {
      if (!state.board) return;
      const timeline = state.board.timelines[color];
      if (timeline && timeline.length === 6) {
        // 觸發「定格動畫大放映」！
        state.completedBands++;
        state.filmPlaying = {
          color: color,
          frame: 1,
          timer: 0,
          loopsLeft: 3 // 快速播 3 遍
        };
        playSfx("fanfare");
        state.hitstopTimer = 0.05;

        // 檢查該輪是否全部完成
        const rInfo = rules.ROUNDS[state.roundIndex];
        if (rules.isRoundCleared(state.board.timelines, rInfo.bands)) {
          state.completedRounds++;
          // 勝利判定：完成第 1、2 輪為 win
          if (state.completedRounds >= 2) {
            state.win = true;
          }

          state.roundTransitionTimer = 1.8; // 過場慶祝時間
        }
      }
    }

    // 拖曳互動事件處理
    let lastTapTime = 0;
    let lastTapCard = null;

    function handlePointerDown(e) {
      if (state.isEnded) return;
      getAudio();
      state.hasInteracted = true;
      const vc = toVirtualCoord(e.clientX, e.clientY);
      const hit = hitTest(vc.x, vc.y);

      if (hit) {
        const now = performance.now();
        // 雙擊 / 雙點偵測：快速自動送上時間軸
        if (lastTapCard === hit.card && now - lastTapTime < 350) {
          const sent = autoSendCard(hit);
          if (sent) {
            lastTapTime = 0;
            lastTapCard = null;
            return;
          }
        }
        lastTapTime = now;
        lastTapCard = hit.card;

        // 開始拖曳
        const pile = state.board.piles[hit.pileIndex];
        const movingCards = pile.slice(hit.cardIndex);

        state.drag = {
          fromPileIndex: hit.pileIndex,
          fromCardIndex: hit.cardIndex,
          cards: movingCards,
          startX: hit.startX,
          startY: hit.startY,
          x: hit.startX,
          y: hit.startY,
          offsetX: vc.x - hit.startX,
          offsetY: vc.y - hit.startY,
          vx: 0,
          tilt: 0
        };

        // 暫時從牌疊拿出
        pile.splice(hit.cardIndex);
        playSfx("pickup");
      }
    }

    function handlePointerMove(e) {
      if (!state.drag) return;
      const vc = toVirtualCoord(e.clientX, e.clientY);
      const d = state.drag;
      const targetX = vc.x - d.offsetX;
      const targetY = vc.y - d.offsetY;

      // 黏手但微落後（平滑 lerp）與速度傾斜（tilt）
      const prevX = d.x;
      d.x += (targetX - d.x) * 0.35;
      d.y += (targetY - d.y) * 0.35;
      d.vx = d.x - prevX;
      d.tilt = Math.max(-0.2, Math.min(0.2, d.vx * 0.006));
    }

    function handlePointerUp(e) {
      if (!state.drag) return;
      const d = state.drag;
      state.drag = null;
      const baseCard = d.cards[0];
      const centerX = d.x + state.cardW / 2;
      const centerY = d.y + state.cardH / 2;

      let placed = false;

      // 1. 嘗試放置於時間軸槽（只有單張可放）
      if (d.cards.length === 1) {
        for (let i = 0; i < state.timelineSlots.length; i++) {
          const slot = state.timelineSlots[i];
          if (centerX >= slot.x && centerX <= slot.x + slot.w && centerY >= slot.y && centerY <= slot.y + slot.h) {
            const timeline = state.board.timelines[slot.color];
            if (rules.canStackTimeline(baseCard, timeline, slot.color)) {
              timeline.push(baseCard);
              placed = true;
              playSfx("coin");
              state.shakeTimer = 0.04;
              state.shakeIntensity = 2;
              spawnParticles(slot.x + slot.w / 2, slot.y + slot.h / 2, COLORS.yellow, 15);
              // 翻開來源疊底牌
              const srcPile = state.board.piles[d.fromPileIndex];
              if (srcPile.length > 0 && !srcPile[srcPile.length - 1].up) {
                srcPile[srcPile.length - 1].up = true;
              }
              checkTimelineCompletion(slot.color);
              break;
            }
          }
        }
      }

      // 2. 嘗試放置於下方牌疊
      if (!placed) {
        for (let p = 0; p < state.tableauSlots.length; p++) {
          const slot = state.tableauSlots[p];
          if (centerX >= slot.x - 15 && centerX <= slot.x + slot.w + 15 && centerY >= slot.y - 20) {
            const targetPile = state.board.piles[p];
            if (rules.canStackTableau(baseCard, targetPile)) {
              for (let k = 0; k < d.cards.length; k++) {
                targetPile.push(d.cards[k]);
              }
              placed = true;
              playSfx("drop");
              // 翻開來源疊底牌
              const srcPile = state.board.piles[d.fromPileIndex];
              if (srcPile.length > 0 && !srcPile[srcPile.length - 1].up) {
                srcPile[srcPile.length - 1].up = true;
              }
              break;
            }
          }
        }
      }

      // 3. 放不下去：計一次失誤，平滑飛回原位
      if (!placed) {
        state.wrongDrops++;
        playSfx("error");
        state.shakeTimer = 0.08;
        state.shakeIntensity = 3;

        // 將牌飛回來源牌疊
        const srcPile = state.board.piles[d.fromPileIndex];
        let returnY = d.startY;
        for (let k = 0; k < d.cards.length; k++) {
          const c = d.cards[k];
          addFlyingCard(c, d.x, d.y + k * 26, d.startX, returnY + k * 26, function () {
            srcPile.push(c);
          });
        }
      }
    }

    // 鍵盤無障礙支援
    function handleKeyDown(e) {
      getAudio();
      state.hasInteracted = true;
      if (e.key === "a" || e.key === "A") {
        autoCompleteAll();
      } else if (e.key >= "1" && e.key <= "5") {
        const pIdx = parseInt(e.key, 10) - 1;
        if (state.board && pIdx < state.board.piles.length) {
          const pile = state.board.piles[pIdx];
          if (pile.length > 0 && pile[pile.length - 1].up) {
            const slot = state.tableauSlots[pIdx];
            let topY = slot.y;
            for (let i = 0; i < pile.length - 1; i++) {
              topY += pile[i].up ? 26 : 14;
            }
            autoSendCard({
              pileIndex: pIdx,
              cardIndex: pile.length - 1,
              card: pile[pile.length - 1],
              startX: slot.x,
              startY: topY
            });
          }
        }
      }
    }

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("keydown", handleKeyDown);

    // 遊戲結束結算
    function endGame() {
      if (state.isEnded) return;
      state.isEnded = true;

      const finalStats = {
        win: state.win,
        completedBands: state.completedBands,
        remainingSeconds: state.remainingSeconds,
        wrongDrops: state.wrongDrops
      };

      state.score = rules.calcScore(finalStats);
      state.flawless = rules.isFlawless(finalStats);

      playSfx(state.win ? "fanfare" : "error");

      if (api && typeof api.onEnd === "function") {
        api.onEnd({
          win: state.win,
          score: state.score,
          flawless: state.flawless
        });
      }
    }

    // 主更新與繪製迴圈 (requestAnimationFrame)
    let lastTime = performance.now();
    let animId = null;

    function loop(now) {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      // 頓幀處理
      if (state.hitstopTimer > 0) {
        state.hitstopTimer -= dt;
      } else {
        update(dt);
      }

      render();

      if (!state.isEnded) {
        animId = requestAnimationFrame(loop);
      }
    }

    function update(dt) {
      // 倒數計時（總共 60 秒）
      if (!state.isEnded) {
        state.remainingSeconds -= dt;
        if (state.remainingSeconds <= 0) {
          state.remainingSeconds = 0;
          endGame();
          return;
        }
      }

      // 開場指引時間遞減
      if (state.hintTimer > 0) {
        state.hintTimer -= dt;
      }

      // 震動計時
      if (state.shakeTimer > 0) {
        state.shakeTimer -= dt;
      }

      // 飛行動畫更新
      for (let i = flyingCards.length - 1; i >= 0; i--) {
        const fc = flyingCards[i];
        fc.progress += dt * fc.speed;
        if (fc.progress >= 1) {
          fc.progress = 1;
          fc.x = fc.endX;
          fc.y = fc.endY;
          if (fc.onComplete) fc.onComplete();
          flyingCards.splice(i, 1);
        } else {
          // 平滑緩動
          const t = fc.progress;
          const ease = t * (2 - t);
          fc.x = fc.startX + (fc.endX - fc.startX) * ease;
          fc.y = fc.startY + (fc.endY - fc.startY) * ease;
        }
      }

      // 粒子系統更新
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 220 * dt; // 重力
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // 定格動畫播放器回饋更新
      if (state.filmPlaying) {
        const fp = state.filmPlaying;
        fp.timer += dt;
        if (fp.timer >= 0.09) { // 每格 90ms，手作定格感
          fp.timer = 0;
          fp.frame++;
          playSfx("film");
          if (fp.frame > 6) {
            fp.frame = 1;
            fp.loopsLeft--;
            if (fp.loopsLeft <= 0) {
              state.filmPlaying = null;
            }
          }
        }
      }

      // 輪次過場轉換
      if (state.roundTransitionTimer > 0) {
        state.roundTransitionTimer -= dt;
        if (state.roundTransitionTimer <= 0) {
          if (state.roundIndex + 1 < state.totalRounds) {
            startRound(state.roundIndex + 1);
            playSfx("fanfare");
          } else {
            // 三輪全數突破，大獲全勝
            state.win = true;
            endGame();
          }
        }
      }
    }

    function render() {
      ctx.save();
      // 依 devicePixelRatio 縮放
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 清除背景（紙色）
      ctx.fillStyle = COLORS.paper;
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // 震動偏移（只動畫面內部，不改 root style）
      let shakeX = 0;
      let shakeY = 0;
      if (state.shakeTimer > 0) {
        shakeX = (Math.random() - 0.5) * state.shakeIntensity * 4;
        shakeY = (Math.random() - 0.5) * state.shakeIntensity * 4;
      }

      ctx.translate(offsetX + shakeX, offsetY + shakeY);
      ctx.scale(scale, scale);

      // 頂部 HUD
      renderHUD(ctx);

      // 繪製上方時間軸槽位
      renderTimelines(ctx);

      // 繪製下方牌疊
      renderTableau(ctx);

      // 繪製飛行的卡牌
      for (let i = 0; i < flyingCards.length; i++) {
        const fc = flyingCards[i];
        drawCard(ctx, fc.card, fc.x, fc.y, state.cardW, state.cardH, false, 0);
      }

      // 繪製拖曳中的卡牌
      if (state.drag) {
        const d = state.drag;
        for (let i = 0; i < d.cards.length; i++) {
          const c = d.cards[i];
          drawCard(ctx, c, d.x, d.y + i * 26, state.cardW, state.cardH, true, d.tilt);
        }
      }

      // 繪製粒子
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      // 開場示範指引
      if (state.hintTimer > 0 && !state.hasInteracted) {
        renderHint(ctx);
      }

      // 輪次過場提示
      if (state.roundTransitionTimer > 0) {
        renderTransition(ctx);
      }

      // 畫面右下角固定小字 GRAYBOX
      ctx.fillStyle = COLORS.ink;
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("GRAYBOX", viewW - 16, viewH - 12);

      ctx.restore();
    }

    function renderHUD(ctx) {
      // 頂部倒數進度條
      const barX = 40;
      const barY = 16;
      const barW = viewW - 80;
      const barH = 12;

      ctx.fillStyle = COLORS.ink;
      ctx.fillRect(barX, barY, barW, barH);
      const pct = Math.max(0, state.remainingSeconds / 60);
      ctx.fillStyle = pct > 0.25 ? COLORS.blue : COLORS.red;
      ctx.fillRect(barX + 2, barY + 2, (barW - 4) * pct, barH - 4);

      // 文字資訊
      ctx.fillStyle = COLORS.ink;
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("⏳ " + Math.ceil(state.remainingSeconds) + "s", barX, barY + 16);

      ctx.textAlign = "center";
      const rInfo = rules.ROUNDS[state.roundIndex];
      ctx.fillText("🎬 " + rInfo.name, viewW / 2, barY + 16);

      ctx.textAlign = "right";
      ctx.fillText("失誤: " + state.wrongDrops + " 次  |  按 A 自動送牌", viewW - barX, barY + 16);

      // 教學一行
      ctx.font = "13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = COLORS.ink;
      ctx.fillText("把逐格照片照 1→6 拖進時間軸，排好就會動起來", viewW / 2, barY + 36);
    }

    function renderTimelines(ctx) {
      if (!state.board) return;

      for (let i = 0; i < state.timelineSlots.length; i++) {
        const slot = state.timelineSlots[i];
        const timeline = state.board.timelines[slot.color];

        // 槽位底框
        ctx.fillStyle = COLORS.paper;
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 3;
        ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
        ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);

        // 硬陰影
        ctx.fillStyle = COLORS.ink;
        ctx.fillRect(slot.x + slot.w, slot.y + 4, 4, slot.h);
        ctx.fillRect(slot.x + 4, slot.y + slot.h, slot.w, 4);

        // 拖曳懸停高亮
        if (state.drag && state.drag.cards.length === 1) {
          const c = state.drag.cards[0];
          if (c.color === slot.color && rules.canStackTimeline(c, timeline, slot.color)) {
            ctx.strokeStyle = COLORS.yellow;
            ctx.lineWidth = 4;
            ctx.strokeRect(slot.x - 2, slot.y - 2, slot.w + 4, slot.h + 4);
          }
        }

        // 槽位頂部色標
        const colorMap = { red: COLORS.red, blue: COLORS.blue, yellow: COLORS.yellow };
        ctx.fillStyle = colorMap[slot.color] || COLORS.red;
        ctx.fillRect(slot.x + 3, slot.y + 3, slot.w - 6, 18);

        ctx.fillStyle = COLORS.paper;
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const cName = slot.color === "red" ? "紅帶" : slot.color === "blue" ? "藍帶" : "黃帶";
        ctx.fillText(cName + "時間軸", slot.x + slot.w / 2, slot.y + 12);

        // 若該帶正在播放定格動畫
        if (state.filmPlaying && state.filmPlaying.color === slot.color) {
          // 播放高亮
          ctx.fillStyle = COLORS.yellow;
          ctx.fillRect(slot.x + 4, slot.y + 24, slot.w - 8, slot.h - 28);
          // 繪製快速閃過的定格影格
          drawPuppet(ctx, slot.x + slot.w / 2, slot.y + 68, 28, state.filmPlaying.frame, slot.color);

          ctx.fillStyle = COLORS.ink;
          ctx.font = "bold 13px system-ui, sans-serif";
          ctx.fillText("🎬 動畫播放中 #" + state.filmPlaying.frame, slot.x + slot.w / 2, slot.y + slot.h - 10);
        } else if (timeline.length > 0) {
          // 繪製時間軸頂部卡牌
          const topCard = timeline[timeline.length - 1];
          drawCard(ctx, topCard, slot.x + 10, slot.y + 24, state.cardW, state.cardH - 20, false, 0);

          ctx.fillStyle = COLORS.ink;
          ctx.font = "bold 12px system-ui, sans-serif";
          ctx.fillText("進度 " + timeline.length + " / 6", slot.x + slot.w / 2, slot.y + slot.h - 4);
        } else {
          // 空槽提示
          ctx.strokeStyle = COLORS.gray;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(slot.x + 10, slot.y + 26, slot.w - 20, slot.h - 32);
          ctx.setLineDash([]);

          ctx.fillStyle = COLORS.gray;
          ctx.font = "bold 13px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("放入 1", slot.x + slot.w / 2, slot.y + slot.h / 2 + 6);
        }
      }
    }

    function renderTableau(ctx) {
      if (!state.board) return;

      for (let pIdx = 0; pIdx < state.board.piles.length; pIdx++) {
        const slot = state.tableauSlots[pIdx];
        if (!slot) continue;
        const pile = state.board.piles[pIdx];

        // 若該欄為空，繪製空欄虛線框
        if (pile.length === 0) {
          ctx.strokeStyle = COLORS.gray;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(slot.x, slot.y, state.cardW, state.cardH);
          ctx.setLineDash([]);

          ctx.fillStyle = COLORS.gray;
          ctx.font = "12px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("空欄暫放", slot.x + state.cardW / 2, slot.y + state.cardH / 2);
        }

        // 繪製牌疊卡牌
        let currY = slot.y;
        for (let cIdx = 0; cIdx < pile.length; cIdx++) {
          const card = pile[cIdx];
          drawCard(ctx, card, slot.x, currY, state.cardW, state.cardH, false, 0);
          currY += card.up ? 26 : 14;
        }

        // 拖曳懸停高亮
        if (state.drag) {
          const base = state.drag.cards[0];
          if (rules.canStackTableau(base, pile)) {
            ctx.strokeStyle = COLORS.yellow;
            ctx.lineWidth = 3;
            ctx.strokeRect(slot.x - 3, slot.y - 3, state.cardW + 6, Math.max(state.cardH + 6, currY - slot.y + 10));
          }
        }
      }
    }

    function renderHint(ctx) {
      // 示範動畫：半透明動態指引
      ctx.save();
      const alpha = Math.min(1, state.hintTimer);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(15, 13, 10, 0.75)";
      ctx.fillRect(viewW / 2 - 160, viewH / 2 - 25, 320, 50);

      ctx.fillStyle = COLORS.paper;
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("👆 按住拖曳，或【雙擊】快速送進時間軸", viewW / 2, viewH / 2);
      ctx.restore();
    }

    function renderTransition(ctx) {
      ctx.save();
      ctx.fillStyle = "rgba(244, 236, 216, 0.92)";
      ctx.fillRect(viewW / 2 - 220, viewH / 2 - 60, 440, 120);

      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 4;
      ctx.strokeRect(viewW / 2 - 220, viewH / 2 - 60, 440, 120);

      ctx.fillStyle = COLORS.ink;
      ctx.font = "900 24px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🎉 影格組裝完成！", viewW / 2, viewH / 2 - 16);

      ctx.font = "bold 16px system-ui, sans-serif";
      ctx.fillStyle = COLORS.blue;
      ctx.fillText("定格動畫成功動起來了！準備進入下一輪…", viewW / 2, viewH / 2 + 24);
      ctx.restore();
    }

    // 啟動主迴圈
    animId = requestAnimationFrame(loop);

    return {
      destroy() {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
        window.removeEventListener("resize", recalculateLayout);
        container.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("keydown", handleKeyDown);

        if (audioCtx) {
          try {
            audioCtx.close();
          } catch (e) {}
          audioCtx = null;
        }

        // 依合約容器規則：destroy() 後 root 必須是空的
        while (root.firstChild) {
          root.removeChild(root.firstChild);
        }
      }
    };
  }
};
