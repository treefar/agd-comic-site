/* 章節 — 師資 / 實驗室 / 作品 / 招生 / 聯絡 — 標準 tier 結構 */

// CH.05 — 師資登場
const FACULTY = [
  {
    name: "鄧樹遠", role: "系主任 · 副教授(技)", en: "TENG, SHU-YUAN",
    spec: "遊戲設計 / 劇本創作 / 數位剪輯", color: "red",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/09/78pan_0-scaled-e1725608026576-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/treefar/"
  },
  {
    name: "蘇中和", role: "教授", en: "SU, CHUNG-HO",
    spec: "互動多媒體 / VR / AR / 遊戲化學習", color: "blue",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/1211pan-scaled-e1712908210105-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/mic6033/"
  },
  {
    name: "江雅媚", role: "助理教授", en: "CHIANG, YA-MEI",
    spec: "數位媒體設計 / 介面設計 / 角色與場景", color: "yellow",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/1176pan-scaled-e1712908337437-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/江雅媚/"
  },
  {
    name: "陳重光", role: "助理教授(技)(專)", en: "CHEN, CHUNG-KUANG",
    spec: "繪本製作 / 角色造型 / 電腦繪圖", color: "",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/09/1189pan_0-scaled-e1725608414852-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/陳重光/"
  },
  {
    name: "楊智彰", role: "助理教授", en: "YANG, CHIH-CHANG",
    spec: "Unity / VR / 程式設計 / 大數據", color: "blue",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/1092pan-scaled-e1712909734467-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/楊智彰/"
  },
  {
    name: "陳慶鴻", role: "助理教授(技)", en: "CHEN, CHING-HUNG",
    spec: "數位設計 / 電腦動畫 / 動態影像", color: "red",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/09/311pan-scaled-e1725608387187-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/陳慶鴻/"
  },
  {
    name: "張純雅", role: "助理教授(技)", en: "CHANG, CHUN-YA",
    spec: "視覺設計 / 字體設計 / 動畫美術", color: "",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/990pan-YAYA-scaled-e1712910086728-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/張純雅/"
  },
  {
    name: "邱士展", role: "助理教授(技)(專)", en: "CHIU, SHIN-CHAN",
    spec: "電腦動畫 / 動畫導演 / 數位特效 / 鏡頭語言", color: "yellow",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/jjjj-scaled-e1712910712234-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/邱士展/"
  },
  {
    name: "陳美蓉", role: "助理教授(技)", en: "CHEN, MEI-JUNG",
    spec: "視覺傳達 / 企業識別 / 推廣與廣告", color: "yellow",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/1185pan-scaled-e1712910426723-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/系所成員/陳美蓉/"
  },
  {
    name: "陳慧萍", role: "助理教授", en: "CHEN, HUEI-PING",
    spec: "資訊管理 / 互動設計 / 數據分析 / 遊戲程式", color: "blue",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/09/1080pan_0-scaled-e1725608358262-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/系所成員/陳慧萍/"
  },
  {
    name: "吳焉昇", role: "講師(技)(專)", en: "WU, YEN-SHEN",
    spec: "平面設計 / 網路多媒體 / 影像處理", color: "red",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/09/513-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/系所成員/吳焉昇/"
  },
  {
    name: "李宛庭", role: "助理教授", en: "LI, WAN-TING",
    spec: "品牌設計 / 策展 / 包裝設計 / 文化研究", color: "",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/1066pan-scaled-e1712911883658-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/系所成員/李宛庭/"
  },
  {
    name: "王宗立", role: "助理教授", en: "WANG, TSUNG-LI",
    spec: "3D 角色 / 2D & 3D 動畫 / 影片後製剪輯", color: "yellow",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/09/1223pan-scaled-e1725608460881-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/系所成員/王宗立/"
  },
  {
    name: "陳寀瑜", role: "助理教授(專) · 從聘", en: "CHEN, TSAI-YU",
    spec: "資訊介面 / 數位遊戲理論 / 互動裝置 / 遊戲企劃", color: "blue",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/157pan-scaled-e1712912482260-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/系所成員/陳寀瑜/"
  },
  {
    name: "蔣天華", role: "助理教授(技)(專) · 從聘", en: "CHIANG, TIEN-HUA",
    spec: "互動遊戲 / AR VR MR / 物聯網", color: "red",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/04/1170pan-scaled-e1712911533827-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/系所成員/蔣天華/"
  },
  {
    name: "尹立", role: "助理教授(技) · 留職停薪", en: "YIN, LI",
    spec: "設計展演 / 設計實務 / 應用設計", color: "",
    photo: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2024/09/192pan_0-scaled-e1725608280681-1024x1024.jpg",
    page: "https://www.dgd.stu.edu.tw/系所成員/尹立/"
  },
];

const FacultyCard = ({ f, i }) => {
  const [hover, setHover] = React.useState(false);
  const slug = f.slug || f.en.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <Panel
      clickable
      onClick={() => { window.location.hash = "#/faculty/" + slug; }}
      bg={f.color === "red" ? "bg-halftone-red" : f.color === "blue" ? "bg-halftone-blue" : "bg-halftone-light"}
      variant={f.color === "yellow" ? "yellow" : ""}
      style={{ padding: 0, position: "relative", overflow: "hidden" }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ height: "62%", borderBottom: "var(--bw) solid var(--ink)", position: "relative" }}
      >
        <PH label={`${f.name} portrait`} src={f.photo} fallback={f.photoFallback} alt={`${f.name} 老師`} pos="center top" />
        <div style={{
          position: "absolute", top: 8, left: 8,
          fontFamily: "'Bangers',sans-serif",
          background: "var(--ink)", color: "var(--paper)",
          padding: "2px 8px", fontSize: 13, letterSpacing: "0.1em",
          zIndex: 2
        }}>
          NO. {String(i + 1).padStart(2, "0")}
        </div>

        {/* Hover popover — 漫畫對話框風 */}
        {hover && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(15,13,10,0.94)", color: "var(--paper)",
            padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between",
            zIndex: 3, animation: "fadeIn 0.15s",
            border: "var(--bw) solid var(--ink)"
          }}>
            <div>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 12, color: "var(--accent-yellow)", letterSpacing: "0.1em", marginBottom: 6 }}>
                CHARACTER PROFILE
              </div>
              <div className="h-display" style={{ fontSize: 22, lineHeight: 1.1 }}>{f.name}</div>
              {f.research && (
                <div style={{ fontSize: 11, lineHeight: 1.55, marginTop: 8, opacity: 0.92 }}>
                  <b style={{ color: "var(--accent-yellow)" }}>研究專長</b><br/>
                  {f.research}
                </div>
              )}
              {f.courses && (
                <div style={{ fontSize: 11, lineHeight: 1.55, marginTop: 6, opacity: 0.85 }}>
                  <b style={{ color: "var(--accent-yellow)" }}>授課</b> · {f.courses}
                </div>
              )}
            </div>
            <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "var(--accent-yellow)", textAlign: "right" }}>
              點擊看完整 →
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div className="h-display" style={{ fontSize: 22 }}>{f.name}</div>
        <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.65, letterSpacing: "0.06em" }}>{f.en}</div>
        <div style={{
          fontSize: 12, fontWeight: 800, marginTop: 6,
          background: "var(--ink)", color: "var(--paper)",
          display: "inline-block", padding: "2px 6px"
        }}>{f.role}</div>
        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, opacity: 0.85 }}>專長 · {f.spec}</div>
      </div>
    </Panel>
  );
};

const FacultyChapter = () => {
  // 優先讀本地 data/faculty.json（含完整 research/courses/achievements），fallback 用上方 FACULTY
  const remote = useDataset ? useDataset("faculty") : null;
  const list = remote && remote.length ? remote : FACULTY;
  return (
    <section className="chapter" id="faculty" data-screen-label="05 Faculty">
      <div className="container">
        <ChapterTag num="05" title="第五話 — CHARACTER 老師登場！" jp="MEET THE SENSEI" />
        <div style={{ marginBottom: 20 }}>
          <Bubble variant="bubble--shout" className="bubble--anim-jitter" style={{ background: "var(--accent-yellow)", display: "inline-block" }}>
            <span style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 22 }}>業界派 SENSEI 集合！</span>
          </Bubble>
        </div>

        <div className="comic-page">
          <div className="comic-tier tier-1-1-1-1" style={{ minHeight: 320 }}>
            {list.slice(0, 4).map((f, i) => <FacultyCard key={i} f={f} i={i} />)}
          </div>
          <div className="comic-tier tier-1-1-1-1" style={{ minHeight: 320 }}>
            {list.slice(4, 8).map((f, i) => <FacultyCard key={i + 4} f={f} i={i + 4} />)}
          </div>
          <div className="comic-tier tier-1-1-1-1" style={{ minHeight: 320 }}>
            {list.slice(8, 12).map((f, i) => <FacultyCard key={i + 8} f={f} i={i + 8} />)}
          </div>
          <div className="comic-tier tier-1-1-1-1" style={{ minHeight: 320 }}>
            {list.slice(12, 16).map((f, i) => <FacultyCard key={i + 12} f={f} i={i + 12} />)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
          <span className="bubble bubble--anim-tilt" style={{ fontFamily: "'Bangers',sans-serif", letterSpacing: "0.06em", color: "var(--ink)" }}>
            全體陣容 · 點擊任一格進入個人頁
          </span>
          <a href="#/stats/teacher-materials" style={{
            background: "var(--ink)", color: "var(--accent-yellow)",
            padding: "8px 14px", textDecoration: "none",
            fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900,
            fontSize: 13, letterSpacing: "0.04em",
            border: "3px solid var(--ink)", boxShadow: "3px 3px 0 var(--accent-red)"
          }}>
            ★ 教師教材 80+ 件 + 專利 6 件 →
          </a>
        </div>

        <ChapterNext to="#labs" num="06" title="我們的祕密基地" currentLabel="P. 005 — 第五話 FACULTY" />
      </div>
    </section>
  );
};

// CH.06 — 實驗室
const LABS = [
  { slug: "d0604",  code: "D0604",  name: "電繪實驗室",        t: "TABLET",     desc: "電繪繪圖板專業教室，2D 角色與場景設計練功房。" },
  { slug: "d0628",  code: "D0628",  name: "3D 列印工作坊",      t: "3D PRINT",   desc: "FDM / 光固化 3D 列印機群，把建模作品實體化。" },
  { slug: "d0631",  code: "D0631",  name: "動作捕捉實驗室",     t: "MOCAP",      desc: "虛擬製片棚 — 不需後期、即時拍出寫實場景，培養虛擬與實體攝影機連動的數位影像人才。" },
  { slug: "d0633",  code: "D0633",  name: "體感互動實驗室",     t: "INTERACT",   desc: "VIVE 空間定位 + 跑步機 / 氣壓水平面 / 腳踏車，體感遊戲開發即時驗證場域。" },
  { slug: "d0637",  code: "D0637",  name: "偶動畫實驗室",       t: "STOP-MO",    desc: "停格動畫拍攝棚，立體造型 × 逐格手作的工藝場域。" },
  { slug: "db101-1",code: "DB101-1",name: "週邊商品設計實驗室", t: "MERCH",      desc: "3D 印表機、直噴機、熱轉印、雷射切割 — 動漫遊戲周邊一條龍。" },
  { slug: "db104",  code: "DB104",  name: "虛擬運動科藝館",     t: "VR / XR",    desc: "運動 × 科技數位化創新場館，戶外運動場域加值應用基地。" },
  { slug: "db105",  code: "DB105",  name: "影音後製 / 自媒體",  t: "POST-PROD",  desc: "4 間數位攝影棚 + 4 間錄音室，主播、聲優、配樂、3D 後製一站到位。" },
  // 教學環境 — 跨樓層特色教室
  { slug: "h0201",               code: "H0201", name: "橫山創意基地",       t: "MAKER",      desc: "數位科技文化創意工坊 — Maker 自造者文化基地，DIY × 科技元素跨域創作。" },
  { slug: "multimedia-classroom",code: "B1",    name: "多媒體 / 遊戲教室",  t: "MULTIMEDIA", desc: "多媒體教室 + 遊戲與網路媒體教室，理論到引擎開發的核心戰場。" },
  { slug: "esports-classroom",   code: "B1",    name: "電競專業教室",       t: "ESPORTS",    desc: "高規電競機台 + 賽事級設備，電競產業學程的訓練主場。" },
  { slug: "startup-base",        code: "B1",    name: "三創基地 / 創客中心",t: "STARTUP",    desc: "三創（創意、創新、創業）基地，學生提案、原型到育成的孵化器。" },
];

const LabCard = ({ l, i }) => (
  <Panel
    clickable
    onClick={() => { if (l.slug) window.location.hash = "#/labs/" + l.slug; }}
    variant={i % 4 === 0 ? "inkbg" : i % 4 === 2 ? "yellow" : ""}
    className={i % 4 === 1 ? "bg-halftone-red" : i % 4 === 3 ? "bg-halftone-blue" : ""}
    style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
  >
    <div>
      <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", opacity: 0.85 }}>ROOM · {l.code}</div>
      <div className="h-display" style={{ fontSize: 22, marginTop: 6 }}>{l.name}</div>
      {l.desc && (
        <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.55, marginTop: 8, opacity: 0.82 }}>
          {l.desc}
        </div>
      )}
    </div>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", marginTop: 12,
      paddingTop: 8, borderTop: "2px dashed currentColor"
    }}>
      <span style={{ background: "var(--ink)", color: "var(--paper)", padding: "3px 8px" }}>{l.t}</span>
      <a href={`#/labs/${l.slug}`} onClick={(e) => e.stopPropagation()} style={{
        color: "inherit", textDecoration: "none", fontFamily: "'Bangers',sans-serif",
        background: "var(--accent-yellow)", color: "var(--ink)",
        padding: "3px 10px", border: "2px solid var(--ink)",
        boxShadow: "2px 2px 0 var(--ink)"
      }}>ENTER →</a>
    </div>
  </Panel>
);

const LabsChapter = () => (
  <section className="chapter" id="labs" data-screen-label="06 Labs">
    <div className="container">
      <ChapterTag num="06" title="第六話 — 我們的祕密基地" jp="THE SECRET BASE" />

      <div className="comic-page">
        {/* TIER 1 — 大地圖 1:2（一格 + 兩格） */}
        <div className="comic-tier tier-1-2 tier-tall">
          <Panel clickable className="bg-halftone-light" style={{ padding: 0, position: "relative" }}
            onClick={() => { window.location.hash = "#/labs/h0201"; }}>
            <PH label="樹德 設計大樓 · 動遊系實驗室全圖" />
            <div style={{ position: "absolute", left: 18, top: 18, fontFamily: "'Bowlby One',sans-serif", fontSize: 28, lineHeight: 1, color: "var(--ink)" }}>
              D BLOCK<br/><span style={{ color: "var(--accent-red)" }}>BASEMENT</span>
            </div>
            <div style={{
              position: "absolute", right: 18, top: 18,
              fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em",
              background: "var(--ink)", color: "var(--accent-yellow)",
              padding: "5px 12px", border: "3px solid var(--paper)",
              boxShadow: "3px 3px 0 var(--accent-red)", transform: "rotate(2deg)"
            }}>
              MAP · 12 ROOMS
            </div>
            <div style={{
              position: "absolute", bottom: 18, right: 18,
              fontFamily: "'Bangers',sans-serif", fontSize: 14, letterSpacing: "0.08em",
              background: "var(--accent-yellow)", color: "var(--ink)",
              padding: "5px 14px", border: "3px solid var(--ink)",
              boxShadow: "3px 3px 0 var(--ink)"
            }}>
              探索基地 →
            </div>
            <SFX color="ink" rotate={-8} size={48} style={{ position: "absolute", bottom: 18, left: 22 }}>
              咻！
            </SFX>
          </Panel>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--gutter)" }}>
            <div className="comic-tier tier-1-1" style={{ flex: 1 }}>
              <LabCard l={LABS[0]} i={0} />
              <LabCard l={LABS[1]} i={1} />
            </div>
            <div className="comic-tier tier-1-1" style={{ flex: 1 }}>
              <LabCard l={LABS[2]} i={2} />
              <LabCard l={LABS[3]} i={3} />
            </div>
          </div>
        </div>

        {/* TIER 2 — 四格等寬 */}
        <div className="comic-tier tier-1-1-1-1 tier-mid">
          {LABS.slice(4, 8).map((l, i) => <LabCard key={i + 4} l={l} i={i + 4} />)}
        </div>

        {/* TIER 3 — 教學環境跨樓層特色教室 */}
        <div className="comic-tier tier-1-1-1-1 tier-mid">
          {LABS.slice(8, 12).map((l, i) => <LabCard key={i + 8} l={l} i={i + 8} />)}
        </div>
      </div>

      {/* 國際實習側欄 */}
      <div className="comic-tier tier-2-1 tier-short" style={{ marginTop: "var(--gutter)" }}>
        <Panel clickable className="bg-halftone-blue" style={{ padding: 22, position: "relative" }}
          onClick={() => { window.location.hash = "#/stats/international"; }}>
          <div style={{ display: "inline-block", background: "var(--accent-blue)", color: "#fff", padding: "3px 12px", fontFamily: "'Bowlby One',sans-serif", fontSize: 13, letterSpacing: "0.08em", marginBottom: 10 }}>
            SIDE QUEST · 國際實習
          </div>
          <div className="h-display" style={{ fontSize: 24, marginBottom: 8 }}>
            日本 HC 公司 · 第 8 年合作 · 6 國 8 公司
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, fontWeight: 500 }}>
            學海築夢計畫近 3 年共派 16 位學生赴日本愛媛縣松山市 Hautecouture 株式會社實習。合作網絡涵蓋日本、韓國、印尼共 6 國 8 家公司。
          </div>
          <div style={{ position: "absolute", bottom: 12, right: 22, fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.1em" }}>
            完整名單 →
          </div>
          <SFX color="red" rotate={-4} size={42} style={{ position: "absolute", top: 16, right: 22 }}>耶！</SFX>
        </Panel>
        <Panel clickable variant="yellow" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          onClick={() => { window.location.hash = "#/stats/biz-mentors"; }}>
          <div>
            <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 8 }}>
              SIDE QUEST · 業師陣容
            </div>
            <div className="h-display" style={{ fontSize: 22, lineHeight: 1.15 }}>
              業師講座 9 場<br/>協同授課 5 學期
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, lineHeight: 1.6, opacity: 0.9 }}>
              「設計師工作室」課程連續邀請 20+ 業界 SOHO 設計師親自授課；橫山盃高中職競賽吸引全國 600+ 師生報名。
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", marginTop: 12 }}>
            業師清單 →
          </div>
        </Panel>
      </div>

      <ChapterNext to="#join" num="07" title="加入連載" currentLabel="P. 006 — 第六話 LABS" />
    </div>
  </section>
);

// CH.04 — 作品 / 榮譽
const WorkCard = ({ w, i }) => (
  <Panel clickable
    onClick={() => { window.location.hash = w.link || ("#/works/" + w.id); }}
    style={{ padding: 0, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
    <div style={{ position: "relative", height: 140, borderBottom: "var(--bw) solid var(--ink)", overflow: "hidden" }}>
      {w.img ? (
        <PH src={w.img} alt={w.title} fit="cover" pos="center" />
      ) : (
        <div className={i % 3 === 0 ? "bg-halftone-light" : i % 3 === 1 ? "bg-halftone-red" : "bg-halftone-blue"}
          style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 64, opacity: 0.4 }}>★</span>
        </div>
      )}
      <div style={{
        position: "absolute", top: 8, left: 8,
        background: "var(--accent-red)", color: "#fff",
        padding: "3px 10px", fontSize: 11,
        fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em",
        boxShadow: "2px 2px 0 var(--ink)"
      }}>WIN · {w.year}</div>
    </div>
    <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ fontWeight: 900, fontSize: 15, lineHeight: 1.4 }}>{w.title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-blue)" }}>
          ▸ {w.award}
        </div>
        <div style={{ fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 11, opacity: 0.7 }}>
          詳情 →
        </div>
      </div>
    </div>
  </Panel>
);

const WORKS = [
  { id: "clipstudio-grand-prize", title: "ClipStudio 國際插畫大賽", award: "Grand Prize 國際首獎", year: "2022", img: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2025/03/_page-0001-scaled-e1765931540737.jpg" },
  { id: "bahamut-acg", title: "巴哈姆特 ACG 創作大賽", award: "優選雙獎", year: "2025", img: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2025/08/1140828-1.jpg" },
  { id: "times-pin", title: "時報金犢獎國際競賽", award: "第二名", year: "2025", img: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2025/07/unnamed.jpg" },
  { id: "fangshi-2025", title: "2025 放視大賞", award: "8 件入圍", year: "2025", img: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2025/05/unnamed-1.jpg" },
  { id: "awards-2026", title: "動遊系 2026 競賽佳績榜", award: "4 競賽 14 件入圍 · 7 部畢業專題", year: "2026", img: "images/news/2026-awards/healing-light.jpg", link: "#/news/2026-04-29-awards-showcase" },
  { id: "top-2-scientists", title: "科研雙星 · 全球前 2% 學者榜", award: "連四年榮登", year: "2025", img: "https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2025/09/c6135cb3c2111669fdf3d99d0b26bd20.jpg" },
];

const WorksChapter = () => (
  <section className="chapter" id="works" data-screen-label="04 Works">
    <div className="container">
      <ChapterTag num="04" title="第四話 — BOSS BATTLE 榮譽戰績" jp="HIGH SCORE" />

      <div className="comic-page">
        {/* TIER 1 — 大主榜 2:1 */}
        <div className="comic-tier tier-2-1 tier-tall">
          <Panel variant="inkbg" style={{ padding: 28, position: "relative" }}>
            <div className="bg-halftone-red" style={{ position: "absolute", inset: 0, opacity: 0.25 }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color: "var(--accent-yellow)", letterSpacing: "0.1em" }}>
                HIGH SCORE BOARD ★
              </div>
              <div className="h-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "var(--paper)", marginTop: 8 }}>
                連載 20 話<br/>戰績<span style={{ color: "var(--accent-yellow)" }}>不間斷</span>。
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
                {[
                  { n: "811", l: "5 年取得證照", sub: "Adobe / Unity / Autodesk", to: "#/stats/certifications" },
                  { n: "90+", l: "歷屆得獎", sub: "109-113 學年度", to: "#/stats/awards" },
                  { n: "8 + 42", l: "MOU 戰略 + 產學案", sub: "智冠 / HC / 西基…", to: "#/stats/partners" },
                  { n: "94%", l: "平均就業比", sub: "教育部追蹤調查", to: "#/stats/employment" },
                ].map((s, i) => (
                  <a key={i} href={s.to} style={{
                    borderLeft: "4px solid var(--accent-yellow)", paddingLeft: 12,
                    textDecoration: "none", display: "block",
                    transition: "transform 0.1s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(2px)"; e.currentTarget.style.borderLeftColor = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderLeftColor = "var(--accent-yellow)"; }}>
                    <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 38, color: "var(--paper)", lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "var(--paper)", opacity: 0.95, marginTop: 4 }}>{s.l} →</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--accent-yellow)", opacity: 0.8, marginTop: 2 }}>{s.sub}</div>
                  </a>
                ))}
              </div>
            </div>
            <SFX color="red" rotate={6} size={64} style={{ position: "absolute", top: 14, right: 24 }}>
              強！
            </SFX>
          </Panel>
          <Panel clickable variant="yellow" style={{ padding: 18, position: "relative" }}
            onClick={() => { window.location.hash = "#/stats/awards"; }}>
            <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, letterSpacing: "0.08em", marginBottom: 8 }}>
              CONTINUE? → YES
            </div>
            <div className="h-display" style={{ fontSize: 22, marginBottom: 14, lineHeight: 1.25 }}>
              代表作<br/>ClipStudio 國際首獎
            </div>
            <div style={{ height: 140, marginBottom: 12 }}>
              <PH label="ClipStudio Grand Prize"
                src="https://wpcdn.stu.edu.tw/wp-content/uploads/sites/53/2025/03/_page-0001-scaled-e1765931540737.jpg"
                alt="ClipStudio Grand Prize 代表作" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em" }}>
              <span>第 27 屆 · Grand Prize</span>
              <span>PRESS START →</span>
            </div>
          </Panel>
        </div>

        {/* TIER 2 — 三格戰績 (with images) */}
        <div className="comic-tier tier-1-1-1 tier-mid">
          {WORKS.slice(0, 3).map((w, i) => <WorkCard key={i} w={w} i={i} />)}
        </div>

        {/* TIER 3 — 三格戰績 (with images) */}
        <div className="comic-tier tier-1-1-1 tier-mid">
          {WORKS.slice(3, 6).map((w, i) => <WorkCard key={i + 3} w={w} i={i + 3} />)}
        </div>

        {/* TIER 4 — 完整榮譽史入口 */}
        <div className="comic-tier tier-1 tier-short">
          <Panel clickable variant="inkbg" style={{ padding: 24, position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}
            onClick={() => { window.location.hash = "#/stats/honors"; }}>
            <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color: "var(--accent-yellow)", letterSpacing: "0.1em", marginBottom: 6 }}>
                ★ FULL ARCHIVE
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900, fontSize: 28, color: "var(--paper)", lineHeight: 1.2 }}>
                看完整榮譽史 · 連載 15 年
              </div>
              <div style={{ fontSize: 13, color: "var(--paper)", opacity: 0.85, marginTop: 6 }}>
                2011 → 2025 · 100+ 件得獎 + 20+ 國際影展 · 從早期金獎到最近巴塞隆納/印度孟買/西班牙停格…
              </div>
            </div>
            <div style={{ position: "relative", fontFamily: "'Bowlby One',sans-serif", fontSize: 16, color: "var(--accent-yellow)", padding: "10px 18px", border: "3px solid var(--accent-yellow)" }}>
              ENTER ARCHIVE →
            </div>
          </Panel>
        </div>
      </div>

      <ChapterNext to="#faculty" num="05" title="老師登場" currentLabel="P. 004 — 第四話 WORKS" />
    </div>
  </section>
);

// 影片牆 — 從 data/videos.json 載入，4×N 格網格
const VideoWall = () => {
  const videos = useDataset ? useDataset("videos") : null;
  if (!videos || videos.length === 0) return null;
  return (
    <div style={{ marginTop: 36 }}>
      <div className="chapter-header" style={{ marginBottom: 18 }}>
        <div className="chapter-tag" style={{ background: "var(--accent-blue)" }}>
          <span>BONUS</span>
        </div>
        <div className="title h-display" style={{ fontSize: 32 }}>影片牆 · 學生作品 / 課堂精選</div>
        <div className="sub">— STUDENT REEL · {videos.length} CLIPS —</div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "var(--gutter)"
      }}>
        {videos.map((v, i) => <VideoCard key={v.id} v={v} i={i} />)}
      </div>
    </div>
  );
};

const VideoCard = ({ v, i }) => {
  const palette = ["", "yellow", "", ""];
  const bgs = ["bg-halftone-red", "", "bg-halftone-blue", "bg-halftone-light"];
  const tagColors = { "動畫": "var(--accent-red)", "遊戲": "var(--accent-blue)", "形象片": "var(--accent-yellow)", "教學": "#8b5cf6", "活動": "#16a34a", "課堂作業": "#ec4899", "遊戲評論": "#6b7280" };
  return (
    <Panel
      clickable
      onClick={() => { window.location.hash = "#/videos/" + v.id; }}
      variant={palette[i % 4]}
      className={bgs[i % 4]}
      style={{ padding: 0, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--ink)", borderBottom: "var(--bw) solid var(--ink)" }}>
        <PH
          src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
          fallback={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
          alt={v.title}
          fit="cover"
        />
        {/* 漫畫風格 PLAY 按鈕 */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none"
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--accent-red)", border: "4px solid var(--paper)",
            boxShadow: "4px 4px 0 var(--ink)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: "rotate(-3deg)"
          }}>
            <div style={{
              width: 0, height: 0,
              borderLeft: "16px solid #fff",
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              marginLeft: 4
            }} />
          </div>
        </div>
        {v.category && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.1em",
            background: tagColors[v.category] || "var(--ink)", color: "#fff",
            padding: "2px 8px", border: "2px solid var(--ink)"
          }}>{v.category}</div>
        )}
      </div>
      <div style={{ padding: "10px 12px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.4 }}>{v.title}</div>
        <div style={{ fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em", fontSize: 11, marginTop: 8, opacity: 0.7 }}>
          ▶ WATCH
        </div>
      </div>
    </Panel>
  );
};

// CH.07 — 招生
const JoinChapter = () => (
  <section className="chapter" id="join" data-screen-label="07 Join">
    <div className="container">
      <ChapterTag num="07" title="第七話 — 加入連載！" jp="JOIN THE STORY" />

      <div className="comic-page">
        {/* TIER 1 — 主 CTA 2:1 */}
        <div className="comic-tier tier-2-1 tier-tall">
          <Panel variant="red" style={{ padding: 36, position: "relative" }}>
            <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
            <div style={{ position: "relative" }}>
              <Bubble variant="bubble--shout" className="bubble--anim-shake" style={{
                background: "var(--accent-yellow)", color: "var(--ink)",
                fontFamily: "'Bowlby One',sans-serif", fontSize: 24,
                transform: "rotate(-3deg)"
              }}>
                下一話的主角，是你！
              </Bubble>
              <div className="h-display h-jojo" style={{
                fontSize: "clamp(40px, 6vw, 72px)", color: "#fff",
                marginTop: 30, lineHeight: 0.9
              }}>
                115 學年度<br/>新生招募中
              </div>
              <div style={{ fontSize: 16, color: "#fff", marginTop: 18, fontWeight: 700, maxWidth: 460, lineHeight: 1.6 }}>
                只要你愛畫、愛玩、愛動腦 — 我們就有你的位置。歡迎報名校系說明會與一日體驗。
              </div>
            </div>
          </Panel>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--gutter)" }}>
            {[
              { t: "申請入學", q: "11 名 · 代碼 205005", s: "報名 3/19-3/25 · 放榜 5/25", c: "", slug: "high-school-application" },
              { t: "甄選入學", q: "44 名 · 設計 22 / 商管 14 / 資電 8 / 青儲 2", s: "統測 4/25-4/26 · 放榜 7/14", c: "yellow", slug: "selection" },
              { t: "科技繁星", q: "設計群 3 名 · 代碼 08039", s: "報名 3/11-3/18 · 放榜 5/5", c: "inkbg", slug: "tech-star" },
            ].map((o, i) => (
              <Panel key={i} clickable
                onClick={() => { window.location.hash = "#/admission/" + o.slug; }}
                variant={o.c}
                className={o.c === "" ? "bg-halftone-blue" : ""}
                style={{ padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 12, letterSpacing: "0.1em", opacity: 0.85 }}>OPTION 0{i + 1} · 115 學年度</div>
                <div>
                  <div className="h-display" style={{ fontSize: 22 }}>{o.t}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4, opacity: 0.85, lineHeight: 1.5 }}>名額 · {o.q}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, opacity: 0.78 }}>📅 {o.s}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em" }}>看完整時程 →</div>
              </Panel>
            ))}
          </div>
        </div>

        {/* TIER 1.5 — 課程地圖 CTA 橫幅 */}
        <div className="comic-tier tier-1 tier-short">
          <Panel clickable variant="inkbg"
            onClick={() => { window.location.hash = "#/curriculum/map"; }}
            style={{ padding: "20px 28px", position: "relative", overflow: "hidden" }}>
            <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.15 }} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.12em", color: "var(--accent-yellow)" }}>
                  📚 BEFORE YOU APPLY · 報名前先看看
                </div>
                <div className="h-display" style={{ fontSize: 26, color: "var(--paper)", marginTop: 4 }}>
                  四年要學什麼？看完整課程地圖
                </div>
                <div style={{ fontSize: 12, color: "var(--paper)", opacity: 0.8, marginTop: 6, fontWeight: 600 }}>
                  專業必修 44 學分 · 選修 45 學分 · 4 條軸線（動畫／遊戲／美術／跨域）任選深耕
                </div>
              </div>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, letterSpacing: "0.1em", color: "var(--accent-yellow)", whiteSpace: "nowrap" }}>
                看課程地圖 →
              </div>
            </div>
          </Panel>
        </div>

        {/* TIER 2 — 2 格招生管道 */}
        <div className="comic-tier tier-1-1 tier-short">
          {[
            { t: "技優甄審", q: "16 名 · 85-035 商設", s: "報名 5/18-5/22 · 放榜 6/22", c: "", slug: "tech-elite" },
            { t: "登記分發", q: "5 名 · 設計 3+1 / 資電 1 / 商管 1+1", s: "登記 7/28-7/31 · 放榜 8/06", c: "yellow", slug: "joint" },
          ].map((o, i) => (
            <Panel key={i} clickable
              onClick={() => { window.location.hash = "#/admission/" + o.slug; }}
              variant={o.c}
              className={o.c === "" ? "bg-halftone-red" : ""}
              style={{ padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.1em", opacity: 0.85 }}>OPTION 0{i + 4} · 115</div>
              <div>
                <div className="h-display" style={{ fontSize: 19, lineHeight: 1.15 }}>{o.t}</div>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6, opacity: 0.85, lineHeight: 1.5 }}>名額 · {o.q}</div>
                <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, opacity: 0.78 }}>📅 {o.s}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em" }}>看完整時程 →</div>
            </Panel>
          ))}
        </div>

        {/* TIER 2.5 — 官方連結集中區（樹德 + 招聯會 + 技專校院招聯會） */}
        <div className="comic-tier tier-1 tier-mid">
          <Panel variant="inkbg" style={{ padding: 24, position: "relative" }}>
            <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.12 }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, letterSpacing: "0.12em", color: "var(--accent-yellow)" }}>
                🔗 OFFICIAL LINKS · 官方時程以這裡為準
              </div>
              <div className="h-display" style={{ fontSize: 26, marginTop: 6, marginBottom: 16, color: "var(--paper)" }}>
                簡章下載 · 報名繳費 · 放榜查詢
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}>
                {[
                  { l: "樹德招生網（總入口）", u: "https://reg.aca.stu.edu.tw/", h: "樹德" },
                  { l: "樹德 · 申請入學", u: "https://reg.aca.stu.edu.tw/4d_application_admission", h: "樹德" },
                  { l: "樹德 · 甄選入學", u: "https://reg.aca.stu.edu.tw/4d_selection_admission", h: "樹德" },
                  { l: "樹德 · 科技繁星", u: "https://reg.aca.stu.edu.tw/4d_star_admissions", h: "樹德" },
                  { l: "樹德 · 技優甄審", u: "https://reg.aca.stu.edu.tw/4d_skill_excellent", h: "樹德" },
                  { l: "樹德 · 登記分發", u: "https://reg.aca.stu.edu.tw/4d_distribution_adimission", h: "樹德" },
                  { l: "樹德 · 進修學制（夜四技）", u: "https://reg.aca.stu.edu.tw/continuing_es", h: "樹德" },
                  { l: "技專校院招聯會（jctv）", u: "https://www.jctv.ntut.edu.tw/", h: "聯招" },
                  { l: "115 申請入學（CAAC）", u: "https://www.jctv.ntut.edu.tw/caac/", h: "聯招" },
                  { l: "115 甄選入學", u: "https://www.jctv.ntut.edu.tw/enter42/apply/", h: "聯招" },
                  { l: "115 科技繁星", u: "https://www.jctv.ntut.edu.tw/star/", h: "聯招" },
                  { l: "115 技優甄審", u: "https://www.jctv.ntut.edu.tw/enter42/skill/", h: "聯招" },
                  { l: "115 聯合登記分發", u: "https://www.jctv.ntut.edu.tw/union42/", h: "聯招" },
                  { l: "統測中心（tcte）", u: "https://www.tcte.edu.tw/", h: "考試" },
                  { l: "學測中心（ceec）", u: "https://www.ceec.edu.tw/", h: "考試" },
                ].map((x, i) => (
                  <a key={i} href={x.u} target="_blank" rel="noopener noreferrer" style={{
                    background: "var(--paper)", color: "var(--ink)",
                    padding: "10px 12px", textDecoration: "none",
                    fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 800,
                    fontSize: 13, border: "2px solid var(--ink)",
                    boxShadow: "3px 3px 0 var(--accent-red)",
                    display: "flex", alignItems: "center", gap: 6,
                    lineHeight: 1.3
                  }}>
                    <span style={{
                      background: "var(--ink)", color: "var(--accent-yellow)",
                      fontSize: 9, fontFamily: "'Bangers',sans-serif",
                      letterSpacing: "0.08em", padding: "2px 5px",
                      flexShrink: 0
                    }}>{x.h}</span>
                    <span style={{ flex: 1 }}>{x.l}</span>
                    <span style={{ flexShrink: 0, opacity: 0.6 }}>↗</span>
                  </a>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--paper)", opacity: 0.72, marginTop: 14, lineHeight: 1.7 }}>
                📞 樹德招生諮詢：07-6158000　動遊系系辦：#6102（rita@stu.edu.tw）　主任：#6100（treefar@stu.edu.tw）
              </div>
            </div>
          </Panel>
        </div>

        {/* TIER 3 — 全寬參訪 */}
        <div className="comic-tier tier-1-1 tier-short" style={{ minHeight: 120 }}>
          <Panel variant="yellow" style={{ padding: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, letterSpacing: "0.1em" }}>SIDE QUEST · 支線任務</div>
              <div className="h-display" style={{ fontSize: 30, marginTop: 4 }}>
                預約深度參訪 · 進入動遊系祕密基地
              </div>
            </div>
            <a href="#/admission/visit" style={{
              background: "var(--ink)", color: "var(--paper)",
              padding: "14px 22px", textDecoration: "none",
              fontFamily: "'Bowlby One',sans-serif", letterSpacing: "0.06em",
              fontSize: 16, border: "3px solid var(--ink)",
              boxShadow: "5px 5px 0 var(--accent-red)"
            }}>立即預約 →</a>
          </Panel>
        </div>
      </div>

      <ChapterNext to="#contact" num="08" title="聯絡我們" hint="THE END" currentLabel="P. 007 — 第七話 JOIN" />
    </div>
  </section>
);

// FOOTER
const FooterChapter = () => (
  <footer className="foot" id="contact" data-screen-label="08 Contact">
    <div className="container" style={{ position: "relative", padding: 0 }}>
      <div style={{ position: "absolute", top: -42, left: 0, right: 0, textAlign: "center" }}>
        <span style={{
          background: "var(--accent-yellow)", color: "var(--ink)",
          fontFamily: "'Bowlby One',sans-serif", padding: "6px 18px",
          letterSpacing: "0.06em", border: "3px solid var(--ink)",
          boxShadow: "4px 4px 0 var(--ink)", display: "inline-block",
          transform: "rotate(-2deg)"
        }}>~ 待續 TO BE CONTINUED ~</span>
      </div>
    </div>
    <div className="grid">
      <div>
        <h4>樹德動遊</h4>
        <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.7 }}>
          樹德科技大學<br/>動畫與遊戲設計系<br/>Department of Animation<br/>& Game Design
        </div>
      </div>
      <div>
        <h4>聯絡</h4>
        <a href="mailto:rita@stu.edu.tw">rita@stu.edu.tw</a>
        <a href="tel:+886-7-6158000,6102">07-6158000 #6102</a>
        <a href="#contact">高雄市燕巢區橫山路 59 號 設計大樓 6 樓</a>
      </div>
      <div>
        <h4>系所</h4>
        <a href="#about">系所簡介</a>
        <a href="#faculty">專任教師</a>
        <a href="#labs">實驗室與教學環境</a>
        <a href="#works">畢業展與作品</a>
      </div>
      <div>
        <h4>招生</h4>
        <a href="#/admission/high-school-application">申請入學</a>
        <a href="#/admission/selection">甄選入學</a>
        <a href="#/admission/tech-star">科技繁星</a>
        <a href="#/admission/tech-elite">技優甄審</a>
        <a href="#/admission/joint">登記分發</a>
      </div>
    </div>
    <div className="end">
      © 2026 SHU-TE University · Dept. of Animation & Game Design — All panels reserved.
    </div>
  </footer>
);

Object.assign(window, { FacultyChapter, LabsChapter, WorksChapter, JoinChapter, FooterChapter, VideoWall, VideoCard });
