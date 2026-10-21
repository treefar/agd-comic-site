/* ============================================================
 * 內建像素圖（美術聖經 crunch-defense-pixel-v1）
 * 字元→色盤映射；'.' 為透明
 * 啟動時嘗試以 assets/sprites/<id>.png 覆蓋（AI 生成素材放這裡）
 * ============================================================ */
'use strict';
var CD = window.CD || (window.CD = {});

CD.PIXELS = {
  /* ---- 專員（16×16） ---- */
  PLN: { // 企劃同學：藍衣、抱白色規格書
    pal: { h: '#4a3628', f: '#ffd9b3', o: '#14162b', b: '#4f9dff', B: '#3a78cc', w: '#f4f6fb', l: '#c9d2e8', d: '#2c3350' },
    rows: [
      '................',
      '.....hhhhhh.....',
      '....hhhhhhhh....',
      '....hffffffh....',
      '....hfoffofh....',
      '....hffffffh....',
      '.....ffffff.....',
      '....bbbbbbbb....',
      '...bBwwwwwwBb...',
      '...bBwllllwBb...',
      '...bBwwwwwwBb...',
      '....bbbbbbbb....',
      '....bbbbbbbb....',
      '.....dd..dd.....',
      '.....dd..dd.....',
      '................']
  },
  DEV: { // 程式同學：綠帽T、面前筆電
    pal: { g: '#5dd66e', G: '#3fa855', f: '#ffd9b3', o: '#14162b', k: '#2c3350', s: '#41f2e6', d: '#22283f' },
    rows: [
      '................',
      '.....gggggg.....',
      '....gggggggg....',
      '....gffffffg....',
      '....gfoffofg....',
      '....gffffffg....',
      '.....ffffff.....',
      '....gggggggg....',
      '...gGggggggGg...',
      '...gGggggggGg...',
      '....kkkkkkkk....',
      '....kssssssk....',
      '....kkkkkkkk....',
      '.....dd..dd.....',
      '.....dd..dd.....',
      '................']
  },
  QAT: { // 測試同學：黃衣、放大鏡
    pal: { h: '#2e2a26', f: '#ffd9b3', o: '#14162b', y: '#ffd23f', Y: '#d9a92e', l: '#bfefff', t: '#8a6d3b', d: '#2c3350' },
    rows: [
      '................',
      '.....hhhhhh.....',
      '....hhhhhhhh....',
      '....hffffffh....',
      '....hfoffofh....',
      '....hffffffh....',
      '.....ffffff.ooo.',
      '....yyyyyyyyolo.',
      '...yYyyyyyYyooo.',
      '...yYyyyyyYy.t..',
      '....yyyyyyyy.t..',
      '....yyyyyyyy....',
      '....yyyyyyyy....',
      '.....dd..dd.....',
      '.....dd..dd.....',
      '................']
  },
  ART: { // 美術同學：紅圍裙、馬尾、畫筆
    pal: { h: '#6b3fa0', f: '#ffd9b3', o: '#14162b', r: '#ff6b57', R: '#cc4a3a', w: '#f4f6fb', p: '#ff2e63', t: '#8a6d3b', d: '#2c3350' },
    rows: [
      '................',
      '.....hhhhhh.....',
      '....hhhhhhhh.h..',
      '....hffffffh.h..',
      '....hfoffofhh...',
      '....hffffffh....',
      '.....ffffff..p..',
      '....rrrrrrrr.t..',
      '...rRwwwwwwRt...',
      '...rRwwwwwwR....',
      '....rwwwwwwr....',
      '....rrrrrrrr....',
      '....rrrrrrrr....',
      '.....dd..dd.....',
      '.....dd..dd.....',
      '................']
  },

  /* ---- 敵人 ---- */
  MSG: { // ＠所有人：白色對話泡泡＋怒視＠
    pal: { w: '#e8ecf7', W: '#c9d2e8', a: '#2c3350', o: '#14162b' },
    rows: [
      '................',
      '...wwwwwwwwww...',
      '..wwwwwwwwwwww..',
      '.wwwwwwwwwwwwww.',
      '.wwooww..wwoow..',
      '.wwwwwwwwwwwwww.',
      '.wwwaaaaaawwwww.',
      '.wwaawwwwaawwww.',
      '.wwaawaawaawwww.',
      '.wwaawaaaaawwww.',
      '.wwaawwwwwwwwww.',
      '.wwwaaaaaawWWww.',
      '..wwwwwwwwwwww..',
      '...wwwWW........',
      '...wwW..........',
      '................']
  },
  BUG: { // 靈異 Bug：紫蟲、翅膀、大眼
    pal: { p: '#b07ef2', P: '#8a54cc', w: '#dcd0ff', o: '#14162b', e: '#ff5d5d', l: '#5c3f8a' },
    rows: [
      '................',
      '..l..........l..',
      '...l........l...',
      '....pppppppp....',
      '...pppppppppp...',
      '..wpoeppppeopw..',
      '.wwpoeppppeopww.',
      '.wwpppppppppPww.',
      '..wppPPPPPPpw...',
      '...pppppppppp...',
      '....pppppppp....',
      '...l.l....l.l...',
      '..l...l..l...l..',
      '................',
      '................',
      '................']
  },
  ECR: { // 需求變更單：紅色公文、摺角、怒臉
    pal: { r: '#ff5d5d', R: '#cc3a3a', c: '#ffb8b8', w: '#ffe8e8', o: '#14162b' },
    rows: [
      '................',
      '...rrrrrrrrcc...',
      '...rrrrrrrrrc...',
      '...rrrrrrrrrr...',
      '...roorrrroor...',
      '...rrrrrrrrrr...',
      '...rwwwwwwrrr...',
      '...rrrrrrrrrr...',
      '...rwwwwrrrrr...',
      '...rrrrrrrrrr...',
      '...rrRRRRrrrr...',
      '...rRrrrrRrrr...',
      '...rrrrrrrrrr...',
      '...rrrrrrrrrr...',
      '................',
      '................']
  },
  CRN: { // 爆肝魔人：咖啡杯怪、黑眼圈、蒸氣
    pal: { m: '#7a5c3e', M: '#5c4430', s: '#c9d2e8', w: '#f4f6fb', o: '#14162b', g: '#3a2f4a', c: '#3d2b1f' },
    rows: [
      '......s..s......',
      '.....s..s.......',
      '......s..s......',
      '....mmmmmmmm....',
      '...mmmmmmmmmmm..',
      '...mwwmmmmwwmm..',
      '...mowmmmmowmmm.',
      '...mggmmmmggmm..',
      '...mmmmmmmmmm...',
      '...mccccccccm...',
      '...mmmmmmmmmm...',
      '...mMMMMMMMMm...',
      '...mmmmmmmmmm...',
      '....mmmmmmmm....',
      '................',
      '................']
  },
  REG: { // 迴歸蟲：綠殭屍蟲、縫線疤
    pal: { g: '#68d16f', G: '#3fa855', o: '#14162b', x: '#2c6b38', s: '#245c30', l: '#3fa855' },
    rows: [
      '................',
      '....gggggggg....',
      '...gggggggggg...',
      '..ggooggggoogg..',
      '..gggggggggggg..',
      '..ggxgxxgxggg...',
      '..gggggggggggg..',
      '...gsGsGsGsg....',
      '...gggggggggg...',
      '..gggggggggggg..',
      '...g.g.gg.g.g...',
      '..l..l....l..l..',
      '................',
      '................',
      '................',
      '................']
  },
  BSD: { // 未存檔當機：藍屏、:( 臉
    pal: { b: '#3f7dff', B: '#2c5ccc', w: '#f4f6fb', o: '#14162b' },
    rows: [
      '................',
      '...bbbbbbbbbb...',
      '..bbbbbbbbbbbb..',
      '..bbbbbbbbbbbb..',
      '..bbwwbb..wwbb..',
      '..bbwwbb..wwbb..',
      '..bbbbbbbbbbbb..',
      '..bbbbwwwwbbbb..',
      '..bbbwwbbwwbbb..',
      '..bbwwbbbbwwbb..',
      '..bbbbbbbbbbbb..',
      '..bBBBBBBBBBBb..',
      '..bbbbbbbbbbbb..',
      '...bbbbbbbbbb...',
      '................',
      '................']
  },
  WISH: { // 許願池泥漿：粉彩泥漿＋便利貼
    pal: { p: '#e6a3c4', P: '#c47ba3', o: '#14162b', y: '#ffd23f', s: '#a3557e' },
    rows: [
      '................',
      '................',
      '.....pp....yy...',
      '....pppp...yy...',
      '...pppppp.......',
      '..ppppppppp.....',
      '..poopppoopp....',
      '.pppppppppppp...',
      '.ppssssspppppp..',
      'ppppppppppppyy..',
      'ppPPpppppPPpyy..',
      'pppppppppppppp..',
      '.pppPPPPPPppp...',
      '................',
      '................',
      '................']
  },
  STK: { // 新功能便利貼（12×12）
    pal: { y: '#ffd23f', Y: '#d9a92e', o: '#14162b', s: '#8a6d3b' },
    rows: [
      '............',
      '.yyyyyyyyyY.',
      '.yyyyyyyyYY.',
      '.yooyyyooyy.',
      '.yyyyyyyyyy.',
      '.yysssssyyy.',
      '.yyyyyyyyyy.',
      '.ysssyyyyyy.',
      '.yyyyyyyyyy.',
      '.yyyyyyyyyy.',
      '.YYYYYYYYYY.',
      '............']
  },
  HYD: { // 評圖九頭龍（24×24）：三頭紅龍、握紅筆
    pal: { r: '#ff5d5d', R: '#cc3a3a', n: '#e04848', o: '#14162b', w: '#ffe8e8', p: '#ff2e63', t: '#8a6d3b', d: '#992222' },
    rows: [
      '........................',
      '..rrr......rrr.....rrr..',
      '.rorr.....rorr....rorr..',
      '.rrrw.....rrrw....rrrw..',
      '.rrr......rrr.....rrr...',
      '..nn.......nn......nn...',
      '..nn.......nn......nn...',
      '...nn......nn.....nn....',
      '....nn.....nn....nn.....',
      '.....nnn...nn..nnn......',
      '.......nnnnnnnnn........',
      '......rrrrrrrrrrr.......',
      '.....rrrrrrrrrrrrr......',
      '....rrRRrrrrrrRRrrr.....',
      '....rrrrrrrrrrrrrrr..t..',
      '....rrrrrrrrrrrrrrr..t..',
      '....rddrrrrrrrrddrr..p..',
      '.....rrrrrrrrrrrrr......',
      '......rrrrrrrrrrr.......',
      '....RR...RR...RR........',
      '....RR...RR...RR........',
      '........................',
      '........................',
      '........................']
  },
  REV: { // 再改一版（14×14）：單頭小龍
    pal: { r: '#ff8f57', R: '#cc6a3a', o: '#14162b', w: '#ffe8e8' },
    rows: [
      '..............',
      '....rrrr......',
      '...rorrrw.....',
      '...rrrrw......',
      '....rr........',
      '...rrrrrrrr...',
      '..rrrrrrrrrr..',
      '..rRrrrrrrRr..',
      '..rrrrrrrrrr..',
      '...rrrrrrrr...',
      '...RR....RR...',
      '..............',
      '..............',
      '..............']
  },
  CORE: { // 交件主機（24×24）：伺服器機櫃＋燈號
    pal: { k: '#2c3350', K: '#1e2338', c: '#41f2e6', g: '#5dd66e', y: '#ffd23f', r: '#ff5d5d', w: '#c9d2e8', o: '#14162b' },
    rows: [
      '........................',
      '.....kkkkkkkkkkkkkk.....',
      '....kkkkkkkkkkkkkkkk....',
      '....kKKKKKKKKKKKKKKk....',
      '....kKggKwwwwwwwwKKk....',
      '....kKKKKKKKKKKKKKKk....',
      '....kkkkkkkkkkkkkkkk....',
      '....kKKKKKKKKKKKKKKk....',
      '....kKycKwwwwwwwwKKk....',
      '....kKKKKKKKKKKKKKKk....',
      '....kkkkkkkkkkkkkkkk....',
      '....kKKKKKKKKKKKKKKk....',
      '....kKgcKccccccccKKk....',
      '....kKKKKKKKKKKKKKKk....',
      '....kkkkkkkkkkkkkkkk....',
      '....kKKKKKKKKKKKKKKk....',
      '....kKrgKwwwwwwwwKKk....',
      '....kKKKKKKKKKKKKKKk....',
      '....kkkkkkkkkkkkkkkk....',
      '...kkkkkkkkkkkkkkkkkk...',
      '...kkkkkkkkkkkkkkkkkk...',
      '........................',
      '........................',
      '........................']
  },

  /* ---- v3 嘲諷新敵人（PNG 交付前的內建版） ---- */
  GHO: { // 消失的組員：床單幽靈捧著發光手機
    pal: { c: '#c9d2e8', s: '#8a94b8', p: '#4f9dff', o: '#14162b' },
    rows: [
      '................',
      '.......ss.......',
      '.....cccccc.....',
      '....cccccccc....',
      '...cccccccccc...',
      '...ccoccccocc...',
      '...cccccccccc...',
      '...cccppppccc...',
      '...cccppppccc...',
      '...cccppppccc...',
      '...cccccccccc...',
      '...cccccccccc...',
      '...cscscscsc....',
      '....c..cc..c....',
      '................',
      '................']
  },
  IDA: { // 組長的新點子：自信燈泡怪全速衝刺
    pal: { y: '#ffd23f', Y: '#d9a92e', g: '#8a94b8', o: '#14162b' },
    rows: [
      '................',
      '....yyyyyyyy....',
      '...yyyyyyyyyy...',
      '..yyyyyyyyyyyy..',
      '..yyooyyyyooyy..',
      '..yyyyyyyyyyyy..',
      '..yyoyyyyyyoyy..',
      '...yyooooooyy...',
      '...yYyyyyyyYy...',
      '....yyyyyyyy....',
      '.....gggggg.....',
      '.....gggggg.....',
      '....oo....oo....',
      '...oo......oo...',
      '................',
      '................']
  },
  LAG: { // 讀取圈：毫無歉意的 loading spinner
    pal: { c: '#41f2e6', m: '#8a94b8', d: '#2c3350', o: '#14162b' },
    rows: [
      '................',
      '.....cccc.......',
      '...cc....cc.....',
      '..c........c....',
      '..c.........c...',
      '.c....o..o...m..',
      '.c...........m..',
      '.c....oooo...m..',
      '..m..........m..',
      '..m.........d...',
      '...d.......d....',
      '....dd...dd.....',
      '................',
      '....o.....o.....',
      '................',
      '................']
  },

  /* ---- 三選一強化 icon（12×12） ---- */
  ICON_can: { pal: { c: '#41f2e6', C: '#2cb8ad', w: '#f4f6fb', o: '#14162b' },
    rows: ['............', '...wwwwww...', '...cccccc...', '..cccccccc..', '..cCCCCCCc..', '..cwwwwwwc..', '..cwoowowc..', '..cwwwwwwc..', '..cCCCCCCc..', '..cccccccc..', '...cccccc...', '............'] },
  ICON_key: { pal: { k: '#c9d2e8', K: '#8a94b8', b: '#41f2e6', o: '#14162b' },
    rows: ['............', '..kkkkkkkk..', '.kkkkkkkkkk.', '.kKKKKKKKKk.', '.kKbbbbbbKk.', '.kKbbbbbbKk.', '.kKbbbbbbKk.', '.kKKKKKKKKk.', '.kkkkkkkkkk.', '..KKKKKKKK..', '............', '............'] },
  ICON_copy: { pal: { w: '#f4f6fb', W: '#c9d2e8', l: '#8a94b8', o: '#14162b' },
    rows: ['............', '..www.......', '..wlw.......', '..www.wwww..', '..wlw.wllw..', '..www.wwww..', '..wlw.wllw..', '..www.wwww..', '......wllw..', '......wwww..', '............', '............'] },
  ICON_hammer: { pal: { h: '#8a94b8', H: '#5c6488', t: '#8a6d3b', o: '#14162b' },
    rows: ['............', '..hhhhhh....', '..hhhhhhh...', '..hHHHHhh...', '..hhhhhh....', '.....tt.....', '.....tt.....', '.....tt.....', '.....tt.....', '.....tt.....', '............', '............'] },
  ICON_ups: { pal: { g: '#5dd66e', G: '#3fa855', k: '#2c3350', y: '#ffd23f', o: '#14162b' },
    rows: ['............', '....kkkk....', '..kkkkkkkk..', '..kggggggk..', '..kggyyggk..', '..kgyyyygk..', '..kggyyggk..', '..kggyyggk..', '..kggggggk..', '..kkkkkkkk..', '............', '............'] },
  ICON_cloud: { pal: { c: '#c9d2e8', C: '#8a94b8', g: '#5dd66e', o: '#14162b' },
    rows: ['............', '....cccc....', '...cccccc...', '..cccccccc..', '.cccccccccc.', '.ccCCCCCCcc.', '..cccccccc..', '.....gg.....', '....gggg....', '.....gg.....', '............', '............'] }
};

/* 純 PNG 資產（無內建 pixel 備援）：v2 動畫幀、必殺立繪、投射物、特效、Logo。
 * 載不到就靜默略過，繪製端各有 fallback。 */
CD.EXTRA_SPRITES = [
  // A 組：專員動畫幀（呼吸／出手）
  'PLN_idle2', 'PLN_atk', 'DEV_idle2', 'DEV_atk',
  'QAT_idle2', 'QAT_atk', 'ART_idle2', 'ART_atk',
  // A 組：敵人走路第二幀
  'MSG_walk2', 'BUG_walk2', 'ECR_walk2', 'CRN_walk2', 'REG_walk2',
  'BSD_walk2', 'WISH_walk2', 'STK_walk2', 'HYD_walk2', 'REV_walk2',
  // R2 重製梯次（2026-08-05）：這六隻先前只有靜止幀，走路第二幀是這批才補上的
  'PONY_walk2', 'MEET_walk2', 'LOST_walk2', 'NCARD_walk2', 'FAKE_walk2', 'LAG_walk2',
  // R3 審查委員家族（2026-08-06）：六隻先前也只有靜止幀
  'ROLL_walk2', 'NOD_walk2', 'ELDER_walk2', 'SUIT_walk2', 'CALC_walk2', 'GUARDB_walk2',
  // A 組：主機燈號第二幀
  'CORE_lights2',
  // v3 T 組：爆肝差分
  'PLN_tired', 'DEV_tired', 'QAT_tired', 'ART_tired',
  // v3 F 組：吵架系統
  'FEUD_spark', 'FEUD_ready', 'FEUD_bubble',
  // v4 B2 組：審查委員 mini-boss
  'ROLL', 'NOD', 'ELDER', 'SUIT', 'CALC', 'GUARDB',
  // v4 N2 組：觀眾系敵人
  'KID', 'KAREN', 'SWAG', 'NCARD', 'STREAM', 'LOST', 'GUARD', 'CMP',
  // v4 R 組：專題實況敵人
  'PONY', 'MEET', 'FAKE',
  // v5 P 組：審查／佈展道具（場景辨識與 Boss 波壓力儀式）
  'PROP_bag', 'PROP_books', 'PROP_booth', 'PROP_calendar', 'PROP_cans',
  'PROP_cart', 'PROP_chair', 'PROP_fan', 'PROP_gantt', 'PROP_gen',
  'PROP_jury', 'PROP_lots', 'PROP_maquette', 'PROP_mic', 'PROP_notes',
  'PROP_pizza', 'PROP_podium', 'PROP_posters', 'PROP_print3d', 'PROP_printer',
  'PROP_projector', 'PROP_roll', 'PROP_scoresheet', 'PROP_screen', 'PROP_shrine',
  'PROP_swagbox', 'PROP_tape', 'PROP_timer',
  // v4 L 組：關卡節點與星（DOM 用 img，但進 cache 無妨）
  'ICON_pie', 'ICON_ask',
  // v5 D 組：狀態符號
  'FX_spotlight', 'FX_sweat', 'FX_zzz', 'FX_gasp',
  // B 組：必殺 cut-in 立繪
  'MUSOU_PLN', 'MUSOU_DEV', 'MUSOU_QAT', 'MUSOU_ART',
  // C 組：投射物
  'PROJ_doc', 'PROJ_bolt', 'PROJ_lens', 'PROJ_brush',
  // F 組：特效幀
  'FX_poof1', 'FX_poof2', 'FX_poof3', 'FX_boom1', 'FX_boom2', 'FX_boom3'
  // 標題不用 LOGO.png：標題畫面是 HTML <h1> 以 Cubic 11 點陣中文字型渲染，
  // 該檔（英文 CRUNCH DEFENSE）從未被繪製，留在此處只是白下載 57KB。
  // 檔案保留在 assets/ 供未來商店頁等外部用途。
];

/* ---------- Sprite 系統：pixel map → canvas，支援 PNG 覆蓋與白閃 ---------- */
CD.Sprites = (function () {
  var cache = {};       // id -> { normal: canvas, flash: canvas, w, h }

  function buildFromPixels(id) {
    var def = CD.PIXELS[id];
    if (!def) return null;
    var h = def.rows.length, w = 0, y, x, row, ch, col;
    for (y = 0; y < h; y++) w = Math.max(w, def.rows[y].length);
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var fx = document.createElement('canvas'); fx.width = w; fx.height = h;
    var c1 = cv.getContext('2d'), c2 = fx.getContext('2d');
    for (y = 0; y < h; y++) {
      row = def.rows[y];
      for (x = 0; x < row.length; x++) {
        ch = row[x];
        if (ch === '.' || ch === ' ') continue;
        col = def.pal[ch];
        if (!col) continue;
        c1.fillStyle = col; c1.fillRect(x, y, 1, 1);
        c2.fillStyle = '#ffffff'; c2.fillRect(x, y, 1, 1);
      }
    }
    return { normal: cv, flash: fx, w: w, h: h };
  }

  function makeFlashFromImage(img) {
    var cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
    var c = cv.getContext('2d');
    c.drawImage(img, 0, 0);
    c.globalCompositeOperation = 'source-in';
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, cv.width, cv.height);
    return cv;
  }

  return {
    init: function () {
      var id;
      for (id in CD.PIXELS) cache[id] = buildFromPixels(id);
      // PNG 覆蓋：assets/sprites/<id>.png 存在即取代（AI 生成素材接入點）
      Object.keys(CD.PIXELS).forEach(function (sid) {
        var img = new Image();
        img.onload = function () {
          cache[sid] = { normal: img, flash: makeFlashFromImage(img), w: img.width, h: img.height };
        };
        img.onerror = function () { /* 無覆蓋檔，使用內建 */ };
        img.src = 'assets/sprites/' + sid + '.png';
      });
      // 純 PNG 資產（動畫幀、立繪、投射物、特效、Logo）：無內建備援，載到才進 cache
      CD.EXTRA_SPRITES.forEach(function (sid) {
        var img = new Image();
        img.onload = function () {
          cache[sid] = { normal: img, flash: makeFlashFromImage(img), w: img.width, h: img.height };
        };
        img.onerror = function () { /* 尚未交圖，繪製端 fallback */ };
        img.src = 'assets/sprites/' + sid + '.png';
      });
    },
    has: function (id) { return !!cache[id]; },
    get: function (id) { return cache[id] || null; },
    /* 以中心點繪製；opts: {scale, flip, flash, alpha, rot} */
    draw: function (ctx, id, cx, cy, opts) {
      var s = cache[id];
      if (!s) return;
      opts = opts || {};
      var sc = opts.scale || 2.5;
      var img = opts.flash ? s.flash : s.normal;
      ctx.save();
      if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha;
      ctx.translate(Math.round(cx), Math.round(cy));   // 整數座標：非整數位移會讓像素每幀抖動
      if (opts.rot) ctx.rotate(opts.rot);
      if (opts.flip) ctx.scale(-1, 1);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, -s.w * sc / 2, -s.h * sc / 2, s.w * sc, s.h * sc);
      ctx.restore();
    }
  };
})();
