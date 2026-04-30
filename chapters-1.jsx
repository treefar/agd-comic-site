/* 章節版型 — 標準漫畫 tier 結構 */
const { useState: useS } = React;

// CH.01 — HERO 卷頭頁（splash + tier 結構）
const HeroChapter = () => (
  <section className="chapter" id="hero" data-screen-label="01 Hero">
    <div className="container">
      <div className="comic-page">

        {/* TIER 1 — splash 全寬主格 — tier 設 position:relative 給 bubble 用 */}
        <div className="comic-tier tier-1-1 tier-splash" style={{ position: "relative" }}>
          {/* 對話泡泡 — 移到 panel 外側 + 突出 panel 上邊框，破第四面牆（panel 有 overflow:hidden 會切掉） */}
          <div style={{ position: "absolute", top: -28, left: 36, zIndex: 7, transform: "rotate(-3deg)" }}>
            <Bubble variant="bubble--cloud" className="bubble--anim-bounce">「動起來！動到極限！」</Bubble>
          </div>
          <Panel bg="bg-halftone-light" style={{ padding: 0, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0 }} className="bg-speedlines" />
            {/* 🥚 彩蛋熱區 — 集中線中心半徑 20px 內可點 */}
            <EasterEgg size={40} label="彩蛋！" />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              padding: "36px 36px 120px 36px"
            }}>
              <div style={{
                fontFamily: "'Bangers',sans-serif",
                color: "var(--accent-red)", fontSize: 22,
                letterSpacing: "0.1em", textShadow: "2px 2px 0 var(--ink)"
              }}>SHU-TE UNIVERSITY · DEPT. OF ANIMATION & GAME DESIGN</div>
              <div className="h-display h-jojo" style={{
                fontSize: "clamp(72px, 10vw, 140px)", marginTop: 10
              }}>
                畫出來，<br />動起來。
              </div>
              <div style={{ marginTop: 18 }}>
                <span className="hero-tagline" style={{
                  display: "inline-block",
                  fontSize: 17, fontWeight: 700,
                  whiteSpace: "nowrap",
                  background: "var(--accent-yellow)",
                  color: "var(--ink)",
                  padding: "6px 14px",
                  border: "3px solid var(--ink)",
                  boxShadow: "3px 3px 0 var(--ink)",
                  position: "relative", zIndex: 2
                }}>
                  動畫、遊戲、互動媒體 — 把你腦內的世界畫出來，動起來，變成會跑的角色與故事。
                </span>
              </div>
            </div>
            <SFX color="yellow" rotate={-10} size={120} anim="burst"
              style={{ position: "absolute", top: 30, right: 60, zIndex: 5 }}>
              碰！
            </SFX>
            <div style={{
              position: "absolute", top: 24, right: 24,
              fontFamily: "'Bangers',sans-serif", fontSize: 14,
              background: "var(--ink)", color: "var(--paper)",
              padding: "6px 14px", transform: "rotate(3deg)",
              border: "3px solid var(--paper)",
              boxShadow: "3px 3px 0 var(--accent-red)", zIndex: 5
            }}>CH. 01 — OPEN</div>

            {/* 「碰」下方的 PRESS START 按鈕 + 角色對白 */}
            <div style={{
              position: "absolute", top: 170, right: 36,
              display: "flex", flexDirection: "column", alignItems: "flex-end",
              gap: 12, zIndex: 4, maxWidth: 240
            }}>
              <Bubble variant="bubble--shout" style={{
                background: "#fff", color: "var(--ink)",
                fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900,
                fontSize: 13, lineHeight: 1.3,
                transform: "rotate(2deg)", textAlign: "right"
              }}>
                準備好了嗎？<br/>翻開第一格 ↓
              </Bubble>
              <a href="#news" style={{
                background: "var(--accent-red)", color: "#fff",
                fontFamily: "'Bowlby One',sans-serif", letterSpacing: "0.06em",
                fontSize: 22, padding: "12px 24px",
                textDecoration: "none",
                border: "4px solid var(--ink)",
                boxShadow: "5px 5px 0 var(--ink)",
                transform: "rotate(-2deg)",
                display: "inline-flex", alignItems: "center", gap: 8,
                cursor: "pointer",
                animation: "pressStart 1.6s ease-in-out infinite"
              }}>
                ▶ PRESS START
              </a>
              <div style={{
                fontFamily: "'Bangers',sans-serif", fontSize: 12, letterSpacing: "0.1em",
                color: "var(--ink)", opacity: 0.6
              }}>
                ↓ SCROLL TO CONTINUE ↓
              </div>
            </div>
            {/* 底部 highlight 泡泡 — 點擊即跳到對應的精彩內容 */}
            <div style={{ position: "absolute", bottom: 24, left: 32, right: 280, display: "flex", gap: 10, flexWrap: "wrap", zIndex: 5 }}>
              <a href="#about" style={{ textDecoration: "none" }}>
                <Bubble className="bubble--anim-glow" style={{
                  background: "#fff", color: "var(--ink)",
                  fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900,
                  fontSize: 13, cursor: "pointer", transform: "rotate(-2deg)",
                  border: "3px solid var(--accent-red)"
                }}>
                  🥇 全台<b style={{ color: "var(--accent-red)" }}>第一所</b>動畫與遊戲科系
                </Bubble>
              </a>
              <a href="#/stats/international" style={{ textDecoration: "none" }}>
                <Bubble variant="bubble--cloud" className="bubble--anim-rubber" style={{
                  background: "var(--accent-red)", color: "#fff",
                  fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900,
                  fontSize: 13, cursor: "pointer"
                }}>
                  🇯🇵 日本海外實習 · 第 8 年
                </Bubble>
              </a>
              <a href="#/works/top-2-scientists" style={{ textDecoration: "none" }}>
                <Bubble className="bubble--anim-flash" style={{
                  background: "var(--ink)", color: "var(--accent-yellow)",
                  fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900,
                  fontSize: 13, cursor: "pointer", transform: "rotate(2deg)"
                }}>
                  ⭐ 全球前 2% 學者 · 連 4 年
                </Bubble>
              </a>
            </div>
          </Panel>
        </div>

        {/* TIER 2 — 方案 C：左寬 stats 主體（含工具棧）+ 右側海報 sidebar 等高拉長 */}
        <div className="comic-tier">
          {/* LEFT — stats 主體（3 欄 6 格） */}
          <Panel variant="yellow" style={{ flex: 2, padding: 18, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
            {/* 標題 */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 32, lineHeight: 1, color: "var(--accent-red)" }}>2006</span>
                <span style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 22, lineHeight: 1 }}>創系</span>
                <span style={{ flex: 1, height: 3, background: "var(--ink)", marginLeft: 6 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.85, lineHeight: 1.5 }}>
                做動畫 · 做遊戲 · 做 VR/AR 互動體驗的地方
              </div>
            </div>

            {/* 6 格統計 — 3 欄 × 2 列 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
              {[
                { num: "16", unit: "位", label: "業界派老師", to: "#faculty", color: "var(--accent-red)" },
                { num: "12", unit: "間", label: "特色實驗室", to: "#labs", color: "var(--accent-blue)" },
                { num: "811", unit: "張", label: "5 年取得證照", to: "#/stats/certifications", color: "var(--accent-red)" },
                { num: "90+", unit: "件", label: "歷屆得獎", to: "#/stats/awards", color: "var(--ink)" },
                { num: "8", unit: "年", label: "日本實習", to: "#/stats/international", color: "var(--accent-blue)" },
                { num: "94%", unit: "", label: "畢業就業比", to: "#/stats/employment", color: "var(--ink)" },
              ].map((s, i) => (
                <a key={i} href={s.to} style={{
                  background: "var(--paper)", color: "var(--ink)",
                  padding: "12px 14px", textDecoration: "none",
                  border: "3px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  transition: "transform 0.1s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "5px 5px 0 var(--ink)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    <span style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 32, lineHeight: 1, color: s.color }}>{s.num}</span>
                    <span style={{ fontSize: 13, fontWeight: 800 }}>{s.unit}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6, opacity: 0.85 }}>{s.label} →</div>
                </a>
              ))}
            </div>

            {/* 工具棧（從 TIER 3 搬過來） */}
            <div style={{ marginTop: 14, padding: "12px 14px", border: "3px solid var(--ink)", background: "rgba(15,13,10,0.06)" }}>
              <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 16, color: "var(--accent-red)", marginBottom: 8, letterSpacing: "0.02em" }}>
                3D / 2D / VR / AR / GAME / COMIC
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.65, color: "var(--ink)" }}>
                {[
                  { tag: "Adobe", tools: "Photoshop · Illustrator · After Effects · Premiere Pro · Animate" },
                  { tag: "Autodesk", tools: "Maya · 3ds Max" },
                  { tag: "引擎", tools: "Unity · Unreal Engine" },
                  { tag: "3D / 雕塑 / 材質", tools: "ZBrush · Blender · Substance Painter" },
                  { tag: "2D / 動畫 / 繪圖", tools: "Live2D · Spine · Clip Studio Paint · Procreate" },
                ].map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                    <span style={{ color: "var(--accent-red)", fontWeight: 900, minWidth: 100, fontSize: 12 }}>● {g.tag}</span>
                    <span style={{ flex: 1, fontWeight: 600 }}>{g.tools}</span>
                  </div>
                ))}
                <div style={{ marginTop: 6, fontSize: 11, opacity: 0.75, fontStyle: "italic" }}>
                  —— 真機房、真設備、業界級工具一次到位
                </div>
              </div>
            </div>

            {/* LIVE 提示 */}
            <div style={{
              marginTop: 10, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
              display: "flex", alignItems: "center", gap: 8, opacity: 0.78
            }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent-red)", animation: "sfxBlink 1.4s ease-in-out infinite" }} />
              LIVE · 2006 → NOW · 連載中
            </div>
          </Panel>

          {/* RIGHT — 海報 sidebar（拉長 + 上下稍微 crop） */}
          <Panel style={{ flex: 1, padding: 0, position: "relative", overflow: "hidden", background: "var(--ink)", minWidth: 280, alignSelf: "stretch" }}>
            <PH label="ClipStudio Grand Prize 國際插畫首獎"
              src="images/posters/clipstudio-grand-prize.jpg"
              fallback="https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2025/03/_page-0001-scaled-e1765931540737.jpg"
              alt="ClipStudio Grand Prize 國際插畫首獎 · 直幅原版海報"
              fit="cover"
              pos="center top" />
            {/* GRAND PRIZE 黃章 */}
            <div style={{
              position: "absolute", top: 10, right: 10, zIndex: 2,
              background: "var(--accent-yellow)", color: "var(--ink)",
              padding: "4px 10px",
              fontFamily: "'Bowlby One',sans-serif",
              fontSize: 11, transform: "rotate(3deg)",
              border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)",
              letterSpacing: "0.05em"
            }}>
              GRAND PRIZE
            </div>
          </Panel>
        </div>

        {/* TIER 3 — 全寬 CTA 橫條：「這一話，由你來畫」 */}
        <div className="comic-tier tier-1">
          <Panel clickable variant="red"
            onClick={() => { window.location.hash = "#about"; }}
            style={{ padding: "20px 28px", position: "relative", overflow: "hidden" }}>
            <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.15 }} />
            {/* 巨大「你」字背景 */}
            <div style={{
              position: "absolute", right: 30, top: -30,
              fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900,
              fontSize: 200, lineHeight: 1, color: "#fff",
              opacity: 0.16, pointerEvents: "none",
              transform: "rotate(-6deg)"
            }}>你</div>
            <div style={{
              position: "relative",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 20, flexWrap: "wrap"
            }}>
              {/* 左側：標籤 + 大字 + 補述 */}
              <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", flex: 1 }}>
                <Bubble variant="bubble--cloud" style={{
                  background: "var(--accent-yellow)", color: "var(--ink)",
                  fontFamily: "'Noto Sans TC',sans-serif", fontSize: 13, fontWeight: 900,
                  display: "inline-block", transform: "rotate(-2deg)", flexShrink: 0
                }}>
                  CHARACTER · YOU
                </Bubble>
                <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900, fontSize: 30, lineHeight: 1.1, color: "#fff" }}>
                  這一話，由<u style={{ textDecorationColor: "var(--accent-yellow)", textDecorationThickness: 4 }}>你</u>來畫。
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "#fff", opacity: 0.92, fontWeight: 600 }}>
                  愛畫、愛玩、愛動腦 — 把腦內小劇場帶來連載。
                </div>
              </div>
              {/* 右側：NEXT 按鈕 */}
              <div style={{
                fontSize: 13, fontWeight: 900, letterSpacing: "0.1em",
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--ink)", color: "var(--accent-yellow)",
                padding: "8px 14px", flexShrink: 0,
                boxShadow: "3px 3px 0 var(--accent-yellow)"
              }}>
                <span>NEXT →</span> 翻頁認識我們
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <ChapterNext to="#news" num="02" title="最新消息" currentLabel="P. 001 — 第一話 OPEN" />
    </div>
  </section>
);

// CH.02 — 最新消息（標準 tier：頭條 2:1 + 三格新聞）
const NEWS = [
  {
    id: 7140, date: "2026.04.29", tag: "入圍", color: "red", num: "01",
    title: "動遊系 2026 競賽佳績榜 · 14 件入圍 7 部畢業專題上榜",
    excerpt: "全國技專專題、青春設計節、放視大賞、金點新秀 — 4 大競賽 14 件入圍，7 部畢業專題作品全榜公開。",
    link: "#/news/2026-04-29-awards-showcase"
  },
  {
    id: 7141, date: "2026.04.25", tag: "國際", color: "wine", num: "01",
    title: "四部學生動畫橫掃國際影展 · 21+ 入圍 · 歐美亞澳四大洲",
    excerpt: "《失竊的祕方》《癡迷的現實》《人造人》《神癒》登上多國影展競賽單元 — 義大利怪誕影展叛逆視野獎、西班牙愛情影展最佳奇幻類等獎項相繼到手。",
    link: "#/news/2026-04-25-international-festivals"
  },
  {
    id: 7119, date: "2026.04.08", tag: "課程", color: "blue", num: "02",
    title: "114 學年度第 2 學期學生「Unity 證照輔導班」開課！",
    excerpt: "Unity Certification User (UCU) 國際認證 · 5/16-5/17 D0625 · 名額 20 人 · 楊智彰老師授課。",
    link: "https://www.dgd.stu.edu.tw/2026/04/08/%e5%8b%95%e7%95%ab%e8%88%87%e9%81%8a%e6%88%b2%e8%a8%ad%e8%a8%88%e7%b3%bb%e8%be%a6%e7%90%86114%e5%ad%b8%e5%b9%b4%e5%ba%a6%e7%ac%ac%e4%ba%8c%e5%ad%b8%e6%9c%9f%e5%ad%b8%e7%94%9f%e3%80%8cunity%e8%ad%89/"
  },
  {
    id: 7108, date: "2026.03.31", tag: "課程", color: "yellow", num: "03",
    title: "「SSE-Adobe After Effect CC」國際證照輔導班",
    excerpt: "動畫與遊戲設計系辦理 114-2 學年度「SSE-Adobe After Effect CC」國際證照輔導班。",
    link: "https://www.dgd.stu.edu.tw/2026/03/31/%e5%8b%95%e7%95%ab%e8%88%87%e9%81%8a%e6%88%b2%e8%a8%ad%e8%a8%88%e7%b3%bb%e8%be%a6%e7%90%86114-2%e5%ad%b8%e5%b9%b4%e5%ba%a6%e3%80%8csse-adobe-after-effect-cc%e3%80%8d%e5%9c%8b%e9%9a%9b%e8%ad%89/"
  },
  {
    id: 7104, date: "2026.03.24", tag: "比賽", color: "red", num: "04",
    title: "2026 第十五屆開拓極短篇原創大賞 熱烈徵件中！",
    excerpt: "想一舉擄獲數萬名動漫迷的眼光？優先獲得被推薦到國內外各出版單位的機會、成為正式線上連載的作者。",
    link: "https://www.dgd.stu.edu.tw/2026/03/24/2026%e7%ac%ac%e5%8d%81%e4%ba%94%e5%b1%86%e9%96%8b%e6%8b%93%e6%a5%b5%e7%9f%ad%e7%af%87%e5%8e%9f%e5%89%b5%e5%a4%a7%e8%b3%9e-%e7%86%b1%e7%83%88%e5%be%b5%e4%bb%b6%e4%b8%ad%ef%bc%81/"
  },
  {
    id: 7076, date: "2026.03.17", tag: "課程", color: "blue", num: "05",
    title: "114 學年度第 2 學期「ACP Illustrator」國際證照輔導班",
    excerpt: "動畫與遊戲設計系辦理 114-2 學期「ACP Illustrator」國際證照輔導班，提升學生數位設計就業競爭力。",
    link: "https://www.dgd.stu.edu.tw/2026/03/17/114%e5%ad%b8%e5%b9%b4%e5%ba%a6%e7%ac%ac2%e5%ad%b8%e6%9c%9f%e3%80%8cacp-illustrator%e3%80%8d%e5%9c%8b%e9%9a%9b%e8%ad%89%e7%85%a7%e8%bc%94%e5%b0%8e%e7%8f%ad/"
  },
  {
    id: 7053, date: "2026.01.27", tag: "活動", color: "yellow", num: "06",
    title: "樹德科大動遊系 2026 Open Day 引導學員體驗動畫與遊戲設計學習現場",
    excerpt: "Open Day 以「真實體驗大學學習」為核心，五門核心課程＋桌遊互動＋校園走讀＋分組實作。",
    link: "#/news/2026-01-27-open-day"
  },
  {
    id: 6800, date: "2025.10.20", tag: "課程", color: "blue", num: "07",
    title: "114 學年度第 1 學期學生「Unity 證照輔導班」",
    excerpt: "Unity Certification User (UCU) 國際認證 · 11/29-11/30 · D0625 · Programmer 第二張證照。",
    link: "#/news/2025-10-20-unity-114-1"
  },
  {
    id: 6765, date: "2025.09.25", tag: "榮譽", color: "wine", num: "08",
    title: "樹德科大再創佳績！科研雙星連四年榮登全球前 2% 學者榜",
    excerpt: "蘇中和教授（動遊系）連續四年入選《全球前 2% 頂尖科學家》。",
    link: "#/news/2025-09-25-top-2-percent-scientists"
  },
  {
    id: 6759, date: "2025.08.28", tag: "得獎", color: "red", num: "09",
    title: "樹德科大動遊系勇奪巴哈姆特 ACG 創作大賽優選雙獎",
    excerpt: "原創動畫《人造人》與《癡迷的現實》同時榮獲優選賞，從全台 69 件入圍作品中脫穎而出。",
    link: "#/news/2025-08-28-bahamut-acg"
  },
  {
    id: 6753, date: "2025.07.25", tag: "國際", color: "wine", num: "10",
    title: "樹德科大攜手日本動畫大廠 培育國際競爭力動漫設計人才",
    excerpt: "與日本 Hautecouture (HC) 公司合作邁入第八年，學海築夢計畫 8 位學生赴愛媛縣松山市實習近三個月。",
    link: "#/news/2025-07-25-japan-hc-internship"
  },
  {
    id: 6747, date: "2025.07.04", tag: "得獎", color: "red", num: "11",
    title: "樹科大動遊系創意展實力 時報金犢獎國際競賽勇奪第二名",
    excerpt: "張純雅老師指導學生作品《永慶房屋雇主品牌招募廣告系列》榮獲第 34 屆時報金犢獎第二名。",
    link: "#/news/2025-07-04-times-golden-pin"
  },
  {
    id: 6735, date: "2025.06.17", tag: "得獎", color: "red", num: "12",
    title: "樹科大動遊系勇奪全國競賽佳績 畢業專題《失竊的祕方》領銜嶄露鋒芒",
    excerpt: "《失竊的祕方》獲青春設計節優選，並入圍全國技專校院實務專題競賽（從 1,181 件作品中脫穎而出）。",
    link: "#/news/2025-06-17-stolen-recipe"
  },
];

// 2026 競賽佳績榜 7 部入圍作品（首頁縮圖用 — 點擊跳到 NEWS[0] 詳情頁）
const AWARDS_WORKS = [
  { rank: "01", title: "癒光之音：悅曲", cat: "遊戲", img: "images/news/2026-awards/healing-light.jpg", grand: true },
  { rank: "02", title: "競箱團",        cat: "動畫", img: "images/news/2026-awards/jingxiangtuan.jpg" },
  { rank: "03", title: "葛柏 TV 秀",    cat: "遊戲", img: "images/news/2026-awards/garble-tv.jpg" },
  { rank: "04", title: "Dear, All Robots", cat: "動畫", img: "images/news/2026-awards/dear-all-robots.jpg" },
  { rank: "05", title: "喀嚓",          cat: "遊戲", img: "images/news/2026-awards/kacha.jpg" },
  { rank: "06", title: "今食堂",        cat: "遊戲", img: "images/news/2026-awards/today-restaurant.jpg" },
  { rank: "07", title: "冤枉汪",        cat: "動畫", img: "images/news/2026-awards/yuan-wang-wang.jpg" },
];

// 本地導航：設定 hash → 觸發 router 切換到 detail page
const goLocal = (type, slug) => () => { window.location.hash = "#/" + type + "/" + slug; };

const NewsChapter = () => (
  <section className="chapter" id="news" data-screen-label="02 News">
    <div className="container">
      <ChapterTag num="02" title="動畫與遊戲設計系 — 最新消息" jp="LATEST DROPS" />

      <div className="comic-page">
        {/* TIER 1 — 頭條全寬大版（2026 競賽佳績榜） */}
        <div className="comic-tier tier-1">
          <Panel clickable onClick={goLocal("news", NEWS[0].id)} className="bg-halftone-light"
            style={{ padding: 0, position: "relative", overflow: "hidden" }}>
            <div className="news-headline" style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
              gridTemplateRows: "1fr",
              minHeight: 420
            }}>
              {/* 左：海報主視覺（絕對定位避免被 img 撐爆） */}
              <div style={{ position: "relative", borderRight: "var(--bw) solid var(--ink)", overflow: "hidden", minHeight: 420 }}>
                <div style={{ position: "absolute", inset: 0 }}>
                  <PH label="2026 競賽佳績榜"
                    src="images/news/2026-awards/healing-light.jpg"
                    alt="2026 動遊系競賽佳績榜 — 全國技專專題／青春設計節／放視大賞／金點新秀"
                    fit="cover"
                    pos="center 18%" />
                </div>
                <SFX color="yellow" rotate={-10} size={84} style={{ position: "absolute", top: 18, left: 22, zIndex: 2 }}>
                  14 件！
                </SFX>
                <div style={{
                  position: "absolute", bottom: 14, left: 14, zIndex: 2,
                  background: "var(--accent-red)", color: "#fff",
                  padding: "5px 12px",
                  fontFamily: "'Bowlby One',sans-serif", fontSize: 13, letterSpacing: "0.1em"
                }}>★ 4 競賽全入圍代表作《癒光之音：悅曲》</div>
              </div>
              {/* 右：標題與內文 */}
              <div style={{ padding: "28px 30px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{
                    display: "inline-block", background: "var(--accent-red)", color: "#fff",
                    padding: "4px 14px", fontFamily: "'Bowlby One',sans-serif",
                    letterSpacing: "0.1em", fontSize: 14, marginBottom: 14
                  }}>HEADLINE · 頭版</div>
                  <div className="h-display" style={{ fontSize: 32, marginBottom: 14, lineHeight: 1.18 }}>
                    {NEWS[0].title}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.85, opacity: 0.88, marginBottom: 12, fontWeight: 500 }}>
                    {NEWS[0].excerpt}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                    {["全國技專專題", "青春設計節", "放視大賞", "金點新秀"].map((c, i) => (
                      <span key={i} style={{
                        background: "var(--ink)", color: "var(--accent-yellow)",
                        padding: "3px 10px", fontFamily: "'Bangers',sans-serif",
                        fontSize: 12, letterSpacing: "0.08em"
                      }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px dashed var(--ink)", paddingTop: 12 }}>
                  <div style={{ fontSize: 13, color: "var(--ink-2)", opacity: 0.7, fontWeight: 700 }}>
                    {NEWS[0].date} · {NEWS[0].tag}
                  </div>
                  <div style={{ fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em", fontSize: 16, display: "flex", alignItems: "center", gap: 4 }}>
                    看
                    <span style={{
                      fontFamily: "'Bowlby One',sans-serif",
                      fontSize: 28, lineHeight: 1, color: "var(--accent-red)",
                      WebkitTextStroke: "2px var(--ink)",
                      paintOrder: "stroke fill",
                      margin: "0 2px"
                    }}>7</span>
                    部入圍作品 →
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* TIER 1.5 — 7 部入圍作品縮圖牆 */}
        <div className="comic-tier tier-1">
          <Panel variant="inkbg" style={{ padding: "18px 20px 22px", position: "relative", overflow: "hidden" }}>
            <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.12 }} />
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.14em", color: "var(--accent-yellow)" }}>
                  ★ SELECTED WORKS · 入圍作品
                </div>
                <div className="h-display" style={{ fontSize: 22, color: "var(--paper)", marginTop: 2 }}>
                  7 部畢業專題　14 件入圍
                </div>
              </div>
              <div onClick={goLocal("news", NEWS[0].id)}
                style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", color: "var(--accent-yellow)", cursor: "pointer" }}>
                看完整內文 →
              </div>
            </div>
            <div style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 10
            }}>
              {AWARDS_WORKS.map((w, i) => (
                <div key={i}
                  onClick={() => { window.location.hash = "#/news/2026-04-29-awards-showcase/work-" + w.rank; }}
                  style={{
                    cursor: "pointer",
                    border: "3px solid var(--ink)",
                    background: "#000",
                    position: "relative",
                    aspectRatio: "3 / 4",
                    overflow: "hidden",
                    transition: "transform 0.15s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translate(-3px,-3px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translate(0,0)"}>
                  <img src={w.img} alt={w.title} loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", top: 6, left: 6,
                    background: "var(--accent-yellow)", color: "var(--ink)",
                    padding: "1px 6px",
                    fontFamily: "'Bangers',sans-serif", fontSize: 10, letterSpacing: "0.08em"
                  }}>NO.{w.rank}</div>
                  {w.grand && (
                    <div style={{
                      position: "absolute", top: 6, right: 6,
                      background: "var(--accent-red)", color: "#fff",
                      padding: "1px 6px",
                      fontFamily: "'Bowlby One',sans-serif", fontSize: 9, letterSpacing: "0.08em"
                    }}>★ 4 競賽</div>
                  )}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
                    padding: "16px 8px 8px",
                    color: "#fff"
                  }}>
                    <div style={{ fontSize: 9, fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", color: "var(--accent-yellow)" }}>{w.cat}</div>
                    <div style={{ fontWeight: 900, fontSize: 13, lineHeight: 1.2, marginTop: 2 }}>{w.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* TIER 2 / 3 / 4 / 5 — 12 格次要新聞（最近的 12 則，加上頭條共 13 則） */}
        {[NEWS.slice(1, 4), NEWS.slice(4, 7), NEWS.slice(7, 10), NEWS.slice(10, 13)].map((row, ri) => (
          <div key={ri} className="comic-tier tier-1-1-1" style={{ minHeight: 0 }}>
            {row.map((n, i) => (
              <Panel
                key={i}
                clickable
                onClick={goLocal("news", n.id)}
                style={{ padding: "7px 10px 6px", display: "flex", flexDirection: "column", minHeight: 0 }}
              >
                <div style={{
                  display: "inline-block",
                  background: "var(--ink)", color: "var(--accent-yellow)",
                  padding: "1px 6px", alignSelf: "flex-start",
                  fontFamily: "'Bangers',sans-serif", fontSize: 10, letterSpacing: "0.08em",
                  marginBottom: 3
                }}>
                  #{n.num}　{n.tag}
                </div>
                <div style={{ fontWeight: 900, fontSize: 14, lineHeight: 1.3 }}>{n.title}</div>
                <div style={{
                  fontSize: 11.5, fontWeight: 500, lineHeight: 1.45, marginTop: 3, opacity: 0.78,
                  display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2,
                  overflow: "hidden"
                }}>
                  {n.excerpt}
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontSize: 10, fontWeight: 700, opacity: 0.6, marginTop: 4
                }}>
                  <span>{n.date}</span>
                  <span>READ →</span>
                </div>
              </Panel>
            ))}
          </div>
        ))}
      </div>

      <ChapterNext to="#about" num="03" title="我們在做什麼" currentLabel="P. 002 — 第二話 NEWS" />
    </div>
  </section>
);

// CH.03 — 系所介紹（標準 tier：3:2 大格 + 三格主軸）
const AboutChapter = () => (
  <section className="chapter" id="about" data-screen-label="03 About">
    <div className="container">
      <ChapterTag num="03" title="第三話 — 我們在做什麼" jp="WHO WE ARE" />

      <div className="comic-page">
        {/* TIER 1 — 主獨白 1:1 + 數字側欄（右側 4 stats 比例放大）*/}
        <div className="comic-tier tier-1-1 tier-tall">
          <Panel className="bg-halftone-light" style={{ padding: 24, position: "relative", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 12 }}>
              <Bubble variant="bubble--cloud" className="bubble--anim-heartbeat" style={{ background: "var(--accent-yellow)" }}>
                「動遊系到底在學什麼？」
              </Bubble>
            </div>
            <div className="h-display" style={{ fontSize: "clamp(24px,3vw,40px)", margin: "10px 0 12px" }}>
              培育<span style={{ color: "var(--accent-red)" }}>動畫創作</span>、
              <span style={{ color: "var(--accent-blue)" }}>遊戲設計</span>、
              影音後製、互動設計（AR / VR）<br/>所需的專業人才。
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.75, fontWeight: 500 }}>
              <b>2006</b> 年成立全國第一所「<b>數位遊戲設計系</b>」，<b>2011</b> 年依產業人才需求更名為「<b>動畫與遊戲設計系</b>」。完整的專業學習課程＋產學合作機制，師生定期參與企業參訪、教學講座，掌握產業脈動；持續在<b>放視大賞</b>、<b>巴哈姆特 ACG</b>、<b>金犢獎</b>等競賽屢獲佳績。
            </div>
            {/* 課程地圖 CTA — 嵌入主獨白 panel 底部，省掉獨立 TIER */}
            <a href="#/curriculum/map" style={{
              marginTop: "auto", paddingTop: 14,
              textDecoration: "none", color: "var(--ink)",
              display: "block"
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                padding: "10px 14px", flexWrap: "wrap",
                background: "var(--accent-yellow)",
                border: "3px solid var(--ink)",
                boxShadow: "3px 3px 0 var(--ink)",
                transition: "transform 0.1s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
              >
                <div>
                  <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.12em", opacity: 0.8 }}>
                    📚 CURRICULUM MAP · 課程地圖
                  </div>
                  <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900, fontSize: 16, marginTop: 2, lineHeight: 1.2 }}>
                    想看每學期上什麼課？4 年 128 學分一次看
                  </div>
                  <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2, fontWeight: 700 }}>
                    核心專業必修 + 動畫／遊戲／美術／跨域 4 條軸線 · 含畢業專題與校外實習
                  </div>
                </div>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                  看課程地圖 →
                </div>
              </div>
            </a>
          </Panel>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--gutter)" }}>
            <Panel clickable className="bg-halftone-red" variant="red" style={{ padding: 22, position: "relative", flex: 1, overflow: "hidden" }}
              onClick={() => { window.location.hash = "#faculty"; }}>
              <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 64, lineHeight: 1 }}>16</div>
              <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>位業界派老師<br/>平均 15+ 年實戰</div>
              <div style={{ position: "absolute", bottom: 8, right: 14, fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.1em" }}>看陣容 →</div>
            </Panel>
            <Panel clickable variant="inkbg" style={{ padding: 22, position: "relative", flex: 1 }}
              onClick={() => { window.location.hash = "#labs"; }}>
              <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 56, color: "var(--accent-yellow)", lineHeight: 1 }}>12</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>間特色實驗室<br/>設計大樓 + H + B1 跨樓層</div>
              <div style={{ position: "absolute", bottom: 8, right: 14, fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent-yellow)" }}>探索 →</div>
            </Panel>
            <Panel clickable variant="yellow" style={{ padding: 22, position: "relative", flex: 1, overflow: "hidden" }}
              onClick={() => { window.location.hash = "#/news/6753"; }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 56, lineHeight: 1 }}>8</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>年</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>日本 HC 公司<br/>國際實習合作</div>
              <div style={{ position: "absolute", bottom: 8, right: 14, fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.1em" }}>看故事 →</div>
            </Panel>
            <Panel clickable className="bg-halftone-blue" style={{ padding: 22, position: "relative", flex: 1 }}
              onClick={() => { window.location.hash = "#/works/top-2-scientists"; }}>
              <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 56, color: "var(--accent-red)", lineHeight: 1 }}>2%</div>
              <div style={{ fontSize: 13, fontWeight: 800, marginTop: 4 }}>全球頂尖科學家<br/>連 4 年榮登</div>
              <div style={{ position: "absolute", bottom: 8, right: 14, fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.1em" }}>詳情 →</div>
            </Panel>
          </div>
        </div>

        {/* TIER 2 — 三大主軸 */}
        <div className="comic-tier tier-1-1-1" style={{ minHeight: 0 }}>
          {[
            { num: "ACT.1", t: "動畫製作", d: "2D / 3D / 偶動畫 / 動態捕捉", col: "red", bg: "bg-halftone-red", to: "#/labs/d0631", linkLabel: "去動作捕捉實驗室" },
            { num: "ACT.2", t: "遊戲設計", d: "Unity / Unreal / 美術 / 程式", col: "blue", bg: "bg-halftone-blue", to: "#/labs/d0633", linkLabel: "去體感互動實驗室" },
            { num: "ACT.3", t: "互動媒體", d: "VR / AR / 體感互動 / 自媒體", col: "", bg: "bg-halftone-light", to: "#/labs/db104", linkLabel: "去虛擬運動科藝館" },
          ].map((b, i) => (
            <Panel
              key={i}
              clickable
              onClick={() => { window.location.hash = b.to; }}
              className={b.bg}
              variant={b.col}
              style={{ padding: "12px 14px 28px", position: "relative", minHeight: 0 }}
            >
              <div style={{
                fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em", fontSize: 12,
                background: "var(--ink)", color: "var(--paper)",
                display: "inline-block", padding: "2px 10px", marginBottom: 6
              }}>{b.num}</div>
              <div className="h-display" style={{ fontSize: 22, lineHeight: 1.15 }}>{b.t}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 4, opacity: 0.9 }}>{b.d}</div>
              <div style={{ position: "absolute", bottom: 8, right: 12, fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 11 }}>
                {b.linkLabel} →
              </div>
            </Panel>
          ))}
        </div>
      </div>

      {/* 影片牆 — 系上 YouTube 學生作品集錦（搬家自 CH.06） */}
      {typeof VideoWall !== "undefined" && <VideoWall />}

      <ChapterNext to="#works" num="04" title="BOSS BATTLE 榮譽戰績" currentLabel="P. 003 — 第三話 ABOUT" />
    </div>
  </section>
);

Object.assign(window, { HeroChapter, NewsChapter, AboutChapter });
