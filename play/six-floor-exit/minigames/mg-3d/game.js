window.EXIT6_MG = window.EXIT6_MG || {};

window.EXIT6_MG["mg-3d"] = {
  title: "3D 列印拼裝",
  skill: "3D 角色與 3D 列印",
  seconds: 60,

  mount(root, api) {
    const R = window.EXIT6_RULES_MG_3D || window.EXIT6_RULES_3D;
    if (!R) {
      console.error("EXIT6_RULES_MG_3D not found.");
      return { destroy() {} };
    }

    if (typeof THREE === "undefined") {
      console.error("Three.js not loaded.");
      return { destroy() {} };
    }

    // 動態狀態
    const LIMIT = api && api.seconds > 0 ? api.seconds : R.TOTAL_TIME; // 派對模式會傳較短秒數
    let state = R.createInitialState({ rng: api && api.rng ? api.rng : Math.random, seconds: LIMIT });
    let isGameOver = false;
    let endedCalled = false;
    let isDropping = false;
    let dropLockUntil = 0;
    let animId = null;
    let timerInterval = null;
    let audioCtx = null;
    let isMuted = false;

    // 視角旋轉限制（斜上 45° ±30° 繞看）
    const BASE_ELEVATION = Math.PI / 4; // 45°
    const BASE_AZIMUTH = Math.PI / 4;   // 45°
    let targetYawOffset = 0;
    let targetPitchOffset = 0;
    let currentYawOffset = 0;
    let currentPitchOffset = 0;
    const MAX_YAW_OFFSET = Math.PI / 6;    // ±30°
    const MAX_PITCH_OFFSET = Math.PI / 12; // ±15°
    let cameraDist = 12.0;

    // 拖曳狀態
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startYawOffset = 0;
    let startPitchOffset = 0;

    // 動畫參數
    let dropProgress = 0; // 0 = 浮空, 1 = 嵌入底座
    let dropTarget = 0;
    let dropBounce = 0;
    let bounceTimer = 0;
    let flashTimer = 0;
    let flashColor = null;

    // 粒子系統（列印完成噴濺火花）
    const particles = [];

    // 音效合成器 (Web Audio API)
    function getAudio() {
      if (isMuted) return null;
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playTone(freq, type, duration, gainVal = 0.15) {
      const ctx = getAudio();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {}
    }

    function playRotateSfx() {
      playTone(520, "triangle", 0.06, 0.12);
    }

    function playSuccessSfx() {
      const ctx = getAudio();
      if (!ctx) return;
      playTone(659.25, "sine", 0.15, 0.2); // E5
      setTimeout(() => playTone(880, "sine", 0.3, 0.25), 100); // A5
    }

    function playWrongSfx() {
      playTone(130.81, "sawtooth", 0.22, 0.22); // C3 low buzz
    }

    function playFanfareSfx() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        setTimeout(() => playTone(f, "triangle", 0.22, 0.2), i * 110);
      });
    }

    // DOM 舞台架構
    root.innerHTML = "";
    root.style.position = "relative";
    root.style.width = "100%";
    root.style.height = "100%";
    root.style.overflow = "hidden";
    root.style.background = "#f4ecd8";
    root.style.userSelect = "none";
    root.style.fontFamily = '"Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif';

    // Three.js 場景與彩現器
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4ecd8);

    const camera = new THREE.PerspectiveCamera(40, root.clientWidth / root.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(root.clientWidth, root.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    root.appendChild(renderer.domElement);

    // 燈光：1 盞方向光 + 1 盞環境光
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(7, 14, 9);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xfcf8ed, 0.6);
    scene.add(ambLight);

    // 建立列印底座 (3D Print Bed)
    const bedGroup = new THREE.Group();
    scene.add(bedGroup);

    // 列印板平台
    const plateGeo = new THREE.BoxGeometry(6.6, 0.35, 6.6);
    const plateMat = new THREE.MeshLambertMaterial({ color: 0x8a948e });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = -1.2;
    bedGroup.add(plateMesh);

    // 黑色邊框線
    const plateEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(plateGeo),
      new THREE.LineBasicMaterial({ color: 0x0f0d0a, linewidth: 2 })
    );
    plateMesh.add(plateEdges);

    // 加熱板格線網格
    const gridHelper = new THREE.GridHelper(6.0, 6, 0x0f0d0a, 0x0f0d0a);
    gridHelper.position.y = -1.02;
    bedGroup.add(gridHelper);

    // 底座四角固定座
    const cornerGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const cornerMat = new THREE.MeshLambertMaterial({ color: 0x0f0d0a });
    const cornerOffsets = [
      [-3.0, -1.35, -3.0],
      [3.0, -1.35, -3.0],
      [-3.0, -1.35, 3.0],
      [3.0, -1.35, 3.0],
    ];
    cornerOffsets.forEach(([cx, cy, cz]) => {
      const cMesh = new THREE.Mesh(cornerGeo, cornerMat);
      cMesh.position.set(cx, cy, cz);
      bedGroup.add(cMesh);
    });

    // 缺口群組 (Recess / Target Slot)
    const recessGroup = new THREE.Group();
    scene.add(recessGroup);

    // 零件群組 (Active Part)
    const partGroup = new THREE.Group();
    partGroup.position.y = 1.6;
    scene.add(partGroup);

    // 粒子群組
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    // 輔助函式：清理 Three.js 群組內部幾何與材質
    function clearMeshGroup(group) {
      while (group.children.length > 0) {
        const child = group.children[0];
        group.remove(child);
        child.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
      }
    }

    // 計算方塊群的包圍中心 (用來居中旋轉與放置)
    function getCenterOffset(blocks) {
      if (!blocks || blocks.length === 0) return { cx: 0, cy: 0, cz: 0 };
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;
      blocks.forEach((b) => {
        if (b.x < minX) minX = b.x;
        if (b.x > maxX) maxX = b.x;
        if (b.y < minY) minY = b.y;
        if (b.y > maxY) maxY = b.y;
        if (b.z < minZ) minZ = b.z;
        if (b.z > maxZ) maxZ = b.z;
      });
      return {
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2,
        cz: (minZ + maxZ) / 2,
      };
    }

    // 建立缺口模型 (底座上的凹槽形狀)
    function rebuildRecess() {
      clearMeshGroup(recessGroup);
      const currentQ = state.questions[state.currentIndex];
      const targetBlocks = currentQ.targetBlocks;
      const offset = getCenterOffset(targetBlocks);

      const cubeSize = 0.94;
      const unitGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const edgeGeo = new THREE.EdgesGeometry(unitGeo);

      targetBlocks.forEach((b) => {
        const mesh = new THREE.Mesh(
          unitGeo,
          new THREE.MeshLambertMaterial({
            color: 0x0f0d0a,
            transparent: true,
            opacity: 0.28,
          })
        );
        mesh.position.set(
          (b.x - offset.cx) * 1.0,
          -1.01 + (b.y - offset.cy) * 1.0,
          (b.z - offset.cz) * 1.0
        );
        const line = new THREE.LineSegments(
          edgeGeo,
          new THREE.LineBasicMaterial({ color: 0x0f0d0a, linewidth: 2 })
        );
        mesh.add(line);
        recessGroup.add(mesh);
      });
    }

    // 建立零件模型 (玩家旋轉的多方塊)
    function rebuildPart() {
      clearMeshGroup(partGroup);
      const blocks = state.currentBlocks;
      const offset = getCenterOffset(blocks);

      const cubeSize = 0.92;
      const unitGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const edgeGeo = new THREE.EdgesGeometry(unitGeo);

      blocks.forEach((b) => {
        const mesh = new THREE.Mesh(
          unitGeo,
          new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }) // 藍色墨水
        );
        mesh.position.set(
          (b.x - offset.cx) * 1.0,
          (b.y - offset.cy) * 1.0,
          (b.z - offset.cz) * 1.0
        );
        const line = new THREE.LineSegments(
          edgeGeo,
          new THREE.LineBasicMaterial({ color: 0x0f0d0a, linewidth: 2 })
        );
        mesh.add(line);
        partGroup.add(mesh);
      });

      // 旋轉反饋微震彈跳
      bounceTimer = 0.15;
    }

    // 噴出成功火花粒子
    function spawnSparks() {
      for (let i = 0; i < 24; i++) {
        const pGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
        const color = Math.random() > 0.4 ? 0xffd60a : 0xe63946; // 黃色與紅色粒子
        const pMat = new THREE.MeshBasicMaterial({ color });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.set(
          (Math.random() - 0.5) * 1.8,
          -0.8 + Math.random() * 0.4,
          (Math.random() - 0.5) * 1.8
        );
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 4.5,
          Math.random() * 4.0 + 2.5,
          (Math.random() - 0.5) * 4.5
        );
        particleGroup.add(pMesh);
        particles.push({ mesh: pMesh, vel, life: 0.65 });
      }
    }

    // 更新鏡頭位置
    function updateCamera() {
      currentYawOffset += (targetYawOffset - currentYawOffset) * 0.18;
      currentPitchOffset += (targetPitchOffset - currentPitchOffset) * 0.18;

      const yaw = BASE_AZIMUTH + currentYawOffset;
      const pitch = BASE_ELEVATION + currentPitchOffset;

      const cy = Math.sin(pitch) * cameraDist;
      const r = Math.cos(pitch) * cameraDist;
      const cx = Math.sin(yaw) * r;
      const cz = Math.cos(yaw) * r;

      camera.position.set(cx, cy, cz);
      camera.lookAt(0, -0.2, 0);
    }

    // UI 疊層
    const uiLayer = document.createElement("div");
    uiLayer.style.position = "absolute";
    uiLayer.style.left = "0";
    uiLayer.style.top = "0";
    uiLayer.style.width = "100%";
    uiLayer.style.height = "100%";
    uiLayer.style.pointerEvents = "none";
    uiLayer.style.display = "flex";
    uiLayer.style.flexDirection = "column";
    uiLayer.style.justifyContent = "space-between";
    uiLayer.style.padding = "12px";
    uiLayer.style.boxSizing = "border-box";
    root.appendChild(uiLayer);

    // 頂部 HUD (標題、難度階級、倒數條、題目進度)
    const topBar = document.createElement("div");
    topBar.style.display = "flex";
    topBar.style.alignItems = "center";
    topBar.style.justifyContent = "space-between";
    topBar.style.gap = "10px";
    topBar.style.background = "#f4ecd8";
    topBar.style.border = "3px solid #0f0d0a";
    topBar.style.boxShadow = "4px 4px 0 #0f0d0a";
    topBar.style.padding = "8px 12px";
    topBar.style.pointerEvents = "auto";
    uiLayer.appendChild(topBar);

    const titleBox = document.createElement("div");
    titleBox.style.display = "flex";
    titleBox.style.alignItems = "center";
    titleBox.style.gap = "8px";

    const titleText = document.createElement("span");
    titleText.textContent = "3D 列印拼裝";
    titleText.style.fontSize = "16px";
    titleText.style.fontWeight = "900";
    titleText.style.color = "#0f0d0a";
    titleBox.appendChild(titleText);

    const tierBadge = document.createElement("span");
    tierBadge.style.fontSize = "12px";
    tierBadge.style.fontWeight = "bold";
    tierBadge.style.padding = "2px 6px";
    tierBadge.style.border = "2px solid #0f0d0a";
    tierBadge.style.background = "#ffd60a";
    tierBadge.style.color = "#0f0d0a";
    tierBadge.style.borderRadius = "2px";
    tierBadge.textContent = "第 1 階";
    titleBox.appendChild(tierBadge);
    topBar.appendChild(titleBox);

    // 進度與倒數計時容器
    const statusBox = document.createElement("div");
    statusBox.style.display = "flex";
    statusBox.style.alignItems = "center";
    statusBox.style.gap = "12px";

    const progressText = document.createElement("span");
    progressText.style.fontSize = "14px";
    progressText.style.fontWeight = "bold";
    progressText.style.color = "#0f0d0a";
    progressText.textContent = "題目: 1 / 5";
    statusBox.appendChild(progressText);

    const timeContainer = document.createElement("div");
    timeContainer.style.display = "flex";
    timeContainer.style.flexDirection = "column";
    timeContainer.style.alignItems = "flex-end";
    timeContainer.style.width = "100px";

    const timeLabel = document.createElement("span");
    timeLabel.style.fontSize = "13px";
    timeLabel.style.fontWeight = "bold";
    timeLabel.style.color = "#e63946";
    timeLabel.textContent = "60.0s";
    timeContainer.appendChild(timeLabel);

    const timeBarTrack = document.createElement("div");
    timeBarTrack.style.width = "100%";
    timeBarTrack.style.height = "6px";
    timeBarTrack.style.background = "#8a948e";
    timeBarTrack.style.border = "1px solid #0f0d0a";
    timeBarTrack.style.overflow = "hidden";

    const timeBarFill = document.createElement("div");
    timeBarFill.style.width = "100%";
    timeBarFill.style.height = "100%";
    timeBarFill.style.background = "#e63946";
    timeBarTrack.appendChild(timeBarFill);
    timeContainer.appendChild(timeBarTrack);

    statusBox.appendChild(timeContainer);
    topBar.appendChild(statusBox);

    // 開場教學示範橫幅 (10秒教會 / 3秒示範動作)
    const hintBanner = document.createElement("div");
    hintBanner.style.alignSelf = "center";
    hintBanner.style.marginTop = "8px";
    hintBanner.style.background = "#ffd60a";
    hintBanner.style.border = "3px solid #0f0d0a";
    hintBanner.style.boxShadow = "4px 4px 0 #0f0d0a";
    hintBanner.style.padding = "6px 14px";
    hintBanner.style.fontSize = "13px";
    hintBanner.style.fontWeight = "bold";
    hintBanner.style.color = "#0f0d0a";
    hintBanner.style.transition = "opacity 0.4s ease";
    hintBanner.textContent = "📐 轉動 X/Y/Z 讓零件與底座凹槽方向吻合，再按「放下」！";
    uiLayer.appendChild(hintBanner);

    // 反饋浮水印標籤 (果汁特效：列印完成 / -3秒)
    const toastLabel = document.createElement("div");
    toastLabel.style.position = "absolute";
    toastLabel.style.left = "50%";
    toastLabel.style.top = "42%";
    toastLabel.style.transform = "translate(-50%, -50%) scale(0.8)";
    toastLabel.style.padding = "10px 20px";
    toastLabel.style.fontSize = "20px";
    toastLabel.style.fontWeight = "900";
    toastLabel.style.border = "3px solid #0f0d0a";
    toastLabel.style.boxShadow = "4px 4px 0 #0f0d0a";
    toastLabel.style.opacity = "0";
    toastLabel.style.pointerEvents = "none";
    toastLabel.style.transition = "opacity 0.25s, transform 0.25s";
    root.appendChild(toastLabel);

    function showToast(text, isError) {
      toastLabel.textContent = text;
      toastLabel.style.background = isError ? "#e63946" : "#ffd60a";
      toastLabel.style.color = isError ? "#f4ecd8" : "#0f0d0a";
      toastLabel.style.opacity = "1";
      toastLabel.style.transform = "translate(-50%, -50%) scale(1.1)";
      setTimeout(() => {
        toastLabel.style.opacity = "0";
        toastLabel.style.transform = "translate(-50%, -50%) scale(0.8)";
      }, 700);
    }

    // 零件旁提示標籤 (第 1 階前兩題答錯時提示：試試看轉 <正確軸> 軸)
    const pieceHintLabel = document.createElement("div");
    pieceHintLabel.style.position = "absolute";
    pieceHintLabel.style.background = "#ffd60a";
    pieceHintLabel.style.color = "#0f0d0a";
    pieceHintLabel.style.border = "3px solid #0f0d0a";
    pieceHintLabel.style.boxShadow = "3px 3px 0 #0f0d0a";
    pieceHintLabel.style.padding = "6px 12px";
    pieceHintLabel.style.fontSize = "13px";
    pieceHintLabel.style.fontWeight = "900";
    pieceHintLabel.style.pointerEvents = "none";
    pieceHintLabel.style.display = "none";
    pieceHintLabel.style.zIndex = "10";
    pieceHintLabel.style.whiteSpace = "nowrap";
    pieceHintLabel.style.transform = "translate(-50%, -100%)";
    uiLayer.appendChild(pieceHintLabel);

    // 畫面冷卻中提示徽章
    const cooldownBadge = document.createElement("div");
    cooldownBadge.style.position = "absolute";
    cooldownBadge.style.left = "50%";
    cooldownBadge.style.bottom = "76px";
    cooldownBadge.style.transform = "translateX(-50%)";
    cooldownBadge.style.background = "#8a948e";
    cooldownBadge.style.color = "#0f0d0a";
    cooldownBadge.style.border = "2px solid #0f0d0a";
    cooldownBadge.style.boxShadow = "2px 2px 0 #0f0d0a";
    cooldownBadge.style.padding = "4px 12px";
    cooldownBadge.style.fontSize = "12px";
    cooldownBadge.style.fontWeight = "bold";
    cooldownBadge.style.display = "none";
    cooldownBadge.style.pointerEvents = "none";
    cooldownBadge.textContent = "⏱ 冷卻中";
    uiLayer.appendChild(cooldownBadge);

    // 視角提示與 GRAYBOX 浮水印
    const infoRow = document.createElement("div");
    infoRow.style.display = "flex";
    infoRow.style.justifyContent = "space-between";
    infoRow.style.alignItems = "flex-end";
    infoRow.style.fontSize = "11px";
    infoRow.style.fontWeight = "bold";
    infoRow.style.color = "#8a948e";
    infoRow.style.marginBottom = "4px";

    const dragTip = document.createElement("span");
    dragTip.textContent = "👆 拖曳畫面可旋轉視角 (±30°)";
    infoRow.appendChild(dragTip);

    const grayboxMark = document.createElement("span");
    grayboxMark.textContent = "GRAYBOX";
    infoRow.appendChild(grayboxMark);
    uiLayer.appendChild(infoRow);

    // 底部 4 顆操作按鈕 (繞 X、繞 Y、繞 Z、放下)
    const buttonRow = document.createElement("div");
    buttonRow.style.display = "flex";
    buttonRow.style.gap = "8px";
    buttonRow.style.pointerEvents = "auto";
    uiLayer.appendChild(buttonRow);

    function createActionButton(label, shortcut, bg, textColor, onClick) {
      const btn = document.createElement("button");
      btn.style.flex = "1";
      btn.style.minHeight = "48px";
      btn.style.minWidth = "48px";
      btn.style.background = bg;
      btn.style.color = textColor;
      btn.style.border = "3px solid #0f0d0a";
      btn.style.boxShadow = "3px 3px 0 #0f0d0a";
      btn.style.borderRadius = "0px";
      btn.style.fontSize = "14px";
      btn.style.fontWeight = "900";
      btn.style.cursor = "pointer";
      btn.style.fontFamily = "inherit";
      btn.style.display = "flex";
      btn.style.flexDirection = "column";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.padding = "4px";
      btn.style.touchAction = "manipulation";

      btn.innerHTML = `<span>${label}</span><span style="font-size:10px;font-weight:normal;opacity:0.8;">[${shortcut}]</span>`;

      btn.addEventListener("pointerdown", () => {
        btn.style.transform = "translate(2px, 2px)";
        btn.style.boxShadow = "1px 1px 0 #0f0d0a";
      });

      const resetBtn = () => {
        btn.style.transform = "none";
        btn.style.boxShadow = "3px 3px 0 #0f0d0a";
      };

      btn.addEventListener("pointerup", resetBtn);
      btn.addEventListener("pointerleave", resetBtn);
      btn.addEventListener("click", () => {
        if (hintBanner.parentNode) hintBanner.style.opacity = "0";
        onClick();
      });

      return btn;
    }

    const btnX = createActionButton("轉 X 軸", "X", "#e63946", "#f4ecd8", () => handleRotate("X"));
    const btnY = createActionButton("轉 Y 軸", "Y", "#ffd60a", "#0f0d0a", () => handleRotate("Y"));
    const btnZ = createActionButton("轉 Z 軸", "Z", "#1d4ed8", "#f4ecd8", () => handleRotate("Z"));
    const btnDrop = createActionButton("📥 放下", "空白鍵", "#f4ecd8", "#0f0d0a", () => handleDrop());
    btnDrop.style.flex = "1.3";
    btnDrop.style.background = "#f4ecd8";

    buttonRow.appendChild(btnX);
    buttonRow.appendChild(btnY);
    buttonRow.appendChild(btnZ);
    buttonRow.appendChild(btnDrop);

    function updateDropButtonState() {
      const now = performance.now();
      const locked = !R.canDrop(now, dropLockUntil);
      if (locked) {
        btnDrop.style.background = "#8a948e";
        btnDrop.style.color = "#0f0d0a";
        btnDrop.style.opacity = "0.75";
        btnDrop.style.cursor = "not-allowed";
        btnDrop.innerHTML = `<span>⏳ 冷卻中</span><span style="font-size:10px;font-weight:normal;opacity:0.8;">[鎖定]</span>`;
        cooldownBadge.style.display = "block";
      } else {
        btnDrop.style.background = "#f4ecd8";
        btnDrop.style.color = "#0f0d0a";
        btnDrop.style.opacity = "1";
        btnDrop.style.cursor = "pointer";
        btnDrop.innerHTML = `<span>📥 放下</span><span style="font-size:10px;font-weight:normal;opacity:0.8;">[空白鍵]</span>`;
        cooldownBadge.style.display = "none";
      }
    }

    function refreshTier1Hint() {
      if (state.currentIndex === 0 || state.currentIndex === 1) {
        const curQ = state.questions[state.currentIndex];
        const axis = R.hintAxis(state.currentBlocks, curQ.targetBlocks);
        if (axis) {
          pieceHintLabel.textContent = `試試看轉 ${axis.toUpperCase()} 軸`;
          pieceHintLabel.style.display = "block";
        } else {
          pieceHintLabel.style.display = "none";
        }
      } else {
        pieceHintLabel.style.display = "none";
      }
    }

    // 旋轉動作處理
    function handleRotate(axis) {
      if (isGameOver || isDropping) return;
      playRotateSfx();
      state = R.rotateCurrent(state, axis);
      rebuildPart();
      if (pieceHintLabel.style.display !== "none") {
        refreshTier1Hint();
      }
    }

    // 放下動作處理
    function handleDrop() {
      const now = performance.now();
      if (isGameOver || isDropping || !R.canDrop(now, dropLockUntil)) return;
      isDropping = true;
      dropTarget = 1; // 開始向下嵌入
    }

    // 觸控與滑鼠拖曳視角控制
    const domEl = renderer.domElement;
    function onPointerDown(e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      startYawOffset = targetYawOffset;
      startPitchOffset = targetPitchOffset;
      domEl.setPointerCapture(e.pointerId);
      if (hintBanner.parentNode) hintBanner.style.opacity = "0";
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const dx = (e.clientX - dragStartX) * 0.006;
      const dy = (e.clientY - dragStartY) * 0.005;

      targetYawOffset = Math.max(-MAX_YAW_OFFSET, Math.min(MAX_YAW_OFFSET, startYawOffset + dx));
      targetPitchOffset = Math.max(-MAX_PITCH_OFFSET, Math.min(MAX_PITCH_OFFSET, startPitchOffset - dy));
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      try {
        domEl.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    domEl.addEventListener("pointerdown", onPointerDown);
    domEl.addEventListener("pointermove", onPointerMove);
    domEl.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("pointercancel", onPointerUp);

    // 鍵盤快捷鍵
    function onKeyDown(e) {
      if (isGameOver) return;
      const key = e.key.toLowerCase();
      if (key === "x") handleRotate("X");
      else if (key === "y") handleRotate("Y");
      else if (key === "z") handleRotate("Z");
      else if (key === " " || key === "enter") {
        e.preventDefault();
        handleDrop();
      }
    }
    window.addEventListener("keydown", onKeyDown);

    // 畫面震動果汁
    function triggerScreenShake() {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;
      root.style.transform = "translate(4px, -3px)";
      setTimeout(() => (root.style.transform = "translate(-3px, 3px)"), 60);
      setTimeout(() => (root.style.transform = "translate(2px, -2px)"), 120);
      setTimeout(() => (root.style.transform = "none"), 200);
    }

    // 結束畫面展示
    function showEndDialog(win) {
      if (endedCalled) return;
      endedCalled = true;
      isGameOver = true;

      if (win) playFanfareSfx();
      else playWrongSfx();

      if (api && typeof api.onEnd === "function") {
        api.onEnd({ win, score: state.score });
      }

      const modalOverlay = document.createElement("div");
      modalOverlay.style.position = "absolute";
      modalOverlay.style.left = "0";
      modalOverlay.style.top = "0";
      modalOverlay.style.width = "100%";
      modalOverlay.style.height = "100%";
      modalOverlay.style.background = "rgba(15, 13, 10, 0.75)";
      modalOverlay.style.display = "flex";
      modalOverlay.style.alignItems = "center";
      modalOverlay.style.justifyContent = "center";
      modalOverlay.style.padding = "16px";
      modalOverlay.style.boxSizing = "border-box";
      modalOverlay.style.zIndex = "100";
      root.appendChild(modalOverlay);

      const modalCard = document.createElement("div");
      modalCard.style.background = "#f4ecd8";
      modalCard.style.border = "3px solid #0f0d0a";
      modalCard.style.boxShadow = "6px 6px 0 #0f0d0a";
      modalCard.style.maxWidth = "420px";
      modalCard.style.width = "100%";
      modalCard.style.padding = "20px";
      modalCard.style.textAlign = "center";
      modalCard.style.color = "#0f0d0a";
      modalOverlay.appendChild(modalCard);

      const modalTitle = document.createElement("h2");
      modalTitle.style.fontSize = "24px";
      modalTitle.style.fontWeight = "900";
      modalTitle.style.marginBottom = "8px";
      modalTitle.style.color = win ? "#1d4ed8" : "#e63946";
      modalTitle.textContent = win ? "🎉 列印成功！完美吻合！" : "⏱ 時間到！列印中止";
      modalCard.appendChild(modalTitle);

      const scoreText = document.createElement("p");
      scoreText.style.fontSize = "16px";
      scoreText.style.fontWeight = "bold";
      scoreText.style.marginBottom = "14px";
      scoreText.textContent = `完成題數：${state.score} / ${state.targetQuestions} 題`;
      modalCard.appendChild(scoreText);

      const knowledgeBox = document.createElement("div");
      knowledgeBox.style.background = "#ffd60a";
      knowledgeBox.style.border = "2px solid #0f0d0a";
      knowledgeBox.style.padding = "10px";
      knowledgeBox.style.fontSize = "13px";
      knowledgeBox.style.fontWeight = "bold";
      knowledgeBox.style.lineHeight = "1.5";
      knowledgeBox.style.marginBottom = "4px";
      knowledgeBox.style.textAlign = "left";
      knowledgeBox.textContent =
        "這就是 3D 角色與 3D 列印在做的事：3D 建模要想清楚物件的方向與軸向，3D 列印前要擺好「列印方向」才不會失敗。";
      modalCard.appendChild(knowledgeBox);
    }

    // 重新更新 HUD
    function updateHUD() {
      const q = state.questions[state.currentIndex] || state.questions[state.questions.length - 1];
      tierBadge.textContent = `第 ${q.tier} 階`;
      if (q.tier === 1) tierBadge.style.background = "#ffd60a";
      else if (q.tier === 2) tierBadge.style.background = "#1d4ed8", tierBadge.style.color = "#f4ecd8";
      else tierBadge.style.background = "#e63946", tierBadge.style.color = "#f4ecd8";

      progressText.textContent = `題目: ${Math.min(state.currentIndex + 1, state.targetQuestions)} / ${state.targetQuestions}`;
      timeLabel.textContent = `${state.timeRemaining.toFixed(1)}s`;

      const pct = Math.max(0, Math.min(100, (state.timeRemaining / LIMIT) * 100));
      timeBarFill.style.width = `${pct}%`;
      if (pct < 25) timeBarFill.style.background = "#e63946";
      else if (pct < 50) timeBarFill.style.background = "#ffd60a";
      else timeBarFill.style.background = "#1d4ed8";
    }

    // 建立初始題目模型
    rebuildRecess();
    rebuildPart();
    updateHUD();

    // 倒數計時主迴圈 (每秒 tick)
    let lastTime = performance.now();
    timerInterval = setInterval(() => {
      if (isGameOver) return;
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      state = R.tick(state, dt);
      updateHUD();

      if (state.isGameOver) {
        showEndDialog(state.isWin);
      }
    }, 100);

    // 主動畫渲染迴圈 (RequestAnimationFrame)
    function renderLoop(time) {
      animId = requestAnimationFrame(renderLoop);

      updateCamera();
      updateDropButtonState();

      // 更新提示標籤位置（跟隨零件 3D 投影位置）
      if (pieceHintLabel.style.display !== "none") {
        const v = new THREE.Vector3();
        partGroup.getWorldPosition(v);
        v.x += 1.3;
        v.y += 0.9;
        v.project(camera);
        const rect = root.getBoundingClientRect();
        const w = rect.width || root.clientWidth || 300;
        const h = rect.height || root.clientHeight || 200;
        const sx = (v.x * 0.5 + 0.5) * w;
        const sy = (-v.y * 0.5 + 0.5) * h;
        pieceHintLabel.style.left = `${Math.max(60, Math.min(w - 70, sx))}px`;
        pieceHintLabel.style.top = `${Math.max(40, Math.min(h - 100, sy))}px`;
      }

      // 下放動畫插值
      if (isDropping) {
        dropProgress += 0.16;
        if (dropProgress >= 1) {
          dropProgress = 1;
          // 到達底座，判定吻合度
          const wasCorrect = R.areShapesEqual(
            state.currentBlocks,
            state.questions[state.currentIndex].targetBlocks
          );
          state = R.submitCurrent(state);

          if (wasCorrect) {
            playSuccessSfx();
            spawnSparks();
            showToast("✔ 列印完成！", false);

            if (state.isGameOver) {
              updateHUD();
              showEndDialog(true);
            } else {
              // 進入下一題
              pieceHintLabel.style.display = "none";
              setTimeout(() => {
                dropProgress = 0;
                isDropping = false;
                rebuildRecess();
                rebuildPart();
                updateHUD();
              }, 450);
            }
          } else {
            // 答錯扣 2 秒
            playWrongSfx();
            triggerScreenShake();
            showToast("✖ 角度不合！扣 2 秒", true);
            updateHUD();

            // 鎖定 1 秒：放下按鈕變灰、空白鍵無效，轉軸按鈕隨時可用
            dropLockUntil = performance.now() + 1000;
            updateDropButtonState();

            // 第 1 階前兩題答錯時在零件旁顯示提示
            if (state.currentIndex === 0 || state.currentIndex === 1) {
              refreshTier1Hint();
            }

            if (state.isGameOver) {
              showEndDialog(false);
            } else {
              // 零件立刻彈回浮空原位，確保轉軸按鈕立即可用
              dropProgress = 0;
              isDropping = false;
            }
          }
        }
      }

      // 計算零件 Y 座標位置 (浮空 1.6 -> 凹槽 -1.01)
      const hoverY = 1.6;
      const slotY = -1.01;
      partGroup.position.y = hoverY + (slotY - hoverY) * dropProgress;

      // 方塊縮放彈跳
      if (bounceTimer > 0) {
        bounceTimer -= 0.016;
        const scale = 1.0 + Math.sin(bounceTimer * Math.PI * 15) * 0.12;
        partGroup.scale.set(scale, scale, scale);
      } else {
        partGroup.scale.set(1, 1, 1);
      }

      // 粒子更新
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.02;
        p.mesh.position.addScaledVector(p.vel, 0.016);
        p.vel.y -= 9.8 * 0.016; // 重力
        if (p.life <= 0) {
          particleGroup.remove(p.mesh);
          p.mesh.geometry.dispose();
          p.mesh.material.dispose();
          particles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(renderLoop);

    // 視窗自適應縮放
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          // 若為手機窄螢幕，拉遠相機距離以完整呈現
          if (w < 480) cameraDist = 15.0;
          else if (w < 768) cameraDist = 13.5;
          else cameraDist = 12.0;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(root);

    // 清理資源函式 (驗收條件：destroy() 後 root 是空的，無殘留事件與計時器)
    function cleanup() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      window.removeEventListener("keydown", onKeyDown);
      domEl.removeEventListener("pointerdown", onPointerDown);
      domEl.removeEventListener("pointermove", onPointerMove);
      domEl.removeEventListener("pointerup", onPointerUp);
      domEl.removeEventListener("pointercancel", onPointerUp);

      resizeObserver.disconnect();

      // 釋放 Three.js 資源
      clearMeshGroup(recessGroup);
      clearMeshGroup(partGroup);
      clearMeshGroup(bedGroup);
      clearMeshGroup(particleGroup);

      if (plateGeo) plateGeo.dispose();
      if (plateMat) plateMat.dispose();
      if (cornerGeo) cornerGeo.dispose();
      if (cornerMat) cornerMat.dispose();

      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      if (audioCtx) {
        try {
          audioCtx.close();
        } catch (e) {}
        audioCtx = null;
      }

      root.innerHTML = "";
    }

    return {
      destroy: cleanup,
    };
  },
};
