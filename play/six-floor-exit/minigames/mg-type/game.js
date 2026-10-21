/**
 * mg-type「字體對撞」（專長：視覺傳達設計）
 * 小遊戲本體（非 module，一般 script）
 */
(function () {
  window.EXIT6_MG = window.EXIT6_MG || {};

  window.EXIT6_MG["mg-type"] = {
    title: "字體對撞",
    skill: "視覺傳達設計",
    seconds: 60,

    mount(root, api) {
      const R = window.EXIT6_RULES_MG_TYPE;
      if (!R) {
        console.error("EXIT6_RULES_MG_TYPE not loaded!");
      }

      const rng = (api && typeof api.rng === "function") ? api.rng : Math.random;
      let onEndCalled = false;
      function triggerEnd(result) {
        if (onEndCalled) return;
        onEndCalled = true;
        if (api && typeof api.onEnd === "function") {
          api.onEnd(result);
        }
      }

      // 檢查使用者無障礙偏好（降低動態效果）
      const reducedMotion = typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 建立 WebAudio 聲音合成器
      let audioCtx = null;
      function initAudio() {
        if (!audioCtx && typeof (window.AudioContext || window.webkitAudioContext) !== "undefined") {
          try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioCtx();
          } catch (e) {
            audioCtx = null;
          }
        }
        if (audioCtx && audioCtx.state === "suspended") {
          audioCtx.resume().catch(() => {});
        }
      }

      function playSound(type) {
        if (!audioCtx || audioCtx.state !== "running") return;
        try {
          const now = audioCtx.currentTime;
          if (type === "hit") {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
          } else if (type === "dash") {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
          } else if (type === "out") {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(380, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
          } else if (type === "win") {
            [440, 554, 659, 880].forEach((freq, idx) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = "triangle";
              osc.frequency.setValueAtTime(freq, now + idx * 0.08);
              gain.gain.setValueAtTime(0.2, now + idx * 0.08);
              gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.15);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start(now + idx * 0.08);
              osc.stop(now + idx * 0.08 + 0.16);
            });
          } else if (type === "lose") {
            [330, 290, 240, 180].forEach((freq, idx) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, now + idx * 0.1);
              gain.gain.setValueAtTime(0.2, now + idx * 0.1);
              gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.18);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start(now + idx * 0.1);
              osc.stop(now + idx * 0.1 + 0.2);
            });
          }
        } catch (e) {}
      }

      // 構建 DOM 容器結構
      root.innerHTML = "";
      root.style.position = "relative";
      root.style.width = "100%";
      root.style.height = "100%";
      root.style.overflow = "hidden";
      root.style.backgroundColor = "#f4ecd8";
      root.style.fontFamily = '"Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';
      root.style.color = "#0f0d0a";
      root.style.userSelect = "none";
      root.style.webkitUserSelect = "none";

      const styleEl = document.createElement("style");
      styleEl.textContent = `
        .exit6-type-btn {
          min-height: 44px;
          min-width: 44px;
          border: 3px solid #0f0d0a;
          box-shadow: 4px 4px 0 #0f0d0a;
          background: #f4ecd8;
          color: #0f0d0a;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          border-radius: 6px;
          padding: 8px 14px;
          transition: transform 0.1s, box-shadow 0.1s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: inherit;
        }
        .exit6-type-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 #0f0d0a;
        }
        .exit6-type-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #0f0d0a;
        }
        .exit6-type-btn.primary {
          background: #ffd60a;
        }
        .exit6-type-btn.active {
          background: #1d4ed8;
          color: #f4ecd8;
        }
        .exit6-type-input {
          height: 48px;
          border: 3px solid #0f0d0a;
          box-shadow: 4px 4px 0 #0f0d0a;
          background: #fff;
          color: #0f0d0a;
          font-weight: 900;
          font-size: 22px;
          text-align: center;
          border-radius: 6px;
          padding: 4px 8px;
          width: 160px;
          letter-spacing: 4px;
          font-family: inherit;
        }
        .exit6-type-input:focus {
          outline: none;
          border-color: #1d4ed8;
        }
        .exit6-type-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 900;
          padding: 3px 6px;
          border: 2px solid #0f0d0a;
          background: #ffd60a;
          color: #0f0d0a;
          border-radius: 4px;
          white-space: nowrap;
        }
      `;
      root.appendChild(styleEl);

      // Canvas
      const canvas = document.createElement("canvas");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.touchAction = "none";
      canvas.style.cursor = "crosshair";
      root.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      // HUD 頂部倒數與狀態列
      const hudEl = document.createElement("div");
      hudEl.style.position = "absolute";
      hudEl.style.top = "8px";
      hudEl.style.left = "12px";
      hudEl.style.right = "12px";
      hudEl.style.display = "flex";
      hudEl.style.justifyContent = "space-between";
      hudEl.style.alignItems = "center";
      hudEl.style.pointerEvents = "none";
      hudEl.style.zIndex = "10";

      hudEl.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:4px; max-width:45%;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span id="type-p-name" class="exit6-type-badge" style="background:#1d4ed8; color:#f4ecd8;">我方</span>
            <span id="type-p-font" style="font-size:12px; font-weight:900;">粗黑體</span>
          </div>
          <div id="type-p-glyphs" style="font-size:12px; font-weight:700; color:#0f0d0a;"></div>
        </div>

        <!-- 倒數與階段進度條 -->
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; max-width:180px; margin:0 8px;">
          <div style="font-size:16px; font-weight:900; letter-spacing:1px; color:#0f0d0a;">
            <span id="type-timer">60.0</span>s
          </div>
          <div style="width:100%; height:8px; border:2px solid #0f0d0a; background:#e63946; border-radius:4px; overflow:hidden;">
            <div id="type-time-bar" style="width:100%; height:100%; background:#ffd60a; transition:width 0.1s linear;"></div>
          </div>
          <span id="type-stage-badge" class="exit6-type-badge">第 1 階：暖身</span>
        </div>

        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px; max-width:45%; text-align:right;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span id="type-e-font" style="font-size:12px; font-weight:900;">明體</span>
            <span class="exit6-type-badge" style="background:#e63946; color:#f4ecd8;">電腦</span>
          </div>
          <div id="type-e-glyphs" style="font-size:12px; font-weight:700; color:#0f0d0a;"></div>
        </div>
      `;
      root.appendChild(hudEl);

      // 開場 3 秒教學提示橫幅（10 秒教會原則，文字不超過一行）
      const tipBanner = document.createElement("div");
      tipBanner.style.position = "absolute";
      tipBanner.style.top = "64px";
      tipBanner.style.left = "50%";
      tipBanner.style.transform = "translateX(-50%)";
      tipBanner.style.background = "#ffd60a";
      tipBanner.style.border = "3px solid #0f0d0a";
      tipBanner.style.boxShadow = "4px 4px 0 #0f0d0a";
      tipBanner.style.padding = "6px 16px";
      tipBanner.style.borderRadius = "20px";
      tipBanner.style.fontWeight = "900";
      tipBanner.style.fontSize = "13px";
      tipBanner.style.zIndex = "12";
      tipBanner.style.pointerEvents = "none";
      tipBanner.style.transition = "opacity 0.4s";
      tipBanner.textContent = "👆 拖曳或點選擂台瞄準，點擊衝刺將對手撞出圈外！";
      root.appendChild(tipBanner);

      // 底部操作輔助按鈕
      const bottomControls = document.createElement("div");
      bottomControls.style.position = "absolute";
      bottomControls.style.bottom = "12px";
      bottomControls.style.left = "16px";
      bottomControls.style.display = "flex";
      bottomControls.style.gap = "8px";
      bottomControls.style.alignItems = "center";
      bottomControls.style.zIndex = "11";

      const dashBtn = document.createElement("button");
      dashBtn.className = "exit6-type-btn primary";
      dashBtn.textContent = "衝刺 (Space)";
      dashBtn.style.padding = "10px 18px";
      dashBtn.style.fontSize = "15px";
      bottomControls.appendChild(dashBtn);
      root.appendChild(bottomControls);

      // 右下角固定標籤 GRAYBOX
      const grayboxTag = document.createElement("div");
      grayboxTag.style.position = "absolute";
      grayboxTag.style.right = "8px";
      grayboxTag.style.bottom = "6px";
      grayboxTag.style.fontSize = "11px";
      grayboxTag.style.fontWeight = "900";
      grayboxTag.style.letterSpacing = "1px";
      grayboxTag.style.color = "#8a948e";
      grayboxTag.style.pointerEvents = "none";
      grayboxTag.style.zIndex = "15";
      grayboxTag.textContent = "GRAYBOX";
      root.appendChild(grayboxTag);

      // 開場配置對話框 (Setup Overlay)
      const setupOverlay = document.createElement("div");
      setupOverlay.style.position = "absolute";
      setupOverlay.style.inset = "0";
      setupOverlay.style.background = "#f4ecd8f0";
      setupOverlay.style.display = "flex";
      setupOverlay.style.flexDirection = "column";
      setupOverlay.style.justifyContent = "center";
      setupOverlay.style.alignItems = "center";
      setupOverlay.style.zIndex = "20";
      setupOverlay.style.padding = "20px";
      setupOverlay.style.boxSizing = "border-box";

      setupOverlay.innerHTML = `
        <div style="background:#fff; border:3px solid #0f0d0a; box-shadow:6px 6px 0 #0f0d0a; border-radius:12px; padding:20px; max-width:440px; width:100%; box-sizing:border-box; text-align:center;">
          <h2 style="margin:0 0 6px; font-size:24px; font-weight:900; color:#0f0d0a; letter-spacing:2px;">字體對撞</h2>
          <div style="font-size:12px; font-weight:900; color:#1d4ed8; margin-bottom:14px;">專長領域：視覺傳達設計・文字個性擂台</div>
          
          <div style="margin-bottom:12px;">
            <div style="font-size:12px; font-weight:900; margin-bottom:6px; color:#0f0d0a;">步驟 1：輸入字陣文字（1～3 個字）</div>
            <input id="type-setup-input" class="exit6-type-input" type="text" maxlength="3" value="動遊系" spellcheck="false" autocomplete="off" />
          </div>

          <div style="margin-bottom:16px;">
            <div style="font-size:12px; font-weight:900; margin-bottom:8px; color:#0f0d0a;">步驟 2：選擇字體風格（賦予文字個性能力）</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="exit6-type-btn active" data-font="bold">粗黑體<br><span style="font-size:10px; font-weight:700;">重、撞得遠</span></button>
              <button class="exit6-type-btn" data-font="serif">明體<br><span style="font-size:10px; font-weight:700;">銳利、反擊強</span></button>
              <button class="exit6-type-btn" data-font="round">圓體<br><span style="font-size:10px; font-weight:700;">彈性、回彈快</span></button>
              <button class="exit6-type-btn" data-font="script">楷體<br><span style="font-size:10px; font-weight:700;">靈活、轉向快</span></button>
            </div>
          </div>

          <div id="type-setup-desc" style="font-size:11px; color:#0f0d0a; background:#f4ecd8; border:2px solid #0f0d0a; padding:8px; border-radius:6px; margin-bottom:16px; text-align:left; line-height:1.4;">
            <strong>粗黑體</strong>：沉穩厚重，撞擊力道猛烈、擊退距離極遠！
          </div>

          <button id="type-start-btn" class="exit6-type-btn primary" style="width:100%; font-size:18px; padding:12px 0;">開始對撞 (Enter)</button>
        </div>
      `;
      root.appendChild(setupOverlay);

      // 結束結算畫面 (Game Over Overlay)
      const endOverlay = document.createElement("div");
      endOverlay.style.position = "absolute";
      endOverlay.style.inset = "0";
      endOverlay.style.background = "#f4ecd8e6";
      endOverlay.style.display = "none";
      endOverlay.style.flexDirection = "column";
      endOverlay.style.justifyContent = "center";
      endOverlay.style.alignItems = "center";
      endOverlay.style.zIndex = "30";
      endOverlay.style.padding = "20px";
      endOverlay.style.boxSizing = "border-box";
      root.appendChild(endOverlay);

      // 提前獲勝等待橫幅（10 秒前電腦全員出圈時顯示「完勝！」）
      const pendingWinEl = document.createElement("div");
      pendingWinEl.id = "type-pending-win";
      pendingWinEl.style.position = "absolute";
      pendingWinEl.style.top = "42%";
      pendingWinEl.style.left = "50%";
      pendingWinEl.style.transform = "translate(-50%, -50%)";
      pendingWinEl.style.background = "#ffd60a";
      pendingWinEl.style.border = "4px solid #0f0d0a";
      pendingWinEl.style.boxShadow = "6px 6px 0 #0f0d0a";
      pendingWinEl.style.borderRadius = "12px";
      pendingWinEl.style.padding = "14px 28px";
      pendingWinEl.style.textAlign = "center";
      pendingWinEl.style.zIndex = "25";
      pendingWinEl.style.display = "none";
      pendingWinEl.style.pointerEvents = "none";
      pendingWinEl.innerHTML = `
        <div style="font-size:36px; font-weight:900; color:#1d4ed8; letter-spacing:4px; margin-bottom:4px;">完勝！</div>
        <div style="font-size:13px; font-weight:900; color:#0f0d0a;">電腦文字全員出圈！將於第 10 秒結算 (<span id="type-win-countdown">0.0</span>s)</div>
      `;
      root.appendChild(pendingWinEl);
      const pendingWinCountdown = pendingWinEl.querySelector("#type-win-countdown");

      // 遊戲內部狀態
      let phase = "setup"; // "setup" | "battle" | "result"
      let selectedFontKey = "bold";
      let playerChars = ["動", "遊", "系"];
      let enemyChars = ["視", "傳", "組"];
      let enemyFontKey = "serif";

      let timeElapsed = 0;
      const MAX_TIME = api && api.seconds > 0 ? api.seconds : 60; // 派對模式會傳較短秒數
      let particles = [];
      let screenShake = 0;
      let playerDashCooldown = 0;
      let isPlayerDashing = false;
      let playerDashTimer = 0;

      let isEnemyDashing = false;
      let enemyDashTimer = 0;

      // 瞄準座標
      let aimGoal = { x: 0, y: 0 };
      let isAiming = false;

      // 戰隊狀態
      let playerTeam = {
        x: -90,
        y: 0,
        vx: 0,
        vy: 0,
        angle: 0,
        glyphs: [],
      };

      let enemyTeam = {
        x: 90,
        y: 0,
        vx: 0,
        vy: 0,
        angle: Math.PI,
        dashTimer: 3.0,
        glyphs: [],
      };

      function setupFighters() {
        const inputVal = root.querySelector("#type-setup-input")?.value || "動遊系";
        playerChars = R.parseCharacters(inputVal);

        // 初始化我方文字頂點
        playerTeam.x = -90;
        playerTeam.y = 0;
        playerTeam.vx = 0;
        playerTeam.vy = 0;
        playerTeam.angle = 0;
        playerTeam.glyphs = playerChars.map((ch, idx) => ({
          char: ch,
          index: idx,
          hp: 100,
          out: false,
          x: -90,
          y: 0,
          hitCooldown: 0,
        }));

        // 初始化電腦文字
        enemyTeam.x = 90;
        enemyTeam.y = 0;
        enemyTeam.vx = 0;
        enemyTeam.vy = 0;
        enemyTeam.angle = Math.PI;
        enemyTeam.dashTimer = 2.5;
        // 電腦選擇明體或依階段輪替
        enemyFontKey = selectedFontKey === "serif" ? "bold" : "serif";
        enemyTeam.glyphs = enemyChars.map((ch, idx) => ({
          char: ch,
          index: idx,
          hp: 100,
          out: false,
          x: 90,
          y: 0,
          hitCooldown: 0,
        }));

        timeElapsed = 0;
        particles = [];
        screenShake = 0;
        playerDashCooldown = 0;
        aimGoal = { x: 0, y: 0 };
      }

      // 切換字體選單
      const fontBtns = setupOverlay.querySelectorAll("[data-font]");
      fontBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          initAudio();
          fontBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          selectedFontKey = btn.dataset.font;
          const fontData = R.FONTS[selectedFontKey];
          const descEl = setupOverlay.querySelector("#type-setup-desc");
          if (descEl && fontData) {
            descEl.innerHTML = `<strong>${fontData.name}</strong>（${fontData.trait}）：${fontData.designRole}`;
          }
        });
      });

      const startBtn = setupOverlay.querySelector("#type-start-btn");
      startBtn.addEventListener("click", startGame);

      function startGame() {
        initAudio();
        setupFighters();
        setupOverlay.style.display = "none";
        phase = "battle";

        // 更新 HUD 顯示字體
        const pFontLabel = root.querySelector("#type-p-font");
        const eFontLabel = root.querySelector("#type-e-font");
        if (pFontLabel) pFontLabel.textContent = R.FONTS[selectedFontKey].name;
        if (eFontLabel) eFontLabel.textContent = R.FONTS[enemyFontKey].name;

        // 開局前 3 秒示範時間提示
        tipBanner.style.opacity = "1";
        tipBanner.textContent = "👆 示範時間：拖曳滑鼠瞄準，3 秒後開放衝刺對撞！";
      }

      // 衝刺動作觸發
      function triggerPlayerDash() {
        if (phase !== "battle" || R.isDemoTime(timeElapsed) || playerDashCooldown > 0.05) return;
        initAudio();
        playSound("dash");
        const font = R.FONTS[selectedFontKey];

        // 朝 aimGoal 或面向衝刺
        let dx = aimGoal.x - playerTeam.x;
        let dy = aimGoal.y - playerTeam.y;
        let d = Math.hypot(dx, dy);
        if (d < 10) {
          dx = Math.cos(playerTeam.angle);
          dy = Math.sin(playerTeam.angle);
          d = 1;
        }

        const dashSpeed = 220 * (font.speed / 80);
        playerTeam.vx += (dx / d) * dashSpeed;
        playerTeam.vy += (dy / d) * dashSpeed;

        isPlayerDashing = true;
        playerDashTimer = 0.35;
        // 衝刺冷卻至少 1.2 秒
        playerDashCooldown = R.getDashCooldown(selectedFontKey);

        // 噴射粒子
        if (!reducedMotion) {
          for (let i = 0; i < 8; i++) {
            const spread = (rng() - 0.5) * 0.8;
            particles.push({
              x: playerTeam.x,
              y: playerTeam.y,
              vx: -(dx / d) * (80 + rng() * 60) + spread * 40,
              vy: -(dy / d) * (80 + rng() * 60) + spread * 40,
              life: 0.25,
              color: "#ffd60a",
              size: 4,
            });
          }
        }
      }

      dashBtn.addEventListener("click", triggerPlayerDash);

      // 輸入處理（滑鼠、觸控、鍵盤）
      function updateAimFromPointer(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const rawX = clientX - rect.left;
        const rawY = clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const arenaR = R.getArenaRadius(timeElapsed);
        const scale = Math.min(rect.width, rect.height) / (arenaR * 2.3);

        aimGoal.x = (rawX - cx) / scale;
        aimGoal.y = (rawY - cy) / scale;
      }

      function onPointerDown(e) {
        initAudio();
        isAiming = true;
        updateAimFromPointer(e.clientX, e.clientY);
        canvas.setPointerCapture(e.pointerId);
      }

      function onPointerMove(e) {
        if (isAiming) {
          updateAimFromPointer(e.clientX, e.clientY);
        }
      }

      function onPointerUp(e) {
        if (isAiming) {
          isAiming = false;
          // 點放時若在戰鬥中，順暢微加速
          triggerPlayerDash();
        }
      }

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);

      // 鍵盤操作
      function onKeyDown(e) {
        if (e.repeat) return;
        initAudio();
        if (phase === "setup") {
          if (e.key === "Enter") {
            startGame();
          }
          return;
        }
        if (phase === "battle") {
          if (e.code === "Space") {
            e.preventDefault();
            triggerPlayerDash();
          } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
            playerTeam.vy -= 40;
          } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
            playerTeam.vy += 40;
          } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            playerTeam.vx -= 40;
          } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            playerTeam.vx += 40;
          }
        }
      }
      window.addEventListener("keydown", onKeyDown);

      // 結束畫面展示
      function showGameOver(matchResult) {
        phase = "result";
        if (matchResult.win) {
          playSound("win");
        } else {
          playSound("lose");
        }

        const fontData = R.FONTS[selectedFontKey];
        endOverlay.style.display = "flex";
        endOverlay.innerHTML = `
          <div style="background:#fff; border:3px solid #0f0d0a; box-shadow:6px 6px 0 #0f0d0a; border-radius:12px; padding:22px; max-width:440px; width:100%; box-sizing:border-box; text-align:center;">
            <div style="font-size:32px; font-weight:900; margin-bottom:4px; color:${matchResult.win ? "#1d4ed8" : "#e63946"};">
              ${matchResult.win ? "🎉 碰撞獲勝！" : "💥 挑戰結束"}
            </div>
            <div style="font-size:14px; font-weight:700; color:#0f0d0a; margin-bottom:12px;">${matchResult.reason}</div>

            <div style="background:#f4ecd8; border:2px solid #0f0d0a; border-radius:8px; padding:10px; margin-bottom:14px;">
              <div style="font-size:12px; font-weight:900; color:#8a948e;">最終得分</div>
              <div style="font-size:26px; font-weight:900; color:#0f0d0a;">${matchResult.score}</div>
            </div>

            <!-- 專長知識傳達卡 -->
            <div style="text-align:left; background:#fff; border:2px dashed #0f0d0a; border-radius:8px; padding:12px; margin-bottom:18px; line-height:1.5;">
              <div style="font-size:12px; font-weight:900; color:#1d4ed8; margin-bottom:4px;">
                【視覺傳達設計學堂：文字有「個性」！】
              </div>
              <div style="font-size:12px; font-weight:700; color:#0f0d0a; margin-bottom:6px;">
                你選擇了<strong>「${fontData.name}」</strong>（${fontData.trait}）：<br>
                ${fontData.designRole}
              </div>
              <div style="font-size:11px; color:#687670; border-top:1px solid #d5dbd1; padding-top:6px;">
                💡 <strong>這就是視覺傳達設計在做的事</strong>：替訊息挑選最契合的字型、色彩與版面編排，賦予文字專屬的情感與視覺張力。
              </div>
            </div>
          </div>
        `;

        triggerEnd({
          win: matchResult.win,
          score: matchResult.score,
        });
      }

      // 物理迴圈與動畫幀
      let lastTime = 0;
      let rafId = null;

      function update(dt) {
        if (phase !== "battle") return;

        timeElapsed += dt;
        const arenaRadius = R.getArenaRadius(timeElapsed);
        const stageConfig = R.getStage(timeElapsed);

        // 冷卻與計時更新
        if (playerDashCooldown > 0) playerDashCooldown -= dt;
        if (playerDashTimer > 0) {
          playerDashTimer -= dt;
          if (playerDashTimer <= 0) isPlayerDashing = false;
        }
        if (enemyDashTimer > 0) {
          enemyDashTimer -= dt;
          if (enemyDashTimer <= 0) isEnemyDashing = false;
        }

        const pFont = R.FONTS[selectedFontKey];
        const eFont = R.FONTS[enemyFontKey];

        // 玩家旋轉與自然轉向
        playerTeam.angle += pFont.turnSpeed * dt;
        // 電腦 AI 行為計算（純規則，傳入 timeElapsed 支援示範時間判定）
        const aiUpdate = R.updateAI(enemyTeam, playerTeam, stageConfig, dt, rng, timeElapsed);
        enemyTeam.x = aiUpdate.x;
        enemyTeam.y = aiUpdate.y;
        enemyTeam.vx = aiUpdate.vx;
        enemyTeam.vy = aiUpdate.vy;
        enemyTeam.angle = aiUpdate.angle;
        enemyTeam.dashTimer = aiUpdate.dashTimer;

        if (aiUpdate.shouldDash) {
          isEnemyDashing = true;
          enemyDashTimer = 0.35;
          playSound("dash");
          const dx = playerTeam.x - enemyTeam.x;
          const dy = playerTeam.y - enemyTeam.y;
          const d = Math.hypot(dx, dy) || 1;
          const eSpeed = 190 * (eFont.speed / 80);
          enemyTeam.vx += (dx / d) * eSpeed;
          enemyTeam.vy += (dy / d) * eSpeed;
        }

        // 玩家物理更新
        playerTeam.vx *= Math.exp(-0.25 * dt);
        playerTeam.vy *= Math.exp(-0.25 * dt);
        playerTeam.x += playerTeam.vx * dt;
        playerTeam.y += playerTeam.vy * dt;

        // 計算個別文字頂點在擂台的即時絕對座標
        const pPositions = R.computeGlyphPositions(
          playerTeam.x,
          playerTeam.y,
          playerTeam.angle,
          playerTeam.glyphs.length,
          38
        );
        playerTeam.glyphs.forEach((g, i) => {
          if (!g.out) {
            g.x = pPositions[i].x;
            g.y = pPositions[i].y;
            if (g.hitCooldown > 0) g.hitCooldown -= dt;
            // 檢查出界
            if (R.isOutOfBounds(g.x, g.y, arenaRadius, 24)) {
              g.out = true;
              g.hp = 0;
              playSound("out");
              if (!reducedMotion) {
                for (let k = 0; k < 10; k++) {
                  particles.push({
                    x: g.x,
                    y: g.y,
                    vx: (rng() - 0.5) * 120,
                    vy: (rng() - 0.5) * 120,
                    life: 0.35,
                    color: "#0f0d0a",
                    size: 5,
                  });
                }
              }
            }
          }
        });

        const ePositions = R.computeGlyphPositions(
          enemyTeam.x,
          enemyTeam.y,
          enemyTeam.angle,
          enemyTeam.glyphs.length,
          38
        );
        enemyTeam.glyphs.forEach((g, i) => {
          if (!g.out) {
            g.x = ePositions[i].x;
            g.y = ePositions[i].y;
            if (g.hitCooldown > 0) g.hitCooldown -= dt;
            // 檢查出界
            if (R.isOutOfBounds(g.x, g.y, arenaRadius, 24)) {
              g.out = true;
              g.hp = 0;
              playSound("out");
              if (!reducedMotion) {
                for (let k = 0; k < 10; k++) {
                  particles.push({
                    x: g.x,
                    y: g.y,
                    vx: (rng() - 0.5) * 120,
                    vy: (rng() - 0.5) * 120,
                    life: 0.35,
                    color: "#e63946",
                    size: 5,
                  });
                }
              }
            }
          }
        });

        // 頂點間碰撞檢測
        for (const pg of playerTeam.glyphs) {
          if (pg.out) continue;
          for (const eg of enemyTeam.glyphs) {
            if (eg.out) continue;

            const col = R.checkGlyphCollision(pg, eg, 26, 26);
            if (col.collided && pg.hitCooldown <= 0 && eg.hitCooldown <= 0) {
              pg.hitCooldown = 0.2;
              eg.hitCooldown = 0.2;

              // 計算擊退與衝量（傳入 stageConfig 套用第 1 階質量與抗擊退加成）
              const knock = R.calcKnockback(
                playerTeam,
                enemyTeam,
                pFont,
                eFont,
                col.nx,
                col.ny,
                isPlayerDashing,
                isEnemyDashing,
                stageConfig
              );

              playerTeam.vx += knock.deltaVelA.vx;
              playerTeam.vy += knock.deltaVelA.vy;
              enemyTeam.vx += knock.deltaVelB.vx;
              enemyTeam.vy += knock.deltaVelB.vy;

              pg.hp = Math.max(0, pg.hp - knock.damageA);
              eg.hp = Math.max(0, eg.hp - knock.damageB);

              playSound("hit");
              if (!reducedMotion) {
                screenShake = Math.min(12, screenShake + knock.totalImpulse * 0.05);
                // 產生火花與擊打粒子
                const hitX = (pg.x + eg.x) / 2;
                const hitY = (pg.y + eg.y) / 2;
                for (let m = 0; m < 12; m++) {
                  const angle = rng() * Math.PI * 2;
                  const speed = 70 + rng() * 110;
                  particles.push({
                    x: hitX,
                    y: hitY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 0.28,
                    color: m % 2 === 0 ? "#ffd60a" : "#0f0d0a",
                    size: 4,
                  });
                }
              }
            }
          }
        }

        // 震動衰減
        if (screenShake > 0) {
          screenShake = Math.max(0, screenShake - dt * 25);
        }

        // 粒子更新
        particles.forEach((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
        });
        particles = particles.filter((p) => p.life > 0);

        // 存活統計與勝負判定
        const pLiving = playerTeam.glyphs.filter((g) => !g.out).length;
        const eLiving = enemyTeam.glyphs.filter((g) => !g.out).length;
        const pTotalHp = playerTeam.glyphs.reduce((sum, g) => sum + g.hp, 0);
        const eTotalHp = enemyTeam.glyphs.reduce((sum, g) => sum + g.hp, 0);

        const matchResult = R.evaluateMatchResult(
          pLiving,
          eLiving,
          pTotalHp,
          eTotalHp,
          timeElapsed,
          MAX_TIME
        );

        // 提前獲勝等待期（10 秒內打光顯示「完勝！」，等至第 10 秒結算）
        if (matchResult.pendingWin) {
          pendingWinEl.style.display = "block";
          const remain = Math.max(0, R.MIN_EARLY_WIN_SECONDS - timeElapsed);
          if (pendingWinCountdown) {
            pendingWinCountdown.textContent = remain.toFixed(1);
          }
        } else {
          pendingWinEl.style.display = "none";
        }

        if (matchResult.finished) {
          pendingWinEl.style.display = "none";
          showGameOver(matchResult);
        }

        // HUD 數值更新
        updateHUD(pLiving, eLiving, stageConfig);
      }

      function updateHUD(pLiving, eLiving, stageConfig) {
        const timeRemaining = Math.max(0, MAX_TIME - timeElapsed);
        const timerEl = root.querySelector("#type-timer");
        const timeBar = root.querySelector("#type-time-bar");
        const stageBadge = root.querySelector("#type-stage-badge");

        if (timerEl) timerEl.textContent = timeRemaining.toFixed(1);
        if (timeBar) {
          const pct = Math.max(0, (timeRemaining / MAX_TIME) * 100);
          timeBar.style.width = pct + "%";
        }
        if (stageBadge && stageConfig) {
          stageBadge.textContent = stageConfig.name;
          stageBadge.style.background = stageConfig.stage === 3 ? "#e63946" : stageConfig.stage === 2 ? "#ffd60a" : "#8a948e";
          stageBadge.style.color = stageConfig.stage === 3 ? "#fff" : "#0f0d0a";
        }

        // 示範時間與提示橫幅更新
        if (tipBanner) {
          if (R.isDemoTime(timeElapsed)) {
            tipBanner.textContent = "👆 示範時間：拖曳滑鼠瞄準，3 秒後開放衝刺對撞！";
            tipBanner.style.opacity = "1";
          } else if (timeElapsed < R.DEMO_DURATION + 2.0) {
            tipBanner.textContent = "⚔️ 示範結束！立即發動衝刺，將對手撞出圈外！";
            tipBanner.style.opacity = "1";
          } else {
            tipBanner.style.opacity = "0";
          }
        }

        // 衝刺按鈕冷卻文字
        if (dashBtn) {
          if (R.isDemoTime(timeElapsed)) {
            const rem = Math.max(0, R.DEMO_DURATION - timeElapsed);
            dashBtn.textContent = `示範中 (${rem.toFixed(1)}s)`;
            dashBtn.style.opacity = "0.5";
          } else if (playerDashCooldown > 0.05) {
            dashBtn.textContent = `衝刺 (${playerDashCooldown.toFixed(1)}s)`;
            dashBtn.style.opacity = "0.5";
          } else {
            dashBtn.textContent = "衝刺 (Space)";
            dashBtn.style.opacity = "1";
          }
        }

        // 存活文字狀態
        const pGlyphsEl = root.querySelector("#type-p-glyphs");
        const eGlyphsEl = root.querySelector("#type-e-glyphs");
        if (pGlyphsEl) {
          pGlyphsEl.innerHTML = playerTeam.glyphs
            .map((g) => `<span style="${g.out ? 'color:#8a948e; text-decoration:line-through;' : 'color:#1d4ed8;'}">${g.char}${g.out ? '×' : Math.ceil(g.hp)}</span>`)
            .join(" ");
        }
        if (eGlyphsEl) {
          eGlyphsEl.innerHTML = enemyTeam.glyphs
            .map((g) => `<span style="${g.out ? 'color:#8a948e; text-decoration:line-through;' : 'color:#e63946;'}">${g.char}${g.out ? '×' : Math.ceil(g.hp)}</span>`)
            .join(" ");
        }
      }

      // 繪製擂台與戰鬥實況
      function render() {
        const dpr = window.devicePixelRatio || 1;
        const rect = root.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
        }

        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        // 背景：漫畫紙色
        ctx.fillStyle = "#f4ecd8";
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2 + 10;
        const arenaR = R.getArenaRadius(timeElapsed);
        const scale = Math.min(w, h) / (arenaR * 2.3);

        // 震動偏移
        let ox = 0;
        let oy = 0;
        if (screenShake > 0 && !reducedMotion) {
          ox = (rng() - 0.5) * screenShake;
          oy = (rng() - 0.5) * screenShake;
        }

        ctx.translate(cx + ox, cy + oy);
        ctx.scale(scale, scale);

        // 繪製圓形擂台陰影與本體
        ctx.fillStyle = "#0f0d0a";
        ctx.beginPath();
        ctx.arc(4, 4, arenaR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(0, 0, arenaR, 0, Math.PI * 2);
        ctx.fill();

        // 第 3 階縮圈外圍危險紅框警示
        if (timeElapsed >= 40) {
          ctx.strokeStyle = "#e63946";
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.arc(0, 0, arenaR + 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // 擂台邊線與同心刻度
        ctx.strokeStyle = "#0f0d0a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, arenaR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#8a948e33";
        ctx.lineWidth = 1;
        [0.35, 0.7].forEach((ratio) => {
          ctx.beginPath();
          ctx.arc(0, 0, arenaR * ratio, 0, Math.PI * 2);
          ctx.stroke();
        });

        // 玩家瞄準虛線
        if (phase === "battle") {
          ctx.strokeStyle = "#1d4ed880";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(playerTeam.x, playerTeam.y);
          ctx.lineTo(aimGoal.x, aimGoal.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // 準心圓
          ctx.strokeStyle = "#1d4ed8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(aimGoal.x, aimGoal.y, 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 開局前 3 秒示範時間：畫面示範手勢與瞄準軌跡
        if (phase === "battle" && R.isDemoTime(timeElapsed)) {
          const progress = (timeElapsed % 1.2) / 1.2;
          const gx = playerTeam.x + (enemyTeam.x - playerTeam.x) * (0.2 + progress * 0.6);
          const gy = playerTeam.y + (enemyTeam.y - playerTeam.y) * (0.2 + progress * 0.6);

          ctx.save();
          // 示範軌跡引導虛線
          ctx.strokeStyle = "#e63946bb";
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(playerTeam.x, playerTeam.y);
          ctx.lineTo(enemyTeam.x, enemyTeam.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // 示範手勢圖示
          ctx.font = "26px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("👆", gx, gy);

          // 示範說明字樣
          ctx.font = "bold 12px 'Microsoft JhengHei', sans-serif";
          ctx.fillStyle = "#1d4ed8";
          ctx.fillText("【示範：拖曳瞄準】", gx + 15, gy - 20);
          ctx.restore();
        }

        // 繪製戰隊連結線
        drawTeamLinks(playerTeam, "#1d4ed8");
        drawTeamLinks(enemyTeam, "#e63946");

        // 繪製個別字元圓盤
        const pFont = R.FONTS[selectedFontKey];
        const eFont = R.FONTS[enemyFontKey];

        playerTeam.glyphs.forEach((g) => {
          drawGlyphDisk(g, pFont, "#1d4ed8", "#fff", playerTeam.angle);
        });

        enemyTeam.glyphs.forEach((g) => {
          drawGlyphDisk(g, eFont, "#e63946", "#fff", enemyTeam.angle);
        });

        // 繪製撞擊粒子
        particles.forEach((p) => {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      function drawTeamLinks(team, color) {
        const liveGlyphs = team.glyphs.filter((g) => !g.out);
        if (liveGlyphs.length > 1) {
          ctx.strokeStyle = color + "66";
          ctx.lineWidth = 2;
          ctx.beginPath();
          liveGlyphs.forEach((g, idx) => {
            if (idx === 0) ctx.moveTo(g.x, g.y);
            else ctx.lineTo(g.x, g.y);
          });
          ctx.closePath();
          ctx.stroke();
        }
      }

      function drawGlyphDisk(glyph, fontConfig, borderColor, bgColor, baseAngle) {
        ctx.save();
        ctx.translate(glyph.x, glyph.y);

        if (glyph.out) {
          ctx.globalAlpha = 0.2;
        }

        // 圓盤陰影
        ctx.fillStyle = "#0f0d0a";
        ctx.beginPath();
        ctx.arc(3, 3, 24, 0, Math.PI * 2);
        ctx.fill();

        // 圓盤底色
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fill();

        // 圓盤外邊框
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();

        // 體力弧圈
        if (!glyph.out && glyph.hp < 100) {
          ctx.strokeStyle = "#ffd60a";
          ctx.lineWidth = 3;
          ctx.beginPath();
          const startA = -Math.PI / 2;
          const endA = startA + (Math.PI * 2 * (glyph.hp / 100));
          ctx.arc(0, 0, 21, startA, endA);
          ctx.stroke();
        }

        // 文字繪製（使用規格指定之字型）
        ctx.fillStyle = "#0f0d0a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // 粗體／字重與字型設定
        ctx.font = `${fontConfig.weight} 26px ${fontConfig.fontFamily}`;
        ctx.fillText(glyph.char, 0, 1);

        ctx.restore();
      }

      function loop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
        lastTime = timestamp;

        update(dt);
        render();

        rafId = requestAnimationFrame(loop);
      }

      rafId = requestAnimationFrame(loop);

      // Resize 監聽
      const resizeObserver = new ResizeObserver(() => {
        render();
      });
      resizeObserver.observe(root);

      // 返回 destroy 介面
      return {
        destroy() {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          window.removeEventListener("keydown", onKeyDown);
          canvas.removeEventListener("pointerdown", onPointerDown);
          canvas.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerup", onPointerUp);
          canvas.removeEventListener("pointercancel", onPointerUp);
          dashBtn.removeEventListener("click", triggerPlayerDash);
          startBtn.removeEventListener("click", startGame);

          resizeObserver.disconnect();

          if (audioCtx) {
            try {
              audioCtx.close();
            } catch (e) {}
            audioCtx = null;
          }

          root.innerHTML = "";
        },
      };
    },
  };
})();
