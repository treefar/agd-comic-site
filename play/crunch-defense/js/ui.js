/* ============================================================
 * DOM UI：HUD、建造選單、三選一、標題／結算、輸入與主迴圈
 * ============================================================ */
'use strict';
var CD = window.CD || (window.CD = {});

CD.UI = (function () {
  const $ = function (id) { return document.getElementById(id); };
  let cv, stage;
  const W = CD.CONFIG.NATIVE_W, H = CD.CONFIG.NATIVE_H, T = CD.CONFIG.TILE;

  /* ---------- 座標換算 ---------- */
  function toNative(ev) {
    const r = cv.getBoundingClientRect();
    return { x: (ev.clientX - r.left) * (W / r.width), y: (ev.clientY - r.top) * (H / r.height) };
  }
  function toDisplay(nx, ny) {
    const r = cv.getBoundingClientRect(), s = stage.getBoundingClientRect();
    return { x: (r.left - s.left) + nx * (r.width / W), y: (r.top - s.top) + ny * (r.height / H) };
  }

  /* ---------- Sprite 縮圖 ---------- */
  function thumb(id, px) {
    const s = CD.Sprites.get(id);
    const c = document.createElement('canvas');
    c.width = px; c.height = px;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    if (s) x.drawImage(s.normal, 0, 0, px, px);
    c.className = 'thumb';
    return c;
  }

  /* ---------- HUD ---------- */
  /* 波次預告：名稱＋數量＋威脅屬性（✈飛行／👻隱形／🛡重甲），這才是「部署誰」的依據 */
  function waveThreatPreview(w) {
    if (!w || !w.groups) return '';
    const agg = {}, order = [];
    w.groups.forEach(function (g) {
      const d = CD.ENEMIES[g[0]];
      if (!d) return;
      if (!agg[d.id]) { agg[d.id] = { d: d, n: 0 }; order.push(d.id); }
      agg[d.id].n += g[1];
    });
    const parts = order.slice(0, 3).map(function (k) {
      const d = agg[k].d;
      const tags = (d.cat === 'BOSS' ? '⚠' : '') + (d.flying ? '✈' : '') +
                   (d.phase ? '👻' : '') + ((d.armor || 0) >= 20 ? '🛡' : '');
      return d.name + '×' + agg[k].n + tags;
    });
    return parts.join('／') + (order.length > 3 ? '…' : '');
  }
  function syncAll() {
    const G = CD.Game.G;
    syncTopbarVisibility(G.state === 'playing');
    let w, waveTxt;
    if (G.mode === 'endless') {
      w = CD.WAVES[G.waveIdx % CD.WAVES.length];
      waveTxt = '無盡・第 ' + G.cycle + ' 輪 第 ' + (G.waveIdx + 1) + ' 波';
    } else {
      const lv = CD.LEVELS[G.levelIdx];
      w = lv.waves[G.waveIdx % lv.waves.length];
      waveTxt = lv.name + '（第 ' + (G.waveIdx + 1) + '／' + lv.waves.length + ' 波）';
    }
    $('hud-wave').textContent = waveTxt;
    const preview = waveThreatPreview(w);
    $('hud-wavename').textContent = w.name + (preview ? ' ｜ ' + preview : '');
    $('hud-wavename').title = '本波威脅：' + preview;
    $('hud-dp').textContent = G.dp;
    $('hud-team').textContent = G.towers.length + '/' + CD.Game.teamLimit();
    $('btn-speed').textContent = '速度 ' + G.speed + 'x ▸ ' + (G.speed === 1 ? 2 : 1) + 'x';
    $('btn-pause').textContent = G.paused ? '繼續' : '暫停';
    $('btn-sound').textContent = CD.Audio.isEnabled() ? '♪ 開' : '♪ 關';
    const calc = G.enemies && G.enemies.find(function (e) { return !e.dead && e.def.argue; });
    $('btn-argue').classList.toggle('hidden', !calc);
    $('btn-argue').disabled = !calc || G.dp < calc.def.argue.cost;
    syncCore(); syncMusou();
  }
  function syncCore() {
    const G = CD.Game.G;
    const pct = Math.max(0, G.coreHp / CD.CONFIG.CORE_HP * 100);
    $('core-fill').style.width = pct + '%';
    $('core-fill').style.background = pct > 50 ? '#5dd66e' : (pct > 25 ? '#ffd23f' : '#ff5d5d');
    $('core-num').textContent = Math.max(0, Math.round(G.coreHp)) + '/' + CD.CONFIG.CORE_HP;
  }
  function syncMusou() {
    const G = CD.Game.G;
    const max = CD.Game.musouMax();
    const pct = G.musou / max * 100;
    $('musou-fill').style.width = pct + '%';
    const btn = $('btn-musou');
    if (pct >= 100) { btn.classList.add('ready'); $('musou-label').textContent = CD.TEXT.musouReady; }
    else { btn.classList.remove('ready'); $('musou-label').textContent = CD.TEXT.musouName + ' ' + Math.floor(G.musou) + '/' + max; }
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  /* ---------- 建造選單 ---------- */
  function showBuildMenu(tileIdx) {
    const G = CD.Game.G;
    const menu = $('build-menu');
    menu.innerHTML = '';
    CD.SPECIALIST_ORDER.forEach(function (id, i) {
      const def = CD.SPECIALISTS[id];
      const card = document.createElement('button');
      card.className = 'build-card';
      // 錯誤預防而非事後責備：不可選就 disabled，並分開說明「錢不夠」與「人滿了」
      const overCap = G.towers.length >= CD.Game.teamLimit();
      const tooPoor = G.dp < def.cost;
      if (overCap || tooPoor) {
        card.classList.add('poor');
        card.disabled = true;
        card.title = overCap
          ? '上場人數已滿（' + CD.Game.teamLimit() + '／' + CD.Game.teamLimit() + '），本關就這些人手了'
          : '還差 ' + (def.cost - G.dp) + ' DP';
      }
      card.appendChild(thumb(id, 40));
      const info = document.createElement('div');
      info.className = 'bc-info';
      const tile = CD.MAP.tiles[tileIdx];
      const cx = tile.x + T / 2, cy = tile.y + T / 2;
      const quarrels = [], counters = [];
      G.towers.forEach(function (tw) {
        if (tw.type !== id && Math.hypot(cx - tw.x, cy - tw.y) <= CD.FEUD_CFG.ADJ_DIST) {
          const name = CD.SPECIALISTS[tw.type].name;
          if (quarrels.indexOf(name) < 0) {
            quarrels.push(name);
            // 剋制表寫在資料裡卻從沒顯示過：部署當下就標出這組配對剋什麼
            const order = CD.SPECIALIST_ORDER;
            const key = order.indexOf(tw.type) < order.indexOf(id) ? tw.type + '_' + id : id + '_' + tw.type;
            const ctr = CD.FEUD_COUNTERS[key];
            if (ctr && counters.indexOf(ctr.label) < 0) counters.push(ctr.label + '（剋 ' + ctr.ids.length + ' 種敵人）');
          }
        }
      });
      info.innerHTML = '<b style="color:' + def.color + '">' + def.name + '</b>' +
        '<span class="bc-skill">' + def.skill + '</span>' +
        (quarrels.length ? '<span class="bc-feud">⚡ 會和 ' + quarrels.join('、') + ' 吵架</span>' : '') +
        (counters.length ? '<span class="bc-feud">◎ ' + counters.join('；') + '</span>' : '') +
        '<span class="bc-cost">' + def.cost + ' DP・快捷鍵 ' + (i + 1) + '</span>';
      card.appendChild(info);
      if (!card.disabled) card.title = def.desc;
      card.addEventListener('click', function (ev) {
        ev.stopPropagation();
        CD.Game.deploy(tileIdx, id);
      });
      menu.appendChild(card);
    });
    const tile = CD.MAP.tiles[tileIdx];
    const p = toDisplay(tile.x + T / 2, tile.y);
    menu.classList.remove('hidden');
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    const sw = stage.clientWidth;
    let left = p.x - mw / 2, top = p.y - mh - 10;
    left = Math.max(6, Math.min(sw - mw - 6, left));
    if (top < 6) top = p.y + T * (cv.getBoundingClientRect().height / H) + 10;
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
  }
  function hideBuildMenu() { $('build-menu').classList.add('hidden'); }

  /* ---------- 塔資訊 ---------- */
  function showTowerInfo(idx) {
    const G = CD.Game.G;
    const tw = G.towers[idx];
    if (!tw) return;
    const def = CD.SPECIALISTS[tw.type];
    const panel = $('tower-info');
    panel.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'ti-head';
    head.appendChild(thumb(tw.type, 36));
    const row = CD.Game.levelRow(tw.lv || 1);
    head.innerHTML += '<div><b style="color:' + def.color + '">' + def.name +
      (row.tag ? ' <span style="color:' + def.color + '">' + row.tag + '</span>' : '') +
      '</b><br><span class="ti-skill">' + def.skill + '・' + row.name + '</span></div>';
    panel.appendChild(head);
    const desc = document.createElement('div');
    desc.className = 'ti-desc';
    desc.textContent = def.desc;
    panel.appendChild(desc);
    // 爆肝進度不再是黑盒：未爆肝也顯示已連續工作秒數
    const tiredAt = 45 + (G.buffs && G.buffs.tiredGrace || 0);
    const workInfo = document.createElement('div');
    workInfo.className = 'ti-desc';
    if (CD.Game.isTired(tw)) {
      workInfo.style.color = '#ffd23f';
      workInfo.textContent = '⚠ ' + CD.TEXT.tiredTag + '：輸出下降中。請他休息可完全恢復（吵架會更兇）。';
    } else {
      workInfo.style.color = '#8a94b8';
      workInfo.textContent = '已連續工作 ' + Math.floor(tw.workT) + '／' + tiredAt + ' 秒（波間會恢復）';
    }
    panel.appendChild(workInfo);
    // 升級：DP 在本關的主要出口，按鈕要把「花多少、換到什麼」講清楚
    const eff = CD.Game.towerDef(tw);
    const stats = document.createElement('div');
    stats.className = 'ti-desc';
    stats.style.color = '#8a94b8';
    stats.textContent = '傷害 ' + Math.round(eff.damage) + '　攻速 ' + eff.interval.toFixed(2) +
      ' 秒／發　射程 ' + Math.round(eff.range);
    panel.appendChild(stats);
    if ((tw.lv || 1) < CD.Game.maxLevel()) {
      const next = CD.Game.levelRow((tw.lv || 1) + 1);
      const cost = CD.Game.upgradeCost(tw);
      const up = document.createElement('button');
      up.className = 'ti-upgrade';
      up.disabled = G.dp < cost;
      up.innerHTML = '<b>升級：' + next.name + '</b><span>' + cost + ' DP　傷害 +' +
        Math.round((next.dmgMul / row.dmgMul - 1) * 100) + '%　攻速 +' +
        Math.round((1 / (next.rateMul / row.rateMul) - 1) * 100) + '%</span>';
      if (up.disabled) up.title = '還差 ' + (cost - G.dp) + ' DP';
      up.addEventListener('click', function (ev) {
        ev.stopPropagation();
        CD.Game.upgradeTower(idx);
      });
      panel.appendChild(up);
    }
    const refund = Math.max(0, (tw.spent || def.cost) - 1);
    const btn = document.createElement('button');
    btn.className = 'ti-remove';
    btn.textContent = '請他休息（返還 ' + refund + ' DP）';
    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      CD.Game.removeTower(idx);
    });
    panel.appendChild(btn);
    const p = toDisplay(tw.x, tw.y - 24);
    panel.classList.remove('hidden');
    const mw = panel.offsetWidth;
    let left = Math.max(6, Math.min(stage.clientWidth - mw - 6, p.x - mw / 2));
    panel.style.left = left + 'px';
    panel.style.top = Math.max(6, p.y - panel.offsetHeight) + 'px';
  }
  function hideTowerInfo() { $('tower-info').classList.add('hidden'); }

  /* ---------- 三選一 ---------- */
  function showPerks(picks) {
    const wrap = $('perk-cards');
    wrap.innerHTML = '';
    picks.forEach(function (p, i) {
      const card = document.createElement('button');
      card.className = 'perk-card';
      card.appendChild(thumb('ICON_' + p.icon, 48));
      card.innerHTML += '<b>' + p.name + '</b><p>' + p.desc + '</p><span class="pk-key">按 ' + (i + 1) + '</span>';
      card.addEventListener('click', function () { CD.Game.pickPerk(p.id); });
      wrap.appendChild(card);
    });
    $('perk-overlay').classList.remove('hidden');
  }
  function hidePerks() { $('perk-overlay').classList.add('hidden'); }

  /* ---------- 戰役 2.0：關卡選擇（LEVELMAP 甘特圖） ---------- */
  /* 十個節點在 LEVELMAP（836×470）上的座標 */
  const NODE_POS = [[113, 94], [232, 99], [338, 131], [430, 184], [376, 216],
                    [287, 262], [383, 296], [459, 342], [613, 296], [613, 377]];
  let pendingLevel = -1;

  function showLevelSelect() {
    hideTitle();
    $('end-overlay').classList.add('hidden');
    $('level-clear').classList.add('hidden');
    $('level-info').classList.add('hidden');
    const prog = CD.Game.loadProgress();
    const wrap = $('level-nodes');
    wrap.innerHTML = '';
    // 「接下來該打哪一關」：已解鎖但還沒拿到星星的第一關；全通關則沒有
    let nextIdx = -1;
    for (let n = 0; n < CD.LEVELS.length; n++) {
      if (n < prog.unlocked && !(prog.stars[n] > 0)) { nextIdx = n; break; }
    }
    CD.LEVELS.forEach(function (lv, i) {
      const unlocked = i < prog.unlocked;
      const done = (prog.stars[i] || 0) > 0;
      const btn = document.createElement('button');
      btn.className = 'level-node' + (unlocked ? '' : ' locked');
      btn.style.left = (NODE_POS[i][0] / 836 * 100) + '%';
      btn.style.top = (NODE_POS[i][1] / 470 * 100) + '%';
      const img = document.createElement('img');
      img.src = 'assets/sprites/' + (unlocked ? (done ? 'UI_node_done' : 'UI_node_now') : 'UI_node_lock') + '.png';
      btn.appendChild(img);
      if (done) {
        const st = document.createElement('span');
        st.className = 'ln-stars';
        st.textContent = '★'.repeat(prog.stars[i]);
        btn.appendChild(st);
      }
      // 關卡名稱要畫在盤面上。原本只放在 btn.title（hover tooltip），
      // 玩家看到的是十個一模一樣的圈，既認不出哪關是什麼，也看不出下一關該打哪。
      const nm = document.createElement('span');
      nm.className = 'ln-name';
      nm.textContent = lv.name;
      btn.appendChild(nm);
      // 「下一關」＝已解鎖之中還沒通關的第一關，給它一個持續脈動的外框
      if (unlocked && !done && i === nextIdx) btn.classList.add('is-next');
      btn.title = lv.name + '・' + lv.sub;
      btn.addEventListener('click', function () {
        if (!unlocked) { toast('先過前面的死線再說'); return; }
        pendingLevel = i;
        $('li-name').textContent = lv.name;
        // 星數綁定永久解鎖，標準必須每一關都看得到
        $('li-sub').textContent = lv.sub + '（' + lv.waves.length + ' 波）' +
          ((i === 7 || i === 8) ? '｜三星：主機 ≥65 且展場事故 ≤8' : '｜三星：主機 ≥75');
        $('level-info').classList.remove('hidden');
      });
      wrap.appendChild(btn);
    });
    $('level-screen').classList.remove('hidden');
  }
  function hideLevelSelect() { $('level-screen').classList.add('hidden'); }

  /* ---------- 過場插圖播放器（支援序列，點擊逐張前進） ---------- */
  let csQueue = [], csDone = null;
  function playCutscene(names, onDone) {
    const list = (names || []).filter(function (n) { return !!n; });
    if (list.length === 0) { if (onDone) onDone(); return; }
    csQueue = list.slice(); csDone = onDone || null;
    $('cutscene-img').src = 'assets/sprites/' + csQueue.shift() + '.png';
    $('cutscene').classList.remove('hidden');
  }
  function advanceCutscene() {
    if (csQueue.length > 0) {
      $('cutscene-img').src = 'assets/sprites/' + csQueue.shift() + '.png';
    } else {
      $('cutscene').classList.add('hidden');
      const cb = csDone; csDone = null;
      if (cb) cb();
    }
  }

  /* ---------- v5 名場面 CG／鑑賞廊 ---------- */
  let cgQueue = [], cgActive = null, cgTimer = null;
  function loadCGUnlocks() {
    let ids = [];
    try { ids = JSON.parse(localStorage.getItem('cd_cg_unlocks') || '[]'); } catch (e) {}
    if (!Array.isArray(ids)) ids = [];
    // 舊存檔回溯：過了最終評圖就看過九頭龍；全戰役通關就看過晨光。
    const prog = CD.Game.loadProgress();
    if ((((prog.stars || {})[6]) || 0) > 0 && ids.indexOf('hydra') < 0) ids.push('hydra');
    if (CD.Game.isCleared() && ids.indexOf('dawn') < 0) ids.push('dawn');
    try { localStorage.setItem('cd_cg_unlocks', JSON.stringify(ids)); } catch (e) {}
    return ids;
  }
  function saveCGUnlocks(ids) {
    try { localStorage.setItem('cd_cg_unlocks', JSON.stringify(ids)); } catch (e) {}
  }
  function showNextCG() {
    if (cgActive || cgQueue.length === 0) return;
    cgActive = cgQueue.shift();
    const d = cgActive.def;
    CD.Game.setModalPause(true);
    $('cg-kicker').textContent = cgActive.kicker || '名場面解鎖';
    $('cg-img').src = 'assets/sprites/' + d.asset + '.png';
    $('cg-img').alt = d.title;
    $('cg-title').textContent = d.title + '｜' + d.hint;
    $('cg-count').textContent = loadCGUnlocks().length + ' / ' + CD.CG_EVENTS.length;
    const ov = $('cg-overlay');
    ov.classList.remove('hidden', 'enter');
    void ov.offsetWidth;
    ov.classList.add('enter');
    clearTimeout(cgTimer);
    cgTimer = setTimeout(closeCurrentCG, 2500);
  }
  function closeCurrentCG() {
    if (!cgActive) return;
    clearTimeout(cgTimer);
    const done = cgActive.done;
    cgActive = null;
    $('cg-overlay').classList.add('hidden');
    $('cg-overlay').classList.remove('enter');
    if (done) done();
    if (cgQueue.length > 0) showNextCG();
    else CD.Game.setModalPause(false);
  }
  function queueCG(id, kicker, done) {
    const def = CD.CG_EVENTS.find(function (x) { return x.id === id; });
    if (!def) return false;
    cgQueue.push({ def: def, kicker: kicker, done: done || null });
    showNextCG();
    return true;
  }
  function triggerCG(id, done) {
    const ids = loadCGUnlocks();
    if (ids.indexOf(id) >= 0) return false;
    ids.push(id); saveCGUnlocks(ids);
    return queueCG(id, '名場面解鎖', done);
  }
  function triggerOneCG(ids) {
    const unlocked = loadCGUnlocks();
    const unseen = ids.filter(function (id) { return unlocked.indexOf(id) < 0; });
    if (!unseen.length) return false;
    let turn = 0;
    try { turn = Number(localStorage.getItem('cd_rage_cg_turn') || 0); } catch (e) {}
    const pick = unseen[turn % unseen.length];
    try { localStorage.setItem('cd_rage_cg_turn', String(turn + 1)); } catch (e) {}
    return triggerCG(pick);
  }
  function showGallery() {
    const ids = loadCGUnlocks();
    const wrap = $('gallery-grid');
    wrap.innerHTML = '';
    CD.CG_EVENTS.forEach(function (d, i) {
      const unlocked = ids.indexOf(d.id) >= 0;
      const card = document.createElement('button');
      card.className = 'gallery-card ' + (unlocked ? 'unlocked' : 'locked');
      const frame = document.createElement('img');
      frame.className = 'gallery-frame';
      frame.src = 'assets/sprites/' + (unlocked ? 'UI_frame' : 'UI_frame_lock') + '.png';
      frame.alt = '';
      const pic = document.createElement('img');
      pic.className = 'gallery-thumb';
      pic.src = unlocked ? ('assets/sprites/' + d.asset + '.png') : 'assets/sprites/UI_frame_lock.png';
      pic.alt = unlocked ? d.title : '尚未解鎖';
      card.appendChild(frame); card.appendChild(pic);
      const cap = document.createElement('span');
      cap.textContent = unlocked ? ((i + 1) + '. ' + d.title) : ((i + 1) + '. ???');
      card.appendChild(cap);
      if (unlocked) card.addEventListener('click', function () {
        $('gallery-overlay').classList.add('hidden');
        queueCG(d.id, '名場面重播', showGallery);
      });
      wrap.appendChild(card);
    });
    $('gallery-complete').classList.toggle('hidden', ids.length < CD.CG_EVENTS.length);
    $('gallery-overlay').classList.remove('hidden');
  }
  function hideGallery() { $('gallery-overlay').classList.add('hidden'); }

  /* ---------- 首次吵架全螢幕教學 ---------- */
  function showFeudTutorial() {
    hideBuildMenu(); hideTowerInfo();
    CD.Game.setModalPause(true);
    $('tutorial-overlay').classList.remove('hidden');
  }
  function hideFeudTutorial() {
    $('tutorial-overlay').classList.add('hidden');
    CD.Game.setModalPause(false);
  }

  /* ---------- 每關傳承 ---------- */
  function showLegacy(picks) {
    const wrap = $('legacy-cards');
    wrap.innerHTML = '';
    picks.forEach(function (p) {
      const card = document.createElement('button');
      card.className = 'legacy-card';
      card.innerHTML = '<b>' + p.name + '</b><p>' + p.desc + '</p>';
      card.addEventListener('click', function () { CD.Game.pickLegacy(p.id); });
      wrap.appendChild(card);
    });
    $('legacy-overlay').classList.remove('hidden');
  }
  function hideLegacy() { $('legacy-overlay').classList.add('hidden'); }

  /* ---------- L7 佈展拖拉：座位即初始陣型 ---------- */
  let boothSeats = [null, null, null, null], boothDrag = null, boothShownThisSession = false;
  const BOOTH_PAIRS = [[0, 1], [0, 2], [1, 3], [2, 3]];
  const BOOTH_POS = [[62, 53], [258, 53], [62, 137], [258, 137]];
  function boothMember(id, seated) {
    const d = CD.SPECIALISTS[id];
    const b = document.createElement('button');
    b.className = 'booth-member'; b.draggable = true; b.dataset.id = id;
    b.innerHTML = '<img src="assets/sprites/' + id + '.png" alt=""><span>' + d.name.replace('同學', '') + '</span>';
    b.addEventListener('dragstart', function (ev) {
      boothDrag = id; ev.dataTransfer.setData('text/plain', id);
    });
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (seated) {
        boothSeats[boothSeats.indexOf(id)] = null; boothDrag = null; renderBooth();
      } else {
        boothDrag = id; toast('已拿起' + d.name + '，點一個座位放下');
      }
    });
    return b;
  }
  function placeBooth(id, seat) {
    if (!CD.SPECIALISTS[id] || seat < 0 || seat > 3) return;
    const old = boothSeats.indexOf(id);
    if (old >= 0) boothSeats[old] = null;
    boothSeats[seat] = id;
    boothDrag = null;
    renderBooth();
  }
  function renderBooth() {
    for (let i = 0; i < 4; i++) {
      const seat = $('booth-seat-' + i);
      seat.innerHTML = '';
      if (boothSeats[i]) seat.appendChild(boothMember(boothSeats[i], true));
      else { const s = document.createElement('span'); s.textContent = '座位 ' + String.fromCharCode(65 + i); seat.appendChild(s); }
    }
    const roster = $('booth-roster'); roster.innerHTML = '';
    CD.SPECIALIST_ORDER.forEach(function (id) {
      if (boothSeats.indexOf(id) < 0) roster.appendChild(boothMember(id, false));
    });
    const svg = $('booth-lines'); svg.innerHTML = '';
    let feuds = 0;
    BOOTH_PAIRS.forEach(function (p) {
      if (!boothSeats[p[0]] || !boothSeats[p[1]] || boothSeats[p[0]] === boothSeats[p[1]]) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', BOOTH_POS[p[0]][0]); line.setAttribute('y1', BOOTH_POS[p[0]][1]);
      line.setAttribute('x2', BOOTH_POS[p[1]][0]); line.setAttribute('y2', BOOTH_POS[p[1]][1]);
      svg.appendChild(line); feuds++;
    });
    const filled = boothSeats.filter(Boolean).length;
    $('booth-summary').textContent = filled < 4
      ? '已安排 ' + filled + '／4 人；異職種相鄰會立刻形成紅色內耗線。'
      : '佈展完成：' + feuds + ' 條內耗線。開場直接擁有四位隊友，預計剩餘 ' + Math.max(0, CD.Game.G.dp - 8) + ' DP。';
    $('btn-booth-confirm').disabled = filled < 4;
  }
  function showBooth() {
    // 每次載入頁面可示範一次；避免展場共用機被永久存檔吃掉這段玩法。
    if (boothShownThisSession) return false;
    boothSeats = [null, null, null, null]; boothDrag = null;
    renderBooth();
    CD.Game.setModalPause(true);
    $('booth-overlay').classList.remove('hidden');
    return true;
  }
  function closeBooth(useLayout) {
    if (useLayout && !CD.Game.predeployBooth(boothSeats.slice())) { toast('座位配置無法部署，請重排'); return; }
    boothShownThisSession = true;
    $('booth-overlay').classList.add('hidden');
    CD.Game.setModalPause(false);
    if (!useLayout) toast('跳過佈展：保留 12 DP，自由安排座位');
  }

  /* ---------- 關卡通過結算 ---------- */
  function showLevelClear(stars) {
    // 按鈕文字對齊實際行為：下一步其實是「傳承三選一」
    $('btn-lc-next').innerHTML = CD.Game.G.levelIdx < CD.LEVELS.length - 1
      ? '<b>選擇傳承 ▶</b>' : '<b>回到進度表</b>';
    $('lc-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const total = CD.Game.totalStars();
    const expo = CD.Game.G.levelIdx === 7 || CD.Game.G.levelIdx === 8;
    $('lc-msg').textContent = stars === 3 ? '主機幾乎無傷。你們是怎麼辦到的？'
      : (stars === 2 ? '有驚無險。喝口水，下一關要來了。' : '低空掠過。主機在冒煙，但活著就是勝利。');
    $('lc-msg').textContent += '　目前累積 ' + total + ' 星。';
    if (expo) $('lc-msg').textContent += ' 展場事故 ' + CD.Game.G.stats.leaks + ' 次。';
    $('level-clear').classList.remove('hidden');
  }

  /* ---------- 標題／結算 ---------- */
  function showTitle() {
    $('title-screen').classList.remove('hidden');
    $('end-overlay').classList.add('hidden');
    $('end-overlay').classList.remove('win', 'perfect', 'barely', 'lose', 'legend');
    const unlocked = CD.Game.isCleared();
    const btn = $('btn-endless');
    btn.disabled = !unlocked;
    $('endless-sub').textContent = unlocked ? '波次無限循環，越撐越兇' : CD.TEXT.endlessSub;
    const stars = CD.Game.totalStars();
    const cg = loadCGUnlocks().length;
    const meta = [
      '<b>' + stars + '／30 星</b>・名場面 ' + cg + '／8',
      (stars >= 10 ? '<span class="meta-unlocked">✓ 10★ 開場 +2 DP</span>' : '10★ 開場 +2 DP'),
      (stars >= 20 ? '<span class="meta-unlocked">✓ 20★ 必殺門檻降至 90</span>' : '20★ 必殺門檻降至 90'),
      (stars >= 30 ? '<span class="meta-unlocked">✓ 30★ 真・畢業結局</span>' : '30★ 真・畢業結局')
    ];
    $('meta-progress').innerHTML = meta.join('　｜　');
    $('title-screen').classList.toggle('meta-master', stars >= 30);
    $('t-title').textContent = stars >= 30 ? '死線防衛隊：熬出名堂' : CD.TEXT.title;
  }
  function hideTitle() { $('title-screen').classList.add('hidden'); }
  /* kind: 'perfect' | 'win' | 'barely' | 'lose' | 'legend'（true/false 相容舊呼叫） */
  function showEnd(kind) {
    if (kind === true) kind = 'win';
    if (kind === false) kind = 'lose';
    const G = CD.Game.G;
    syncTopbarVisibility(G.state === 'playing');
    const isWin = kind === 'perfect' || kind === 'win' || kind === 'barely';
    const TITLES = { perfect: '真的畢業了。', win: CD.TEXT.victory, barely: CD.TEXT.barely, lose: CD.TEXT.defeat, legend: CD.TEXT.legend };
    const SUBS = { perfect: '三十顆星、十道死線、八次爆炸。這次沒有人用身體擋螢幕；觀眾真的停下來玩了。', win: CD.TEXT.victorySub, barely: CD.TEXT.barelySub, lose: CD.TEXT.defeatSub, legend: CD.TEXT.legendSub };
    const COLORS = { perfect: '#ffd7a8', win: '#5dd66e', barely: '#ffd23f', lose: '#ff5d5d', legend: '#41f2e6' };
    $('end-title').textContent = TITLES[kind];
    $('end-title').style.color = COLORS[kind];
    $('end-sub').textContent = SUBS[kind];
    let waves = (G.mode === 'endless')
      ? ((G.cycle - 1) * CD.WAVES.length + G.waveIdx) + ' 波（無盡）'
      : Math.min(G.waveIdx + (isWin ? 1 : 0), CD.LEVELS[G.levelIdx].waves.length) + '/' + CD.LEVELS[G.levelIdx].waves.length + ' 波';
    $('end-stats').innerHTML =
      '<span>擊退威脅：<b>' + G.stats.kills + '</b></span>' +
      '<span>漏進主機：<b>' + G.stats.leaks + '</b></span>' +
      '<span>撐過：<b>' + waves + '</b></span>' +
      '<span>部署人次：<b>' + G.stats.deployed + '</b></span>';
    const ov = $('end-overlay');
    ov.classList.remove('perfect', 'win', 'barely', 'lose', 'legend', 'hidden');
    ov.classList.add(kind);
    if (isWin && G.mode === 'campaign') $('btn-end-endless').classList.remove('hidden');
    else $('btn-end-endless').classList.add('hidden');
  }

  /* ---------- 底部隊伍列：從靜態說明卡升級成上場狀態儀表板 ---------- */
  function buildRoster() {
    const wrap = $('roster-cards');
    wrap.innerHTML = '';
    CD.SPECIALIST_ORDER.forEach(function (id, i) {
      const def = CD.SPECIALISTS[id];
      const card = document.createElement('div');
      card.className = 'roster-card';
      card.dataset.type = id;
      card.style.borderColor = def.color;
      card.appendChild(thumb(id, 28));
      // 技能與在場狀態併成一行：隊伍列每省一行，畫布就多 14px 的整數倍空間
      card.innerHTML += '<div class="rc-txt"><b style="color:' + def.color + '">' + def.name +
        '</b><span>' + def.skill + '・' + def.cost + ' DP<em class="rc-count"></em></span></div>';
      card.title = def.desc;
      wrap.appendChild(card);
    });
  }
  function syncRoster() {
    const G = CD.Game.G;
    const inGame = G.state === 'playing';
    document.querySelectorAll('#roster-cards .roster-card').forEach(function (card) {
      const id = card.dataset.type;
      const onField = inGame ? G.towers.filter(function (t) { return t.type === id; }) : [];
      const worst = onField.reduce(function (m, t) { return Math.max(m, t.workT); }, 0);
      const el = card.querySelector('.rc-count');
      if (!el) return;
      if (!inGame) { el.textContent = ''; card.classList.remove('rc-tired'); return; }
      el.textContent = onField.length ? ('在場 ' + onField.length + (worst >= 45 ? '・爆肝中' : '')) : '未上場';
      card.classList.toggle('rc-tired', worst >= 45);
    });
  }

  /* ---------- 輸入 ---------- */
  function hitTile(n) {
    for (let i = 0; i < CD.MAP.tiles.length; i++) {
      const t = CD.MAP.tiles[i];
      if (n.x >= t.x && n.x <= t.x + T && n.y >= t.y && n.y <= t.y + T) return i;
    }
    return -1;
  }
  function hitTower(n) {
    const G = CD.Game.G;
    for (let i = 0; i < G.towers.length; i++) {
      const t = G.towers[i];
      const dx = n.x - t.x, dy = n.y - (t.y - 4);
      if (dx * dx + dy * dy < 20 * 20) return i;
    }
    return -1;
  }

  function bindInput() {
    // pointer 事件同時涵蓋滑鼠、觸控與筆（行動裝置／展場觸控螢幕）
    cv.addEventListener('pointermove', function (ev) {
      const G = CD.Game.G;
      const n = toNative(ev);
      G.hoverTile = hitTile(n);
      G.hoverTowerIdx = hitTower(n);
      cv.style.cursor = (G.hoverTile >= 0 || G.hoverTowerIdx >= 0) ? 'pointer' : '';
    });
    cv.addEventListener('pointerdown', function (ev) {
      CD.Audio.unlock();
      // 觸控沒有 hover：按下瞬間先補一次 hover 更新，射程圈等資訊才會出現
      if (ev.pointerType !== 'mouse') {
        const G0 = CD.Game.G;
        const n0 = toNative(ev);
        G0.hoverTile = hitTile(n0);
        G0.hoverTowerIdx = hitTower(n0);
      }
      const G = CD.Game.G;
      if (G.state !== 'playing' || G.perkChoices || G.modalPause || G.paused) return;
      const n = toNative(ev);
      // Boss 反制窗口最優先：「當年學長」張嘴只有短暫窗口，爆氣圖示隨時都在。
      if (CD.Game.interruptElderAt(n.x, n.y)) return;
      if (CD.Game.stallGuardAt(n.x, n.y)) return;
      // 爆氣圖示：滿槽→組合必殺；吵架中→勸架換部分爆氣（落在隊友命中區內時讓位給隊友）
      for (let fi = 0; fi < G.feuds.length; fi++) {
        const f = G.feuds[fi];
        if (f.iconX === undefined) continue;
        const dx = n.x - f.iconX, dy = n.y - f.iconY;
        if (dx * dx + dy * dy < 24 * 24 && hitTower(n) < 0) { // 半徑 24：R5 圖示顯示 48px，同步達 44px 觸控目標
          if (f.charge >= CD.FEUD_CFG.MAX) { CD.Game.castFeud(f); return; }
          if (f.quarreling) { CD.Game.mediateFeud(f); return; }
        }
      }
      const twIdx = hitTower(n);
      if (twIdx >= 0) {
        if (CD.Game.answerRollcall(twIdx)) return;
        G.selectedTower = twIdx; G.selectedTile = -1;
        hideBuildMenu(); showTowerInfo(twIdx);
        CD.Audio.play('click');
        return;
      }
      const tile = hitTile(n);
      if (tile >= 0 && G.blockedTiles && G.blockedTiles[tile] > 0) {
        CD.Game.tearCard(tile); return;
      }
      if (tile >= 0 && !G.towers.some(function (t) { return t.tile === tile; })) {
        G.selectedTile = tile; G.selectedTower = -1;
        hideTowerInfo(); showBuildMenu(tile);
        CD.Audio.play('click');
        return;
      }
      G.selectedTile = -1; G.selectedTower = -1;
      hideBuildMenu(); hideTowerInfo();
    });
    document.addEventListener('keydown', function (ev) {
      CD.Audio.unlock();
      const G = CD.Game.G;
      const k = ev.key;
      if (!$('cg-overlay').classList.contains('hidden')) {
        if (k === 'Escape' || k === 'Enter' || k === ' ') { ev.preventDefault(); closeCurrentCG(); }
        return;
      }
      if (!$('cutscene').classList.contains('hidden')) {   // README 承諾的「Esc 跳過演出」補上
        if (k === 'Escape' || k === 'Enter' || k === ' ') { ev.preventDefault(); advanceCutscene(); }
        return;
      }
      if (!$('gallery-overlay').classList.contains('hidden')) {
        if (k === 'Escape') hideGallery();
        return;
      }
      if (!$('tutorial-overlay').classList.contains('hidden')) {
        if (k === 'Escape' || k === 'Enter' || k === ' ') hideFeudTutorial();
        return;
      }
      if (!$('pause-menu').classList.contains('hidden')) {
        if (k === 'Escape' || k === 'p' || k === 'P') CD.Game.togglePause();
        return;
      }
      if (!$('booth-overlay').classList.contains('hidden')) {
        // 佈展是完整凍結的教學儀式；不讓空白、P、M 偷跑戰鬥狀態。
        return;
      }
      if (G.perkChoices) {   // 三選一快捷鍵
        if (k >= '1' && k <= '3') {
          const p = G.perkChoices[Number(k) - 1];
          if (p) CD.Game.pickPerk(p.id);
        }
        return;
      }
      if (G.legacyChoices) {
        if (k >= '1' && k <= '3') {
          const p = G.legacyChoices[Number(k) - 1];
          if (p) CD.Game.pickLegacy(p.id);
        }
        return;
      }
      if (G.state !== 'playing') return;
      if (k === ' ') {
        ev.preventDefault();
        if (G.phase === 'prep') CD.Game.startWave(true);
        else CD.Game.togglePause();
      } else if (k === 'p' || k === 'P') {
        CD.Game.togglePause();
      } else if (k === 'm' || k === 'M') {
        CD.Game.castMusou();
      } else if (k === 'F11') {
        // 桌面版由 Electron 攔下；瀏覽器多半也會自己處理，這裡是保險
        ev.preventDefault();
        toggleFullscreen();
      } else if (k === 'u' || k === 'U') {
        // 選中隊友時 U 直接升級：升級是波間高頻操作，不該每次都要移到面板按鈕
        if (G.selectedTower >= 0) CD.Game.upgradeTower(G.selectedTower);
        else CD.UI.toast('先點一位隊友，再按 U 升級');
      } else if (k === 'Escape') {
        // 有選取先清選取；沒有選取＝開暫停選單（戰鬥中的退出路徑）
        if (G.selectedTile >= 0 || G.selectedTower >= 0) {
          G.selectedTile = -1; G.selectedTower = -1;
          hideBuildMenu(); hideTowerInfo();
        } else {
          CD.Game.togglePause();
        }
      } else if (k >= '1' && k <= '4' && G.selectedTile >= 0) {
        CD.Game.deploy(G.selectedTile, CD.SPECIALIST_ORDER[Number(k) - 1]);
      }
    });
  }

  /* ---------- 按鈕 ---------- */
  function bindButtons() {
    $('btn-campaign').addEventListener('click', function () {
      CD.Audio.unlock(); CD.Audio.play('click');
      showLevelSelect();
    });
    $('btn-endless').addEventListener('click', function () {
      CD.Audio.unlock(); CD.Audio.play('click');
      hideTitle(); CD.Game.startEndless();
    });
    /* 戰役 2.0 */
    $('btn-level-go').addEventListener('click', function () {
      if (pendingLevel < 0) return;
      CD.Audio.play('click');
      const lv = CD.LEVELS[pendingLevel];
      hideLevelSelect();
      const idx = pendingLevel;
      playCutscene(lv.cutscene, function () {
        CD.Game.startLevel(idx);
        if (idx === 7) showBooth();
      });
    });
    $('btn-level-back').addEventListener('click', function () {
      hideLevelSelect(); showTitle();
    });
    $('cutscene').addEventListener('click', function () {
      CD.Audio.play('click'); advanceCutscene();
    });
    $('btn-lc-next').addEventListener('click', function () {
      CD.Audio.play('click');
      $('level-clear').classList.add('hidden');
      CD.Game.offerLegacy();
    });
    /* 暫停選單：戰鬥中終於有「重打／放棄」的路徑，不用再按 F5 */
    $('btn-pause-resume').addEventListener('click', function () { CD.Game.togglePause(); });
    $('btn-pause-restart').addEventListener('click', function () {
      CD.Game.G.paused = false;
      $('pause-menu').classList.add('hidden');
      if (CD.Game.G.mode === 'endless') CD.Game.startEndless();
      else CD.Game.startLevel(CD.Game.G.levelIdx);
    });
    $('btn-pause-quit').addEventListener('click', function () {
      CD.Game.G.paused = false;
      $('pause-menu').classList.add('hidden');
      if (CD.Game.G.mode === 'endless') { CD.Game.backToTitle(); }
      else { CD.Game.G.state = 'levelselect'; showLevelSelect(); }
    });
    $('btn-musou').addEventListener('click', function () { CD.Game.castMusou(); });
    $('btn-speed').addEventListener('click', function () {
      CD.Game.setSpeed(CD.Game.G.speed === 1 ? 2 : 1);
    });
    $('btn-pause').addEventListener('click', function () { CD.Game.togglePause(); });
    $('btn-sound').addEventListener('click', function () {
      CD.Audio.setEnabled(!CD.Audio.isEnabled()); syncAll();
    });
    $('btn-fullscreen').addEventListener('click', function () {
      CD.Audio.play('click'); toggleFullscreen();
    });
    initVolumeSliders();
    // 進出全螢幕會觸發 resize（縮放已綁在那裡），這裡只同步按鈕文字
    document.addEventListener('fullscreenchange', syncFullscreenBtn);
    document.addEventListener('webkitfullscreenchange', syncFullscreenBtn);
    $('btn-startwave').addEventListener('click', function () {
      if (CD.Game.G.phase === 'prep') CD.Game.startWave(true);
    });
    $('btn-argue').addEventListener('click', function () { CD.Game.argueBudget(); });
    $('btn-gallery').addEventListener('click', function () { CD.Audio.play('click'); showGallery(); });
    $('btn-gallery-close').addEventListener('click', hideGallery);
    $('cg-overlay').addEventListener('click', closeCurrentCG);
    $('btn-tutorial-ok').addEventListener('click', hideFeudTutorial);
    $('btn-booth-skip').addEventListener('click', function () { closeBooth(false); });
    $('btn-booth-confirm').addEventListener('click', function () { closeBooth(true); });
    for (let si = 0; si < 4; si++) {
      (function (seatNo) {
        const seat = $('booth-seat-' + seatNo);
        seat.addEventListener('dragover', function (ev) { ev.preventDefault(); seat.classList.add('dragover'); });
        seat.addEventListener('dragleave', function () { seat.classList.remove('dragover'); });
        seat.addEventListener('drop', function (ev) {
          ev.preventDefault(); seat.classList.remove('dragover');
          placeBooth(ev.dataTransfer.getData('text/plain') || boothDrag, seatNo);
        });
        seat.addEventListener('click', function () { if (boothDrag) placeBooth(boothDrag, seatNo); });
      })(si);
    }
    $('btn-end-title').addEventListener('click', function () { CD.Game.backToTitle(); });
    $('btn-end-retry').addEventListener('click', function () {
      $('end-overlay').classList.add('hidden');
      if (CD.Game.G.mode === 'endless') CD.Game.startEndless();
      else CD.Game.startLevel(CD.Game.G.levelIdx);   // 重打當前關
    });
    $('btn-end-endless').addEventListener('click', function () {
      $('end-overlay').classList.add('hidden');
      CD.Game.startEndless();
    });
  }

  /* ---------- 主迴圈 ---------- */
  let lastT = 0;
  function loop(ts) {
    const dt = Math.min(0.1, (ts - lastT) / 1000 || 0.016);
    lastT = ts;
    CD.Game.update(dt);
    CD.Render.draw(CD.Game);
    // 動態 HUD
    const G = CD.Game.G;
    syncTopbarVisibility(G.state === 'playing');
    const btn = $('btn-startwave');
    if (G.state === 'playing' && G.phase === 'prep') {
      btn.classList.remove('hidden');
      btn.textContent = G.tutorialGate && G.feuds.length === 0
        ? '⚡ 先安排吵架搭檔'
        : '開波（' + Math.ceil(G.prepLeft) + '）';
    } else {
      btn.classList.add('hidden');
    }
    const calc = G.enemies && G.enemies.find(function (e) { return !e.dead && e.def.argue; });
    $('btn-argue').classList.toggle('hidden', !(G.state === 'playing' && calc));
    $('btn-argue').disabled = !calc || G.dp < (calc ? calc.def.argue.cost : 3) || (G.argueCd || 0) > 0;
    // 暫停選單同步
    $('pause-menu').classList.toggle('hidden', !(G.state === 'playing' && G.paused));
    // Boss 專屬血條：打了三分鐘的對手值得一條像樣的血條
    const boss = (G.state === 'playing' && G.enemies) ? G.enemies.find(function (e) { return !e.dead && e.def.cat === 'BOSS'; }) : null;
    const bb = $('boss-bar');
    if (boss && !(boss.def.fakeHp && !boss.exposed)) {
      bb.classList.remove('hidden');
      $('boss-bar-name').textContent = '⚠ ' + boss.def.name;
      const bpct = boss.def.immune ? 100 : Math.max(0, boss.hp / boss.maxHp * 100);
      $('boss-bar-fill').style.width = bpct + '%';
    } else bb.classList.add('hidden');
    // roster 儀表板節流更新（每 250ms）
    if (!loop._rosterT || ts - loop._rosterT > 250) { loop._rosterT = ts; syncRoster(); }
    requestAnimationFrame(loop);
  }

  /* ---------- 整數倍縮放（包殼上架必要） ----------
   * 畫布原生 836×470。CSS 若用 width:100% 讓它縮成 1.237 倍，
   * 一部分像素會變成 1px、另一部分 2px——像素風最刺眼的瑕疵，
   * 而且 1920×1080 下畫面只佔 54%，截不出合格的商店頁截圖。
   * 這裡由高而低試整數倍，取第一個「整個版面塞得進視窗」的倍率。
   * 頂部 HUD 會依寬度換行，chrome 高度不是定值，所以用實際量測而非算式。 */
  const FIT_MAX = 4;
  // 安全邊界：1920×1080 下 2 倍只剩個位數餘裕，字型度量差 1px 就會掉回 1 倍
  // （整個畫面瞬間縮成四分之一，玩家會以為是 bug）。留 10px 吸收機器差異。
  const FIT_MARGIN = 10;
  function fitScale() {
    const app = $('app');
    if (!app) return;
    const availW = document.documentElement.clientWidth - FIT_MARGIN;
    const availH = document.documentElement.clientHeight - FIT_MARGIN;
    app.classList.remove('fluid');
    for (let s = FIT_MAX; s >= 1; s--) {
      app.style.setProperty('--px-scale', s);
      // 讀 offsetWidth/Height 會強制重排，量到的是套用該倍率後的真實尺寸
      if (app.offsetWidth <= availW && app.offsetHeight <= availH) return;
    }
    // 連 1 倍都塞不下（手機、小視窗）：退回流體縮放，可玩性優先於像素完美
    app.style.setProperty('--px-scale', 1);
    app.classList.add('fluid');
  }
  let fitQueued = false;
  function queueFit() {
    if (fitQueued) return;
    fitQueued = true;
    requestAnimationFrame(function () { fitQueued = false; fitScale(); });
  }
  /* 頂部 HUD 只在戰鬥中出現，一出現版面就長高約 55px。
   * 縮放是在標題畫面（HUD 隱藏）算的，不重算的話一進關就會撐出捲軸。
   * 這個切換每幀都會被呼叫，所以只在狀態真的改變時才重算。 */
  let topbarShown = null;
  function syncTopbarVisibility(playing) {
    if (topbarShown === playing) return;
    topbarShown = playing;
    $('topbar').classList.toggle('hidden', !playing);
    queueFit();
  }

  /* ---------- 音量 ----------
   * 標題畫面與暫停選單各掛一組滑桿（同 class，不同 DOM 節點），
   * 兩處要互相同步，否則玩家在暫停選單調完、回標題看到的是舊值。
   * 沒放進頂部 HUD 是刻意的：那裡的高度直接決定 1080p 能不能吃到 2 倍整數縮放。 */
  function syncVolumeSliders() {
    document.querySelectorAll('.vol-slider').forEach(function (el) {
      const v = CD.Audio.getVolume(el.dataset.kind);
      el.value = Math.round(v * 100);
      const out = el.parentNode.querySelector('.vol-val');
      if (out) out.textContent = Math.round(v * 100) + '%';
    });
  }
  function initVolumeSliders() {
    document.querySelectorAll('.vol-slider').forEach(function (el) {
      el.addEventListener('input', function () {
        CD.Audio.setVolume(el.dataset.kind, el.value / 100);
        syncVolumeSliders();
      });
      // 放開時給一聲回饋，音效滑桿才聽得出調到哪
      el.addEventListener('change', function () {
        CD.Audio.unlock();
        if (el.dataset.kind === 'sfx') CD.Audio.play('click');
      });
    });
    syncVolumeSliders();
  }

  /* ---------- 全螢幕 ----------
   * 整數縮放要吃到 2 倍需要 1080 的可用高度；一般瀏覽器視窗在 1080p 螢幕上
   * 扣掉分頁列與工作列多半只剩 ~960，會掉回 1 倍（見審查報告第七節）。
   * 桌面版由 Electron 直接開全螢幕；網頁版靠這顆按鈕。 */
  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  function toggleFullscreen() {
    const el = document.documentElement;
    const p = isFullscreen()
      ? (document.exitFullscreen || document.webkitExitFullscreen).call(document)
      : (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    // 舊瀏覽器的 webkit 版本不回 Promise
    if (p && p.catch) p.catch(function () { toast('這個瀏覽器不允許全螢幕'); });
  }
  function syncFullscreenBtn() {
    const b = $('btn-fullscreen');
    if (b) b.textContent = isFullscreen() ? '⛶ 離開全螢幕' : '⛶ 全螢幕';
  }

  /* ---------- 初始化 ---------- */
  function init() {
    cv = $('game'); stage = $('stage');
    // 預載點陣字型：canvas 首幀就用 Cubic 11，不閃一下系統字
    if (document.fonts && document.fonts.load) {
      // 字型換掉後 HUD 高度會變，重算一次縮放才不會多出一條捲軸
      document.fonts.load('bold 11px "Cubic 11"').then(queueFit).catch(function () {});
    }
    CD.Sprites.init();
    CD.Render.init(cv);
    buildRoster();
    bindInput();
    bindButtons();
    fitScale();
    window.addEventListener('resize', queueFit);
    $('t-title').textContent = CD.TEXT.title;
    $('t-sub').textContent = CD.TEXT.subtitle;
    $('t-tagline').textContent = CD.TEXT.tagline;
    $('t-lore').textContent = CD.TEXT.lore;
    showTitle();
    syncAll();
    requestAnimationFrame(loop);
  }

  return {
    init: init, syncAll: syncAll, syncMusou: syncMusou, toast: toast,
    showBuildMenu: showBuildMenu, hideBuildMenu: hideBuildMenu,
    showTowerInfo: showTowerInfo, hideTowerInfo: hideTowerInfo,
    showPerks: showPerks, hidePerks: hidePerks,
    showTitle: showTitle, showEnd: showEnd,
    showLevelSelect: showLevelSelect, showLevelClear: showLevelClear,
    playCutscene: playCutscene,
    triggerCG: triggerCG, triggerOneCG: triggerOneCG, showGallery: showGallery,
    showFeudTutorial: showFeudTutorial,
    showLegacy: showLegacy, hideLegacy: hideLegacy,
    showBooth: showBooth,
    fitScale: fitScale
  };
})();

window.addEventListener('DOMContentLoaded', function () { CD.UI.init(); });
