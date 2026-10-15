// 《六樓出口》站點與異常設定（2026-10-15 依老師實拍影片改為 8 站）
// frames：走到這一站的兩張中間格；still：停站圖。全部是 Codex 依實拍重繪的漫畫風（art-src/exit6），使用者 2026-10-15 於對話確認風格
// 原始實拍影片：桌面「系網企畫」A＝20261015_134951.mp4、B＝20261015_140325.mp4，src 記原片秒數
// 異常：在該異常加 still（例：still: "frames/s4_a06.webp"）就顯示生好的異常圖；沒有 still 時顯示「佔位」字卡

export const STATIONS = [
  { id: "S0", name: "電梯內", frames: ["frames/s0_a.webp", "frames/s0_b.webp"], still: "frames/s0.webp", src: "B 0:09–0:13",
    tour: "設計大樓 D 棟，按下 6 樓。動遊系的系辦、很多間實驗室和老師研究室都在這一層。" },
  { id: "S1", name: "系辦門口", frames: ["frames/s1_a.webp", "frames/s1_b.webp"], still: "frames/s1.webp", src: "B 0:13–0:19",
    tour: "電梯一出來的正前方就是動遊系系辦，新生有問題先來這裡問。記住門口的告示、兩側海報和地上的彩繪地墊。" },
  { id: "S2", name: "天橋地板彩繪", frames: ["frames/s2_a.webp", "frames/s2_b.webp"], still: "frames/s2.webp", src: "B 0:30–0:40",
    tour: "穿過休息區就是天橋，地上有一大片彩繪。記住它的圖案和方向。" },
  { id: "S3", name: "中庭牌樓", frames: ["frames/s3_a.webp", "frames/s3_b.webp"], still: "frames/s3.webp", src: "B 3:30–3:39",
    tour: "玻璃天棚下的木造牌樓，是六樓最好認的地標。在六樓迷路，就先找它。" },
  { id: "S4", name: "D0604 電繪實驗室", frames: ["frames/s4_a.webp", "frames/s4_b.webp"], still: "frames/s4.webp", src: "A 7:16–7:26",
    tour: "D0604 電繪實驗室：繪圖板教室，2D 角色、場景、UI 都在這裡練。門號 D0604＝D 棟、06 樓、04 號房。旁邊是消防栓。" },
  { id: "S5", name: "作品海報櫥窗", frames: ["frames/s5_a.webp", "frames/s5_b.webp"], still: "frames/s5.webp", src: "A 7:30–7:41",
    tour: "走廊櫥窗貼滿作品海報，記住每張的位置和方向。（待老師確認：海報出處）光是 2025 年，系上就有 8 件作品入圍放視大賞。" },
  { id: "S6", name: "D0646 研究室", frames: ["frames/s6_a.webp", "frames/s6_b.webp"], still: "frames/s6.webp", src: "A 11:08–11:14",
    tour: "老師研究室門口有在室牌：IN 是在、OUT 是不在，找老師前先看一眼。D0646 是陳慶鴻老師，專長電腦動畫與動態影像。" },
  { id: "S7", name: "電梯廳", frames: ["frames/s7_a.webp", "frames/s7_b.webp"], still: "frames/s7.webp", src: "B 5:58–6:10",
    tour: "繞一圈又回到電梯廳。牆上那個「6」記住它。導覽圈結束後，真正的循環才開始。" },
];

// placeholder：{ x, y }＝字卡在畫面上的位置（百分比），text＝佔位說明
// stage：補拍時怎麼現場佈置；card：圖鑑卡內容
export const ANOMALIES = [
  { id: "A01", station: 1, still: "frames/s1_a01.webp", placeholder: { x: 50, y: 42, text: "告示變成「請回頭看看嘛♡」" },
    stage: "門口 A4 告示換成第二張",
    card: { title: "告示變溫柔了", text: "「請勿回頭」其實是反話：回頭就是回報異常。系主任很希望你多看看系上。" } },
  { id: "A02", station: 1, still: "frames/s1_a02.webp", placeholder: { x: 50, y: 18, text: "門口兩側海報左右對調" },
    stage: "把系辦門口左右兩張海報對調",
    card: { title: "海報換邊了", text: "系辦門口的海報是系上作品。系辦就在電梯正前方，新生有問題先來這裡問。" } },
  { id: "A03", station: 1, still: "frames/s1_a03.webp", placeholder: { x: 50, y: 85, text: "地上的彩繪地墊方向反了" },
    stage: "把系辦前的彩繪地墊翻面",
    card: { title: "地墊方向反了", text: "（待老師補充：這張彩繪地墊的作者與作品介紹）" } },
  { id: "A04", station: 2, still: "frames/s2_a04.webp", placeholder: { x: 27, y: 62, text: "彩繪中央多了一雙鞋" },
    stage: "在天橋彩繪中央放一雙鞋",
    card: { title: "有人脫了鞋", text: "（待老師補充：天橋地板彩繪的由來）" } },
  { id: "A05", station: 3, still: "frames/s3_a05.webp", placeholder: { x: 50, y: 70, text: "牌樓正下方多了一張椅子" },
    stage: "搬一張走廊長凳到牌樓正下方",
    card: { title: "牌樓下有人坐過", text: "（待老師補充：中庭牌樓的由來）在六樓迷路，先找牌樓。" } },
  { id: "A06", station: 4, still: "frames/s4_a06.webp", placeholder: { x: 46, y: 20, text: "門號變成 D0640" },
    stage: "門號上貼 A4「D0640」",
    card: { title: "門號跑掉了", text: "D0604：D 棟、06 樓、04 號房。看懂門號，在學校就不會迷路。" } },
  { id: "A07", station: 4, still: "frames/s4_a07.webp", placeholder: { x: 30, y: 50, text: "門上貼著「電繪食驗室」" },
    stage: "門上貼 A4「D0604 電繪食驗室」",
    card: { title: "電繪「食」驗室", text: "是實驗室不是食堂。電繪實驗室配備繪圖板，2D 角色、場景、UI 都在這裡練。" } },
  { id: "A08", station: 5, still: "frames/s5_a08.webp", placeholder: { x: 55, y: 45, text: "其中一張海報上下顛倒" },
    stage: "請管理櫥窗的老師把一張海報倒過來放",
    card: { title: "海報倒掛", text: "（待老師確認：櫥窗海報的出處與換展方式）2025 年系上有 8 件作品入圍放視大賞。" } },
  { id: "A09", station: 5, still: "frames/s5_a09.webp", placeholder: { x: 61, y: 45, text: "櫥窗裡多了一張系主任的臉" },
    stage: "櫥窗內放一張 A4 系主任照片",
    card: { title: "系主任在看你", text: "海報上是系主任鄧樹遠本人（照系網官方照片畫的），專長遊戲設計、劇本創作與數位剪輯。（待老師補充：櫥窗海報的作品介紹）" } },
  { id: "A10", station: 6, still: "frames/s6_a10.webp", placeholder: { x: 42, y: 86, text: "在室牌的磁鐵全部擠在 IN" },
    stage: "（徵得陳慶鴻老師同意）把在室牌磁鐵全移到 IN",
    card: { title: "全部都在？", text: "在室牌 IN 是在、OUT 是不在。找老師前先看在室牌，省得白跑一趟。" } },
  { id: "A11", station: 6, still: "frames/s6_a11.webp", placeholder: { x: 49, y: 12, text: "門牌名字變成「鄧樹遠」" },
    stage: "（徵得同意）名牌上貼 A4「鄧樹遠」",
    card: { title: "走錯研究室了", text: "D0646 是陳慶鴻老師的研究室，專長電腦動畫與動態影像，教動態圖像設計。" } },
  { id: "A12", station: 7, still: "frames/s7_a12.webp", placeholder: { x: 44, y: 8, text: "牆上的「6」變成「8」" },
    stage: "在「6」上貼一張 A4「8」",
    card: { title: "這裡不是八號出口", text: "這裡是六樓。致敬《8 番出口》，但我們的出口要靠認識動遊系才找得到。" } },
];

export const VOICE_TEXT = {
  vo_wrong_01: "欸欸欸——拜託再看看嘛～",
  vo_wrong_02: "同學，這圈真的很正常啦，你再看一次嘛。",
  vo_wrong_03: "好啦好啦，我陪你從頭再走一次。",
  vo_first_correct: "欸～你很會看喔！就是要這樣。",
  vo_half: "走一半了，六樓的地標你認得幾個啦？",
  vo_ending: "恭喜你走出六樓！不過說真的，歡迎你常常回來看看。我是系主任鄧樹遠，動遊系等你。",
};
