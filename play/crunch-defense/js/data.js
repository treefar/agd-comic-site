/* ============================================================
 * 《死線防衛隊：畢展倒數》資料表
 * 平衡數值以 tools/balance_bots.cjs 多種子模擬驗收為準
 * Unity 移植時此檔 1:1 對照 ScriptableObject
 * ============================================================ */
'use strict';
var CD = window.CD || (window.CD = {});

CD.CONFIG = {
  NATIVE_W: 836, NATIVE_H: 470,     // 原生解析度
  TILE: 40,                          // 建造格尺寸
  CORE_HP: 100,
  // 開局 12 DP 配上四人合計 8 DP，等於第一波就能滿編，之後 DP 累積到破關都花不掉，
  // 塔防「每波拿新資源做建造決策」的迴圈整個是斷的（實測前六關全滿血通關）。
  // 降到 6：開局只放得起兩人，之後逐波擴編或練強，二選一。
  START_DP: 6,
  DP_PER_WAVE: 3,                    // 每清一波獲得（配合開局變少，回收加快）
  TEAM_LIMIT: 5,                     // 上場人數硬上限（無盡模式與戰役後段）
  PREP_TIME: 12,                     // 波間準備秒數
  HP_MUL: 1.3,                       // 全域敵人 HP 倍率（三入口地圖平衡定值）
  REWARD_EVERY: 2,                   // 每 N 波三選一
  MUSOU_MAX: 100,                    // 必殺充能上限
  MUSOU_PER_KILL: 2.5,               // 每殺充能
  MUSOU_BOSS_BONUS: 15,
  MUSOU_DAMAGE: 200,                 // 通宵爆發全場傷害（高於任何組合技，維持終極技定位）
  ENDLESS_SCALE: 1.15                // 無盡模式每輪成長
};

/* ---------- 專員（塔） ---------- */
CD.SPECIALISTS = {
  PLN: {
    id: 'PLN', name: '企劃同學', skill: '規格凍結',
    desc: '丟出規格書，命中者減速至 52%。「需求凍結了，誰都不准動！」',
    cost: 1, damage: 24, interval: 1.12, range: 148,
    color: '#4f9dff', trait: 'slow', slowFactor: 0.52, slowDuration: 2.0,
    projectile: 'doc'
  },
  DEV: {
    id: 'DEV', name: '程式同學', skill: '熱修補丁',
    desc: '高速連發 commit。「先推再說，CI 會擋。」',
    cost: 2, damage: 20, interval: 0.76, range: 158,
    color: '#5dd66e', trait: 'rapid',
    projectile: 'bolt'
  },
  QAT: {
    id: 'QAT', name: '測試同學', skill: '重現步驟',
    desc: '標記目標使其受傷 +25%，並揭穿隱形的靈異 Bug。',
    cost: 2, damage: 18, interval: 0.84, range: 162,
    color: '#ffd23f', trait: 'mark', markBonus: 1.25, markDuration: 3.0, reveal: true,
    projectile: 'lens'
  },
  ART: {
    id: 'ART', name: '美術同學', skill: '爆稿重畫',
    desc: '重擊並點燃目標，持續燒稿傷害。「這張我重畫！」',
    cost: 3, damage: 32, interval: 1.18, range: 154,
    color: '#ff6b57', trait: 'burn', burnDps: 6, burnDuration: 3.0,
    projectile: 'brush'
  }
};
CD.SPECIALIST_ORDER = ['PLN', 'DEV', 'QAT', 'ART'];

/* ---------- 上場人數隨戰役成長 ----------
 * 固定 5 人時，開局就能把陣容一次擺滿，「人數」這條成長軸從頭到尾沒有存在感。
 * 改成隨關卡開放，同時自動壓低前段強度（實測 L0–L5 原本 18 場全滿血通關）。 */
CD.TEAM_LIMIT_BY_LEVEL = [3, 3, 3, 4, 4, 4, 5, 5, 5, 5];

/* ---------- 隊友升級 ----------
 * DP 原本只有三個出口（找他理論、拖延、撤回重擺），第一波之後就沒東西可買。
 * 兩階升級讓每一波的 DP 都要面對「再找一個人 vs 把現有的練強」。
 * rateMul 乘的是攻擊間隔，數字越小越快。費用＝該職種原價 × costMul。 */
CD.TOWER_LEVELS = [
  { lv: 1, name: '新手上路',     tag: '',   dmgMul: 1.00, rateMul: 1.00, rangeMul: 1.00, costMul: 0 },
  { lv: 2, name: '熬夜自學',     tag: 'Ⅱ', dmgMul: 1.45, rateMul: 0.88, rangeMul: 1.06, costMul: 1 },
  { lv: 3, name: '接過案子的',   tag: 'Ⅲ', dmgMul: 2.00, rateMul: 0.78, rangeMul: 1.12, costMul: 2 }
];

/* ---------- 背景壓暗 ----------
 * 七張背景的實測平均感知明度（0.2126R+0.7152G+0.0722B）：
 *   BG_lab 26.4／BG_hall 28.9／BG_class 30.0／BG_south 32.8／BG_expo 34.0
 *   BG_home 46.7／BG_fest 52.9
 * 前五張讀得很清楚，BG_fest 同時是最亮（52.9）也最飽和（平均 36.9）的一張，
 * 實測截圖裡三名隊友幾乎被攤位吞掉，路徑虛線也淹沒在暖色裡。
 * 這不是敵人或 sprite 的問題，是背景把明度與飽和度畫得太滿。
 *
 * 修法：只壓背景、不壓前景——遮罩疊在 floorCache 上，路徑導引、建造格、
 * 單位、特效全部在遮罩之上畫，亮度完全不受影響。
 * 遮罩色用專案底色 #14162b 而不是純黑：畫面會往整體色調收，
 * 看起來像刻意的夜間打光，而不是有人把亮度轉暗了。
 *
 * 數值取法（**遮罩不是純黑，不能用 1−目標÷原值 反推**——`#14162b` 本身明度 23.1，
 * 這個錯誤第一版就犯過）。正確式子：
 *     結果 ＝ 原明度 ×(1−a) ＋ 23.1 × a
 * 兩張都取到約 39，並排比對過 a＝0／0.32／0.45／0.55 四種強度：
 * 0.55 時紅色攤位開始變濁、背景失去識別；0.45 是「單位讀得出來」與
 * 「背景還是那張背景」的平衡點。
 *
 * 壓暗同時等比降低絕對飽和：fest 36.9→20.3、home 26.4→17.7，
 * 都落回可讀組的 16～27 區間，這才是暖色關真正吃掉前景的那一半原因。
 *
 * 換背景圖之後要重新量測（tools/audit_art_inventory.py 沒有驗這一項）。 */
CD.BG_DIM = {
  BG_fest: 0.45,   // 52.9 → 39.5，飽和 36.9 → 20.3
  BG_home: 0.33    // 46.7 → 38.9，飽和 26.4 → 17.7
};

/* ---------- 敵人 ---------- */
/* speed 單位：native px / 秒 */
CD.ENEMIES = {
  MSG: {
    id: 'MSG', name: '＠所有人', cat: 'THREAT',
    hp: 56, speed: 42, armor: 0, coreDmg: 7, musou: true,
    tagline: '群組訊息轟炸。單隻不痛，成群要命。',
    color: '#e8ecf7', size: 16
  },
  BUG: {
    id: 'BUG', name: '靈異 Bug', cat: 'THREAT',
    hp: 92, speed: 36, armor: 8, coreDmg: 11, musou: true,
    tagline: '時有時無、重現不了。週期隱形，測試同學可揭穿。',
    color: '#b07ef2', size: 16,
    flying: true, phase: { visibleTime: 2.6, hiddenTime: 1.4 }
  },
  ECR: {
    id: 'ECR', name: '需求變更單', cat: 'THREAT',
    hp: 138, speed: 28, armor: 14, coreDmg: 17, musou: true,
    tagline: '「就改一個小地方。」中堅攔截對象。',
    color: '#ff5d5d', size: 16
  },
  CRN: {
    id: 'CRN', name: '爆肝魔人', cat: 'THREAT',
    hp: 190, speed: 22, armor: 22, coreDmg: 24, musou: true,
    tagline: '重甲慢速。讓它走到主機前，全組進度大失血。',
    color: '#7a5c3e', size: 16
  },
  REG: {
    id: 'REG', name: '迴歸蟲', cat: 'THREAT',
    hp: 105, speed: 26, armor: 6, coreDmg: 12, musou: true,
    tagline: '修好的 Bug 又復發了。死後以 45% HP 復活一次。',
    color: '#68d16f', size: 16,
    revive: { hpFactor: 0.45, times: 1 }
  },
  BSD: {
    id: 'BSD', name: '未存檔當機', cat: 'THREAT',
    hp: 72, speed: 28, armor: 0, coreDmg: 20, musou: true,
    tagline: '藍屏倒數。時間到＝進度蒸發，就算它還沒走到主機。',
    color: '#3f7dff', size: 16,
    fuse: 12
  },
  WISH: {
    id: 'WISH', name: '許願池泥漿', cat: 'THREAT',
    hp: 150, speed: 16, armor: 12, coreDmg: 16, musou: true,
    tagline: '「順便加個多人連線嘛。」邊爬邊生出新功能便利貼。',
    color: '#e6a3c4', size: 16,
    summon: { id: 'STK', every: 6, max: 3 }
  },
  STK: {
    id: 'STK', name: '新功能便利貼', cat: 'SUMMON',
    hp: 24, speed: 34, armor: 0, coreDmg: 3, musou: true,
    tagline: '泥漿生成的小怪。脆，但積少成多。',
    color: '#ffd23f', size: 12, noCount: true
  },
  HYD: {
    id: 'HYD', name: '評圖九頭龍', cat: 'BOSS',
    hp: 460, speed: 18, armor: 28, coreDmg: 28, musou: true,
    tagline: '最終評圖。每回覆一個意見，就再長出兩個。',
    color: '#ff5d5d', size: 24,
    split: ['REVA', 'REVB']
  },
  REVA: {
    id: 'REVA', name: '再改一版 REV-A', cat: 'FRAGMENT',
    hp: 160, speed: 34, armor: 8, coreDmg: 14, musou: true,
    tagline: '九頭龍倒下後飛出的快速修訂。', color: '#ff8f57', size: 14, noCount: true
  },
  REVB: {
    id: 'REVB', name: '再改一版 REV-B', cat: 'FRAGMENT',
    hp: 160, speed: 30, armor: 12, coreDmg: 14, musou: true,
    tagline: '比 REV-A 慢一點，但更硬。', color: '#ffb257', size: 14, noCount: true
  },
  /* ---- v3 嘲諷新敵人 ---- */
  GHO: {
    id: 'GHO', name: '消失的組員', cat: 'THREAT',
    hp: 70, speed: 38, armor: 0, coreDmg: 0, musou: true,
    tagline: '已讀。不回。人呢？——不打主機，改偷走 4 部署點後飄走。',
    color: '#c9d2e8', size: 16,
    flying: true, stealDp: 3
  },
  IDA: {
    id: 'IDA', name: '組長的新點子', cat: 'THREAT',
    hp: 26, speed: 62, armor: 0, coreDmg: 5, musou: true,
    tagline: '「我想到一個超屌的功能！」速度極快但脆——否決它，全隊爆氣 +10。',
    color: '#ffd23f', size: 16,
    feudChargeOnKill: 10
  },
  LAG: {
    id: 'LAG', name: '讀取圈', cat: 'THREAT',
    hp: 150, speed: 14, armor: 10, coreDmg: 10, musou: true,
    tagline: '應用程式沒有回應。光環讓附近隊友出手變慢，優先處理。',
    color: '#41f2e6', size: 16,
    slowAura: { range: 100, mul: 1.3 }
  },
  /* ---- v4 審查委員 mini-boss（六次審查的臉） ---- */
  ROLL: {
    id: 'ROLL', name: '點名教授', cat: 'BOSS',
    hp: 380, speed: 16, armor: 20, coreDmg: 20, musou: true,
    tagline: '第一次審查最可怕的不是內容，是出席。會點名隊友，被點到的得停手應答。',
    color: '#c0392b', size: 24,
    rollcall: { first: 2, every: 6, dur: 4, answerDamage: 55, answerFeud: 18 }
  },
  NOD: {
    id: 'NOD', name: '沒意見教授', cat: 'BOSS',
    hp: 999, speed: 10, armor: 0, coreDmg: 0, musou: false,
    tagline: '「都可以。」一般攻擊無效；把異職種排相鄰，任一組合技都能逼他表態離場。',
    color: '#c0392b', size: 24,
    immune: true, feudFreeze: true, politeLeave: true, comboDismiss: true, politeAfter: 20
  },
  ELDER: {
    id: 'ELDER', name: '當年學長', cat: 'BOSS',
    hp: 520, speed: 12, armor: 24, coreDmg: 22, musou: true,
    tagline: '「當年我們熬七天——」全場隊友越聽越沒力（攻速下降）。打斷他有紅包。',
    color: '#c0392b', size: 24,
    slowAura: { range: 400, mul: 1.25 }, dropDp: 8,
    speech: { cycle: 6, window: 4, disabledFor: 5, damageMul: 2 }
  },
  SUIT: {
    id: 'SUIT', name: '業界委員', cat: 'BOSS',
    hp: 450, speed: 18, armor: 18, coreDmg: 22, musou: true,
    tagline: '講評三分鐘，兩分半在講自己公司。會發名片佔住建造格。',
    color: '#c0392b', size: 24,
    cardBlock: { first: 2, every: 7, dur: 7, tearsForCharge: 3, chargeBonus: 10 }
  },
  CALC: {
    id: 'CALC', name: '預算主任', cat: 'BOSS',
    hp: 480, speed: 14, armor: 26, coreDmg: 24, musou: true,
    tagline: '「這個學校不補助。」在場時每波獎勵減半；擊殺返還全額加利息。',
    color: '#c0392b', size: 24,
    budgetCut: true, dropDp: 6, argue: { cost: 3, damage: 80 }
  },
  /* ---- v4 觀眾系敵人（校外展：他們不是壞人，只是不知道自己是災難） ---- */
  KID: {
    id: 'KID', name: '亂摸小孩', cat: 'THREAT',
    hp: 40, speed: 70, armor: 0, coreDmg: 0, musou: true,
    tagline: '光速衝向展品。摸到主機不會壞，但會讓 Demo 當機（必殺充能歸損）。',
    color: '#ffd9b3', size: 16,
    musouDrain: 18
  },
  KAREN: {
    id: 'KAREN', name: '奧客觀眾', cat: 'THREAT',
    hp: 130, speed: 20, armor: 10, coreDmg: 14, musou: true,
    tagline: '「叫你們老師出來。」貼近的隊友被迫接待，出手大幅變慢。',
    color: '#e6a3c4', size: 16,
    slowAura: { range: 70, mul: 1.5 }
  },
  SWAG: {
    id: 'SWAG', name: '贈品獵人', cat: 'THREAT',
    hp: 60, speed: 48, armor: 0, coreDmg: 0, musou: true,
    tagline: '沒玩遊戲，只問有沒有貼紙。會抱走贈品（偷 DP）。',
    color: '#ffb257', size: 16,
    stealDp: 2
  },
  NCARD: {
    id: 'NCARD', name: '廠商名片群', cat: 'THREAT',
    hp: 30, speed: 44, armor: 0, coreDmg: 4, musou: true,
    tagline: '會繁殖的名片。被測試同學標記後一擊即碎。',
    color: '#f4f6fb', size: 16,
    flying: true, markInstakill: true
  },
  STREAM: {
    id: 'STREAM', name: '直播網紅', cat: 'BOSS',
    hp: 460, speed: 14, armor: 12, coreDmg: 25, musou: true,
    tagline: '在你攤位直播一小時，遊戲一秒沒玩。光環帶動人潮加速跟隨。',
    color: '#ff2e63', size: 24,
    hasteAura: { range: 120, mul: 1.35 }
  },
  LOST: {
    id: 'LOST', name: '迷路長輩', cat: 'THREAT',
    hp: 200, speed: 8, armor: 0, coreDmg: 0, musou: true,
    tagline: '要找的是隔壁棟的食品展。走超慢、超能吸火力，到主機也只是問路。',
    color: '#c9d2e8', size: 16
  },
  GUARD: {
    id: 'GUARD', name: '催撤展保全', cat: 'THREAT',
    hp: 250, speed: 22, armor: 18, coreDmg: 25, musou: true,
    tagline: '「五點了，要清場了。」你的 Demo 還在跑。重甲高傷的時間壓力本體。',
    color: '#2c5ccc', size: 16
  },
  GUARDB: {
    id: 'GUARDB', name: '保全隊長', cat: 'BOSS',
    hp: 900, speed: 14, armor: 35, coreDmg: 30, musou: true,
    tagline: '「規定就是規定，五點整拉電閘。」點他拖延——「再五分鐘就好，真的。」',
    color: '#3a4a8c', size: 24,
    stall: { cost: 2, dur: 3, immune: 4 }
  },
  CMP: {
    id: 'CMP', name: '比較怪', cat: 'THREAT',
    hp: 140, speed: 18, armor: 8, coreDmg: 12, musou: true,
    tagline: '「隔壁那組做得比較好。」被指到的隊友分心（傷害下降）但不服輸（爆氣加倍）。',
    color: '#ffd9b3', size: 16,
    cmpAura: { range: 90, dmgMul: 0.75, feudMul: 2 }
  },
  /* ---- v4 專題實況組 ---- */
  PONY: {
    id: 'PONY', name: '天馬行空', cat: 'THREAT',
    hp: 90, speed: 26, armor: 0, coreDmg: 8, musou: true,
    tagline: '翅膀很小、企劃很大、永遠不落地。在場時會催生更多「新點子」。',
    color: '#f4f6fb', size: 16,
    flying: true, summon: { id: 'IDA', every: 8, max: 2 }
  },
  MEET: {
    id: 'MEET', name: '會議循環', cat: 'THREAT',
    hp: 160, speed: 20, armor: 10, coreDmg: 10, musou: true,
    tagline: '走三步就停下來開會，進度條永遠 0%。會議還會生出更多會議。',
    color: '#8a6d3b', size: 16,
    stopgo: { walk: 3, stop: 2 }, summon: { id: 'MEET', every: 14, max: 1 }
  },
  FAKE: {
    id: 'FAKE', name: '滿分履歷', cat: 'THREAT',
    hp: 15, speed: 30, armor: 0, coreDmg: 12, musou: true,
    tagline: '五顆星、技能全滿。血條看起來 500——打一下就現形了。',
    color: '#ffd23f', size: 16,
    fakeHp: 500
  }
};

/* ---------- 波次（10 波＝畢展倒數 10 週） ---------- */
/* groups: [敵種, 數量, 首隻延遲秒, 間隔秒, 路線(0/1/-1隨機)] */
CD.WAVES = [
  { week: '倒數 10 週', name: '收心操',
    intro: '暑假結束，群組開始跳通知了。',
    groups: [['MSG', 6, 1, 1.6, -1]] },
  { week: '倒數 9 週', name: '訊息轟炸',
    intro: '「在嗎？」「回一下」「＠所有人」',
    groups: [['MSG', 6, 0.5, 1.1, 0], ['MSG', 4, 4, 1.1, 1]] },
  { week: '倒數 8 週', name: '第一張變更單',
    intro: '指導老師：「方向很好，但我們換個方向。」',
    groups: [['ECR', 3, 1, 4.5, -1], ['MSG', 6, 2, 1.4, -1]] },
  { week: '倒數 7 週', name: '靈異現象',
    intro: '「我電腦上可以跑啊。」——注意：靈異 Bug 會隱形，記得部署測試同學。',
    groups: [['BUG', 4, 1, 3.2, -1], ['MSG', 4, 5, 1.3, -1]] },
  { week: '倒數 6 週', name: '沒存檔！',
    intro: '警告：藍屏倒數結束會直接蒸發進度。組員也開始已讀不回了……',
    groups: [['BSD', 2, 2, 7, -1], ['ECR', 3, 1, 4, -1], ['GHO', 2, 6, 9, -1]] },
  { week: '倒數 5 週', name: '功能許願池',
    intro: '「加個天氣系統應該不難吧？」泥漿會生新需求，組長的點子跑得比誰都快。',
    groups: [['WISH', 2, 1, 9, -1], ['BUG', 4, 3, 3, -1], ['MSG', 6, 5, 1.2, -1], ['IDA', 3, 8, 2, -1]] },
  { week: '倒數 4 週', name: '迴歸地獄',
    intro: '上週修好的，這週全部復發。迴歸蟲會復活一次。',
    groups: [['REG', 5, 1, 2.8, -1], ['ECR', 2, 4, 5, -1], ['BSD', 2, 8, 8, -1]] },
  { week: '倒數 3 週', name: '全面趕工',
    intro: '爆肝魔人登場，電腦也開始卡了。讀取圈的光環會拖慢附近隊友。',
    groups: [['CRN', 3, 1, 6, -1], ['WISH', 2, 3, 10, -1], ['REG', 3, 5, 3, -1], ['MSG', 8, 2, 1.0, -1], ['LAG', 2, 6, 12, -1]] },
  { week: '倒數 2 週', name: '死線前夜',
    intro: '所有災難一起來。撐住，下週就是評圖。',
    groups: [['CRN', 4, 1, 5, -1], ['BSD', 3, 3, 6.5, -1], ['BUG', 5, 2, 2.4, -1], ['ECR', 4, 4, 3.5, -1], ['IDA', 4, 10, 1.5, -1], ['GHO', 2, 14, 8, -1]] },
  { week: '最終週', name: '最終評圖',
    intro: '評圖九頭龍降臨。牠倒下時會分裂成兩份「再改一版」。',
    boss: true,
    groups: [['ECR', 2, 1, 3, -1], ['HYD', 1, 6, 0, 0], ['MSG', 6, 12, 1.2, -1], ['LAG', 2, 8, 15, 0]] }
];

/* ---------- 吵架爆氣（招牌系統：相鄰隊友內耗→組合必殺） ----------
 * 相鄰的兩位專員會週期性吵架：吵架中兩人輸出下降（分心），
 * 但爆氣值狂漲；槽滿後點擊場上圖示發動組合必殺。
 * key 固定「照 SPECIALIST_ORDER 排序」的兩人 id 相連（如 PLN_DEV）。 */
CD.FEUDS = {
  PLN_DEV: {
    name: '規格攻防', musou: '需求凍結令',
    color: '#4f9dff',
    lines: [['這功能規格書有寫！', '第 3 版早就作廢了'],
            ['很簡單吧，加一下', '你來寫啊'],
            ['所以進度到哪了', '上次開會不是討論過了'],
            ['使用者會誤會啦', '使用者是你想像的']],
    effect: { damage: 55, slowFactor: 0.4, slowDuration: 6 },
    fx: '全場減速 40%・6 秒＋55 傷害'
  },
  PLN_QAT: {
    name: '驗收羅生門', musou: '驗收條件凍結',
    color: '#ffd23f',
    lines: [['這根本沒寫驗收條件', '臨機應變啊'],
            ['我照規格測的', '規格是活的'],
            ['到底誰說了算', '老師說了算']],
    effect: { damage: 50, markDuration: 6, slowFactor: 0.6, slowDuration: 4 },
    fx: '全場標記＋減速・50 傷害'
  },
  PLN_ART: {
    name: '風格大戰', musou: '爆稿最終定案',
    color: '#ff6b57',
    lines: [['說好的日系呢？', '企劃書寫美式'],
            ['LOGO 再大一點', '再大你自己畫'],
            ['參考圖不是這樣', '參考是參考']],
    effect: { damage: 60, burnDps: 8, burnDuration: 5 },
    fx: '全場 60 傷害＋燒稿 5 秒'
  },
  DEV_QAT: {
    name: '甩鍋大會', musou: '熱修迴歸包',
    color: '#5dd66e',
    lines: [['這裡按下去會當', '我電腦跑得好好的'],
            ['重現步驟給我', '你自己按 37 次'],
            ['是你環境問題', '是你 code 問題']],
    effect: { damage: 45, markDuration: 6, revealAll: 6 },
    fx: '全場標記＋揭穿隱形・45 傷害'
  },
  DEV_ART: {
    name: '交檔僵局', musou: '介面大重構',
    color: '#41f2e6',
    lines: [['圖層幫我壓一下', '你程式自己拆'],
            ['檔名不要再改了', '最終版_真的最終版'],
            ['這張爆版面了', '你版面寫死了吧']],
    effect: { damage: 52, armorBreak: 20, armorBreakDur: 6 },
    fx: '全場 52 傷害＋破甲 −20・6 秒'
  },
  QAT_ART: {
    name: '像素之亂', musou: '像素級驗收',
    color: '#ff2e63',
    lines: [['按鈕根本找不到', '那是設計感'],
            ['這裡差 1px', '你眼睛是尺嗎'],
            ['對比度不夠', '氛圍懂不懂']],
    effect: { damage: 45, burnDps: 5, burnDuration: 4, markDuration: 4 },
    fx: '全場 45 傷害＋燒稿＋標記'
  }
};
/* 吵架節奏參數 */
CD.FEUD_CFG = {
  ADJ_DIST: 62,          // 相鄰判定：兩塔中心距（native px）
  IDLE_GAIN: 0.8,        // 平時相鄰充能／秒（僅波內計算；充能主要來自吵架的痛）
  QUARREL_GAIN: 9,       // 吵架中充能／秒
  QUARREL_MIN: 8,        // 吵架間隔下限（秒）
  QUARREL_MAX: 14,       // 吵架間隔上限
  QUARREL_LEN: 3,        // 一場吵架持續秒數
  DEBUFF: 0.7,           // 吵架中輸出倍率（攻速與傷害都乘）
  MAX: 100               // 爆氣槽上限
};

/* ---------- 戰役 2.0：十關 46 波（分組 → 六次審查 → 校外展×3） ----------
 * 兩幕結構：L0-L6 敵人=「做不完」、L7-L9=「展出去之後的世界」。
 * CD.WAVES（上方）保留給無盡加班模式循環使用。
 * cutscene 陣列＝進關前依序播放的過場圖（assets/sprites/<name>.png）。 */
CD.LEVELS = [
  { id: 'L0', name: '分組之夜', sub: '教學關', bg: 'BG_class', cutscene: ['CUT_night0'],
    hpMul: 0.7,
    waves: [
      { name: '第一則群組訊息', intro: '組長建了群組。訊息開始跳了。點格子部署隊友吧。',
        groups: [['MSG', 5, 1, 1.8, -1]] },
      { name: '已讀不回', intro: '有人開始已讀不回了。便利貼也出現了。',
        tutorial: '先讓兩位不同職種坐相鄰：他們一吵起來，才准面對下一波。',
        groups: [['MSG', 6, 1, 1.4, -1], ['STK', 3, 6, 2, -1]] }
    ] },
  { id: 'L1', name: '開題審查', sub: '第一次審查', bg: null, cutscene: ['CUT_brag'],
    hpMul: 1.20,
    waves: [
      { name: '提案前夜', intro: '企劃書印了七份。希望夠用。',
        groups: [['MSG', 6, 1, 1.4, -1], ['ECR', 2, 5, 4, -1]] },
      { name: '需求湧入', intro: '「方向很好，但我們換個方向。」',
        groups: [['ECR', 4, 1, 3.5, -1], ['MSG', 5, 3, 1.2, -1]] },
      { name: 'BOSS：點名教授', intro: '他翻開了簽到簿。被點到的隊友會暫停攻擊——撐住。',
        groups: [['ROLL', 1, 3, 0, 0], ['MSG', 6, 6, 1.5, -1], ['STK', 4, 10, 2, -1]] }
    ] },
  { id: 'L2', name: '期初提案', sub: '第二次審查', bg: 'BG_lab', cutscene: ['CUT_first'],
    hpMul: 1.40,
    waves: [
      { name: '靈異現象', intro: '「我電腦上可以跑啊。」靈異 Bug 會隱形，部署測試同學。',
        groups: [['BUG', 3, 1, 3, -1], ['MSG', 5, 4, 1.3, -1]] },
      { name: '滿分履歷', intro: '有人自稱什麼都會。血條看起來很厚——打一下就知道了。',
        groups: [['FAKE', 4, 1, 3, -1], ['ECR', 3, 4, 4, -1]] },
      { name: '茶水間傳說', intro: 'Bug 越修越多，紙上的專長越寫越滿。',
        groups: [['BUG', 4, 1, 2.6, -1], ['FAKE', 3, 5, 3.5, -1], ['MSG', 6, 3, 1.2, -1]] },
      { name: 'BOSS：沒意見教授', intro: '「都可以。」一般攻擊無效；部署相鄰異職種會直接滿槽，用組合技逼他表態。',
        groups: [['NOD', 1, 3, 0, 1], ['ECR', 4, 5, 3.5, -1], ['BUG', 3, 9, 3, -1]] }
    ] },
  { id: 'L3', name: '期中審查 I', sub: '第三次審查', bg: 'BG_home', cutscene: ['CUT_mid'],
    hpMul: 1.05,
    waves: [
      { name: '遠端開會', intro: '一半的鏡頭是黑的。藍屏當機出現了——倒數歸零會蒸發進度！',
        groups: [['BSD', 2, 2, 7, -1], ['MSG', 6, 1, 1.3, -1]] },
      { name: '人間蒸發', intro: '那位組員最後上線是三天前。他會偷走部署點。',
        groups: [['GHO', 3, 1, 6, -1], ['ECR', 3, 3, 4, -1]] },
      { name: '進度的幻覺', intro: '「我們有開會討論了。」會議會生出更多會議。',
        groups: [['MEET', 2, 1, 8, -1], ['BSD', 2, 6, 8, -1], ['MSG', 5, 4, 1.2, -1]] },
      { name: 'BOSS：當年學長', intro: '「當年我們熬七天——」全場攻速下降，集火打斷他，有紅包。',
        groups: [['ELDER', 1, 3, 0, 2], ['GHO', 2, 6, 7, -1], ['ECR', 4, 8, 3, -1]] }
    ] },
  { id: 'L4', name: '期中審查 II', sub: '第四次審查', bg: 'BG_lab', cutscene: ['CUT_regroup'],
    // 1.28 時實測比只有四波的 L3 還輕鬆——波數同時當長度與難度兩個旋鈕會互相打架，
    // 多出來的那一波要用敵人成長吃掉才會是「更難的一關」。
    hpMul: 1.88,
    waves: [
      { name: '許願池開張', intro: '「順便加個多人連線嘛。」泥漿會邊爬邊生新需求。',
        groups: [['WISH', 3, 1, 7, -1], ['ECR', 3, 5, 4, -1], ['MSG', 6, 3, 1.2, -1]] },
      { name: '新點子狂奔', intro: '組長的點子跑得比誰都快。否決它，全隊爆氣+10。',
        groups: [['IDA', 4, 1, 2, -1], ['ECR', 3, 4, 4, -1]] },
      { name: '天馬行空', intro: '翅膀很小、企劃很大。天馬在場會催生更多新點子。',
        groups: [['PONY', 2, 1, 8, -1], ['WISH', 2, 3, 9, -1], ['BUG', 3, 3, 3, -1]] },
      { name: '需求雪崩', intro: '每一張便利貼後面還有三張。',
        groups: [['STK', 13, 1, 0.9, -1], ['IDA', 5, 5, 2.0, -1], ['ECR', 6, 3, 2.9, -1], ['WISH', 2, 7, 7, -1]] },
      { name: 'BOSS：業界委員', intro: '他開始發名片了——被名片佔住的格子暫時不能部署。',
        groups: [['SUIT', 1, 3, 0, 0], ['NCARD', 8, 5, 1.4, -1], ['MSG', 6, 8, 1.2, -1]] }
    ] },
  { id: 'L5', name: '展前預審', sub: '第五次審查', bg: 'BG_hall', cutscene: null,
    // 波表重寫（2026-08-06）：這一關實測長期是難度低谷，而且對 hpMul 特別不敏感
    // （1.50→83、1.56→82、1.70→92 全在噪音內）。真正的原因是**波次人數太少、
    // 而且沒有一波是雪崩**——最多才 10 隻，對照 L4 有一波 26 隻。
    // 加上 CRN 以 6 秒間隔一隻隻進場，玩家可以逐一集火，重甲形同虛設。
    // 修法是改組成不是灌血量：拉高數量、縮短間隔、把第四波做成雪崩。
    // hpMul 因此從 1.70 降回 1.55，難度來自壓力而不是血條。
    hpMul: 1.42,
    waves: [
      { name: '迴歸地獄', intro: '上週修好的，這週全部復發。',
        groups: [['REG', 6, 1, 2.4, -1], ['MSG', 8, 3, 1.0, -1]] },
      { name: '爆肝前線', intro: '爆肝魔人登場。重甲，用美術同學的燒稿傷害。',
        // 間隔 6→4：三隻重甲要同時在場才叫前線，一隻隻來只是排隊挨打
        groups: [['CRN', 3, 1, 4, -1], ['REG', 4, 3, 2.6, -1], ['MSG', 6, 2, 1.1, -1]] },
      { name: '一切都卡住了', intro: '電腦卡、會議卡、進度卡。',
        // LAG 的攻速光環要有東西可以拖才有意義，所以同時堆 ECR
        groups: [['LAG', 2, 1, 9, -1], ['MEET', 3, 4, 7, -1], ['ECR', 5, 3, 3, -1]] },
      { name: '長官蒞臨前夕', intro: '走廊開始佈展。別組的射燈很亮，我們的還沒到貨。',
        // 本關的雪崩波：重甲＋復活＋倒數同時來，Boss 前的真正高點。
        // 首版放 20 隻，實測休閒三人 5 場掉 2 場、剩餘 HP 在 0～100 之間亂跳——
        // 那是懸崖不是曲線，收到 16 隻。
        groups: [['CRN', 3, 1, 4, -1], ['REG', 4, 2, 2.4, -1],
                 ['BSD', 3, 4, 6, -1], ['MSG', 6, 3, 1.1, -1]] },
      { name: 'BOSS：預算主任', intro: '「這個學校不補助。」他在場時每波獎勵減半——快送他走。',
        groups: [['CALC', 1, 3, 0, 1], ['GHO', 3, 5, 6, -1], ['STK', 10, 7, 1.3, -1]] }
    ] },
  { id: 'L6', name: '最終評圖', sub: '第六次審查', bg: 'BG_hall', cutscene: null,
    hpMul: 1.65,
    waves: [
      { name: '評圖日早晨', intro: '海報是凌晨四點印好的。墨還沒乾。',
        groups: [['ECR', 4, 1, 3.5, -1], ['MSG', 8, 2, 1.0, -1]] },
      { name: '委員入席', intro: '三張椅子：一張端正、一張翹腳、一張遲到。',
        groups: [['BUG', 4, 1, 2.6, -1], ['CRN', 2, 5, 7, -1], ['FAKE', 3, 3, 3, -1]] },
      { name: '連環提問', intro: '「這個為什麼不用 XX 做？」——第八次被問。',
        groups: [['ECR', 5, 1, 3, -1], ['LAG', 2, 4, 10, -1], ['BSD', 2, 7, 8, -1]] },
      { name: '壓力峰值', intro: '所有災難一起來。撐住，九頭龍要來了。',
        groups: [['CRN', 3, 1, 5, -1], ['REG', 4, 2, 3, -1], ['GHO', 2, 6, 7, -1], ['MSG', 8, 3, 1.0, -1]] },
      { name: '暴風雨前', intro: '會議室的門開了。',
        groups: [['WISH', 2, 1, 9, -1], ['IDA', 4, 3, 2, -1], ['ECR', 4, 5, 3, -1]] },
      { name: 'BOSS：評圖九頭龍', intro: '最終評圖。牠倒下時會分裂成兩份「再改一版」。',
        groups: [['HYD', 1, 5, 0, 0], ['ECR', 3, 8, 3.5, -1], ['MSG', 6, 12, 1.2, -1]] }
    ] },
  { id: 'L7', name: '城市設計祭', sub: '校外展 1／3', bg: 'BG_fest', cutscene: ['CUT_truck'],
    hpMul: 1.78,
    // 佈展儀式要一次預部署四人（合計 8 DP），開局 6 會讓儀式直接失敗。
    // 這一關的開場本來就是「把攤位擺好」，多給的 DP 是儀式成本不是額外優勢。
    startDp: 9,
    waves: [
      { name: '開展', intro: '第一次把作品帶出校門。觀眾……跟想像的不太一樣。',
        groups: [['GUARD', 1, 2, 0, -1], ['KAREN', 1, 8, 0, -1], ['LOST', 2, 1, 8, -1], ['KID', 3, 4, 3, -1]] },
      { name: '贈品之亂', intro: '「有沒有貼紙？」沒人玩遊戲，大家都在拿贈品。',
        groups: [['SWAG', 4, 1, 3, -1], ['LOST', 2, 5, 8, -1], ['KID', 3, 3, 3, -1]] },
      { name: '客訴現場', intro: '「叫你們老師出來。」奧客會讓接待的隊友出手變慢。',
        groups: [['KAREN', 3, 1, 5, -1], ['SWAG', 3, 4, 3, -1], ['KID', 4, 2, 2.5, -1]] },
      { name: '名片攻勢', intro: '廠商的名片會繁殖。標記它們，一擊即碎。',
        groups: [['NCARD', 8, 1, 1.2, -1], ['KAREN', 2, 5, 6, -1], ['LOST', 2, 3, 9, -1]] },
      { name: 'BOSS：清場時間', intro: '「五點了。」保全隊長親自來拉電閘——點他拖延，能拖一秒是一秒。',
        groups: [['GUARDB', 1, 3, 0, -1], ['GUARD', 1, 8, 0, -1], ['SWAG', 5, 3, 2.2, -1], ['KID', 6, 4, 1.8, -1]] }
    ] },
  { id: 'L8', name: '南方創意展', sub: '校外展 2／3', bg: 'BG_south', cutscene: ['CUT_booth', 'CUT_rain'],
    // 0.68 讓玩家漏十七隻還能過關，「漏怪＝失敗」的因果就斷了。0.85 把痛感還回來。
    hpMul: 1.35, coreDmgMul: 0.85,
    waves: [
      { name: '大場面', intro: '挑高展館、正式隔板。隔壁是企業攤位，地毯的。',
        groups: [['KAREN', 1, 2, 0, -1], ['LOST', 3, 1, 7, -1], ['NCARD', 5, 4, 1.5, -1]] },
      { name: '比較的目光', intro: '「隔壁那組做得比較好。」被指到的隊友會分心，但也更不服輸。',
        groups: [['CMP', 2, 1, 8, -1], ['KID', 4, 4, 2.5, -1], ['SWAG', 3, 3, 3, -1]] },
      { name: '人潮尖峰', intro: '走道塞滿了。誰是觀眾、誰是災難，已經分不清了。',
        groups: [['KAREN', 3, 1, 5, -1], ['KID', 5, 2, 2, -1], ['NCARD', 6, 4, 1.3, -1]] },
      { name: '擋不住的熱情', intro: '長輩迷路迷進來了，孩子放學也衝進來了。',
        groups: [['LOST', 3, 1, 7, -1], ['KID', 6, 2, 1.8, -1], ['CMP', 2, 5, 8, -1]] },
      { name: '鏡頭對準你', intro: '有人架起了自拍棒。',
        groups: [['SWAG', 5, 1, 2.5, -1], ['KAREN', 3, 4, 5, -1], ['GUARD', 1, 8, 0, -1]] },
      { name: 'BOSS：直播網紅', intro: '「家人們我們現在在一個超酷的攤位——」人潮跟著她加速湧來。',
        groups: [['STREAM', 1, 3, 0, 2], ['KID', 6, 5, 1.8, -1], ['NCARD', 6, 8, 1.3, -1]] }
    ] },
  { id: 'L9', name: '返校成果展', sub: '最終戰', bg: 'BG_expo', cutscene: ['CUT_home'],
    // 原本 1.3＋七折折扣，比 L7 的 1.65 還鬆，最終戰不是峰值——高潮塌在 L8。
    // 拉到全戰役最高並取消折扣，讓最後一關真的是最後一關。
    hpMul: 1.28,
    waves: [
      { name: '回家', intro: '拖著空推車回到系館。最後一戰，在自己的地方。',
        groups: [['MSG', 6, 1, 1.2, -1], ['ECR', 3, 5, 3.5, -1]] },
      { name: '全員到齊（災難版）', intro: '校內的災難們都回來了，還帶了校外的朋友。',
        groups: [['BUG', 4, 1, 2.5, -1], ['KID', 4, 3, 2.5, -1], ['GHO', 2, 6, 7, -1]] },
      { name: '最後的許願', intro: '「畢業前再加一個功能嘛。」',
        groups: [['WISH', 3, 1, 8, -1], ['IDA', 5, 3, 1.8, -1], ['PONY', 2, 6, 8, -1]] },
      { name: '技術債總清算', intro: '四年的迴歸蟲，一次還清。',
        groups: [['REG', 5, 1, 2.6, -1], ['CRN', 3, 4, 5.5, -1], ['LAG', 2, 6, 10, -1]] },
      { name: '倒數三十分鐘', intro: '保全在門口看錶了。',
        groups: [['GUARD', 2, 1, 8, -1], ['BSD', 2, 3, 7, -1], ['KAREN', 3, 5, 5, -1]] },
      { name: 'FINAL：畢業評圖', intro: '九頭龍回來了——這次，牠看過你們所有的作品。',
        groups: [['HYD', 1, 5, 0, 0], ['CMP', 2, 8, 8, -1], ['ECR', 4, 10, 3, -1], ['MSG', 8, 14, 1.0, -1]] }
    ] }
];

/* ---------- v5 名場面、跨關傳承與「吵架剋制」資料 ---------- */
CD.CG_EVENTS = [
  { id: 'rampage', asset: 'CG_rampage', title: '大爆走', hint: '四人一起把死線撞回去。' },
  { id: 'rage_PLN', asset: 'CG_rage_PLN', title: '企劃摔規格書', hint: '需求到此凍結，紙張除外。' },
  { id: 'rage_DEV', asset: 'CG_rage_DEV', title: '程式熱修失控', hint: '能跑的版本，先活過今晚。' },
  { id: 'rage_QAT', asset: 'CG_rage_QAT', title: '測試看見了一切', hint: '裂鏡後面，每一格都是 Bug。' },
  { id: 'rage_ART', asset: 'CG_rage_ART', title: '美術撕稿重生', hint: '這張不要了。後面的人也嚇到了。' },
  { id: 'laststand', asset: 'CG_laststand', title: '絕體絕命', hint: '主機剩最後一口氣，沒有人退後。' },
  { id: 'hydra', asset: 'CG_hydra', title: '九頭壓頂', hint: '每回答一題，就再長出兩題。' },
  { id: 'dawn', asset: 'CG_dawn', title: '天亮了', hint: '唯一的暖色，是熬完以後的晨光。' }
];

/* 量級對齊敵方成長曲線（hpMul 0.7→1.7）：太小的傳承拿了無感。 */
CD.LEGACIES = [
  { id: 'extension', name: '私藏延長線', desc: '下一關開場 +4 DP。', startDp: 4 },
  { id: 'thermos', name: '洗乾淨的保溫杯', desc: '下一關全隊攻速 +15%。', atkSpeedMul: 1.15 },
  { id: 'backup', name: '離線備份碟', desc: '下一關開場必殺充能 +35。', startMusou: 35 },
  { id: 'earplugs', name: '降噪耳塞', desc: '下一關延後 20 秒才爆肝。', tiredGrace: 20 },
  { id: 'redpen', name: '老師的紅筆', desc: '下一關全隊傷害 +15%。', damageMul: 1.15 },
  { id: 'upsmini', name: '迷你 UPS', desc: '下一關主機受傷減少 15%。', coreReduction: 0.15 },
  { id: 'receipt', name: '沒報帳的收據', desc: '下一關每兩波多拿 1 DP。', waveEvery: 2 },
  { id: 'minutes', name: '真的有寫的會議紀錄', desc: '下一關每組吵架從 35 爆氣起跑。', feudStart: 35 }
];

/* 每位 Boss 各自被「不同」組合剋制：這關的 Boss 是誰，直接決定誰該坐在誰旁邊。 */
CD.FEUD_COUNTERS = {
  PLN_DEV: { ids: ['ECR', 'WISH', 'STK', 'IDA', 'PONY', 'ROLL'], label: '需求封鎖' },
  PLN_QAT: { ids: ['BUG', 'BSD', 'REG', 'LAG', 'SUIT'], label: '重現封鎖' },
  PLN_ART: { ids: ['HYD'], label: '簡報反殺' },
  DEV_QAT: { ids: ['BUG', 'REG', 'BSD', 'NCARD', 'NOD'], label: '除錯連鎖' },
  DEV_ART: { ids: ['CRN', 'LAG', 'STREAM', 'CALC'], label: '效能爆破' },
  QAT_ART: { ids: ['KID', 'KAREN', 'SWAG', 'LOST', 'GUARD', 'GUARDB', 'CMP', 'ELDER'], label: '觀眾鎮壓' }
};

CD.REVIEW_PROPS = {
  L1: [{ id: 'PROP_roll', x: 92, y: 335, s: 2.1 }, { id: 'PROP_podium', x: 700, y: 112, s: 2.2, glow: '#ffd23f' }],
  L2: [{ id: 'PROP_projector', x: 650, y: 70, s: 2.1 }, { id: 'PROP_books', x: 72, y: 345, s: 2 }],
  L3: [{ id: 'PROP_screen', x: 678, y: 76, s: 2.1 }, { id: 'PROP_cans', x: 82, y: 346, s: 2.2 }],
  L4: [{ id: 'PROP_gantt', x: 665, y: 78, s: 2.0 }, { id: 'PROP_notes', x: 72, y: 344, s: 2.2 }],
  L5: [{ id: 'PROP_posters', x: 670, y: 74, s: 2.0 }, { id: 'PROP_cart', x: 78, y: 343, s: 2.1 }],
  L6: [{ id: 'PROP_jury', x: 675, y: 112, s: 2.0, glow: '#41f2e6' }, { id: 'PROP_scoresheet', x: 78, y: 342, s: 2.2 }]
};

/* ---------- 每週會議決策（原三選一強化，升級成有代價的專題會議） ----------
 * 每項＝一個好處＋一個代價。唯一無代價的是雲端備份——備份永遠是對的。
 * 代價 hooks：addTiredAll / queueNextWave / blockDeploy / addDp（由 game API 提供） */
CD.PERKS = [
  { id: 'bull', name: '蠻牛特調', icon: 'can', stack: true,
    desc: '全體攻速 +12%。代價：全體爆肝 +12——今晚，我想來點心悸。',
    apply: function (S, g) { S.atkSpeedMul *= 1.12; g.addTiredAll(12); } },
  { id: 'keys', name: '青軸鍵盤', icon: 'key', stack: false,
    desc: '每第 5 發雙倍傷害＋濺射。代價：−2 DP——好鍵盤，不便宜。',
    apply: function (S, g) { S.keyboardEvery = 5; g.addDp(-2); } },
  { id: 'copy', name: 'Ctrl+C', icon: 'copy', stack: false,
    desc: '25% 機率複製攻擊。代價：下波多 2 隻迴歸蟲——複製貼上＝技術債。',
    apply: function (S, g) { S.copyChance = 0.25; S.copyFactor = 0.7; g.queueNextWave({ extra: [['REG', 2, 2, 4, -1]] }); } },
  { id: 'hammer', name: '重構之錘', icon: 'hammer', stack: true,
    desc: '命中破甲 −10%（可疊到 −30%）。代價：本波禁止部署——大家都在重構。',
    apply: function (S, g) { S.armorBreak = Math.min(30, S.armorBreak + 10); g.blockDeploy(); } },
  { id: 'ups', name: '不斷電系統', icon: 'ups', stack: false,
    desc: '主機受傷 −25%。代價：−3 DP——機房守護神要香油錢。',
    apply: function (S, g) { S.coreDmgReduction = 0.25; g.addDp(-3); } },
  { id: 'cloud', name: '雲端備份', icon: 'cloud', stack: true, instant: true,
    desc: '回復主機缺少 HP 的 40%；若主機滿血則 +2 DP。無代價。',
    apply: function (S, g) { g.cloudBackup(); } },
  { id: 'chicken', name: '雞排加珍奶', icon: 'can', stack: true, instant: true,
    desc: '全體爆肝歸零。代價：−4 DP——組長刷卡，含淚請客。',
    apply: function (S, g) { g.clearTiredAll(); g.addDp(-4); } },
  { id: 'beg', name: '跟老師求情', icon: 'cloud', stack: true, instant: true,
    desc: '主機 +15 HP、全組爆氣 +20（被唸得心裡有火）。代價：下波敵人 HP +15%——「那我標準再提高一點。」',
    apply: function (S, g) { g.healCore(15); g.addFeudChargeAll(20); g.queueNextWave({ hpMul: 1.15 }); } },
  { id: 'recall', name: '把失蹤組員抓回來', icon: 'copy', stack: true, instant: true,
    desc: '+5 DP（他把積欠的進度交出來了）。代價：下波多 2 隻消失的組員——他又帶朋友跑了。',
    apply: function (S, g) { g.addDp(5); g.queueNextWave({ extra: [['GHO', 2, 3, 7, -1]] }); } },
  { id: 'allnight', name: '通宵衝刺', icon: 'key', stack: true, instant: true,
    desc: '必殺充能 +50。代價：全體爆肝 +20——用肝換爆發，內耗引擎全開。',
    apply: function (S, g) { g.addMusou(50); g.addTiredAll(20); } },
  { id: 'bigpie', name: '開會畫大餅', icon: 'cloud', stack: false, instant: true,
    desc: '「做完這版就去比賽、上架、找發行商！」畫久了總會有人買單：本關之後每波開場 +1 DP。',
    apply: function (S, g) { S.bigpieDp = 1; g.toastPie(); } },
  { id: 'askprof', name: '鼓起勇氣問指導老師', icon: 'key', stack: true, instant: true,
    desc: '效果最好的選項，你們卻總是最後才選。主機 +25 HP、+3 DP。代價：被唸到全體爆肝 +25。',
    apply: function (S, g) { g.healCore(25); g.addDp(3); g.addTiredAll(25); } },
  { id: 'askother', name: '問天問地問各老師', icon: 'copy', stack: true, instant: true,
    desc: '就是不問指導老師。隨機獲得一個效果——也可能白問一場。',
    apply: function (S, g) { g.askAround(); } }
];

/* ---------- 地圖：動遊系工作室（路線幾何對齊 assets/BG.png 手繪路網） ---------- */
/* 三入口匯流：上方 A、左側 B、下方 C → 共用幹道 → 右下工作桌旁的交件主機 */
(function () {
  // 共用幹道：H4 東行 → V4 南下 → H6 西行 → V7 南下 → 主機
  var TAIL = [
    { x: 402, y: 148 }, { x: 716, y: 146 }, { x: 729, y: 158 },
    { x: 729, y: 326 }, { x: 717, y: 341 }, { x: 634, y: 341 },
    { x: 617, y: 355 }, { x: 616, y: 398 }, { x: 630, y: 412 }, { x: 658, y: 414 }
  ];
  function withTail(head) { return head.concat(TAIL); }
  CD.MAP = {
    core: { x: 660, y: 414 },
    routes: [
      // R0 上方入口：機櫃間縫隙 → 東行 → V2 南下 → H1 東行 → V3 北上 → 幹道
      withTail([
        { x: 115, y: -20 }, { x: 115, y: 100 }, { x: 212, y: 110 }, { x: 228, y: 124 },
        { x: 228, y: 240 }, { x: 242, y: 258 }, { x: 370, y: 258 }, { x: 388, y: 244 },
        { x: 388, y: 164 }
      ]),
      // R1 左側入口：西門 → 東行 → V1 南下 → H2 東行 → 弧形北上 → 幹道
      withTail([
        { x: -20, y: 145 }, { x: 158, y: 145 }, { x: 172, y: 160 }, { x: 172, y: 302 },
        { x: 186, y: 317 }, { x: 398, y: 314 }, { x: 390, y: 292 }, { x: 388, y: 262 },
        { x: 388, y: 164 }
      ]),
      // R2 下方入口：南門 → V5 北上 → H5 東行 → V6 北上 → H3 西行 → 弧形接幹道
      withTail([
        { x: 560, y: 490 }, { x: 560, y: 308 }, { x: 573, y: 294 }, { x: 660, y: 294 },
        { x: 676, y: 280 }, { x: 676, y: 200 }, { x: 663, y: 186 }, { x: 458, y: 186 },
        { x: 444, y: 172 }
      ])
    ],
    // 入口標示（畫在 BG 上方）
    entrances: [
      { x: 100, y: 66, label: '入口 A' },
      { x: 8, y: 128, label: '入口 B' },
      { x: 505, y: 448, label: '入口 C' }
    ],
    // 建造格（14 格，左上角座標，40px）
    tiles: [
      { x: 280, y: 150 }, { x: 330, y: 150 }, { x: 280, y: 200 }, { x: 330, y: 200 },
      { x: 470, y: 215 }, { x: 520, y: 215 }, { x: 575, y: 215 },
      { x: 300, y: 350 }, { x: 360, y: 350 }, { x: 420, y: 350 },
      { x: 112, y: 185 }, { x: 112, y: 238 },
      { x: 748, y: 190 }, { x: 748, y: 240 }
    ],
    // 裝飾桌椅（僅無 BG 圖時的程式繪製備援）
    desks: [
      { x: 60, y: 180, w: 48, h: 88 }, { x: 240, y: 180, w: 48, h: 30 },
      { x: 500, y: 140, w: 40, h: 40 }, { x: 380, y: 300, w: 40, h: 40 },
      { x: 680, y: 80, w: 72, h: 44 }, { x: 60, y: 300, w: 40, h: 60 }
    ]
  };

  /* 校外展三張場景使用各自的真實走道與交件區，不再沿用工作室路網。 */
  const baseMap = {
    core: Object.assign({}, CD.MAP.core),
    routes: CD.MAP.routes.map(function (r) { return r.map(function (p) { return Object.assign({}, p); }); }),
    entrances: CD.MAP.entrances.map(function (e) { return Object.assign({}, e); })
  };
  CD.MAP_PROFILES = {
    BG_fest: {
      core: { x: 760, y: 408 },
      entrances: [{ x: 382, y: 10, label: '入口 A' }, { x: 8, y: 304, label: '入口 B' }, { x: 382, y: 448, label: '入口 C' }],
      routes: [
        [{ x: 390, y: -20 }, { x: 390, y: 155 }, { x: 610, y: 155 }, { x: 610, y: 310 }, { x: 640, y: 310 }, { x: 640, y: 408 }, { x: 760, y: 408 }],
        [{ x: -20, y: 310 }, { x: 180, y: 310 }, { x: 180, y: 155 }, { x: 610, y: 155 }, { x: 610, y: 310 }, { x: 640, y: 310 }, { x: 640, y: 408 }, { x: 760, y: 408 }],
        [{ x: 390, y: 490 }, { x: 390, y: 310 }, { x: 640, y: 310 }, { x: 640, y: 408 }, { x: 760, y: 408 }]
      ]
    },
    BG_south: {
      core: { x: 765, y: 405 },
      entrances: [{ x: 420, y: 10, label: '入口 A' }, { x: 8, y: 218, label: '入口 B' }, { x: 510, y: 448, label: '入口 C' }],
      routes: [
        [{ x: 430, y: -20 }, { x: 430, y: 220 }, { x: 700, y: 220 }, { x: 700, y: 330 }, { x: 765, y: 330 }, { x: 765, y: 405 }],
        [{ x: -20, y: 225 }, { x: 430, y: 225 }, { x: 700, y: 225 }, { x: 700, y: 330 }, { x: 765, y: 330 }, { x: 765, y: 405 }],
        [{ x: 520, y: 490 }, { x: 520, y: 430 }, { x: 700, y: 430 }, { x: 700, y: 330 }, { x: 765, y: 330 }, { x: 765, y: 405 }]
      ]
    },
    BG_expo: {
      core: { x: 765, y: 414 },
      entrances: [{ x: 216, y: 10, label: '入口 A' }, { x: 8, y: 268, label: '入口 B' }, { x: 680, y: 448, label: '入口 C' }],
      routes: [
        [{ x: 225, y: -20 }, { x: 225, y: 280 }, { x: 370, y: 280 }, { x: 370, y: 330 }, { x: 540, y: 330 }, { x: 540, y: 380 }, { x: 690, y: 380 }, { x: 690, y: 414 }, { x: 765, y: 414 }],
        [{ x: -20, y: 275 }, { x: 225, y: 275 }, { x: 370, y: 280 }, { x: 370, y: 330 }, { x: 540, y: 330 }, { x: 540, y: 380 }, { x: 690, y: 380 }, { x: 690, y: 414 }, { x: 765, y: 414 }],
        // R2 原本只有 151px（南門 3.6 秒直通主機，任何佈局都守不住）；
        // 改為繞經主幹道尾段（~480px），與 BG_fest/BG_south 的南門長度一致。
        [{ x: 690, y: 490 }, { x: 690, y: 445 }, { x: 560, y: 445 }, { x: 560, y: 380 }, { x: 690, y: 380 }, { x: 690, y: 414 }, { x: 765, y: 414 }]
      ]
    }
  };
  CD.useMapProfile = function (bg) {
    const profile = CD.MAP_PROFILES[bg] || baseMap;
    CD.MAP.core = Object.assign({}, profile.core);
    CD.MAP.routes = profile.routes.map(function (r) { return r.map(function (p) { return Object.assign({}, p); }); });
    CD.MAP.entrances = profile.entrances.map(function (e) { return Object.assign({}, e); });
  };
})();

/* ---------- 文案 ---------- */
CD.TEXT = {
  title: '死線防衛隊',
  subtitle: '畢展倒數 10 週',
  tagline: '每一件沒做完的事，最後都會自己找上門。',
  lore: '距離畢業展只剩 10 週。企劃書還在改、素材還沒齊、Bug 越修越多——而「交件主機」是全組最後的希望。守住它。',
  campaign: '開始戰役',
  campaignSub: '第一學期・十週倒數',
  endless: '無盡加班',
  endlessSub: '撐過戰役後解鎖',
  victory: '畢展順利展出！',
  victorySub: '你們守住了交件主機。指導老師在展場停留了整整三分鐘，還點了頭。',
  barely: '低空飛過……',
  barelySub: 'Demo 在開展前一刻當機了。你們站成一排用身體擋住螢幕，對觀眾微笑。老師沒發現。大概。',
  legend: '成為傳說',
  legendSub: '你們的名字掛上了系館的牆。多年後學弟妹還在問：當年那組，到底是怎麼撐下來的？',
  defeat: '進度歸零……',
  defeatSub: '交件主機陣亡。組長在群組傳了一句「大家先睡吧」，已讀 4。',
  meetingTitle: '深夜會議——組長說要選一個',
  tiredTag: '爆肝中',
  coreName: '交件主機',
  musouName: '通宵爆發',
  musouReady: '通宵爆發 READY！',
  wavePrefix: '第', waveSuffix: '波'
};
