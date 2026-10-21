/* ============================================================
 * WebAudio 音訊：合成 SFX ＋ BGM（assets/audio/*.ogg，CAFOFO
 * Casual Music Pack Vol 1，Unity Asset Store 單人商用授權）
 * ============================================================ */
'use strict';
var CD = window.CD || (window.CD = {});

CD.Audio = (function () {
  var ctx = null, master = null;
  var enabled = (function () {
    try { return localStorage.getItem('cd_sound_enabled') !== '0'; } catch (e) { return true; }
  })();
  var lastPlay = {};   // 節流：同音效最短間隔
  var sfxGain = null;  // SFX 專屬匯流排，讓音效與 BGM 可以分開調

  /* 音量：0～1，存 localStorage。SFX 全是合成方波／鋸齒波，
   * 與授權 BGM 的聽感落差大，所以兩條分開給玩家調。 */
  function loadVol(key, dflt) {
    try {
      var v = parseFloat(localStorage.getItem(key));
      return (isFinite(v) && v >= 0 && v <= 1) ? v : dflt;
    } catch (e) { return dflt; }
  }
  var vol = { bgm: loadVol('cd_vol_bgm', 1), sfx: loadVol('cd_vol_sfx', 1) };

  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      // 動態壓縮器：波次高峰／通宵爆發大量音源疊加時的天花板保護
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 8;
      comp.attack.value = 0.003; comp.release.value = 0.15;
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* 簡易封包：type 波形、f0→f1 頻率滑移、dur 秒、vol、noise 用雜訊 */
  function blip(o) {
    if (!enabled || !ac()) return;
    var key = o.key || (o.f0 + '_' + o.dur);
    var now = ctx.currentTime;
    if (lastPlay[key] && now - lastPlay[key] < (o.throttle || 0.05)) return;
    lastPlay[key] = now;

    var g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(o.vol || 0.5, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, now + o.dur);
    g.connect(sfxBus());

    if (o.noise) {
      var len = Math.floor(ctx.sampleRate * o.dur);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      var src = ctx.createBufferSource();
      src.buffer = buf;
      var fl = ctx.createBiquadFilter();
      fl.type = 'bandpass';
      fl.frequency.setValueAtTime(o.f0, now);
      if (o.f1) fl.frequency.exponentialRampToValueAtTime(o.f1, now + o.dur);
      src.connect(fl); fl.connect(g);
      src.start(now); src.stop(now + o.dur);
    } else {
      var osc = ctx.createOscillator();
      osc.type = o.type || 'square';
      osc.frequency.setValueAtTime(o.f0, now);
      if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, now + o.dur);
      osc.connect(g);
      osc.start(now); osc.stop(now + o.dur);
    }
  }

  function seq(steps) { // [ [延遲秒, blip設定], ... ]
    steps.forEach(function (s) { setTimeout(function () { blip(s[1]); }, s[0] * 1000); });
  }

  var SFX = {
    click:      function () { blip({ f0: 880, dur: 0.05, vol: 0.25, type: 'square', key: 'click' }); },
    denied:     function () { blip({ f0: 180, f1: 120, dur: 0.16, vol: 0.4, type: 'sawtooth', key: 'denied' }); },
    deploy:     function () { seq([[0, { f0: 330, dur: 0.07, vol: 0.4 }], [0.07, { f0: 660, dur: 0.1, vol: 0.4 }]]); },
    remove:     function () { seq([[0, { f0: 660, dur: 0.07, vol: 0.35 }], [0.07, { f0: 330, dur: 0.1, vol: 0.35 }]]); },
    shoot_PLN:  function () { blip({ f0: 520, f1: 340, dur: 0.08, vol: 0.22, type: 'triangle', key: 'sP' }); },
    shoot_DEV:  function () { blip({ f0: 900, f1: 1400, dur: 0.05, vol: 0.16, type: 'square', key: 'sD', throttle: 0.03 }); },
    shoot_QAT:  function () { blip({ f0: 700, f1: 980, dur: 0.07, vol: 0.2, type: 'sine', key: 'sQ' }); },
    shoot_ART:  function () { blip({ f0: 260, f1: 140, dur: 0.12, vol: 0.3, type: 'sawtooth', key: 'sA' }); },
    /* 連擊音高遞進：連續命中產生上行音階，「打得順」聽得出來 */
    hit:        function (combo) { var c = Math.min(8, combo || 0); blip({ noise: true, f0: 2400 + c * 220, f1: 900 + c * 90, dur: 0.05, vol: 0.14, key: 'hit', throttle: 0.04 }); },
    kill:       function () { blip({ noise: true, f0: 1200, f1: 200, dur: 0.22, vol: 0.3, key: 'kill' }); },
    coreDamage: function () { seq([[0, { noise: true, f0: 500, f1: 90, dur: 0.35, vol: 0.55 }], [0.05, { f0: 220, f1: 90, dur: 0.4, vol: 0.5, type: 'sawtooth' }]]); },
    waveStart:  function () { seq([[0, { f0: 440, dur: 0.1, vol: 0.4 }], [0.12, { f0: 554, dur: 0.1, vol: 0.4 }], [0.24, { f0: 659, dur: 0.16, vol: 0.4 }]]); },
    waveClear:  function () { seq([[0, { f0: 659, dur: 0.09, vol: 0.4 }], [0.1, { f0: 880, dur: 0.14, vol: 0.4 }]]); },
    perkOpen:   function () { seq([[0, { f0: 523, dur: 0.08, vol: 0.35 }], [0.09, { f0: 784, dur: 0.12, vol: 0.35 }]]); },
    perkPick:   function () { seq([[0, { f0: 784, dur: 0.07, vol: 0.4 }], [0.08, { f0: 1046, dur: 0.15, vol: 0.4 }]]); },
    musou:      function () { seq([[0, { f0: 196, f1: 784, dur: 0.5, vol: 0.5, type: 'sawtooth' }], [0.3, { noise: true, f0: 3000, f1: 300, dur: 0.6, vol: 0.5 }]]); },
    /* 藍屏倒數：越接近爆炸音高越高、越大聲（t = 已逼近秒數 0..3） */
    countdown:  function (t) { var k = Math.max(0, Math.min(1, (t || 0) / 3)); blip({ f0: 1200 + k * 500, dur: 0.05 + k * 0.03, vol: 0.3 + k * 0.22, type: 'square', key: 'cd', throttle: 0 }); },
    boom:       function () { seq([[0, { noise: true, f0: 800, f1: 60, dur: 0.5, vol: 0.6 }], [0.02, { f0: 120, f1: 40, dur: 0.5, vol: 0.5, type: 'sine' }]]); },
    reveal:     function () { blip({ f0: 1100, f1: 1600, dur: 0.1, vol: 0.25, type: 'sine', key: 'rv' }); },
    victory:    function () { seq([[0, { f0: 523, dur: 0.14, vol: 0.45 }], [0.15, { f0: 659, dur: 0.14, vol: 0.45 }], [0.3, { f0: 784, dur: 0.14, vol: 0.45 }], [0.45, { f0: 1046, dur: 0.4, vol: 0.5 }]]); },
    /* 全戰役收束：比單關過關更長、更完整的樂句 */
    victoryFinal: function () {
      seq([[0, { f0: 523, dur: 0.16, vol: 0.45 }], [0.18, { f0: 659, dur: 0.16, vol: 0.45 }],
           [0.36, { f0: 784, dur: 0.16, vol: 0.45 }], [0.54, { f0: 1046, dur: 0.3, vol: 0.5 }],
           [0.86, { f0: 880, dur: 0.2, vol: 0.4 }], [1.08, { f0: 1318, dur: 0.9, vol: 0.5 }],
           [1.08, { f0: 659, dur: 0.9, vol: 0.3, type: 'triangle' }]]);
    },
    defeat:     function () { seq([[0, { f0: 392, dur: 0.25, vol: 0.45, type: 'sawtooth' }], [0.27, { f0: 330, dur: 0.25, vol: 0.45, type: 'sawtooth' }], [0.54, { f0: 262, dur: 0.5, vol: 0.5, type: 'sawtooth' }]]); },
    /* 吵架開始：兩個相差小二度的方波搶話，刺耳但不是錯誤音 */
    feudStart:  function () { seq([[0, { f0: 494, dur: 0.14, vol: 0.28, type: 'square', key: 'fsA', throttle: 0.2 }], [0.03, { f0: 466, dur: 0.14, vol: 0.24, type: 'square', key: 'fsB', throttle: 0.2 }]]); },
    /* 組合技：雙聲部交錯上滑（兩人合體），與通宵爆發的總攻擊音明確區隔 */
    feudCast:   function () { seq([[0, { f0: 440, f1: 660, dur: 0.35, vol: 0.45, type: 'square' }], [0.06, { f0: 330, f1: 520, dur: 0.35, vol: 0.35, type: 'triangle' }], [0.2, { noise: true, f0: 2500, f1: 500, dur: 0.4, vol: 0.35 }]]); },
    /* 爆氣滿槽：可以打出去了 */
    feudReady:  function () { seq([[0, { f0: 784, dur: 0.08, vol: 0.35 }], [0.09, { f0: 1046, dur: 0.16, vol: 0.4 }]]); },
    /* Boss 登場：低頻上滑長音＋鑼聲感雜訊掃頻 */
    bossIntro:  function () { seq([[0, { f0: 110, f1: 220, dur: 0.6, vol: 0.5, type: 'sawtooth' }], [0.05, { noise: true, f0: 3000, f1: 200, dur: 0.8, vol: 0.35 }]]); },
    /* Boss 倒下：比一般擊殺更重的落幕 */
    bossDown:   function () { seq([[0, { noise: true, f0: 1500, f1: 100, dur: 0.8, vol: 0.5 }], [0.05, { f0: 220, f1: 50, dur: 0.7, vol: 0.45, type: 'sine' }]]); },
    /* 我方受害（被點名、被偷 DP、Demo 當機）：與敵人受擊的 hit 明確區隔 */
    ownHit:     function () { blip({ noise: true, f0: 600, f1: 150, dur: 0.12, vol: 0.35, key: 'own', throttle: 0.1 }); },
    /* 主機低血心跳 */
    heartbeat:  function () { blip({ f0: 90, f1: 60, dur: 0.14, vol: 0.3, type: 'sine', key: 'hb', throttle: 0.3 }); },
    /* 打斷說教／找主任理論：各自的反制簽名音 */
    interrupt:  function () { seq([[0, { f0: 660, dur: 0.07, vol: 0.4, type: 'square' }], [0.08, { f0: 880, dur: 0.12, vol: 0.4, type: 'square' }]]); },
    argue:      function () { blip({ f0: 392, f1: 523, dur: 0.2, vol: 0.4, type: 'triangle', key: 'argue' }); },
    /* 勸架：兩個不和諧音收斂到同度（從搶話到和解） */
    mediate:    function () { seq([[0, { f0: 494, f1: 480, dur: 0.16, vol: 0.3, type: 'square' }], [0.04, { f0: 466, f1: 480, dur: 0.16, vol: 0.3, type: 'triangle' }], [0.22, { f0: 640, dur: 0.14, vol: 0.35, type: 'sine' }]]); }
  };

  /* ---------- BGM：三軌 loop＋兩個 stinger ---------- */
  var bgmGain = null;                 // BGM 主音量（可被 duck）
  var bgmBuffers = {};                // name → AudioBuffer
  var bgmSrc = null, bgmName = null;  // 目前播放中的 loop
  var bgmPending = null;              // unlock 前的播放請求
  var BGM_VOL = 0.55;                 // 相對 master 的 BGM 音量
  var BGM_FILES = {
    bgm_prep: 'assets/audio/bgm_prep.ogg',
    bgm_wave: 'assets/audio/bgm_wave.ogg',
    bgm_boss: 'assets/audio/bgm_boss.ogg',
    sting_win: 'assets/audio/sting_win.ogg',
    sting_lose: 'assets/audio/sting_lose.ogg'
  };

  function sfxBus() {
    if (!sfxGain) {
      sfxGain = ctx.createGain();
      sfxGain.gain.value = vol.sfx;
      sfxGain.connect(master);
    }
    return sfxGain;
  }
  function bgmBus() {
    if (!ac()) return null;
    if (!bgmGain) {
      bgmGain = ctx.createGain();
      bgmGain.gain.value = BGM_VOL * vol.bgm;
      bgmGain.connect(master);
    }
    return bgmGain;
  }
  function loadBgm(name, cb) {
    if (bgmBuffers[name]) { cb(bgmBuffers[name]); return; }
    if (bgmBuffers[name] === false) return;   // 載入失敗過（file:// 等情境），不再重試
    fetch(BGM_FILES[name])
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(function (buf) { return ctx.decodeAudioData(buf); })
      .then(function (audio) { bgmBuffers[name] = audio; cb(audio); })
      .catch(function () { bgmBuffers[name] = false; });   // 靜默降級：沒有 BGM 也能玩
  }
  function playBgm(name) {
    if (!enabled) { bgmName = name; return; }              // 記住狀態，重開聲音時續播
    if (!ac() || ctx.state === 'suspended') { bgmPending = name; bgmName = name; return; }
    if (bgmName === name && bgmSrc) return;                // 同曲不重播
    bgmName = name;
    if (!BGM_FILES[name]) { stopBgmNow(0.4); return; }
    loadBgm(name, function (buffer) {
      if (bgmName !== name) return;                        // 載入期間又切歌了
      stopBgmNow(0.5);
      var bus = bgmBus();
      var src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      var g = ctx.createGain();                            // 每曲自己的淡入包絡
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.6);
      src.connect(g); g.connect(bus);
      src.start();
      bgmSrc = { src: src, gain: g };
    });
  }
  function stopBgmNow(fade) {
    if (!bgmSrc) return;
    var old = bgmSrc; bgmSrc = null;
    try {
      old.gain.gain.setValueAtTime(old.gain.gain.value, ctx.currentTime);
      old.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + (fade || 0.4));
      old.src.stop(ctx.currentTime + (fade || 0.4) + 0.05);
    } catch (e) { try { old.src.stop(); } catch (e2) {} }
  }
  /* 一次性 stinger（勝敗收束）：走 BGM bus，會先把 loop 收掉 */
  function playSting(name) {
    if (!enabled || !ac()) return;
    stopBgmNow(0.25);
    bgmName = null;
    loadBgm(name, function (buffer) {
      var src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(bgmBus());
      src.start();
    });
  }
  /* Ducking：組合技／通宵爆發瞬間把 BGM 壓下去，爆發才有重量 */
  function duckBgm() {
    if (!bgmGain || !ctx) return;
    var now = ctx.currentTime;
    bgmGain.gain.cancelScheduledValues(now);
    bgmGain.gain.setValueAtTime(bgmGain.gain.value, now);
    bgmGain.gain.linearRampToValueAtTime(BGM_VOL * vol.bgm * 0.3, now + 0.08);
    bgmGain.gain.linearRampToValueAtTime(BGM_VOL * vol.bgm, now + 0.9);
  }

  return {
    play: function (name, arg) { if (SFX[name]) SFX[name](arg); },
    playBgm: playBgm,
    stopBgm: function () { bgmName = null; stopBgmNow(0.5); },
    playSting: playSting,
    duckBgm: duckBgm,
    unlock: function () {
      ac();
      if (bgmPending && ctx && ctx.state !== 'suspended') {
        var p = bgmPending; bgmPending = null;
        var n = bgmName; bgmName = null;   // 清掉再播，繞過同曲判斷
        playBgm(n || p);
      }
    },
    setEnabled: function (v) {
      enabled = v;
      try { localStorage.setItem('cd_sound_enabled', v ? '1' : '0'); } catch (e) {}
      if (!v) stopBgmNow(0.2);
      else if (bgmName) { var n = bgmName; bgmName = null; playBgm(n); }
    },
    isEnabled: function () { return enabled; },
    /* kind: 'bgm' | 'sfx'，v: 0～1。即時套用並記住。 */
    setVolume: function (kind, v) {
      v = Math.max(0, Math.min(1, Number(v) || 0));
      vol[kind] = v;
      try { localStorage.setItem('cd_vol_' + kind, String(v)); } catch (e) {}
      if (!ctx) return;                       // 還沒解鎖音訊，值已存好，之後建匯流排時會吃到
      if (kind === 'bgm' && bgmGain) bgmGain.gain.value = BGM_VOL * v;
      if (kind === 'sfx' && sfxGain) sfxGain.gain.value = v;
    },
    getVolume: function (kind) { return vol[kind]; }
  };
})();
