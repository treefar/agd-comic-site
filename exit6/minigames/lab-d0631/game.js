/**
 * lab-d0631 虛擬製片靶場 - 遊戲主邏輯
 * 依據 orders/_lab-contract.md 與 orders/_mg-contract.md
 */
(function () {
  "use strict";

  const R = (typeof globalThis !== "undefined" && globalThis.EXIT6_RULES_LAB_D0631)
    ? globalThis.EXIT6_RULES_LAB_D0631
    : (typeof require !== "undefined" ? require("./rules.js") : null);

  // 規格六色常數
  const COLOR_PAPER = "#f4ecd8";  // 紙
  const COLOR_INK   = "#0f0d0a";  // 墨
  const COLOR_RED   = "#e63946";  // 紅
  const COLOR_YELLOW= "#ffd60a";  // 黃
  const COLOR_BLUE  = "#1d4ed8";  // 藍
  const COLOR_GRAY  = "#8a948e";  // 灰

  window.EXIT6_MG = window.EXIT6_MG || {};

  window.EXIT6_MG["lab-d0631"] = {
    title: "虛擬製片靶場",
    skill: "虛擬製片",
    seconds: 60,
    lab: "D0631 動作捕捉實驗室",
    stars: {
      score2: 100,
      flawless: "每箭都上靶"
    },

    mount(root, api) {
      const rng = (api && typeof api.rng === "function") ? api.rng : Math.random;
      let onEndCalled = false;

      // 容器規則：不准改 root 本身的任何 style，建立內層 container
      const container = document.createElement("div");
      container.setAttribute(
        "style",
        "position:absolute; inset:0; overflow:hidden; background:#0f0d0a; color:#f4ecd8; font-family:'Noto Sans TC','Microsoft JhengHei',system-ui,sans-serif; user-select:none; touch-action:none;"
      );
      root.appendChild(container);

      // Canvas 元素
      const canvas = document.createElement("canvas");
      canvas.setAttribute("style", "position:absolute; inset:0; width:100%; height:100%; display:block;");
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      // 操作按鈕列（符合 44x44px 以上按鈕，手機與桌機皆可用）
      const controlBar = document.createElement("div");
      controlBar.setAttribute(
        "style",
        "position:absolute; left:0; right:0; bottom:12px; display:flex; justify-content:center; gap:12px; pointer-events:none; z-index:10;"
      );
      container.appendChild(controlBar);

      const drawBtn = document.createElement("button");
      drawBtn.type = "button";
      drawBtn.textContent = "按住拉弓／放開射擊";
      drawBtn.setAttribute(
        "style",
        "pointer-events:auto; min-height:48px; min-width:180px; padding:10px 24px; font-size:16px; font-weight:800; border-radius:999px; border:3px solid #0f0d0a; background:#ffd60a; color:#0f0d0a; box-shadow:4px 4px 0 #0f0d0a; cursor:pointer;"
      );
      controlBar.appendChild(drawBtn);

      // WebAudio 即時合成短音
      let audioCtx = null;
      function initAudio() {
        if (!audioCtx) {
          const AudioCtor = window.AudioContext || window.webkitAudioContext;
          if (AudioCtor) {
            audioCtx = new AudioCtor();
          }
        }
        if (audioCtx && audioCtx.state === "suspended") {
          audioCtx.resume().catch(() => {});
        }
      }

      function playTone(type) {
        if (!audioCtx || audioCtx.state !== "running") return;
        try {
          const now = audioCtx.currentTime;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);

          if (type === "draw") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.13);
          } else if (type === "release") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);
            gain.gain.setValueAtTime(0.07, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
            osc.start(now);
            osc.stop(now + 0.15);
          } else if (type === "hit") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(640, now);
            osc.frequency.exponentialRampToValueAtTime(920, now + 0.08);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.23);
          } else if (type === "miss") {
            osc.type = "square";
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(65, now + 0.16);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
            osc.start(now);
            osc.stop(now + 0.17);
          } else if (type === "stage") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(660, now + 0.08);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.21);
          }
        } catch (_e) {}
      }

      // 檢查降低動態設定
      const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 遊戲狀態變數
      let gameTime = 0;
      let lastTime = performance.now();
      let isGameOver = false;
      let currentStageIndex = 0;

      let totalScore = 0;
      const stats = {
        shotsFired: 0,
        hits: 0,
        misses: 0
      };

      // 瞄準與拉弓
      let isDrawing = false;
      let drawStartTime = 0;
      let currentHoldSeconds = 0;
      let aimPoint = { x: 0, y: -0.05 };

      // 動畫反饋
      let targetBounce = 1.0;
      let screenShake = 0;
      let redFlash = 0;
      const stuckArrows = [];
      const flyingArrows = [];
      const floatingTexts = [];
      const particles = [];

      // 畫布尺寸轉換（標準設計解析度 1280x720）
      const V_WIDTH = 1280;
      const V_HEIGHT = 720;
      let viewScaleX = 1;
      let viewScaleY = 1;

      function resize() {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        viewScaleX = canvas.width / V_WIDTH;
        viewScaleY = canvas.height / V_HEIGHT;
      }

      const resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(container);
      resize();

      // 座標映射：將螢幕座標轉換為瞄準歸一化座標
      function screenToAim(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = ((clientX - rect.left) / rect.width) * V_WIDTH;
        const canvasY = ((clientY - rect.top) / rect.height) * V_HEIGHT;

        // 靶中心螢幕座標預設約在 (860, 340)，半徑約 140
        const targetScreenCenter = getTargetScreenCenter();
        const radius = 140 * getCurrentStage().targetScale;

        return {
          x: (canvasX - targetScreenCenter.x) / radius,
          y: (canvasY - targetScreenCenter.y) / radius
        };
      }

      function getCurrentStage() {
        return R.getStage(gameTime);
      }

      function getTargetScreenCenter() {
        const stage = getCurrentStage();
        const targetOffset = R.getTargetPosition(gameTime, currentStageIndex);
        return {
          x: 880 + targetOffset.x * 160,
          y: 350 + targetOffset.y * 100
        };
      }

      // 開始拉弓
      function startDraw() {
        if (isGameOver) return;
        initAudio();
        if (!isDrawing) {
          isDrawing = true;
          drawStartTime = performance.now();
          currentHoldSeconds = 0;
          playTone("draw");
        }
      }

      // 放開射擊
      function releaseDraw() {
        if (!isDrawing || isGameOver) {
          isDrawing = false;
          return;
        }
        isDrawing = false;
        const hold = Math.max(0.1, currentHoldSeconds);
        const stageConfig = getCurrentStage();

        playTone("release");

        // 依據規則計算落點與彈道
        const shotImpact = R.calculateShotImpact(aimPoint, hold, stageConfig, rng);

        flyingArrows.push({
          progress: 0,
          flightTime: Math.max(0.18, shotImpact.flightTime * 0.7),
          startPos: { x: 340, y: 440 },
          aim: { ...aimPoint },
          impact: shotImpact,
          stageIndex: currentStageIndex,
          targetScale: stageConfig.targetScale,
          holdSeconds: hold
        });
      }

      // 箭矢命中處理
      function handleArrowImpact(arrow) {
        const targetCenterPos = R.getTargetPosition(gameTime, arrow.stageIndex);
        const judged = R.judgeImpact(arrow.impact, targetCenterPos, arrow.targetScale);

        stats.shotsFired += 1;
        const targetScreen = getTargetScreenCenter();
        const targetRadius = 140 * arrow.targetScale;

        const hitScreenX = targetScreen.x + (arrow.impact.impactX - targetCenterPos.x) * targetRadius;
        const hitScreenY = targetScreen.y + (arrow.impact.impactY - targetCenterPos.y) * targetRadius;

        if (judged.isHit) {
          stats.hits += 1;
          totalScore += judged.score;
          targetBounce = 1.25;
          if (!prefersReducedMotion) {
            screenShake = 6;
          }
          playTone("hit");

          // 飄字（得分）
          floatingTexts.push({
            text: `+${judged.score}`,
            x: hitScreenX,
            y: hitScreenY - 20,
            color: judged.score >= 9 ? COLOR_YELLOW : COLOR_PAPER,
            size: judged.score >= 9 ? 34 : 26,
            life: 1.0,
            vy: -40
          });

          // 命中金色粒子
          if (!prefersReducedMotion) {
            for (let i = 0; i < 12; i++) {
              const angle = rng() * Math.PI * 2;
              const spd = 60 + rng() * 120;
              particles.push({
                x: hitScreenX,
                y: hitScreenY,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color: rng() > 0.4 ? COLOR_YELLOW : COLOR_PAPER,
                size: 3 + rng() * 4,
                life: 0.6
              });
            }
          }

          // 靶面保留箭矢（至多保留 15 支）
          stuckArrows.push({
            relX: (arrow.impact.impactX - targetCenterPos.x) / arrow.targetScale,
            relY: (arrow.impact.impactY - targetCenterPos.y) / arrow.targetScale,
            isHit: true
          });
          if (stuckArrows.length > 15) stuckArrows.shift();
        } else {
          stats.misses += 1;
          redFlash = 0.25;
          if (!prefersReducedMotion) {
            screenShake = 4;
          }
          playTone("miss");

          floatingTexts.push({
            text: "MISS",
            x: hitScreenX,
            y: hitScreenY - 20,
            color: COLOR_RED,
            size: 24,
            life: 0.9,
            vy: -30
          });

          stuckArrows.push({
            relX: (arrow.impact.impactX - targetCenterPos.x) / arrow.targetScale,
            relY: (arrow.impact.impactY - targetCenterPos.y) / arrow.targetScale,
            isHit: false
          });
          if (stuckArrows.length > 15) stuckArrows.shift();
        }
      }

      // 事件綁定
      function onPointerMove(e) {
        aimPoint = screenToAim(e.clientX, e.clientY);
      }

      function onPointerDown(e) {
        aimPoint = screenToAim(e.clientX, e.clientY);
        startDraw();
      }

      function onPointerUp() {
        releaseDraw();
      }

      function onKeyDown(e) {
        if (e.code === "Space" && !e.repeat) {
          e.preventDefault();
          startDraw();
        }
      }

      function onKeyUp(e) {
        if (e.code === "Space") {
          e.preventDefault();
          releaseDraw();
        }
      }

      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      drawBtn.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        startDraw();
      });

      // 遊戲結算處理
      function finishGame() {
        if (onEndCalled) return;
        onEndCalled = true;
        isGameOver = true;
        isDrawing = false;
        controlBar.style.display = "none";

        const won = R.isWin(totalScore);
        const flawless = R.isFlawless(stats);

        if (api && typeof api.onEnd === "function") {
          api.onEnd({
            win: won,
            score: totalScore,
            flawless: flawless
          });
        }
      }

      // 重新挑戰（供結束畫面點擊）
      function restartGame() {
        gameTime = 0;
        lastTime = performance.now();
        isGameOver = false;
        onEndCalled = false;
        currentStageIndex = 0;
        totalScore = 0;
        stats.shotsFired = 0;
        stats.hits = 0;
        stats.misses = 0;
        stuckArrows.length = 0;
        flyingArrows.length = 0;
        floatingTexts.length = 0;
        particles.length = 0;
        isDrawing = false;
        controlBar.style.display = "flex";
      }

      // 繪製背景與 LED 巨幕空間
      function drawBackground() {
        ctx.fillStyle = COLOR_INK;
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        // LED 牆虛擬網格
        ctx.strokeStyle = "rgba(138, 148, 142, 0.22)";
        ctx.lineWidth = 1.5;

        // 地面透視網格
        const horizonY = 320;
        for (let i = 0; i <= 8; i++) {
          const y = horizonY + i * i * 6.2;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(V_WIDTH, y);
          ctx.stroke();
        }
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath();
          ctx.moveTo(V_WIDTH * 0.5 + i * 50, horizonY);
          ctx.lineTo(V_WIDTH * 0.5 + i * 160, V_HEIGHT);
          ctx.stroke();
        }

        // 背景 LED 面板格線
        ctx.strokeStyle = "rgba(138, 148, 142, 0.12)";
        ctx.lineWidth = 2;
        for (let x = 60; x < V_WIDTH; x += 140) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, horizonY);
          ctx.stroke();
        }
        for (let y = 40; y < horizonY; y += 70) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(V_WIDTH, y);
          ctx.stroke();
        }
      }

      // 繪製動捕演員（左側）
      function drawActor() {
        ctx.save();
        ctx.translate(280, 480);

        // 動捕人偶線條（使用灰色與紙色）
        ctx.strokeStyle = COLOR_GRAY;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";

        // 頭部
        ctx.fillStyle = COLOR_PAPER;
        ctx.beginPath();
        ctx.arc(0, -110, 24, 0, Math.PI * 2);
        ctx.fill();

        // 軀幹
        ctx.beginPath();
        ctx.moveTo(0, -86);
        ctx.lineTo(0, 10);
        ctx.stroke();

        // 雙腳
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-30, 80);
        ctx.moveTo(0, 10);
        ctx.lineTo(35, 78);
        ctx.stroke();

        // 持弓手臂與拉弦手
        const pullOffset = isDrawing ? Math.min(30, currentHoldSeconds * 22) : 0;
        ctx.strokeStyle = COLOR_BLUE;
        ctx.lineWidth = 6;

        // 前推持弓手
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(65, -55);
        ctx.stroke();

        // 後拉弦手臂
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(-20 - pullOffset, -50);
        ctx.stroke();

        // 弓身
        ctx.strokeStyle = COLOR_YELLOW;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(68, -55, 45, -1.5, 1.5);
        ctx.stroke();

        // 弓弦
        ctx.strokeStyle = COLOR_PAPER;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(68, -98);
        ctx.lineTo(48 - pullOffset, -55);
        ctx.lineTo(68, -12);
        ctx.stroke();

        // 動捕光學標記點（白色亮點）
        ctx.fillStyle = COLOR_PAPER;
        const markers = [
          [-15, -115], [15, -115], [0, -80], [-10, -50], [10, -50],
          [-20 - pullOffset, -50], [65, -55], [0, 10], [-30, 80], [35, 78]
        ];
        for (const [mx, my] of markers) {
          ctx.beginPath();
          ctx.arc(mx, my, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 繪製靶面與其上箭矢
      function drawTarget() {
        const center = getTargetScreenCenter();
        const stage = getCurrentStage();
        const radius = 140 * stage.targetScale * targetBounce;

        ctx.save();
        ctx.translate(center.x, center.y);

        // 靶架支撐
        ctx.strokeStyle = COLOR_GRAY;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.4, radius * 0.8);
        ctx.lineTo(-radius * 0.6, radius + 110);
        ctx.moveTo(radius * 0.4, radius * 0.8);
        ctx.lineTo(radius * 0.6, radius + 110);
        ctx.moveTo(0, radius * 0.8);
        ctx.lineTo(0, radius + 110);
        ctx.stroke();

        // 靶面 10 環（交替六色）
        const ringColors = [
          COLOR_INK, COLOR_PAPER, COLOR_BLUE, COLOR_PAPER, COLOR_RED,
          COLOR_PAPER, COLOR_YELLOW, COLOR_RED, COLOR_YELLOW, COLOR_YELLOW
        ];
        for (let ring = 10; ring >= 1; ring--) {
          ctx.beginPath();
          ctx.arc(0, 0, (radius * ring) / 10, 0, Math.PI * 2);
          ctx.fillStyle = ringColors[10 - ring];
          ctx.fill();
          ctx.strokeStyle = COLOR_INK;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // 靶面十字基準線
        ctx.strokeStyle = "rgba(15, 13, 10, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius, 0);
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius);
        ctx.stroke();

        // 繪製留在靶上的箭矢
        for (const arrow of stuckArrows) {
          const ax = arrow.relX * (radius / targetBounce);
          const ay = arrow.relY * (radius / targetBounce);

          ctx.strokeStyle = arrow.isHit ? COLOR_YELLOW : COLOR_RED;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + 24, ay - 12);
          ctx.stroke();

          ctx.fillStyle = arrow.isHit ? COLOR_PAPER : COLOR_RED;
          ctx.beginPath();
          ctx.arc(ax, ay, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 繪製飛行中的箭矢與軌跡
      function drawFlyingArrows() {
        const targetScreen = getTargetScreenCenter();
        const stage = getCurrentStage();
        const targetRadius = 140 * stage.targetScale;

        for (const arrow of flyingArrows) {
          const t = arrow.progress;
          const targetCenterPos = R.getTargetPosition(gameTime, arrow.stageIndex);
          const endX = targetScreen.x + (arrow.impact.impactX - targetCenterPos.x) * targetRadius;
          const endY = targetScreen.y + (arrow.impact.impactY - targetCenterPos.y) * targetRadius;

          const curX = R.lerp(arrow.startPos.x, endX, t);
          const curY = R.lerp(arrow.startPos.y, endY, t) - Math.sin(t * Math.PI) * 45;

          // 動捕即時軌跡光帶（藍色 Trace）
          ctx.strokeStyle = COLOR_BLUE;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(arrow.startPos.x, arrow.startPos.y);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          // 箭身
          ctx.strokeStyle = COLOR_PAPER;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(curX - 28, curY + 12);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          // 箭頭
          ctx.fillStyle = COLOR_YELLOW;
          ctx.beginPath();
          ctx.moveTo(curX, curY);
          ctx.lineTo(curX - 8, curY - 5);
          ctx.lineTo(curX - 6, curY + 6);
          ctx.closePath();
          ctx.fill();
        }
      }

      // 繪製準心
      function drawReticle() {
        if (isGameOver) return;
        const targetScreen = getTargetScreenCenter();
        const stage = getCurrentStage();
        const targetRadius = 140 * stage.targetScale;

        const rx = targetScreen.x + aimPoint.x * targetRadius;
        const ry = targetScreen.y + aimPoint.y * targetRadius;

        const focusRadius = R.calculateFocusRadius(currentHoldSeconds);
        const reticleSize = 18 + focusRadius * 160;

        let reticleColor = COLOR_BLUE;
        if (currentHoldSeconds >= R.FOCUS_WARN_AT) {
          reticleColor = COLOR_RED;
        } else if (currentHoldSeconds >= R.FOCUS_BEST_AT && currentHoldSeconds <= R.FOCUS_STABLE_UNTIL) {
          reticleColor = COLOR_YELLOW;
        }

        ctx.strokeStyle = reticleColor;
        ctx.lineWidth = 2.5;

        // 準心圓環
        ctx.beginPath();
        ctx.arc(rx, ry, reticleSize, 0, Math.PI * 2);
        ctx.stroke();

        // 十字瞄準線
        ctx.beginPath();
        ctx.moveTo(rx - reticleSize - 8, ry);
        ctx.lineTo(rx - 5, ry);
        ctx.moveTo(rx + 5, ry);
        ctx.lineTo(rx + reticleSize + 8, ry);
        ctx.moveTo(rx, ry - reticleSize - 8);
        ctx.lineTo(rx, ry - 5);
        ctx.moveTo(rx, ry + 5);
        ctx.lineTo(rx, ry + reticleSize + 8);
        ctx.stroke();

        // 蓄力狀態小字與力道進度
        if (isDrawing) {
          const power = R.calculateDrawPower(currentHoldSeconds);
          ctx.fillStyle = reticleColor;
          ctx.font = "800 13px 'Noto Sans TC', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`蓄力 ${(power * 100).toFixed(0)}%`, rx, ry + reticleSize + 20);
        }
      }

      // 繪製粒子與飄字
      function drawEffects() {
        for (const p of particles) {
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
        }

        for (const ft of floatingTexts) {
          ctx.fillStyle = ft.color;
          ctx.font = `900 ${ft.size}px 'Noto Sans TC', sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(ft.text, ft.x, ft.y);
        }

        // 脫靶紅閃
        if (redFlash > 0) {
          ctx.fillStyle = `rgba(230, 57, 70, ${redFlash * 0.4})`;
          ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);
        }
      }

      // 繪製上方 HUD、情境小字、倒數計時條
      function drawHUD() {
        const stage = getCurrentStage();

        // 畫面上方情境狀態小字（符合工單要求）
        ctx.textAlign = "left";
        ctx.font = "900 15px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = COLOR_RED;
        ctx.fillText("LIVE ● 即時合成中", 28, 34);

        ctx.font = "800 13px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = COLOR_GRAY;
        ctx.fillText("D0631 動作捕捉實驗室 · 虛擬製片棚 LED 牆投射", 175, 34);

        // 關卡與難度階數（畫面角落）
        ctx.fillStyle = COLOR_YELLOW;
        ctx.font = "900 18px 'Noto Sans TC', sans-serif";
        ctx.fillText(`${stage.name} (${Math.round(stage.timeStart)}-${Math.round(stage.timeEnd)}s)`, 28, 62);

        // 風向與風速面板
        const windText = stage.windMps >= 0 ? `→ ${Math.abs(stage.windMps).toFixed(1)} m/s` : `← ${Math.abs(stage.windMps).toFixed(1)} m/s`;
        ctx.fillStyle = COLOR_BLUE;
        ctx.font = "800 15px 'Noto Sans TC', sans-serif";
        ctx.fillText(`風場模擬：${windText} · 距離 ${stage.distanceM}m`, 28, 86);

        // 右上角得分與命中數據
        ctx.textAlign = "right";
        ctx.fillStyle = COLOR_PAPER;
        ctx.font = "900 24px 'Noto Sans TC', sans-serif";
        ctx.fillText(`總分：${totalScore} / ${R.WIN_SCORE}`, V_WIDTH - 28, 40);

        ctx.font = "800 15px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = stats.misses === 0 && stats.shotsFired > 0 ? COLOR_YELLOW : COLOR_GRAY;
        ctx.fillText(`每箭上靶：${stats.hits} / ${stats.shotsFired} 箭${stats.misses === 0 && stats.shotsFired > 0 ? " ★" : ""}`, V_WIDTH - 28, 66);

        // 中央頂部 60 秒倒數計時條
        const remainSeconds = Math.max(0, R.TOTAL_SECONDS - gameTime);
        const progress = Math.min(1, gameTime / R.TOTAL_SECONDS);

        const barW = 420;
        const barH = 12;
        const barX = (V_WIDTH - barW) * 0.5;
        const barY = 24;

        ctx.fillStyle = "rgba(138, 148, 142, 0.35)";
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = remainSeconds < 10 ? COLOR_RED : COLOR_YELLOW;
        ctx.fillRect(barX, barY, barW * (1 - progress), barH);
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);

        ctx.textAlign = "center";
        ctx.font = "900 14px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = COLOR_PAPER;
        ctx.fillText(`剩餘時間：${remainSeconds.toFixed(1)}s`, V_WIDTH * 0.5, barY + barH + 16);

        // 下方教學一行（符合情境的說法）
        ctx.textAlign = "center";
        ctx.font = "700 14px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = COLOR_GRAY;
        ctx.fillText("教學：按住蓄力拉弓、移動瞄準、看風向放開射擊，即時捕捉動捕軌跡！", V_WIDTH * 0.5, V_HEIGHT - 68);

        // 開場 3 秒半透明動態示範動作
        if (gameTime < 3.2) {
          const t = gameTime;
          const alpha = t < 2.5 ? 0.85 : (3.2 - t) / 0.7 * 0.85;
          ctx.save();
          ctx.fillStyle = `rgba(15, 13, 10, ${alpha * 0.85})`;
          ctx.fillRect(V_WIDTH * 0.5 - 210, 110, 420, 50);
          ctx.strokeStyle = COLOR_YELLOW;
          ctx.lineWidth = 2;
          ctx.strokeRect(V_WIDTH * 0.5 - 210, 110, 420, 50);

          ctx.textAlign = "center";
          ctx.fillStyle = COLOR_YELLOW;
          ctx.font = "800 16px 'Noto Sans TC', sans-serif";
          ctx.fillText("【示範】：長按螢幕或空白鍵拉弓 1.2 秒，放開射出！", V_WIDTH * 0.5, 142);
          ctx.restore();
        }

        // 畫面右下角固定小字 GRAYBOX
        ctx.textAlign = "right";
        ctx.font = "800 13px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = COLOR_GRAY;
        ctx.fillText("GRAYBOX", V_WIDTH - 20, V_HEIGHT - 18);
      }

      // 繪製結束結算畫面
      function drawGameOver() {
        ctx.fillStyle = "rgba(15, 13, 10, 0.88)";
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        const cardW = 620;
        const cardH = 430;
        const cardX = (V_WIDTH - cardW) * 0.5;
        const cardY = (V_HEIGHT - cardH) * 0.5;

        // 結算卡片框
        ctx.fillStyle = COLOR_INK;
        ctx.fillRect(cardX, cardY, cardW, cardH);
        ctx.strokeStyle = COLOR_PAPER;
        ctx.lineWidth = 3;
        ctx.strokeRect(cardX, cardY, cardW, cardH);

        const won = R.isWin(totalScore);
        const stars = R.calculateStars(totalScore, stats);

        ctx.textAlign = "center";
        ctx.fillStyle = won ? COLOR_YELLOW : COLOR_RED;
        ctx.font = "900 42px 'Noto Sans TC', sans-serif";
        ctx.fillText(won ? "PASS · 製片驗收合格" : "FAIL · 需再次校準", V_WIDTH * 0.5, cardY + 65);

        // 星等顯示 ★☆☆
        const starStr = `${stars.star1 ? "★" : "☆"}${stars.star2 ? "★" : "☆"}${stars.star3 ? "★" : "☆"}`;
        ctx.fillStyle = COLOR_YELLOW;
        ctx.font = "900 36px 'Noto Sans TC', sans-serif";
        ctx.fillText(starStr, V_WIDTH * 0.5, cardY + 115);

        // 分數與星等達成細節
        ctx.fillStyle = COLOR_PAPER;
        ctx.font = "800 18px 'Noto Sans TC', sans-serif";
        ctx.fillText(`總得分：${totalScore} 分 (及格門檻: ${R.WIN_SCORE} / 優秀門檻: ${R.SCORE2})`, V_WIDTH * 0.5, cardY + 158);

        ctx.font = "700 15px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = COLOR_GRAY;
        ctx.fillText(`射出箭數：${stats.shotsFired} 箭 ｜ 上靶命中：${stats.hits} 箭 ｜ 脫靶：${stats.misses} 箭`, V_WIDTH * 0.5, cardY + 192);

        // 星等達成清單
        ctx.font = "700 14px 'Noto Sans TC', sans-serif";
        ctx.fillStyle = stars.star1 ? COLOR_YELLOW : COLOR_GRAY;
        ctx.fillText(`★1 通關：總分達 ${R.WIN_SCORE} 分 [${stars.star1 ? "已達成" : "未達成"}]`, V_WIDTH * 0.5, cardY + 224);
        ctx.fillStyle = stars.star2 ? COLOR_YELLOW : COLOR_GRAY;
        ctx.fillText(`★2 熟練：總分達 ${R.SCORE2} 分 [${stars.star2 ? "已達成" : "未達成"}]`, V_WIDTH * 0.5, cardY + 248);
        ctx.fillStyle = stars.star3 ? COLOR_YELLOW : COLOR_GRAY;
        ctx.fillText(`★3 完美：每箭都上靶 [${stars.star3 ? "已達成" : "未達成"}]`, V_WIDTH * 0.5, cardY + 272);

        // 專長知識（工單要求一字不差的專長知識）
        ctx.fillStyle = COLOR_BLUE;
        ctx.font = "800 16px 'Noto Sans TC', sans-serif";
        ctx.fillText("【專長知識】", V_WIDTH * 0.5, cardY + 312);
        ctx.fillStyle = COLOR_PAPER;
        ctx.font = "700 14px 'Noto Sans TC', sans-serif";
        ctx.fillText("虛擬製片用 LED 牆即時投出場景，演員一邊演、鏡頭一邊拍，不必等後製才看到成果。", V_WIDTH * 0.5, cardY + 338);

        // 再玩一次按鈕文字提示（卡片下方）
        ctx.fillStyle = COLOR_YELLOW;
        ctx.font = "800 16px 'Noto Sans TC', sans-serif";
        ctx.fillText("點擊畫面或按鈕重新挑戰", V_WIDTH * 0.5, cardY + 395);
      }

      // 主更新循環
      let animId = null;

      function update(dt) {
        if (!isGameOver) {
          gameTime += dt;

          // 階段切換檢測
          const nextStageIndex = R.getStageIndex(gameTime);
          if (nextStageIndex !== currentStageIndex) {
            currentStageIndex = nextStageIndex;
            playTone("stage");
          }

          // 蓄力時間計算
          if (isDrawing) {
            currentHoldSeconds += dt;
          }

          // 60 秒到期結束
          if (gameTime >= R.TOTAL_SECONDS) {
            gameTime = R.TOTAL_SECONDS;
            finishGame();
          }
        }

        // 箭矢飛行更新
        for (let i = flyingArrows.length - 1; i >= 0; i--) {
          const arrow = flyingArrows[i];
          arrow.progress += dt / arrow.flightTime;
          if (arrow.progress >= 1.0) {
            arrow.progress = 1.0;
            handleArrowImpact(arrow);
            flyingArrows.splice(i, 1);
          }
        }

        // 靶面彈跳縮放恢復
        if (targetBounce > 1.0) {
          targetBounce = Math.max(1.0, targetBounce - dt * 1.5);
        }

        // 震動衰減
        if (screenShake > 0) {
          screenShake = Math.max(0, screenShake - dt * 25);
        }

        // 紅閃衰減
        if (redFlash > 0) {
          redFlash = Math.max(0, redFlash - dt * 2.0);
        }

        // 粒子更新
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (p.life <= 0) particles.splice(i, 1);
        }

        // 飄字更新
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
          const ft = floatingTexts[i];
          ft.y += ft.vy * dt;
          ft.life -= dt;
          if (ft.life <= 0) floatingTexts.splice(i, 1);
        }
      }

      function loop(now) {
        const dt = Math.min(0.1, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;

        update(dt);

        // 渲染
        ctx.save();
        ctx.setTransform(viewScaleX, 0, 0, viewScaleY, 0, 0);

        if (screenShake > 0 && !prefersReducedMotion) {
          const shakeX = (rng() - 0.5) * screenShake;
          const shakeY = (rng() - 0.5) * screenShake;
          ctx.translate(shakeX, shakeY);
        }

        drawBackground();
        drawActor();
        drawTarget();
        drawFlyingArrows();
        drawReticle();
        drawEffects();
        drawHUD();

        if (isGameOver) {
          drawGameOver();
        }

        ctx.restore();

        animId = requestAnimationFrame(loop);
      }

      // 結束畫面點擊重新挑戰
      function onCanvasClick() {
        if (isGameOver) {
          restartGame();
        }
      }
      canvas.addEventListener("click", onCanvasClick);

      animId = requestAnimationFrame(loop);

      // destroy 清理所有監聽、動畫與音訊
      return {
        destroy() {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
          resizeObserver.disconnect();

          canvas.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerdown", onPointerDown);
          canvas.removeEventListener("click", onCanvasClick);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);
          window.removeEventListener("keydown", onKeyDown);
          window.removeEventListener("keyup", onKeyUp);

          if (audioCtx) {
            try {
              audioCtx.close();
            } catch (_e) {}
            audioCtx = null;
          }

          // 清空 root（嚴禁修改 root.style）
          while (root.firstChild) {
            root.removeChild(root.firstChild);
          }
        }
      };
    }
  };
})();
