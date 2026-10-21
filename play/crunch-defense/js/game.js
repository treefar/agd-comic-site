/* ============================================================
 * 《死線防衛隊》核心邏輯
 * 狀態機：title → playing(prep/wave) → perk/victory/defeat
 * ============================================================ */
'use strict';
var CD = window.CD || (window.CD = {});

CD.Game = (function () {
  const CFG = CD.CONFIG;

  const G = {
    state: 'title',        // title | levelselect | playing | victory | defeat
    mode: 'campaign',      // campaign | endless
    levelIdx: 0,           // 戰役 2.0：目前關卡（CD.LEVELS 索引）
    phase: 'prep',         // prep | wave
    prepLeft: 0,
    waveIdx: 0,            // 0-based（關內波次）
    cycle: 1,              // 無盡循環
    scale: 1,
    coreHp: CFG.CORE_HP,
    dp: CFG.START_DP,
    musou: 0,
    speed: 1,
    paused: false,
    modalPause: false,     // CG／教學／佈展等演出完整凍結戰鬥時間
    time: 0,
    waveTime: 0,
    spawnQueue: [],
    towers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    dmgNums: [],
    banner: null,          // {title, sub, t, dur}
    musouFx: 0,
    cutin: null,           // {ids, title, color, t, dur} 立繪演出（4張=通宵爆發、2張=吵架組合技）
    feuds: [],             // 吵架配對（相鄰隊友內耗系統）
    coreShake: 0,
    coreScratch: 0,
    shake: { t: 0, mag: 0 },   // 全域屏震（render 對整個畫布位移）
    hitstop: 0,                // 頓幀：大事件時凍結戰鬥若干毫秒
    slowmo: null,              // {t, mul} 慢動作（Boss 登場、組合技演出）
    hitCombo: 0, hitComboT: 0, // 連續命中計數（命中音高遞進）
    selectedTile: -1,
    selectedTower: -1,
    hoverTile: -1,
    perkChoices: null,
    perkTaken: [],
    legacyChoices: null,
    activeLegacy: null,
    tutorialGate: false,
    tutorialComboCast: false,
    tutorialComboPrompted: false,
    cardTears: 0,
    buffs: null,
    stats: { kills: 0, leaks: 0, deployed: 0 },
    campaignCleared: false
  };

  /* ---------- 工具 ---------- */
  function resetBuffs() {
    G.buffs = {
      atkSpeedMul: 1, keyboardEvery: 0, copyChance: 0, copyFactor: 0.7,
      armorBreak: 0, coreDmgReduction: 0, damageMul: 1,
      tiredGrace: 0, waveEvery: 0, feudStart: 0, bigpieDp: 0
    };
    G.nextWaveMod = null;      // 會議決策的代價：{extra:[groups], hpMul}
    G.deployBlocked = false;   // 重構之錘：本波禁部署
  }

  /* ---------- 爆肝系統（支柱②）：連續作戰累積、休息或準備期恢復 ---------- */
  const TIRED_AT = 45;         // workT 超過即爆肝
  const TIRED_DEBUFF = 0.8;    // 爆肝輸出倍率（與吵架 debuff 疊乘）
  function isTired(t) { return t.workT >= TIRED_AT + (G.buffs.tiredGrace || 0); }
  function updateTired(dt) {
    G.towers.forEach(function (t) {
      if (G.phase === 'wave') t.workT += dt;
      else t.workT = Math.max(0, t.workT - dt * 2.5);   // 波間喘息恢復
      const tired = isTired(t);
      if (tired && !t.tiredNotified) {
        t.tiredNotified = true;
        addDmgNum(t.x, t.y - 24, '爆肝了…', '#8a94b8');
      }
      if (!tired) t.tiredNotified = false;
    });
  }
  function dist(ax, ay, bx, by) { const dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
  function routePos(route, seg, t) {
    const a = CD.MAP.routes[route][seg], b = CD.MAP.routes[route][seg + 1];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }
  function segLen(route, seg) {
    const a = CD.MAP.routes[route][seg], b = CD.MAP.routes[route][seg + 1];
    return dist(a.x, a.y, b.x, b.y);
  }

  /* ---------- 戰役進度存檔 ---------- */
  function loadProgress() {
    try {
      const p = JSON.parse(localStorage.getItem('cd_progress') || 'null');
      if (p && typeof p.unlocked === 'number') {
        if (!p.stars || typeof p.stars !== 'object') p.stars = {};
        return p;
      }
    } catch (e) {}
    return { unlocked: 1, stars: {} };
  }
  function saveProgress(p) {
    try { localStorage.setItem('cd_progress', JSON.stringify(p)); } catch (e) {}
  }
  function totalStars() {
    const p = loadProgress();
    return Object.keys(p.stars || {}).reduce(function (sum, k) { return sum + (Number(p.stars[k]) || 0); }, 0);
  }
  function musouMax() { return totalStars() >= 20 ? 90 : CFG.MUSOU_MAX; }
  function consumeLegacy() {
    // 只讀不刪：戰敗重試同一關時傳承仍然生效（選出新傳承時自然覆寫）
    let id = null;
    try { id = localStorage.getItem('cd_legacy_next'); } catch (e) {}
    return CD.LEGACIES.find(function (x) { return x.id === id; }) || null;
  }
  function applyRunBonuses() {
    const stars = totalStars();
    if (stars >= 10) G.dp += 2;
    const l = G.activeLegacy;
    if (!l) return;
    if (l.startDp) G.dp += l.startDp;
    if (l.startMusou) G.musou = Math.min(musouMax(), G.musou + l.startMusou);
    if (l.atkSpeedMul) G.buffs.atkSpeedMul *= l.atkSpeedMul;
    if (l.tiredGrace) G.buffs.tiredGrace += l.tiredGrace;
    if (l.damageMul) G.buffs.damageMul *= l.damageMul;
    if (l.coreReduction) G.buffs.coreDmgReduction = Math.min(0.75, G.buffs.coreDmgReduction + l.coreReduction);
    if (l.waveEvery) G.buffs.waveEvery = l.waveEvery;
    if (l.feudStart) G.buffs.feudStart = l.feudStart;
  }

  /* ---------- 流程控制 ---------- */
  /* 目前使用的波次表：戰役=該關 waves、無盡=經典 10 波循環 */
  function currentWaves() {
    return G.mode === 'campaign' ? CD.LEVELS[G.levelIdx].waves : CD.WAVES;
  }
  function levelHpMul() {
    return G.mode === 'campaign' ? (CD.LEVELS[G.levelIdx].hpMul || 1) : 1;
  }
  function levelCoreDmgMul() {
    return G.mode === 'campaign' ? (CD.LEVELS[G.levelIdx].coreDmgMul || 1) : 1;
  }
  function startLevel(idx) {
    G.mode = 'campaign';
    G.levelIdx = idx;
    CD.useMapProfile(CD.LEVELS[idx].bg);
    CD.Render.setBg(CD.LEVELS[idx].bg);   // null＝現行手繪 BG
    beginRun();
  }
  function startEndless() {
    G.mode = 'endless';
    CD.useMapProfile(null);
    CD.Render.setBg(null);
    beginRun();
  }
  function beginRun() {
    G.state = 'playing'; G.phase = 'prep';
    G.waveIdx = 0; G.cycle = 1; G.scale = 1;
    G.coreHp = CFG.CORE_HP; G.musou = 0;
    // 關卡可覆寫開局 DP（目前只有 L7 佈展儀式需要）
    G.dp = (G.mode === 'campaign' && CD.LEVELS[G.levelIdx] && CD.LEVELS[G.levelIdx].startDp) || CFG.START_DP;
    G.speed = 1; G.paused = false; G.modalPause = false; G.time = 0;
    G.towers = []; G.enemies = []; G.projectiles = [];
    G.particles = []; G.dmgNums = [];
    G.feuds = []; G.cutin = null;
    G.selectedTile = -1; G.selectedTower = -1;
    G.perkChoices = null; G.perkTaken = []; G.legacyChoices = null;
    G.stats = { kills: 0, leaks: 0, deployed: 0 };
    G.waveHpMul = 1; G.blockedTiles = {}; G.cardTears = 0; G.waveBudgetCut = false;
    resetBuffs();
    G.activeLegacy = G.mode === 'campaign' ? consumeLegacy() : null;
    applyRunBonuses();
    G.tutorialGate = false; G.tutorialComboCast = false; G.tutorialComboPrompted = false;
    G.zeroSecondUsed = false;
    G.prepLeft = CFG.PREP_TIME;
    const w = currentWaves()[0];
    const head = G.mode === 'campaign'
      ? CD.LEVELS[G.levelIdx].name + '・' + w.name
      : w.week + '・' + w.name;
    setBanner(head, w.intro, 4.5);
    CD.UI.syncAll();
    CD.Audio.playBgm('bgm_prep');
    if (G.activeLegacy) CD.UI.toast('本關傳承：' + G.activeLegacy.name + ' 生效');
  }

  function setBanner(title, sub, dur) { G.banner = { title: title, sub: sub, t: 0, dur: dur || 3 }; }

  function startWave(manual) {
    if (G.state !== 'playing' || G.phase !== 'prep' || G.paused) return;
    // 教學關第二波必須先做出一組相鄰異職種，讓核心機制不是可忽略的說明文字。
    if (G.mode === 'campaign' && G.levelIdx === 0 && G.waveIdx === 1 && G.feuds.length === 0) {
      G.prepLeft = Math.max(0.5, G.prepLeft);
      G.tutorialGate = true;
      setBanner('先吵一架，才能開波', '請把兩位不同職種部署在相鄰格；發亮格會替你找位置。', 2.8);
      CD.UI.toast('第二波鎖定：先做出一組「吵架搭檔」');
      CD.Audio.play('denied');
      return false;
    }
    G.tutorialGate = false;
    // 零秒出手：準備時間剩不到 1 秒才手動開波＝壓線上傳的獎勵（嘲諷成就化）
    if (manual && G.prepLeft > 0) {
      // 提早開波不犧牲休息：一次結算尚未經過的準備期恢復，移除「等滿 12 秒」最優解。
      G.towers.forEach(function (t) { t.workT = Math.max(0, t.workT - G.prepLeft * 2.5); });
    }
    // 獎勵推進而非發呆：真正提早開波（剩 4 秒以上）每波 +1 DP
    if (manual && G.prepLeft > 4) {
      G.dp += 1;
      CD.UI.toast('提前開工 +1 DP');
      addDmgNum(CD.MAP.core.x, CD.MAP.core.y - 50, '+1 DP', '#ffd23f');
    } else if (manual && !G.zeroSecondUsed && G.prepLeft > 0 && G.prepLeft < 1) {
      G.zeroSecondUsed = true;
      CD.UI.toast('零秒出手！壓線上傳的膽識（成就）');
    }
    G.phase = 'wave'; G.waveTime = 0; G.waveBudgetCut = false;
    G.spawnQueue = [];
    const WV = currentWaves();
    const w = WV[G.waveIdx % WV.length];
    // 會議決策代價：本波額外敵人／HP 強化
    const mod = G.nextWaveMod; G.nextWaveMod = null;
    G.waveHpMul = (mod && mod.hpMul) || 1;
    let groups = w.groups;
    if (mod && mod.extra) groups = groups.concat(mod.extra);
    groups.forEach(function (g) {
      const id = g[0], count = g[1], delay = g[2], gap = g[3], route = g[4];
      for (let i = 0; i < count; i++) {
        const r = route < 0 ? Math.floor(Math.random() * CD.MAP.routes.length) : route;
        G.spawnQueue.push({ t: delay + i * gap, id: id, route: r });
      }
    });
    G.spawnQueue.sort(function (a, b) { return a.t - b.t; });
    CD.Audio.play('waveStart');
    CD.Audio.playBgm('bgm_wave');
    CD.UI.syncAll();
    return true;
  }

  function waveCleared() {
    CD.Audio.play('waveClear');
    CD.Audio.playBgm('bgm_prep');
    if (G.lastStandPending) { G.lastStandPending = false; CD.UI.triggerCG('laststand'); }
    G.deployBlocked = false;   // 重構之錘的禁部署只影響單波
    // 預算主任在場：波獎勵減半
    const calcHere = !!G.waveBudgetCut;
    const legacyBonus = G.buffs.waveEvery && ((G.waveIdx + 1) % G.buffs.waveEvery === 0) ? 1 : 0;
    const baseReward = CFG.DP_PER_WAVE + legacyBonus + (G.buffs.bigpieDp || 0);
    const reward = calcHere ? Math.ceil(baseReward / 2) : baseReward;
    G.dp += reward;
    if (calcHere) CD.UI.toast('預算主任在場——本波獎勵被砍半');
    G.stats.wavesDone = (G.stats.wavesDone || 0) + 1;
    const WV = currentWaves();
    const clearedNo = G.waveIdx + 1;

    if (G.mode === 'campaign' && clearedNo >= WV.length) { levelCleared(); return; }

    const total = (G.cycle - 1) * WV.length + clearedNo;
    G.waveIdx++;
    if (G.waveIdx >= WV.length) { // 無盡：循環＋成長
      G.waveIdx = 0; G.cycle++;
      G.scale = Math.pow(CFG.ENDLESS_SCALE, G.cycle - 1);
    }
    G.phase = 'prep'; G.prepLeft = CFG.PREP_TIME;
    G.tutorialGate = G.mode === 'campaign' && G.levelIdx === 0 && G.waveIdx === 1 && G.feuds.length === 0;
    const w = WV[G.waveIdx];
    setBanner('過關！＋' + reward + ' 部署點', '下一波：' + (w.week ? w.week + '・' : '') + w.name, 3);

    if (total % CFG.REWARD_EVERY === 0) openPerks();
    CD.UI.syncAll();
  }

  /* ---------- 戰役 2.0：關卡通過 ---------- */
  function levelCleared() {
    const expo = G.levelIdx === 7 || G.levelIdx === 8;
    // expo 關門檻 65：官方熟練基準（L7 65／L8 60 HP）要摸得到三星，30 星結局才是可達內容。
    const stars = expo
      ? (G.coreHp >= 65 && G.stats.leaks <= 8 ? 3 : (G.coreHp >= 40 && G.stats.leaks <= 12 ? 2 : 1))
      : (G.coreHp >= 75 ? 3 : (G.coreHp >= 40 ? 2 : 1));
    const prog = loadProgress();
    prog.stars[G.levelIdx] = Math.max(prog.stars[G.levelIdx] || 0, stars);
    prog.unlocked = Math.max(prog.unlocked, G.levelIdx + 2);
    saveProgress(prog);
    if (G.levelIdx >= CD.LEVELS.length - 1) { victory(); return; }   // L9＝全戰役通關
    G.state = 'levelselect';
    CD.Audio.play('victory');
    CD.Audio.playSting('sting_win');
    CD.UI.showLevelClear(stars);
  }

  function offerLegacy() {
    if (G.mode !== 'campaign' || G.levelIdx >= CD.LEVELS.length - 1) {
      G.state = 'levelselect'; CD.UI.showLevelSelect(); return;
    }
    const bag = CD.LEGACIES.slice();
    G.legacyChoices = [];
    while (G.legacyChoices.length < 3 && bag.length) {
      G.legacyChoices.push(bag.splice(Math.floor(Math.random() * bag.length), 1)[0]);
    }
    CD.UI.showLegacy(G.legacyChoices);
  }
  function pickLegacy(id) {
    if (!G.legacyChoices || !G.legacyChoices.some(function (x) { return x.id === id; })) return;
    try { localStorage.setItem('cd_legacy_next', id); } catch (e) {}
    G.legacyChoices = null;
    CD.UI.hideLegacy();
    G.state = 'levelselect';
    CD.UI.showLevelSelect();
  }

  function victory() {
    G.state = 'victory';
    CD.Audio.play('victoryFinal');   // 全戰役收束：合成長樂句＋真樂器 jingle 疊加
    CD.Audio.playSting('sting_win');
    // 最後一張暖色 CG 先收束整段戰役，再揭示結局。
    const finish = function () {
      // 30 星後解鎖最佳結局；否則主機殘血 <25 ＝低空飛過。
      const kind = totalStars() >= 30 ? 'perfect' : (G.coreHp < 25 ? 'barely' : 'win');
      CD.UI.showEnd(kind);
    };
    // 先判斷並排入首次晨光，再寫 cleared；否則舊存檔回溯會搶先標成已解鎖而漏播。
    const queuedDawn = CD.UI.triggerCG('dawn', finish);
    G.campaignCleared = true;
    try { localStorage.setItem('cd_campaign_cleared', '1'); } catch (e) {}
    if (!queuedDawn) finish();
  }
  function defeat() {
    G.state = 'defeat';
    CD.Audio.play('defeat');
    CD.Audio.playSting('sting_lose');
    // 無盡模式撐滿 3 輪才倒＝成為傳說
    CD.UI.showEnd(G.mode === 'endless' && G.cycle >= 3 ? 'legend' : 'lose');
  }

  /* ---------- 三選一 ---------- */
  function openPerks() {
    const pool = CD.PERKS.filter(function (p) {
      return p.stack || p.instant || G.perkTaken.indexOf(p.id) < 0;
    });
    const picks = [];
    const bag = pool.slice();
    while (picks.length < 3 && bag.length > 0) {
      picks.push(bag.splice(Math.floor(Math.random() * bag.length), 1)[0]);
    }
    G.perkChoices = picks;
    CD.Audio.play('perkOpen');
    CD.UI.showPerks(picks);
  }
  function pickPerk(id) {
    const p = CD.PERKS.find(function (x) { return x.id === id; });
    if (!p || !G.perkChoices) return;
    p.apply(G.buffs, API);
    if (!p.instant || p.stack === false) G.perkTaken.push(p.id);   // stack:false 的 instant（如畫大餅）一場只出現一次
    G.perkChoices = null;
    CD.Audio.play('perkPick');
    CD.UI.hidePerks();
    CD.UI.syncAll();
  }

  /* ---------- 吵架爆氣（招牌系統） ---------- */
  const FC = CD.FEUD_CFG;
  function feudKey(typeA, typeB) {
    if (typeA === typeB) return null;                       // 同職種不吵
    const order = CD.SPECIALIST_ORDER;
    return order.indexOf(typeA) < order.indexOf(typeB)
      ? typeA + '_' + typeB : typeB + '_' + typeA;
  }
  function towerAt(tileIdx) {
    return G.towers.find(function (t) { return t.tile === tileIdx; }) || null;
  }
  /* 部署／移除後重算相鄰配對；同 key 保留既有充能 */
  function rebuildFeuds() {
    const before = G.feuds.length;
    const old = {};
    G.feuds.forEach(function (f) { old[f.key] = f; });
    const next = [], used = {};
    for (let i = 0; i < G.towers.length; i++) {
      for (let j = i + 1; j < G.towers.length; j++) {
        const a = G.towers[i], b = G.towers[j];
        if (dist(a.x, a.y, b.x, b.y) > FC.ADJ_DIST) continue;
        const key = feudKey(a.type, b.type);
        if (!key || used[key] || !CD.FEUDS[key]) continue;  // 一個配對種類只取一組
        used[key] = true;
        const f = old[key] || {
          key: key, def: CD.FEUDS[key], charge: 0,
          quarreling: false, quarrelT: 0,
          nextQuarrel: FC.QUARREL_MIN + Math.random() * (FC.QUARREL_MAX - FC.QUARREL_MIN),
          lineSet: 0, lineT: 0
        };
        if (!old[key] && G.buffs.feudStart) f.charge = G.buffs.feudStart;
        // 沒意見教授在場：每隻只送「一組」滿槽反擊，不能靠拆建連刷。
        if (!old[key]) {
          const nod = G.enemies.find(function (e) { return !e.dead && e.def.comboDismiss && !e.comboGranted; });
          if (nod) { f.charge = FC.MAX; nod.comboGranted = true; }
        }
        if (!old[key] && G.mode === 'campaign' && G.levelIdx === 0) {
          f.charge = Math.max(f.charge, 82);
          f.nextQuarrel = Math.min(f.nextQuarrel, 0.35);
        }
        f.tileA = a.tile; f.tileB = b.tile;
        next.push(f);
      }
    }
    G.feuds = next;
    if (G.feuds.length > 0) {
      G.tutorialGate = false;
      if (before === 0) {
        let seen = false;
        try { seen = localStorage.getItem('cd_feud_tutorial') === '1'; } catch (e) {}
        if (!seen) {
          try { localStorage.setItem('cd_feud_tutorial', '1'); } catch (e) {}
          CD.UI.showFeudTutorial();
        } else {
          CD.UI.toast('⚡ 吵架搭檔成立：內耗開始充能');
        }
      }
    }
  }
  function updateFeuds(dt) {
    G.towers.forEach(function (t) { t.feuding = false; t.feudCount = 0; });
    // 沒意見教授在場：祥和的壓力籠罩全場，吵不起來（充能凍結）
    const nodHere = G.enemies.some(function (e) { return !e.dead && e.def.feudFreeze; });
    G.feuds.forEach(function (f) {
      const a = towerAt(f.tileA), b = towerAt(f.tileB);
      if (!a || !b) return;
      if (nodHere) { f.quarreling = false; return; }
      // 爆肝的人更暴躁：每位爆肝成員讓充能 +30%；比較怪指著：不服輸充能加倍
      let rageMul = 1 + 0.3 * ((isTired(a) ? 1 : 0) + (isTired(b) ? 1 : 0));
      for (let ci = 0; ci < G.enemies.length; ci++) {
        const ce = G.enemies[ci];
        if (!ce.dead && ce.def.cmpAura &&
            (dist(a.x, a.y, ce.x, ce.y) <= ce.def.cmpAura.range ||
             dist(b.x, b.y, ce.x, ce.y) <= ce.def.cmpAura.range)) {
          rageMul *= ce.def.cmpAura.feudMul;
          break;
        }
      }
      if (f.quarreling) {
        f.quarrelT -= dt;
        f.lineT += dt;
        // 吵架中：輸出下降，且同時捲入越多場吵架、懲罰疊得越重（群聚不再是免費午餐）
        a.feuding = true; b.feuding = true;
        a.feudCount++; b.feudCount++;
        f.charge = Math.min(FC.MAX, f.charge + FC.QUARREL_GAIN * rageMul * dt);
        if (f.quarrelT <= 0) {
          f.quarreling = false;
          f.nextQuarrel = FC.QUARREL_MIN + Math.random() * (FC.QUARREL_MAX - FC.QUARREL_MIN);
        }
      } else {
        // 平時充能只在波內累積：準備期是喘息，不是白拿爆氣的時間
        if (G.phase === 'wave') f.charge = Math.min(FC.MAX, f.charge + FC.IDLE_GAIN * rageMul * dt);
        f.nextQuarrel -= dt;
        if (f.nextQuarrel <= 0 && G.phase === 'wave') {    // 只在波內開吵（準備期讓玩家喘）
          f.quarreling = true;
          f.quarrelT = FC.QUARREL_LEN;
          f.lineSet = Math.floor(Math.random() * f.def.lines.length);
          f.lineT = 0;
          CD.Audio.play('feudStart');                       // 兩人搶話的專屬音，不再借用錯誤音
        }
      }
      // 滿槽提示：讓「可以打出去了」有聲音
      if (f.charge >= FC.MAX && !f.readyNotified) { f.readyNotified = true; CD.Audio.play('feudReady'); }
      else if (f.charge < FC.MAX) f.readyNotified = false;
    });
  }
  /* 勸架：吵架中點擊配對圖示 → 提前止戰，換部分爆氣。
   * 每次吵架變成即時決策：忍痛吵完（約 +27）vs 勸架保輸出（+15）。 */
  function mediateFeud(f) {
    if (!f.quarreling || G.state !== 'playing') return false;
    f.quarreling = false;
    f.charge = Math.min(FC.MAX, f.charge + 15);
    f.nextQuarrel = FC.QUARREL_MIN + Math.random() * (FC.QUARREL_MAX - FC.QUARREL_MIN);
    const a = towerAt(f.tileA), b = towerAt(f.tileB);
    if (a && b) addDmgNum((a.x + b.x) / 2, (a.y + b.y) / 2 - 30, '各退一步！爆氣 +15', '#41f2e6');
    CD.Audio.play('mediate');
    CD.UI.syncAll();
    return true;
  }

  /* 發動組合必殺 */
  function castFeud(f) {
    if (f.charge < FC.MAX || G.state !== 'playing') { CD.Audio.play('denied'); return; }
    f.charge = 0;
    if (G.mode === 'campaign' && G.levelIdx === 0) G.tutorialComboCast = true;
    f.quarreling = false;
    const eff = f.def.effect;
    const ids = f.key.split('_');
    // 立繪 cut-in 降頻：同一配對 25 秒內只播一次完整演出，其餘只走 banner＋閃光，
    // 避免每關 20 次全螢幕演出把「必殺感」磨成壁紙、還擋住敵人成片消失的爽點。
    if (G.time - (f.lastCutin || -99) > 25) {
      f.lastCutin = G.time;
      G.cutin = { ids: ['MUSOU_' + ids[0], 'MUSOU_' + ids[1]], title: f.def.musou, color: f.def.color, t: 0, dur: 1.5 };
      setSlowmo(0.5, 0.35);          // 慢動作取代遮蔽：看得到自己造成的破壞
    }
    G.musouFx = 0.9;
    addHitstop(0.08);
    addShake(4, 0.25);
    CD.Audio.play('feudCast');
    CD.Audio.duckBgm();
    setBanner(f.def.musou + '！', f.def.fx, 2.2);
    const counter = CD.FEUD_COUNTERS[f.key];
    let counterHits = 0;
    // 任何組合技都能逼「沒意見教授」表態離場，將忍耐改成玩家動詞。
    G.enemies.slice().forEach(function (e) {
      if (!e.dead && e.def.comboDismiss) {
        addDmgNum(e.x, e.y - 28, '「那就照你們的。」', '#ffd23f');
        killEnemy(e, true);
        f.charge = Math.min(FC.MAX, f.charge + 30);
      }
    });
    G.enemies.slice().forEach(function (e) {
      if (e.dead) return;
      spawnAnimFx(e.x, e.y - 22, 'FX_gasp', 1, 1.4, 0.5);   // 被組合技嚇到（v5 驚呼符號）
      const isCounter = counter && counter.ids.indexOf(e.id) >= 0;
      if (isCounter) {
        counterHits++;
        addDmgNum(e.x, e.y - 31, '剋制！×1.5', '#ffd23f');
        spawnAnimFx(e.x, e.y - 8, 'FX_spotlight', 1, 1.8, 0.45);
      }
      if (eff.damage) damageEnemy(e, eff.damage * (isCounter ? 1.5 : 1), { ignoreArmor: false, color: f.def.color, noBreak: true });
      if (e.dead) return;
      if (eff.slowFactor) { e.slow = eff.slowFactor; e.slowT = eff.slowDuration; }
      if (eff.burnDps) { e.burn = eff.burnDps; e.burnT = eff.burnDuration; }
      if (eff.markDuration) e.mark = eff.markDuration;
      if (eff.armorBreak) { e.armorBrk = eff.armorBreak; e.armorBrkT = eff.armorBreakDur; }
      if (eff.revealAll) e.forceRevealT = eff.revealAll;
    });
    if (counterHits > 0) setBanner(f.def.musou + '・剋制！', counter.label + '命中 ' + counterHits + ' 個目標', 2.4);
    // 一次戰鬥事件最多插一張 CG，避免首次組合技被連續演出切碎。
    CD.UI.triggerOneCG(ids.map(function (id) { return 'rage_' + id; }));
    CD.UI.syncAll();
  }

  /* ---------- 部署 ---------- */
  /* ---------- 上場人數上限（隨戰役成長） ---------- */
  function teamLimit() {
    if (G.mode !== 'campaign') return CFG.TEAM_LIMIT;   // 無盡加班沿用硬上限
    const n = CD.TEAM_LIMIT_BY_LEVEL[G.levelIdx];
    return typeof n === 'number' ? n : CFG.TEAM_LIMIT;
  }

  /* ---------- 隊友等級 ----------
   * 有效數值＝基礎值 × 等級倍率。快取在 tower 上，等級一變就重算；
   * 這樣 pickTarget／fire／攻速迴圈都不必各自知道升級這件事。 */
  function levelRow(lv) {
    return CD.TOWER_LEVELS[Math.max(0, Math.min(CD.TOWER_LEVELS.length - 1, (lv || 1) - 1))];
  }
  function towerDef(tw) {
    const base = CD.SPECIALISTS[tw.type];
    const lv = tw.lv || 1;
    if (tw._defLv === lv && tw._def) return tw._def;
    const row = levelRow(lv);
    tw._defLv = lv;
    tw._def = Object.assign({}, base, {
      damage: base.damage * row.dmgMul,
      interval: base.interval * row.rateMul,
      range: base.range * row.rangeMul
    });
    return tw._def;
  }
  function maxLevel() { return CD.TOWER_LEVELS.length; }
  /* 升到下一級要花多少 DP；已滿級回 0 */
  function upgradeCost(tw) {
    if (!tw || (tw.lv || 1) >= maxLevel()) return 0;
    return CD.SPECIALISTS[tw.type].cost * levelRow((tw.lv || 1) + 1).costMul;
  }
  function upgradeTower(idx) {
    const tw = G.towers[idx];
    if (!tw) return false;
    if ((tw.lv || 1) >= maxLevel()) { CD.UI.toast('已經是最強的狀態了'); CD.Audio.play('denied'); return false; }
    if (G.paused) { CD.UI.toast('暫停中無法升級'); CD.Audio.play('denied'); return false; }
    const cost = upgradeCost(tw);
    if (G.dp < cost) { CD.UI.toast('部署點數不足（需要 ' + cost + '）'); CD.Audio.play('denied'); return false; }
    G.dp -= cost;
    tw.lv = (tw.lv || 1) + 1;
    tw.spent = (tw.spent || CD.SPECIALISTS[tw.type].cost) + cost;
    tw._def = null;
    const row = levelRow(tw.lv);
    CD.UI.toast(CD.SPECIALISTS[tw.type].name + ' → ' + row.name);
    addDmgNum(tw.x, tw.y - 30, row.name, CD.SPECIALISTS[tw.type].color);
    CD.Audio.play('perkPick');
    CD.UI.showTowerInfo(idx); CD.UI.syncAll();
    return true;
  }

  /* 第一次買得起升級時提示一次（整個存檔只提示一次）。
   * 新經濟下 DP 的主要出口就是升級，實測完全不升級的玩家在 L4 就會撞牆；
   * 升級按鈕雖然在塔資訊面板正中央，但玩家要先想到「點自己的隊友」才看得到。 */
  let upgradeHinted = null;
  function maybeHintUpgrade() {
    if (upgradeHinted === null) {
      try { upgradeHinted = localStorage.getItem('cd_upgrade_hint') === '1'; } catch (e) { upgradeHinted = false; }
    }
    if (upgradeHinted || G.state !== 'playing' || !G.towers.length) return;
    const affordable = G.towers.some(function (t) {
      const c = upgradeCost(t);
      return c > 0 && G.dp >= c;
    });
    if (!affordable) return;
    upgradeHinted = true;
    try { localStorage.setItem('cd_upgrade_hint', '1'); } catch (e) {}
    setBanner('部署點也可以拿來練功', '點任何一位隊友，面板上有升級按鈕（或選取後按 U）。人手有上限，把人練強是另一條路。', 5);
    CD.UI.toast('可以升級了：點隊友 → 升級');
    CD.Audio.play('perkOpen');
  }

  function deploy(tileIdx, typeId) {
    const def = CD.SPECIALISTS[typeId];
    const tile = CD.MAP.tiles[tileIdx];
    if (!def || !tile) return false;
    if (G.towers.some(function (t) { return t.tile === tileIdx; })) { CD.Audio.play('denied'); return false; }
    if (G.blockedTiles && G.blockedTiles[tileIdx] > 0) { CD.UI.toast('這格被名片佔住了'); CD.Audio.play('denied'); return false; }
    if (G.deployBlocked) { CD.UI.toast('重構中——這一波（含準備期）不能部署'); CD.Audio.play('denied'); return false; }
    if (G.paused) { CD.UI.toast('暫停中無法部署'); CD.Audio.play('denied'); return false; }
    if (G.towers.length >= teamLimit()) { CD.UI.toast('上場人數已達上限（' + teamLimit() + '）'); CD.Audio.play('denied'); return false; }
    if (G.dp < def.cost) { CD.UI.toast('部署點數不足'); CD.Audio.play('denied'); return false; }
    G.dp -= def.cost;
    G.towers.push({
      type: typeId, tile: tileIdx,
      x: tile.x + CFG.TILE / 2, y: tile.y + CFG.TILE / 2,
      cd: 0, shots: 0, kills: 0, attackT: 0, facing: 1, target: null,
      workT: 0, tiredNotified: false, silencedT: 0,
      lv: 1, spent: def.cost, _def: null, _defLv: 0
    });
    G.stats.deployed++;
    CD.Audio.play('deploy');
    G.selectedTile = -1;
    rebuildFeuds();
    CD.UI.hideBuildMenu(); CD.UI.syncAll();
    return true;
  }
  function removeTower(idx) {
    const t = G.towers[idx];
    if (!t) return;
    // 撤回收 1 DP 手續費：搬家要有代價。升級投資一併退還，否則練強＝不敢再動位置
    G.dp += Math.max(0, (t.spent || CD.SPECIALISTS[t.type].cost) - 1);
    G.towers.splice(idx, 1);
    G.selectedTower = -1;
    rebuildFeuds();
    CD.Audio.play('remove');
    CD.UI.hideTowerInfo(); CD.UI.syncAll();
  }

  /* ---------- 敵人 ---------- */
  function spawnEnemy(id, route) {
    const def = CD.ENEMIES[id];
    const hp = Math.round(def.hp * G.scale * CFG.HP_MUL * (G.waveHpMul || 1) * levelHpMul());
    const e = {
      def: def, id: id, route: route, seg: 0, segT: 0,
      x: CD.MAP.routes[route][0].x, y: CD.MAP.routes[route][0].y,
      hp: hp, maxHp: hp,
      slow: 0, slowT: 0, burn: 0, burnT: 0, mark: 0, armorBrk: 0, armorBrkT: 0,
      phaseT: 0, hidden: false, revealed: false, forceRevealT: 0,
      fuse: def.fuse ? def.fuse : -1, beeped: -1,
      summonT: def.summon ? def.summon.every : -1, children: [],
      revived: false, flash: 0, wobble: Math.random() * 6.28, dead: false
    };
    G.enemies.push(e);
    if (def.budgetCut) {
      G.waveBudgetCut = true;
      CD.UI.toast('預算主任進場：若讓他走掉，本波部署獎勵砍半');
    }
    if (def.comboDismiss) {
      e.politeT = def.politeAfter || 20;
      if (G.feuds.length > 0) {
        const f = G.feuds.slice().sort(function (a, b) { return b.charge - a.charge; })[0];
        f.charge = FC.MAX;
        e.comboGranted = true;
        setBanner('逼他表態！', '一組吵架搭檔已直接滿槽；點拳頭發動組合技。', 3.2);
      } else {
        setBanner('他說「都可以」', '現在部署相鄰異職種，會直接獲得一組滿槽反擊。', 3.2);
      }
    }
    if (def.cat === 'BOSS') {
      // Boss 登場儀式：慢動作＋專屬音＋Boss 曲＋tagline
      setSlowmo(1.2, 0.35);
      CD.Audio.play('bossIntro');
      CD.Audio.playBgm('bgm_boss');
      setBanner('⚠ ' + def.name, def.tagline, 3.5);
    }
    if (id === 'HYD') CD.UI.triggerCG('hydra');
    return e;
  }

  function enemyProgress(e) { return e.seg + e.segT; }

  function damageEnemy(e, dmg, opts) {
    opts = opts || {};
    if (e.dead) return;
    if (e.def.immune) {   // 沒意見教授：傷害免疫
      addDmgNum(e.x, e.y - 14, '（點頭）', '#8a94b8');
      return;
    }
    // 滿分履歷：首擊現形
    if (e.def.fakeHp && !e.exposed) {
      e.exposed = true;
      addDmgNum(e.x, e.y - 22, '現形了！', '#ffd23f');
      CD.Audio.play('reveal');
    }
    // 名片群：被標記後一擊即碎
    if (e.def.markInstakill && e.mark > 0) {
      e.hp = 0; e.flash = 0.2;
      addDmgNum(e.x, e.y - 14, '碎！', '#f4f6fb');
      killEnemy(e, opts.byMusou);
      return;
    }
    let armor = Math.max(0, (e.def.armor || 0) - (e.armorBrk > 0 ? e.armorBrk : 0));
    if (opts.ignoreArmor) armor = 0;
    let final = dmg * (1 - armor / 100);
    if (e.mark > 0) final *= 1.25;
    final = Math.max(1, Math.round(final));
    e.hp -= final;
    e.flash = 0.12;
    addDmgNum(e.x, e.y - 14, final, opts.big ? '#ffd23f' : (opts.color || '#f4f6fb'), { big: opts.big });
    if (G.buffs.armorBreak > 0 && !opts.noBreak) { e.armorBrk = G.buffs.armorBreak; e.armorBrkT = 4; }
    CD.Audio.play('hit', opts.combo || 0);
    if (e.hp <= 0) killEnemy(e, opts.byMusou);
  }

  function killEnemy(e, byMusou) {
    if (e.dead) return;
    // 迴歸蟲：復活一次
    if (e.def.revive && !e.revived) {
      e.revived = true;
      e.hp = Math.round(e.maxHp * e.def.revive.hpFactor);
      e.flash = 0.4;
      addDmgNum(e.x, e.y - 20, '復發！', '#68d16f');
      return;
    }
    e.dead = true;
    G.stats.kills++;
    if (e.def.budgetCut) {
      G.waveBudgetCut = false;
      CD.UI.toast('預算主任被說服：本波獎勵保住了');
    }
    spawnDissolve(e);
    spawnAnimFx(e.x, e.y - 6, 'FX_poof', 3, e.def.size >= 24 ? 3.4 : 2.4, 0.3);
    if (e.def.cat === 'BOSS') {
      // Boss 死亡儀式：打了三分鐘的對手，不能跟一張便利貼同一個畫面收場
      addHitstop(0.12); addShake(7, 0.5); setSlowmo(0.5, 0.4);
      for (let bi = 0; bi < 30; bi++) {
        G.particles.push({
          x: e.x + Math.random() * 30 - 15, y: e.y + Math.random() * 30 - 15,
          vx: Math.random() * 160 - 80, vy: -Math.random() * 120 - 20,
          size: 2 + Math.random() * 4, color: bi % 3 ? e.def.color : '#f4f6fb',
          t: 0, dur: 0.6 + Math.random() * 0.5
        });
      }
      CD.Audio.play('bossDown');
      // 場上沒有其他 Boss 了：Boss 曲退回波次曲
      if (!G.enemies.some(function (o) { return !o.dead && o !== e && o.def.cat === 'BOSS'; })) {
        CD.Audio.playBgm('bgm_wave');
      }
    } else {
      addShake(1.5, 0.08);
    }
    CD.Audio.play('kill');
    // 必殺充能
    const gain = e.def.cat === 'BOSS' ? CFG.MUSOU_BOSS_BONUS : CFG.MUSOU_PER_KILL;
    G.musou = Math.min(musouMax(), G.musou + gain);
    // 組長的新點子被否決：全隊爆氣 +N（否決的爽感）
    if (e.def.feudChargeOnKill && G.feuds.length > 0) {
      G.feuds.forEach(function (f) { f.charge = Math.min(CD.FEUD_CFG.MAX, f.charge + e.def.feudChargeOnKill); });
      addDmgNum(e.x, e.y - 26, '否決！全隊爆氣+' + e.def.feudChargeOnKill, '#ffd23f');
    }
    // 當年學長／預算主任：擊殺掉落 DP（紅包／退回的預算）
    if (e.def.dropDp) {
      G.dp += e.def.dropDp;
      addDmgNum(e.x, e.y - 32, '+' + e.def.dropDp + ' DP', '#5dd66e');
      CD.UI.syncAll();
    }
    // Boss 分裂
    if (e.def.split) {
      e.def.split.forEach(function (sid, i) {
        const frag = spawnEnemy(sid, e.route);
        frag.seg = e.seg; frag.segT = Math.max(0, e.segT - 0.08 * (i + 1));
        const p = routePos(frag.route, frag.seg, frag.segT);
        frag.x = p.x; frag.y = p.y;
      });
      setBanner('九頭龍分裂了！', '「再改一版」×2 出現', 2.2);
    }
    CD.UI.syncMusou();
  }

  function leakEnemy(e) {
    e.dead = true;
    G.stats.leaks++;
    // 沒意見教授：點三下頭，轉身離開（不扣血）
    if (e.def.politeLeave) {
      addDmgNum(e.x, e.y - 20, '「都可以。」（離場）', '#8a94b8');
      CD.UI.toast('沒意見教授看完了。你們還是不知道過了沒。');
      return;
    }
    // 亂摸小孩：摸到主機＝Demo 當機（必殺充能歸損）
    if (e.def.musouDrain) {
      G.musou = Math.max(0, G.musou - e.def.musouDrain);
      addDmgNum(e.x, e.y - 20, 'Demo 當機！充能 -' + e.def.musouDrain, '#ffd9b3');
      CD.Audio.play('ownHit');
      CD.UI.syncMusou();
      return;
    }
    // 迷路長輩：只是問路
    if (e.def.coreDmg === 0 && !e.def.stealDp) {
      addDmgNum(e.x, e.y - 20, '「請問食品展在哪？」', '#c9d2e8');
      return;
    }
    // 消失的組員：不打主機，偷部署點就跑
    if (e.def.stealDp) {
      const steal = Math.min(G.dp, e.def.stealDp);
      G.dp -= steal;
      addDmgNum(e.x, e.y - 20, '被偷走 ' + steal + ' DP！', '#c9d2e8');
      CD.Audio.play('ownHit');
      CD.UI.syncAll();
      return;
    }
    const dmg = Math.max(1, Math.round(e.def.coreDmg * levelCoreDmgMul() * (1 - G.buffs.coreDmgReduction)));
    G.coreHp -= dmg;
    G.coreShake = 0.5; G.coreScratch = 1;
    addShake(5, 0.35);
    spawnTeamSweat();
    addDmgNum(CD.MAP.core.x, CD.MAP.core.y - 40, '-' + dmg, '#ff5d5d');
    CD.Audio.play('coreDamage');
    CD.UI.syncAll();
    checkLastStand();
    if (G.coreHp <= 0) { G.coreHp = 0; defeat(); }
  }

  function bsdExplode(e) {
    e.dead = true;
    G.stats.leaks++;
    const dmg = Math.max(1, Math.round(e.def.coreDmg * levelCoreDmgMul() * (1 - G.buffs.coreDmgReduction)));
    G.coreHp -= dmg;
    G.coreShake = 0.6; G.coreScratch = 1;
    addShake(5, 0.3); addHitstop(0.1);
    spawnTeamSweat();
    spawnDissolve(e);
    spawnAnimFx(e.x, e.y - 6, 'FX_boom', 3, 3.0, 0.5);
    addDmgNum(e.x, e.y - 20, '進度蒸發 -' + dmg, '#3f7dff');
    CD.Audio.play('boom');
    CD.UI.syncAll();
    checkLastStand();
    if (G.coreHp <= 0) { G.coreHp = 0; defeat(); }
  }

  function checkLastStand() {
    // 不在最緊張的瞬間打斷心流：先掛旗，波次結束再播 CG
    if (G.coreHp > 0 && G.coreHp < 20) G.lastStandPending = true;
  }

  /* ---------- 五位審查委員：可操作的答辯動詞 ---------- */
  function answerRollcall(towerIdx) {
    const tw = G.towers[towerIdx];
    if (!tw || tw.silencedT <= 0) return false;
    const boss = G.enemies.find(function (e) { return !e.dead && e.def.rollcall; });
    if (!boss) return false;
    tw.silencedT = 0;
    damageEnemy(boss, boss.def.rollcall.answerDamage, { ignoreArmor: true, color: '#5dd66e' });
    G.feuds.forEach(function (f) {
      f.charge = Math.min(FC.MAX, f.charge + boss.def.rollcall.answerFeud);
    });
    addDmgNum(tw.x, tw.y - 30, '舉手應答！', '#5dd66e');
    setBanner('點名反擊：舉手應答', '解除停手，教授受到反問傷害，爆氣 +' + boss.def.rollcall.answerFeud, 2.3);
    CD.Audio.play('reveal');
    CD.UI.syncAll();
    return true;
  }

  function tearCard(tileIdx) {
    if (!G.blockedTiles || !(G.blockedTiles[tileIdx] > 0)) return false;
    delete G.blockedTiles[tileIdx];
    G.cardTears++;
    const tile = CD.MAP.tiles[tileIdx];
    addDmgNum(tile.x + 20, tile.y + 10, '手動撕名片！', '#ff6b57');
    spawnAnimFx(tile.x + 20, tile.y + 18, 'FX_poof', 3, 2.2, 0.3);
    if (G.cardTears % 3 === 0) {
      G.feuds.forEach(function (f) { f.charge = Math.min(FC.MAX, f.charge + 10); });
      setBanner('三張名片，撕！', '忍耐轉成爆氣，全組 +10', 2.1);
    } else CD.UI.toast('名片撕掉了（' + (G.cardTears % 3) + '／3）');
    CD.Audio.play('remove');
    CD.UI.syncAll();
    return true;
  }

  function interruptElderAt(x, y) {
    const e = G.enemies.find(function (o) {
      return !o.dead && o.def.speech && dist(x, y, o.x, o.y) <= 34;
    });
    if (!e) return false;
    if (!e.speechOpen) {
      CD.UI.toast('等他張嘴說「當年」時再點擊打斷');
      CD.Audio.play('denied');
      return true;
    }
    e.speechDisabledT = e.def.speech.disabledFor;
    e.speechOpen = false;
    e.speechT = e.def.speech.cycle;
    damageEnemy(e, 100 * e.def.speech.damageMul, { ignoreArmor: true, color: '#ffd23f' });
    setBanner('打斷「當年」！', '雙倍反問傷害，全場說教光環停擺 ' + e.def.speech.disabledFor + ' 秒', 2.5);
    CD.Audio.play('interrupt');
    return true;
  }

  /* 保全隊長：點擊拖延——花 DP 讓他停下（「再五分鐘就好，真的」），停完會不耐煩一陣子 */
  function stallGuardAt(x, y) {
    const e = G.enemies.find(function (o) {
      return !o.dead && o.def.stall && dist(x, y, o.x, o.y) <= 40;
    });
    if (!e) return false;
    if (e.stallImmuneT > 0) {
      CD.UI.toast('「不要再拖了！」他開始不耐煩（' + Math.ceil(e.stallImmuneT) + ' 秒後可再拖延）');
      CD.Audio.play('denied');
      return true;
    }
    if (G.dp < e.def.stall.cost) { CD.UI.toast('部署點不足，連拖延的藉口都想不出來'); CD.Audio.play('denied'); return true; }
    G.dp -= e.def.stall.cost;
    e.stalledT = e.def.stall.dur;
    e.stallImmuneT = e.def.stall.dur + e.def.stall.immune;
    addDmgNum(e.x, e.y - 30, '「再五分鐘就好，真的」', '#41f2e6');
    setBanner('拖延戰術！', '花 ' + e.def.stall.cost + ' DP，保全隊長停下 ' + e.def.stall.dur + ' 秒', 2.1);
    CD.Audio.play('argue');
    CD.UI.syncAll();
    return true;
  }

  function argueBudget() {
    const e = G.enemies.find(function (o) { return !o.dead && o.def.argue; });
    if (!e) return false;
    if (G.argueCd > 0) { CD.UI.toast('他還在算上一張報價單（冷卻 ' + Math.ceil(G.argueCd) + ' 秒）'); CD.Audio.play('denied'); return false; }
    if (G.dp < e.def.argue.cost) { CD.UI.toast('部署點不足，連理論都沒有本錢'); CD.Audio.play('denied'); return false; }
    G.argueCd = 5;   // 冷卻：不能連點把預算主任當提款機打
    G.dp -= e.def.argue.cost;
    damageEnemy(e, e.def.argue.damage, { ignoreArmor: true, color: '#41f2e6' });
    setBanner('拿報價單找主任理論！', '花 ' + e.def.argue.cost + ' DP，造成 ' + e.def.argue.damage + ' 點答辯傷害', 2.1);
    CD.Audio.play('argue');
    CD.UI.syncAll();
    return true;
  }

  function predeployBooth(order) {
    if (!Array.isArray(order) || order.length !== 4) return false;
    const unique = {};
    const cost = order.reduce(function (sum, id) {
      unique[id] = true;
      return sum + (CD.SPECIALISTS[id] ? CD.SPECIALISTS[id].cost : 999);
    }, 0);
    if (Object.keys(unique).length !== 4 || G.dp < cost || G.towers.length) return false;
    let ok = true;
    order.forEach(function (id, i) { if (!deploy(i, id)) ok = false; });
    if (ok) setBanner('攤位佈置完成', '四個座位，四條火線；剩下的部署點留給臨場救火。', 3);
    return ok;
  }

  /* ---------- 塔攻擊 ---------- */
  function canTarget(tower, e, def) {
    if (e.dead || e.spawnPending) return false;
    if (e.hidden && !def.reveal) return false;
    return dist(tower.x, tower.y, e.x, e.y) <= def.range;
  }
  /* 預估抵達主機的秒數：剩餘路徑長 ÷ 當前有效速度 */
  function timeToCore(e) {
    const route = CD.MAP.routes[e.route];
    let d = (1 - e.segT) * segLen(e.route, e.seg);
    for (let s = e.seg + 1; s < route.length - 1; s++) d += segLen(e.route, s);
    const spd = Math.max(1, e.def.speed * (e.slow > 0 ? e.slow : 1));
    return d / spd;
  }
  /* 索敵：最快抵達主機者優先；Boss 永遠優先──快速雜兵不再替直播網紅擋火力 */
  function pickTarget(tower, def) {
    let best = null, bs = -Infinity;
    for (let i = 0; i < G.enemies.length; i++) {
      const e = G.enemies[i];
      if (!canTarget(tower, e, def)) continue;
      let s = -timeToCore(e);
      if (e.def.cat === 'BOSS') s += 10000;
      if (s > bs) { bs = s; best = e; }
    }
    return best;
  }
  /* 吵架懲罰依「同時捲入的吵架組數」疊乘：1 組 0.70、2 組 0.55、3 組 0.42、4 組 0.32 */
  const FEUD_DEBUFF_TABLE = [1, 0.70, 0.55, 0.42, 0.32];
  function feudDebuff(tower) {
    return FEUD_DEBUFF_TABLE[Math.min(4, tower.feudCount || (tower.feuding ? 1 : 0))];
  }
  function fire(tower, def, target, factor, isCopy) {
    tower.shots++;
    let dmg = def.damage * (factor || 1) * (G.buffs.damageMul || 1);
    if (tower.feuding) dmg *= feudDebuff(tower);    // 吵架中：分心，傷害下降（多組同吵懲罰更重）
    if (isTired(tower)) dmg *= TIRED_DEBUFF;        // 爆肝中：手軟
    // 比較怪指著：分心比較，傷害下降
    for (let ci = 0; ci < G.enemies.length; ci++) {
      const ce = G.enemies[ci];
      if (!ce.dead && ce.def.cmpAura && dist(tower.x, tower.y, ce.x, ce.y) <= ce.def.cmpAura.range) {
        dmg *= ce.def.cmpAura.dmgMul;
        break;
      }
    }
    let keyboard = false;
    if (G.buffs.keyboardEvery > 0 && !isCopy && tower.shots % G.buffs.keyboardEvery === 0) { dmg *= 2; keyboard = true; }
    G.projectiles.push({
      x: tower.x, y: tower.y - 14, sx: tower.x, sy: tower.y - 14,
      target: target, speed: 340, dmg: dmg, kind: def.projectile,
      type: def.id, keyboard: keyboard, t: 0,
      lastX: target.x, lastY: target.y
    });
    tower.attackT = 0.18;
    tower.facing = target.x >= tower.x ? 1 : -1;
    CD.Audio.play('shoot_' + def.id);
    // Ctrl+C：機率複製一發到另一目標
    if (!isCopy && G.buffs.copyChance > 0 && Math.random() < G.buffs.copyChance) {
      const others = G.enemies.filter(function (e) { return e !== target && canTarget(tower, e, def); });
      if (others.length > 0) {
        fire(tower, def, others[Math.floor(Math.random() * others.length)], G.buffs.copyFactor, true);
      }
    }
  }
  function projectileHit(p) {
    const def = CD.SPECIALISTS[p.type];
    const e = p.target;
    if (!e || e.dead) return;
    // 視覺擊退：只做繪製偏移，不動 seg/segT，零平衡影響
    const hd = Math.max(1, dist(p.sx, p.sy, e.x, e.y));
    e.hitOffX = (e.x - p.sx) / hd * 6; e.hitOffY = (e.y - p.sy) / hd * 6; e.hitOffT = 0.12;
    // 命中火花：3 顆朝彈道反方向的碎粒＋小圈
    for (let i = 0; i < 3; i++) {
      G.particles.push({
        x: e.x, y: e.y - 6,
        vx: -(e.x - p.sx) / hd * (40 + Math.random() * 50) + (Math.random() * 30 - 15),
        vy: -Math.random() * 40 - 10,
        size: 2, color: def.color, t: 0, dur: 0.22 + Math.random() * 0.1
      });
    }
    // 連擊音高遞進：連續命中會產生上行音階
    G.hitCombo = Math.min(8, G.hitCombo + 1); G.hitComboT = 0.9;
    damageEnemy(e, p.dmg, { color: def.color, combo: G.hitCombo, big: p.keyboard });
    if (e.dead && !e.def.noCount) { /* 擊殺歸功 */ }
    if (def.trait === 'slow') { e.slow = def.slowFactor; e.slowT = def.slowDuration; }
    if (def.trait === 'burn') { e.burn = def.burnDps; e.burnT = def.burnDuration; }
    if (def.trait === 'mark') { e.mark = def.markDuration; }
    // 青軸鍵盤：濺射
    if (p.keyboard) {
      G.enemies.forEach(function (o) {
        if (o !== e && !o.dead && dist(e.x, e.y, o.x, o.y) < 40) {
          damageEnemy(o, p.dmg * 0.5, { color: '#c9d2e8', noBreak: true });
        }
      });
      spawnRing(e.x, e.y, 40, '#c9d2e8');
    }
  }

  /* ---------- 必殺：通宵爆發 ---------- */
  function castMusou() {
    if (G.musou < musouMax() || G.state !== 'playing') { CD.Audio.play('denied'); return; }
    G.musou = 0;
    G.musouFx = 1.2;
    G.cutin = { ids: ['MUSOU_PLN', 'MUSOU_DEV', 'MUSOU_QAT', 'MUSOU_ART'], title: null, color: '#41f2e6', t: 0, dur: 1.7 };
    G.coreShake = 0.4;
    addHitstop(0.15);
    addShake(10, 0.6);
    CD.Audio.play('musou');
    CD.Audio.duckBgm();
    setBanner('通宵爆發！！', '全體火力全開——明天的事明天再說！', 2.5);
    G.enemies.slice().forEach(function (e) {
      if (!e.dead) {
        damageEnemy(e, CFG.MUSOU_DAMAGE, { ignoreArmor: true, byMusou: true, color: '#41f2e6', noBreak: true });
        if (!e.dead && !e.def.immune) { e.slow = 0.05; e.slowT = Math.max(e.slowT, 2.5); }  // 全場定身 2.5 秒
      }
    });
    CD.UI.triggerCG('rampage');
    CD.UI.syncMusou();
  }

  /* ---------- 粒子與數字 ---------- */
  function addDmgNum(x, y, txt, color, opts) {
    const s = String(txt);
    const isText = /[一-鿿]/.test(s);   // 中文句子停留更久、用中文字型
    G.dmgNums.push({
      x: x + (Math.random() * 12 - 6), y: y, txt: s, color: color, t: 0,
      life: isText ? 2.0 : 0.9, cjk: isText, big: !!(opts && opts.big)
    });
    if (G.dmgNums.length > 60) G.dmgNums.shift();
  }
  function spawnDissolve(e) {
    for (let i = 0; i < 10; i++) {
      G.particles.push({
        x: e.x + Math.random() * 20 - 10, y: e.y + Math.random() * 20 - 10,
        vx: Math.random() * 60 - 30, vy: -Math.random() * 50 - 10,
        size: 2 + Math.random() * 3, color: e.def.color, t: 0, dur: 0.5 + Math.random() * 0.3
      });
    }
  }
  function spawnRing(x, y, r, color) {
    G.particles.push({ ring: true, x: x, y: y, r: r, color: color, t: 0, dur: 0.3 });
  }
  /* F 組：逐幀特效粒子（FX_poof 擊殺爆散／FX_boom 藍屏爆炸）；
     幀未載入時 render 自動略過，碎粒 spawnDissolve 仍在，畫面不會空。 */
  function spawnAnimFx(x, y, prefix, frameCount, scale, dur, delay) {
    const frames = [];
    if (frameCount === 1) frames.push(prefix);           // 單幀符號直接用檔名
    else for (let i = 1; i <= frameCount; i++) frames.push(prefix + i);
    G.particles.push({ anim: true, frames: frames, x: x, y: y, scale: scale, t: 0, dur: dur, delay: delay || 0 });
  }
  function spawnTeamSweat() {
    G.towers.forEach(function (tw, i) {
      spawnAnimFx(tw.x + 12, tw.y - 28, 'FX_sweat', 1, 1.25, 0.45, i * 0.05);
    });
  }

  /* ---------- 手感：屏震／頓幀／慢動作 ---------- */
  function addShake(mag, dur) {
    if (mag >= G.shake.mag * G.shake.t) { G.shake.mag = mag; G.shake.t = dur; G.shake.dur = dur; }
  }
  function addHitstop(t) { G.hitstop = Math.max(G.hitstop, t); }
  function setSlowmo(t, mul) { G.slowmo = { t: t, mul: mul }; }

  /* ---------- 主更新 ---------- */
  function update(rawDt) {
    if (G.state !== 'playing' || G.paused || G.modalPause || G.perkChoices || G.legacyChoices) return;
    const dtReal = Math.min(rawDt, 0.05);      // 未經遊戲速度縮放：供演出計時使用
    if (G.shake.t > 0) G.shake.t -= dtReal;
    if (G.hitstop > 0) { G.hitstop -= dtReal; return; }   // 頓幀：畫面照畫，戰鬥凍結
    let dt = dtReal * G.speed;
    if (G.slowmo) {
      dt *= G.slowmo.mul;
      G.slowmo.t -= dtReal;
      if (G.slowmo.t <= 0) G.slowmo = null;
    }
    G.time += dt;
    // 連擊計時：0.9 秒沒有命中就歸零（供命中音高遞進）
    if (G.hitComboT > 0) { G.hitComboT -= dtReal; if (G.hitComboT <= 0) G.hitCombo = 0; }

    // 演出層計時一律用未縮放的 dtReal：2 倍速不該讓玩家少看一半的提示
    if (G.banner) { G.banner.t += dtReal; if (G.banner.t > G.banner.dur) G.banner = null; }
    if (G.musouFx > 0) G.musouFx -= dtReal * 3.5;   // 全螢幕閃光快速收掉，把畫面還給戰場
    if (G.cutin) { G.cutin.t += dtReal; if (G.cutin.t > G.cutin.dur) G.cutin = null; }
    updateFeuds(dt);
    updateTired(dt);
    if (G.coreShake > 0) G.coreShake -= dt;
    if (G.coreScratch > 0) G.coreScratch -= dt * 0.8;
    if (G.argueCd > 0) G.argueCd -= dt;
    // 主機低血：心跳警報（血越少跳越快），離開危險區自動停
    if (G.coreHp > 0 && G.coreHp < 20 && G.phase === 'wave') {
      G.heartbeatT = (G.heartbeatT || 0) - dtReal;
      if (G.heartbeatT <= 0) {
        CD.Audio.play('heartbeat');
        G.heartbeatT = 0.5 + (G.coreHp / 20) * 0.5;   // HP 20→1.0s、HP 5→0.63s
      }
    } else G.heartbeatT = 0;

    /* 準備階段 */
    if (G.phase === 'prep') {
      maybeHintUpgrade();
      if (G.tutorialGate && G.feuds.length === 0) {
        G.prepLeft = Math.max(0.5, G.prepLeft);
      } else {
        G.prepLeft -= dt;
        if (G.prepLeft <= 0) startWave();
      }
    }

    /* 生成 */
    if (G.phase === 'wave') {
      G.waveTime += dt;
      while (G.spawnQueue.length > 0 && G.spawnQueue[0].t <= G.waveTime) {
        const s = G.spawnQueue.shift();
        spawnEnemy(s.id, s.route);
      }
    }

    /* 敵人 */
    for (let i = G.enemies.length - 1; i >= 0; i--) {
      const e = G.enemies[i];
      if (e.dead) { G.enemies.splice(i, 1); continue; }

      // 狀態計時
      if (e.slowT > 0) { e.slowT -= dt; if (e.slowT <= 0) e.slow = 0; }
      if (e.mark > 0) e.mark -= dt;
      if (e.armorBrkT > 0) { e.armorBrkT -= dt; if (e.armorBrkT <= 0) e.armorBrk = 0; }
      if (e.burnT > 0) {
        e.burnT -= dt;
        e.burnAcc = (e.burnAcc || 0) + e.burn * dt;
        if (e.burnAcc >= 3) { damageEnemy(e, e.burnAcc, { ignoreArmor: true, color: '#ff6b57', noBreak: true }); e.burnAcc = 0; }
        if (e.dead) continue;
      }
      // 沒意見教授：20 秒保險離場，避免玩家沒有配對時被迫等完整路程。
      if (e.def.politeAfter) {
        e.politeT -= dt;
        if (e.politeT <= 0) { leakEnemy(e); G.enemies.splice(i, 1); continue; }
      }

      // 靈異 Bug 相位
      if (e.def.phase) {
        if (e.forceRevealT > 0) e.forceRevealT -= dt;      // 組合必殺的強制現形
        e.phaseT += dt;
        const cyc = e.def.phase.visibleTime + e.def.phase.hiddenTime;
        const inHidden = (e.phaseT % cyc) > e.def.phase.visibleTime;
        // 測試同學在射程內 → 強制現形
        let revealed = e.forceRevealT > 0;
        if (inHidden && !revealed) {
          for (let t = 0; t < G.towers.length; t++) {
            const tw = G.towers[t], td = towerDef(tw);
            if (td.reveal && dist(tw.x, tw.y, e.x, e.y) <= td.range) { revealed = true; break; }
          }
          if (revealed && !e.revealed) CD.Audio.play('reveal');
        }
        e.revealed = revealed;
        e.hidden = inHidden && !revealed;
      }

      // 藍屏倒數（音高與音量隨逼近遞增，最後 1 秒加密）
      if (e.fuse > 0) {
        e.fuse -= dt;
        const step = e.fuse <= 1 ? 0.5 : 1;
        const tick = Math.ceil(e.fuse / step);
        if (e.fuse <= 3 && tick !== e.beeped) { e.beeped = tick; CD.Audio.play('countdown', 3 - e.fuse); }
        if (e.fuse <= 0) { bsdExplode(e); continue; }
      }

      // 點名教授：週期點名一位隊友，被點到的停止攻擊
      if (e.def.rollcall) {
        e.rollT = (e.rollT === undefined ? (e.def.rollcall.first || e.def.rollcall.every) : e.rollT) - dt;
        if (e.rollT <= 0 && G.towers.length > 0) {
          const victim = G.towers[Math.floor(Math.random() * G.towers.length)];
          victim.silencedT = e.def.rollcall.dur;
          addDmgNum(victim.x, victim.y - 26, '被點名了！', '#3fa855');
          CD.Audio.play('ownHit');
          e.rollT = e.def.rollcall.every;
        }
      }
      // 當年學長：每 8 秒說教一次，最後 2 秒張嘴可由玩家點擊打斷。
      if (e.def.speech) {
        if (e.speechDisabledT > 0) {
          e.speechDisabledT -= dt;
          e.speechOpen = false;
        } else {
          e.speechT = (e.speechT === undefined ? e.def.speech.cycle : e.speechT) - dt;
          e.speechOpen = e.speechT <= e.def.speech.window;
          if (e.speechT <= 0) {
            e.speechT = e.def.speech.cycle;
            e.speechOpen = false;
            addDmgNum(e.x, e.y - 29, '「當年我們——」', '#ffd23f');
            CD.Audio.play('ownHit');
          }
        }
      }
      // 業界委員：發名片佔住隨機空建造格
      if (e.def.cardBlock) {
        e.cardT = (e.cardT === undefined ? (e.def.cardBlock.first || e.def.cardBlock.every) : e.cardT) - dt;
        if (e.cardT <= 0) {
          const free = [];
          for (let ti = 0; ti < CD.MAP.tiles.length; ti++) {
            if (!G.towers.some(function (t) { return t.tile === ti; }) && !(G.blockedTiles && G.blockedTiles[ti] > 0)) free.push(ti);
          }
          if (free.length > 0) {
            const pick = free[Math.floor(Math.random() * free.length)];
            G.blockedTiles = G.blockedTiles || {};
            G.blockedTiles[pick] = e.def.cardBlock.dur;
            const tile = CD.MAP.tiles[pick];
            addDmgNum(tile.x + 20, tile.y + 12, '「名片拿一下」', '#f4f6fb');
          }
          e.cardT = e.def.cardBlock.every;
        }
      }

      // 泥漿召喚
      if (e.summonT > 0) {
        e.summonT -= dt;
        e.children = e.children.filter(function (c) { return !c.dead; });
        if (e.summonT <= 0 && e.children.length < e.def.summon.max) {
          const kid = spawnEnemy(e.def.summon.id, e.route);
          kid.seg = e.seg; kid.segT = e.segT;
          const kp = routePos(kid.route, kid.seg, kid.segT);
          kid.x = kp.x; kid.y = kp.y;
          e.children.push(kid);
          addDmgNum(e.x, e.y - 20, '＋新需求', '#ffd23f');
          e.summonT = e.def.summon.every;
        }
      }

      // 會議循環：走三步停兩秒（開會中）
      let stopgoMul = 1;
      if (e.def.stopgo) {
        e.sgT = (e.sgT || 0) + dt;
        const cyc = e.def.stopgo.walk + e.def.stopgo.stop;
        if ((e.sgT % cyc) > e.def.stopgo.walk) stopgoMul = 0;   // 停下開會
      }
      // 保全隊長被拖延：原地站住；不耐煩計時同步遞減
      if (e.stallImmuneT > 0) e.stallImmuneT -= dt;
      if (e.stalledT > 0) { e.stalledT -= dt; stopgoMul = 0; }
      // 直播網紅光環：附近敵人加速跟隨
      let hasteMul = 1;
      for (let hi = 0; hi < G.enemies.length; hi++) {
        const he = G.enemies[hi];
        if (!he.dead && he !== e && he.def.hasteAura && dist(e.x, e.y, he.x, he.y) <= he.def.hasteAura.range) {
          hasteMul = he.def.hasteAura.mul;
          break;
        }
      }
      // 移動
      const spd = e.def.speed * (e.slow > 0 ? e.slow : 1) * stopgoMul * hasteMul * (e.def.cat === 'BOSS' ? 1 : (G.scale > 1 ? Math.min(1.3, 1 + (G.scale - 1) * 0.15) : 1));
      let move = spd * dt;
      while (move > 0 && e.seg < CD.MAP.routes[e.route].length - 1) {
        const len = segLen(e.route, e.seg);
        const remain = (1 - e.segT) * len;
        if (move < remain) { e.segT += move / len; move = 0; }
        else { move -= remain; e.seg++; e.segT = 0; }
      }
      if (e.seg >= CD.MAP.routes[e.route].length - 1) { leakEnemy(e); G.enemies.splice(i, 1); continue; }
      const p = routePos(e.route, e.seg, e.segT);
      e.x = p.x; e.y = p.y;
      e.wobble += dt * 6;
      if (e.flash > 0) e.flash -= dt;
      if (e.hitOffT > 0) e.hitOffT -= dtReal;
    }

    /* 名片佔格倒數 */
    if (G.blockedTiles) {
      Object.keys(G.blockedTiles).forEach(function (k) {
        G.blockedTiles[k] -= dt;
        if (G.blockedTiles[k] <= 0) delete G.blockedTiles[k];
      });
    }

    /* 塔 */
    G.towers.forEach(function (tw) {
      const def = towerDef(tw);
      if (tw.attackT > 0) tw.attackT -= dt;
      if (tw.silencedT > 0) { tw.silencedT -= dt; return; }   // 被點名：暫停攻擊
      tw.cd -= dt;
      if (tw.cd <= 0) {
        const target = pickTarget(tw, def);
        if (target) {
          fire(tw, def, target, 1, false);
          tw.cd = def.interval / G.buffs.atkSpeedMul;
          if (tw.feuding) tw.cd /= feudDebuff(tw);       // 吵架中：攻速也下降（多組同吵懲罰更重）
          if (isTired(tw)) tw.cd /= TIRED_DEBUFF;        // 爆肝中：動作變慢
          // 讀取圈光環：範圍內攻速下降
          for (let li = 0; li < G.enemies.length; li++) {
            const le = G.enemies[li];
            if (!le.dead && le.def.slowAura && !(le.def.speech && le.speechDisabledT > 0) &&
                dist(tw.x, tw.y, le.x, le.y) <= le.def.slowAura.range) {
              tw.cd *= le.def.slowAura.mul;
              break;
            }
          }
        }
      }
    });

    /* 投射物 */
    for (let i = G.projectiles.length - 1; i >= 0; i--) {
      const p = G.projectiles[i];
      p.t += dt;
      const tx = (p.target && !p.target.dead) ? p.target.x : p.lastX;
      const ty = (p.target && !p.target.dead) ? p.target.y : p.lastY;
      p.lastX = tx; p.lastY = ty;
      const d = dist(p.x, p.y, tx, ty);
      const step = p.speed * dt;
      if (d <= step || p.t > 3) {
        if (p.target && !p.target.dead) projectileHit(p);
        G.projectiles.splice(i, 1);
      } else {
        p.x += (tx - p.x) / d * step;
        p.y += (ty - p.y) / d * step;
      }
    }

    /* 粒子 */
    for (let i = G.particles.length - 1; i >= 0; i--) {
      const pt = G.particles[i];
      if (pt.delay > 0) { pt.delay -= dt; continue; }
      pt.t += dt;
      if (pt.t > pt.dur) { G.particles.splice(i, 1); continue; }
      if (!pt.ring && !pt.anim) { pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 120 * dt; }
    }
    for (let i = G.dmgNums.length - 1; i >= 0; i--) {
      const n = G.dmgNums[i];
      n.t += dtReal; n.y -= 22 * dtReal;
      if (n.t > (n.life || 0.9)) G.dmgNums.splice(i, 1);
    }

    /* 波次結束判定（state 檢查：同幀多隻漏怪把主機打到 0 時，defeat 不可被過關覆寫） */
    if (G.state === 'playing' && G.phase === 'wave' && G.spawnQueue.length === 0 && G.enemies.length === 0) {
      if (G.mode === 'campaign' && G.levelIdx === 0 && G.waveIdx === 1 && !G.tutorialComboCast) {
        G.feuds.forEach(function (f) { f.charge = FC.MAX; });
        if (!G.tutorialComboPrompted) {
          G.tutorialComboPrompted = true;
          setBanner('最後一步：把內耗打出去！', '點場上的拳頭圖示，親手施放一次組合必殺才算完成教學。', 99);
          CD.UI.toast('教學暫停結算：請點亮起的拳頭');
        }
        return;
      }
      waveCleared();
    }
  }

  /* ---------- 對外 API ---------- */
  const API = {
    G: G,
    update: update,
    startLevel: startLevel,
    startEndless: startEndless,
    loadProgress: loadProgress,
    totalStars: totalStars,
    musouMax: musouMax,
    startWave: startWave,
    deploy: deploy,
    removeTower: removeTower,
    teamLimit: teamLimit,
    towerDef: towerDef,
    upgradeTower: upgradeTower,
    upgradeCost: upgradeCost,
    maxLevel: maxLevel,
    levelRow: levelRow,
    pickPerk: pickPerk,
    castMusou: castMusou,
    castFeud: castFeud,
    mediateFeud: mediateFeud,
    answerRollcall: answerRollcall,
    tearCard: tearCard,
    interruptElderAt: interruptElderAt,
    stallGuardAt: stallGuardAt,
    argueBudget: argueBudget,
    predeployBooth: predeployBooth,
    offerLegacy: offerLegacy,
    pickLegacy: pickLegacy,
    towerAt: towerAt,
    healCore: function (n) {
      G.coreHp = Math.min(CD.CONFIG.CORE_HP, G.coreHp + n);
      addDmgNum(CD.MAP.core.x, CD.MAP.core.y - 40, '+' + n, '#5dd66e');
      CD.UI.syncAll();
    },
    cloudBackup: function () {
      const missing = CD.CONFIG.CORE_HP - G.coreHp;
      if (missing <= 0) {
        G.dp += 2;
        addDmgNum(CD.MAP.core.x, CD.MAP.core.y - 40, '備份完整 +2 DP', '#41f2e6');
        CD.UI.toast('主機滿血：備份改存成 2 DP');
      } else {
        const heal = Math.max(1, Math.ceil(missing * 0.4));
        API.healCore(heal);
        CD.UI.toast('雲端還原：補回缺少 HP 的 40%');
      }
      CD.UI.syncAll();
    },
    /* 會議決策代價 hooks */
    addTiredAll: function (n) {
      G.towers.forEach(function (t) { t.workT += n; });
    },
    clearTiredAll: function () {
      G.towers.forEach(function (t) { t.workT = 0; t.tiredNotified = false; });
      CD.UI.toast('雞排的力量——全員滿血復活！');
    },
    addDp: function (n) {
      G.dp = Math.max(0, G.dp + n);
      CD.UI.syncAll();
    },
    addMusou: function (n) {
      G.musou = Math.min(musouMax(), G.musou + n);
      CD.UI.syncMusou();
    },
    blockDeploy: function () { G.deployBlocked = true; },
    /* 開會畫大餅：字面意義上的沒有效果 */
    toastPie: function () {
      CD.UI.toast('感覺充滿了幹勁！（沒有任何數值變化）');
      addDmgNum(CD.MAP.core.x, CD.MAP.core.y - 50, '+士氣(?)', '#c9d2e8');
    },
    /* 問天問地問各老師：隨機效果，也可能白問 */
    askAround: function () {
      const roll = Math.random();
      if (roll < 0.3) { API.healCore(12); CD.UI.toast('隔壁老師人真好，還請你們喝飲料'); }
      else if (roll < 0.55) { API.addDp(3); CD.UI.toast('通識老師給了超實用的建議'); }
      else if (roll < 0.8) { API.addMusou(30); CD.UI.toast('體育老師：「就是衝了啊！」莫名熱血'); }
      else if (roll < 0.9) { CD.UI.toast('那位老師說：「這要問你們指導老師吧。」白問了'); }
      else { API.addDp(-1); CD.UI.toast('被推銷了一本原文書。−1 DP，還簽了名'); }
    },
    addFeudChargeAll: function (n) {
      G.feuds.forEach(function (f) { f.charge = Math.min(CD.FEUD_CFG.MAX, f.charge + n); });
    },
    queueNextWave: function (mod) {
      const cur = G.nextWaveMod || {};
      if (mod.extra) cur.extra = (cur.extra || []).concat(mod.extra);
      if (mod.hpMul) cur.hpMul = (cur.hpMul || 1) * mod.hpMul;
      G.nextWaveMod = cur;
    },
    isTired: isTired,
    setModalPause: function (v) { G.modalPause = !!v; },
    togglePause: function () { if (G.state === 'playing') { G.paused = !G.paused; CD.UI.syncAll(); } },
    setSpeed: function (s) { G.speed = s; CD.UI.syncAll(); },
    backToTitle: function () { G.state = 'title'; CD.Audio.stopBgm(); CD.UI.showTitle(); },
    isCleared: function () {
      if (G.campaignCleared) return true;
      try { return localStorage.getItem('cd_campaign_cleared') === '1'; } catch (e) { return false; }
    }
  };
  return API;
})();
