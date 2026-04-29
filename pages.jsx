/* 本地頁面：路由 + 詳情頁渲染（漫畫風延用） */

// Hash router — listen to window.location.hash, parse "#/type/slug"
// When hash is plain anchor (#about, #join...) we make sure to scroll to it AFTER React renders the homepage
const useHashRoute = () => {
  const [hash, setHash] = React.useState(window.location.hash);
  React.useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  // Parse "#/type/slug" or "#/type/slug/extra"
  const m = hash.match(/^#\/([a-z]+)\/([^\/]+)/);
  const route = m
    ? { type: m[1], slug: decodeURIComponent(m[2]), full: hash }
    : { type: null, slug: null, full: hash };
  // Side effect: if hash is plain anchor (#about / #join etc.), scroll to it after React commits.
  // 用 window.scrollTo (behavior:instant) — scrollIntoView 在某些 sandbox 環境會被 CSS smooth 卡住
  React.useEffect(() => {
    if (!hash || hash.startsWith("#/")) return;
    const id = hash.slice(1);
    if (!id) return;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (Math.abs(rect.top) <= 30) return;
      const targetY = rect.top + window.pageYOffset - 60;
      window.scrollTo({ top: targetY, behavior: "instant" });
    };
    // 50ms 立刻試、1700ms 補保險（涵蓋 bootLoading 結束）
    const t0 = setTimeout(tryScroll, 50);
    const t1 = setTimeout(tryScroll, 1700);
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, [hash]);
  return route;
};

// Helper: build a local hash URL
const localHref = (type, slug) => `#/${type}/${encodeURIComponent(slug)}`;

// Data cache (loaded once per type)
// _BUILD_VER 跟 Comic Site.html 的 jsx ?v= 同步 bump，避免瀏覽器 cache JSON 舊版
const _BUILD_VER = '20260429d';
const _dataCache = {};
const _MIN_LOAD_MS = 850; // Loading 至少顯示這麼久（讓動畫看得到）
const useDataset = (type) => {
  const [data, setData] = React.useState(_dataCache[type]);
  React.useEffect(() => {
    if (data) return;
    const t0 = Date.now();
    fetch(`data/${type}.json?v=${_BUILD_VER}`).then(r => r.json()).then(d => {
      _dataCache[type] = d;
      const elapsed = Date.now() - t0;
      const wait = Math.max(0, _MIN_LOAD_MS - elapsed);
      setTimeout(() => setData(d), wait);
    }).catch(() => setData([]));
  }, [type]);
  return data;
};

// Section header reused inside detail pages
const DetailHeader = ({ tag, title, sub }) => (
  <div className="chapter-header" style={{ marginBottom: 24 }}>
    <div className="chapter-tag">
      <span>{tag}</span>
    </div>
    <div className="title h-display">{title}</div>
    {sub && <div className="sub">— {sub} —</div>}
  </div>
);

// Generic back-to-home link
const BackBar = ({ label = "回首頁" }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "3px dashed var(--ink)", marginBottom: 24, fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 }}>
    <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>← {label}</a>
    <span style={{ opacity: 0.5 }}>樹德動遊系 — DETAIL CHAPTER</span>
  </div>
);

// =========================================================
// NEWS detail
// =========================================================
const NewsDetail = ({ slug }) => {
  const data = useDataset("news");
  // 解析 hash 第二段 `#/news/<slug>/work-NN` 作為 scroll 目標
  React.useEffect(() => {
    const m = window.location.hash.match(/^#\/news\/[^\/]+\/(work-\d+)/);
    if (!m) return;
    const targetId = m[1];
    const tryScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) return false;
      const targetY = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: targetY, behavior: "instant" });
      return true;
    };
    // 先試一次（資料若已 cached）；data 還沒 ready 時延後重試
    const t1 = setTimeout(tryScroll, 100);
    const t2 = setTimeout(tryScroll, 1200);
    const t3 = setTimeout(tryScroll, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [slug, data]);
  if (!data) return <Loading />;
  const post = data.find(p => p.slug === slug || String(p.id) === slug);
  if (!post) return <NotFound type="新聞" slug={slug} />;
  const showImage = !post.hideImage && (post.image || post.imageFallback);
  return (
    <section className="chapter">
      <div className="container">
        <BackBar />
        <DetailHeader tag={post.tag || "新聞"} title={post.title} sub={post.date} />

        <div className="comic-page">
          {/* Hero 區只在「不隱藏圖」時顯示，證照類等純文字消息直接跳過 */}
          {showImage ? (
            <div className="comic-tier tier-2-1 tier-tall">
              <Panel className="bg-halftone-light" style={{ padding: 0, position: "relative" }}>
                <PH label={post.title} src={post.image} fallback={post.imageFallback} alt={post.title} fit="contain" />
              </Panel>
              <Panel variant="inkbg" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "inline-block", background: "var(--accent-yellow)", color: "var(--ink)", padding: "3px 10px", fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 14 }}>
                    #{post.id} · {post.tag}
                  </div>
                  <div className="h-display" style={{ fontSize: 22, lineHeight: 1.3, marginBottom: 12 }}>{post.title}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>{post.date}</div>
                </div>
                <div style={{ marginTop: 18, fontSize: 12, opacity: 0.7 }}>
                  READ ↓
                </div>
              </Panel>
            </div>
          ) : (
            // 純文字版：輕量 strip — 編號 / 日期 / 回新聞列表
            <div className="comic-tier tier-1" style={{ marginBottom: 12 }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
                padding: "10px 16px", background: "var(--paper)", color: "var(--ink)",
                border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ background: "var(--accent-yellow)", color: "var(--ink)", padding: "3px 10px", fontFamily: "'Bangers',sans-serif", fontSize: 12, letterSpacing: "0.1em", border: "2px solid var(--ink)" }}>
                    #{post.id} · {post.tag}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.7 }}>{post.date}</span>
                </div>
                <a href="#news" style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, color: "var(--ink)", letterSpacing: "0.08em", textDecoration: "none", borderBottom: "2px solid var(--ink)" }}>
                  ← 回新聞列表
                </a>
              </div>
            </div>
          )}

          <div className="comic-tier tier-1 tier-tall">
            <Panel className="bg-halftone-light" style={{ padding: 32, position: "relative" }}>
              <div style={{ fontSize: 16, lineHeight: 1.95, fontWeight: 500, whiteSpace: "pre-line" }}>
                {post.content || post.excerpt}
              </div>
              <SFX color="red" rotate={-6} size={48} style={{ position: "absolute", top: 16, right: 24 }}>!</SFX>
            </Panel>
          </div>

          {/* GALLERY — 入圍作品專輯（左右交替 zigzag 漫畫雜誌風） */}
          {Array.isArray(post.gallery) && post.gallery.length > 0 && (
            <div className="comic-tier tier-1" style={{ marginTop: 12 }}>
              <Panel variant="inkbg" style={{ padding: "22px 24px 28px", position: "relative" }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.14em", color: "var(--accent-yellow)" }}>
                  ★ SELECTED WORKS · 入圍作品專輯
                </div>
                <div className="h-display" style={{ fontSize: 24, color: "var(--paper)", margin: "4px 0 22px" }}>
                  {post.gallery.length} 部畢業專題作品
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {post.gallery.map((w, i) => {
                    const isImgRight = i % 2 === 0; // 第 1, 3, 5, 7 筆：圖在右；2, 4, 6 筆：圖在左
                    const accentColors = ["var(--accent-red)", "var(--accent-blue)", "var(--accent-yellow)", "var(--accent-pink, #ec4899)"];
                    const accent = accentColors[i % accentColors.length];
                    return (
                      <div key={i}
                        className="news-work-row"
                        id={`work-${String(i + 1).padStart(2, "0")}`}
                        style={{
                          background: "var(--paper)",
                          color: "var(--ink)",
                          border: "3px solid var(--ink)",
                          boxShadow: `${isImgRight ? "6px" : "-6px"} 6px 0 ${accent}`,
                          padding: 18,
                          scrollMarginTop: 80,
                          display: "grid",
                          gridTemplateColumns: isImgRight ? "1fr 240px" : "240px 1fr",
                          gap: 20,
                          alignItems: "stretch"
                        }}>
                        {/* 左側 / 右側 — 文字區 */}
                        <div style={{
                          gridColumn: isImgRight ? 1 : 2,
                          gridRow: 1,
                          display: "flex", flexDirection: "column", gap: 8, minWidth: 0
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ background: "var(--ink)", color: "var(--accent-yellow)", padding: "3px 10px", fontFamily: "'Bangers',sans-serif", fontSize: 12, letterSpacing: "0.1em" }}>
                              {w.rank}
                            </span>
                            <span style={{ fontSize: 11, fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em", opacity: 0.7 }}>{w.category}</span>
                            {w.tier === "grand" && (
                              <span style={{ background: "var(--accent-red)", color: "#fff", padding: "3px 10px", fontFamily: "'Bowlby One',sans-serif", fontSize: 11, letterSpacing: "0.1em" }}>
                                ★ 4 競賽全入圍
                              </span>
                            )}
                          </div>
                          <div className="h-display" style={{ fontSize: 28, lineHeight: 1.1, marginTop: 2 }}>{w.title}</div>
                          {w.titleEn && <div style={{ fontSize: 12, fontStyle: "italic", opacity: 0.65 }}>{w.titleEn}</div>}
                          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4, lineHeight: 1.7 }}>
                            <span style={{ opacity: 0.55 }}>指導 </span>{w.mentor}<br/>
                            <span style={{ opacity: 0.55 }}>主創 </span>{w.designers}
                          </div>
                          {w.desc && <div style={{ fontSize: 13, lineHeight: 1.75, marginTop: 6 }}>{w.desc}</div>}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                            {w.awards.map((a, j) => (
                              <span key={j} style={{
                                background: "var(--ink)", color: "var(--accent-yellow)",
                                padding: "2px 9px", fontSize: 11, fontWeight: 700,
                                fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em"
                              }}>{a}</span>
                            ))}
                          </div>
                          {w.social && (
                            <a href={w.social.url} target="_blank" rel="noopener noreferrer"
                              style={{
                                marginTop: 10,
                                display: "inline-flex", alignItems: "center", gap: 6,
                                background: w.social.type === "ig"
                                  ? "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
                                  : w.social.type === "yt"
                                    ? "#FF0000"
                                    : "#1877f2",
                                color: "#fff",
                                padding: "6px 12px",
                                fontSize: 12, fontWeight: 800,
                                textDecoration: "none",
                                border: "2px solid var(--ink)",
                                boxShadow: "2px 2px 0 var(--ink)",
                                alignSelf: "flex-start",
                                transition: "transform 0.1s"
                              }}
                              onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
                              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "2px 2px 0 var(--ink)"; }}
                            >
                              <span style={{ fontSize: 14 }}>{
                                w.social.type === "ig" ? "📷"
                                : w.social.type === "yt" ? "▶"
                                : "📘"
                              }</span>
                              <span>{w.social.label}</span>
                              <span style={{ opacity: 0.9, fontSize: 11 }}>↗</span>
                            </a>
                          )}
                        </div>

                        {/* 右側 / 左側 — 海報圖 */}
                        <div style={{
                          gridColumn: isImgRight ? 2 : 1,
                          gridRow: 1,
                          aspectRatio: "3 / 4",
                          background: "#000",
                          border: "3px solid var(--ink)",
                          overflow: "hidden"
                        }}>
                          <img src={w.image} alt={w.title}
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "20px 4px 12px", borderTop: "3px dashed var(--ink)", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 }}>
          <a href="#news" style={{ color: "var(--ink)", textDecoration: "none" }}>← 看其他更新</a>
          <span style={{ opacity: 0.5 }}>P. {post.id}</span>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>回首頁 →</a>
        </div>
      </div>
    </section>
  );
};

// =========================================================
// FACULTY detail
// =========================================================
const FacultyDetail = ({ slug }) => {
  const data = useDataset("faculty");
  if (!data) return <Loading />;
  const f = data.find(x => x.slug === slug);
  if (!f) return <NotFound type="老師" slug={slug} />;
  return (
    <section className="chapter">
      <div className="container">
        <BackBar />
        <DetailHeader tag="師" title={`CHARACTER · ${f.name}`} sub={f.en} />

        <div className="comic-page">
          <div className="comic-tier tier-2-1 tier-tall">
            <Panel
              bg={f.color === "red" ? "bg-halftone-red" : f.color === "blue" ? "bg-halftone-blue" : "bg-halftone-light"}
              variant={f.color === "yellow" ? "yellow" : ""}
              style={{ padding: 0, position: "relative", overflow: "hidden", minHeight: 420 }}
            >
              <PH label={f.name} src={f.photo} fallback={f.photoFallback} alt={`${f.name} 老師`} pos="center top" />
              <div style={{ position: "absolute", top: 14, left: 14, fontFamily: "'Bangers',sans-serif", background: "var(--ink)", color: "var(--paper)", padding: "4px 14px", fontSize: 16, letterSpacing: "0.1em" }}>
                {f.role}
              </div>
            </Panel>
            <Panel variant="inkbg" style={{ padding: 24 }}>
              <div className="h-display" style={{ fontSize: 38, lineHeight: 1, marginBottom: 6 }}>{f.name}</div>
              <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.7, letterSpacing: "0.06em", marginBottom: 14 }}>{f.en}</div>
              <div style={{ background: "var(--accent-yellow)", color: "var(--ink)", display: "inline-block", padding: "4px 10px", fontWeight: 800, fontSize: 13, marginBottom: 12 }}>
                專長 · {f.spec}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7, marginTop: 14 }}>
                {f.email && <div>📧 <a href={`mailto:${f.email}`} style={{ color: "var(--accent-yellow)" }}>{f.email}</a></div>}
                {f.ext && <div>☎ 分機 {f.ext}</div>}
                {f.officeHours && <div>🕐 {f.officeHours}</div>}
              </div>
            </Panel>
          </div>

          {f.research && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel className="bg-halftone-light" style={{ padding: 24 }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 8 }}>RESEARCH · 研究專長</div>
                <div style={{ fontSize: 15, lineHeight: 1.8, fontWeight: 500 }}>{f.research}</div>
              </Panel>
            </div>
          )}

          {f.courses && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel variant="yellow" style={{ padding: 24 }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 8 }}>COURSES · 授課領域</div>
                <div style={{ fontSize: 15, lineHeight: 1.8, fontWeight: 500 }}>{f.courses}</div>
              </Panel>
            </div>
          )}

          {(f.education || f.certs) && (
            <div className="comic-tier tier-1-1 tier-mid">
              {f.education && (
                <Panel className="bg-halftone-blue" style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 8 }}>EDU · 學歷</div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, fontWeight: 600 }}>{f.education}</div>
                </Panel>
              )}
              {f.certs && (
                <Panel variant="red" style={{ padding: 22 }}>
                  <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 8 }}>CERTS · 證照</div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, fontWeight: 600 }}>{f.certs}</div>
                </Panel>
              )}
            </div>
          )}

          {f.achievements && f.achievements.length > 0 && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel variant="inkbg" style={{ padding: 24, position: "relative" }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", color: "var(--accent-yellow)", marginBottom: 12 }}>★ ACHIEVEMENTS · 成就</div>
                <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 1.9, fontSize: 14, color: "var(--paper)" }}>
                  {f.achievements.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
                <SFX color="yellow" rotate={-6} size={48} style={{ position: "absolute", top: 14, right: 22 }}>讚！</SFX>
              </Panel>
            </div>
          )}

          {f.experience && f.experience.length > 0 && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel className="bg-halftone-red" style={{ padding: 24 }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 12 }}>EXP · 經歷</div>
                <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 1.9, fontSize: 14 }}>
                  {f.experience.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </Panel>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "20px 4px 12px", borderTop: "3px dashed var(--ink)", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 }}>
          <a href="#faculty" style={{ color: "var(--ink)", textDecoration: "none" }}>← 看其他老師</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>回首頁 →</a>
        </div>
      </div>
    </section>
  );
};

// =========================================================
// LAB detail
// =========================================================
// Mapping: tagline -> 大型符號 + 主色（讓沒實照片的格子也有視覺重心）
const LAB_VISUAL = {
  TABLET:     { icon: "✎", color: "var(--accent-blue)", sfx: "刷！", bg: "bg-halftone-blue" },
  "3D PRINT": { icon: "▲", color: "var(--accent-red)", sfx: "咚！", bg: "bg-halftone-red" },
  MOCAP:     { icon: "✦", color: "var(--accent-yellow)", sfx: "咻！", bg: "bg-halftone-light" },
  INTERACT:  { icon: "◉", color: "var(--accent-blue)", sfx: "啪！", bg: "bg-halftone-blue" },
  "STOP-MO": { icon: "▣", color: "var(--accent-red)", sfx: "咔！", bg: "bg-halftone-red" },
  MERCH:     { icon: "✚", color: "var(--accent-yellow)", sfx: "登！", bg: "bg-halftone-light" },
  "VR / XR": { icon: "◇", color: "var(--accent-blue)", sfx: "嗡！", bg: "bg-halftone-blue" },
  "POST-PROD":{ icon: "◐", color: "var(--accent-red)", sfx: "唰！", bg: "bg-halftone-red" },
  MAKER:     { icon: "⚙", color: "var(--accent-yellow)", sfx: "叮！", bg: "bg-halftone-light" },
  MULTIMEDIA:{ icon: "▶", color: "var(--accent-blue)", sfx: "登登！", bg: "bg-halftone-blue" },
  ESPORTS:   { icon: "★", color: "var(--accent-red)", sfx: "Go！", bg: "bg-halftone-red" },
  STARTUP:   { icon: "✺", color: "var(--accent-yellow)", sfx: "讚！", bg: "bg-halftone-light" }
};

const LabDetail = ({ slug }) => {
  const data = useDataset("labs");
  if (!data) return <Loading />;
  const lab = data.find(x => x.slug === slug);
  if (!lab) return <NotFound type="實驗室" slug={slug} />;
  const v = LAB_VISUAL[lab.tagline] || { icon: "◆", color: "var(--accent-red)", sfx: "！", bg: "bg-halftone-light" };
  // 同類其他實驗室
  const allLabs = data.filter(x => x.slug !== slug);
  const others = allLabs.slice(0, 4);
  return (
    <section className="chapter">
      <div className="container">
        <BackBar />
        <DetailHeader tag="室" title={lab.name} sub={`ROOM · ${lab.code}`} />

        <div className="comic-page">
          {/* TIER 1 — Hero 視覺：第一張照片（沒照片就大符號水印）+ 標題 (2:1) */}
          <div className="comic-tier tier-2-1 tier-tall">
            <Panel className={v.bg} style={{ padding: 0, position: "relative", overflow: "hidden", minHeight: 320 }}>
              {lab.photos && lab.photos.length > 0 ? (
                <>
                  <PH src={lab.photos[0]} alt={lab.name} fit="cover" pos="center" />
                  {/* 漸層讓標籤可讀 */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
                    pointerEvents: "none"
                  }} />
                </>
              ) : (
                <>
                  <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.25 }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "clamp(180px, 28vw, 360px)",
                    color: v.color, opacity: 0.85,
                    fontFamily: "'Bowlby One', system-ui",
                    lineHeight: 1, transform: "rotate(-6deg)",
                    pointerEvents: "none",
                    textShadow: "6px 6px 0 var(--ink)"
                  }}>{v.icon}</div>
                </>
              )}
              <div style={{
                position: "absolute", top: 18, left: 18,
                background: "var(--ink)", color: "var(--paper)",
                padding: "6px 16px",
                fontFamily: "'Bowlby One', system-ui", letterSpacing: "0.06em",
                fontSize: 18, transform: "rotate(-2deg)",
                boxShadow: "3px 3px 0 var(--accent-red)",
                zIndex: 2
              }}>
                ROOM · {lab.code}
              </div>
              <SFX color="yellow" rotate={6} size={64} anim="burst"
                style={{ position: "absolute", bottom: 22, right: 26, zIndex: 2 }}>
                {v.sfx}
              </SFX>
            </Panel>

            <Panel variant="inkbg" style={{ padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", color: "var(--accent-yellow)", marginBottom: 8 }}>
                  TAG · {lab.tagline}
                </div>
                <div style={{ fontFamily: "'Noto Sans TC', system-ui", fontSize: 28, fontWeight: 900, color: "var(--paper)", lineHeight: 1.2, marginBottom: 14 }}>
                  {lab.name}
                </div>
                <div style={{ fontSize: 14, color: "var(--paper)", opacity: 0.9, fontWeight: 500, lineHeight: 1.7 }}>
                  {lab.shortDesc}
                </div>
              </div>
              <div style={{ marginTop: 18, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "var(--accent-yellow)", opacity: 0.7 }}>
                ↓ 詳細說明
              </div>
            </Panel>
          </div>

          {/* TIER 2 — 內容文字（高度依內容自動，不再強制 tier-mid 240px） */}
          <div className="comic-tier tier-1">
            <Panel className="bg-halftone-light" style={{ padding: "22px 28px" }}>
              <div style={{ fontSize: 15, lineHeight: 1.85, fontWeight: 500, whiteSpace: "pre-line" }}>
                {lab.content}
              </div>
            </Panel>
          </div>

          {/* TIER 3 — 照片 gallery（除了第一張之外） */}
          {lab.photos && lab.photos.length > 1 && (
            <div className="comic-tier tier-1-1-1-1 tier-mid">
              {lab.photos.slice(1, 5).map((p, idx) => (
                <Panel key={idx} className={idx % 2 === 0 ? "bg-halftone-light" : "bg-halftone-blue"} style={{ padding: 0, overflow: "hidden", minHeight: 180 }}>
                  <PH src={p} alt={`${lab.name} ${idx + 2}`} fit="cover" />
                </Panel>
              ))}
            </div>
          )}

          {/* TIER 3 — 看其他實驗室 */}
          {others.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div className="chapter-header" style={{ marginBottom: 14 }}>
                <div className="chapter-tag" style={{ background: "var(--accent-blue)" }}>
                  <span>NEXT</span>
                </div>
                <div className="title" style={{ fontSize: 22 }}>下一站 · 其他實驗室</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--gutter)" }}>
                {others.map((o) => {
                  const ov = LAB_VISUAL[o.tagline] || v;
                  return (
                    <Panel
                      key={o.slug}
                      clickable
                      onClick={() => { window.location.hash = "#/labs/" + o.slug; }}
                      className={ov.bg}
                      style={{ padding: 14, position: "relative", overflow: "hidden", minHeight: 110 }}
                    >
                      <div style={{
                        position: "absolute", right: -10, bottom: -30,
                        fontSize: 90, color: ov.color, opacity: 0.4,
                        fontFamily: "'Bowlby One', system-ui",
                        lineHeight: 1, pointerEvents: "none"
                      }}>{ov.icon}</div>
                      <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 11, letterSpacing: "0.1em", opacity: 0.8 }}>
                        {o.code} · {o.tagline}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 15, marginTop: 6, position: "relative" }}>{o.name}</div>
                    </Panel>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "20px 4px 12px", borderTop: "3px dashed var(--ink)", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 }}>
          <a href="#labs" style={{ color: "var(--ink)", textDecoration: "none" }}>← 看實驗室總覽</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>回首頁 →</a>
        </div>
      </div>
    </section>
  );
};

// =========================================================
// WORKS detail
// =========================================================
const WorksDetail = ({ slug }) => {
  const data = useDataset("works");
  if (!data) return <Loading />;
  const w = data.find(x => x.id === slug);
  if (!w) return <NotFound type="作品" slug={slug} />;
  return (
    <section className="chapter">
      <div className="container">
        <BackBar />
        <DetailHeader tag="作" title={w.title} sub={`${w.year} · ${w.kind}`} />

        <div className="comic-page">
          <div className="comic-tier tier-2-1 tier-tall">
            <Panel className="bg-halftone-light" style={{ padding: 0, position: "relative", minHeight: 320 }}>
              {w.image ? (
                <PH label={w.title} src={w.image} alt={w.title} fit={w.imageFit || "cover"} pos="center" />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 320, padding: 40 }}>
                  <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 56, opacity: 0.4 }}>★</div>
                </div>
              )}
              <div style={{ position: "absolute", bottom: 16, left: 16, background: "var(--accent-red)", color: "#fff", padding: "4px 14px", fontFamily: "'Bowlby One',sans-serif", letterSpacing: "0.06em", fontSize: 14, boxShadow: "2px 2px 0 var(--ink)" }}>
                WIN · {w.year}
              </div>
            </Panel>
            <Panel variant="red" style={{ padding: 28, color: "#fff" }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em", fontSize: 13, marginBottom: 10 }}>HIGH SCORE ★</div>
              <div className="h-display" style={{ fontSize: 28, lineHeight: 1.2, marginBottom: 12 }}>{w.title}</div>
              <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.95, marginBottom: 16 }}>▸ {w.award}</div>
              {w.team && (
                <div style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>
                  <div style={{ opacity: 0.7, fontWeight: 800 }}>TEAM</div>
                  <div style={{ fontWeight: 600 }}>{w.team}</div>
                </div>
              )}
              {w.advisor && w.advisor !== "—" && (
                <div style={{ fontSize: 12, lineHeight: 1.7 }}>
                  <div style={{ opacity: 0.7, fontWeight: 800 }}>ADVISOR</div>
                  <div style={{ fontWeight: 600 }}>{w.advisor} 老師</div>
                </div>
              )}
            </Panel>
          </div>

          {/* 戰績條列 */}
          {w.achievements && w.achievements.length > 0 && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel variant="inkbg" style={{ padding: 28, position: "relative" }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, letterSpacing: "0.1em", color: "var(--accent-yellow)", marginBottom: 14 }}>
                  ★ TROPHY · 得獎清單
                </div>
                <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 2, fontSize: 15, color: "var(--paper)" }}>
                  {w.achievements.map((a, i) => <li key={i} style={{ fontWeight: 600 }}>{a}</li>)}
                </ul>
                <SFX color="yellow" rotate={-6} size={48} style={{ position: "absolute", top: 14, right: 22 }}>讚！</SFX>
              </Panel>
            </div>
          )}

          <div className="comic-tier tier-1 tier-mid">
            <Panel className="bg-halftone-light" style={{ padding: 32 }}>
              <div style={{ fontSize: 16, lineHeight: 1.95, fontWeight: 500, whiteSpace: "pre-line" }}>
                {w.content}
              </div>
            </Panel>
          </div>

          {w.newsId && (
            <div className="comic-tier tier-1 tier-short">
              <Panel variant="yellow" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em" }}>RELATED · 相關報導</div>
                <a href={localHref("news", w.newsId)} style={{ color: "var(--ink)", fontWeight: 800, textDecoration: "none", letterSpacing: "0.08em" }}>看新聞稿 →</a>
              </Panel>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "20px 4px 12px", borderTop: "3px dashed var(--ink)", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 }}>
          <a href="#works" style={{ color: "var(--ink)", textDecoration: "none" }}>← 看其他戰績</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>回首頁 →</a>
        </div>
      </div>
    </section>
  );
};

// =========================================================
// ADMISSION detail
// =========================================================
const AdmissionDetail = ({ slug }) => {
  const data = useDataset("admission");
  if (!data) return <Loading />;
  const a = data.find(x => x.slug === slug);
  if (!a) return <NotFound type="招生管道" slug={slug} />;
  return (
    <section className="chapter">
      <div className="container">
        <BackBar />
        <DetailHeader tag="招" title={a.title} sub={`${a.year} · ${a.quota}`} />

        <div className="comic-page">
          {/* Hero — 瘦身版 */}
          <div className="comic-tier tier-1">
            <Panel variant="red" style={{ padding: 22, position: "relative" }}>
              <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
              <div style={{ position: "relative" }}>
                <Bubble variant="bubble--shout" className="bubble--anim-shake" style={{ background: "var(--accent-yellow)", color: "var(--ink)", fontFamily: "'Bowlby One',sans-serif", fontSize: 18, padding: "8px 14px", transform: "rotate(-3deg)" }}>
                  下一話的主角，是你！
                </Bubble>
                <div className="h-display h-jojo" style={{ fontSize: "clamp(26px, 3.6vw, 40px)", color: "#fff", marginTop: 16, lineHeight: 0.98 }}>
                  {a.title}
                </div>
                <div style={{ fontSize: 14, color: "#fff", marginTop: 10, fontWeight: 800, opacity: 0.95, lineHeight: 1.6 }}>
                  {a.year} · 名額 {a.quota}
                  {a.code ? ` · ${a.code}` : ""}
                </div>
                {a.summary && (
                  <div style={{ fontSize: 13, color: "#fff", marginTop: 6, opacity: 0.9, lineHeight: 1.7 }}>
                    {a.summary}
                  </div>
                )}
              </div>
            </Panel>
          </div>

          {/* 招生時程 — 關鍵日期排第一順位 */}
          {a.timeline && a.timeline.length > 0 && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel variant="yellow" style={{ padding: 24, position: "relative" }}>
                <SFX color="red" rotate={-8} size={40} style={{ position: "absolute", top: 12, right: 18 }}>排程！</SFX>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.12em", marginBottom: 4 }}>
                  TIMELINE · 招生時程
                </div>
                <div className="h-display" style={{ fontSize: 22, marginBottom: 14 }}>
                  關鍵日期 — 報名 / 放榜 / 繳費
                </div>
                <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
                  {a.timeline.map((t, i) => (
                    <li key={i} style={{
                      display: "flex", gap: 14, alignItems: "flex-start",
                      padding: "10px 0",
                      borderBottom: i < a.timeline.length - 1 ? "2px dashed var(--ink)" : "none"
                    }}>
                      <div style={{
                        flex: "0 0 auto", minWidth: 36, height: 36,
                        background: "var(--ink)", color: "var(--accent-yellow)",
                        fontFamily: "'Bowlby One',sans-serif", fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "2px solid var(--ink)",
                        boxShadow: "2px 2px 0 var(--accent-red)",
                        padding: "0 10px"
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900, fontSize: 16, lineHeight: 1.3 }}>
                          {t.label}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.78, marginTop: 2 }}>
                          📅 {t.date}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
                <div style={{ fontSize: 11, marginTop: 14, opacity: 0.7, lineHeight: 1.6 }}>
                  ※ 確切日期以招聯會 / 技專校院招生委員會聯合會 / 樹德招生資訊網公告為準。
                </div>
              </Panel>
            </div>
          )}

          {/* 招生群類 — 只在多群招生（含 groups 表格）時顯示 */}
          {a.groups && a.groups.length > 0 && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel className="bg-halftone-blue" style={{ padding: 24, position: "relative" }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 4 }}>
                  📋 ADMISSION INFO · 招生群類分配
                </div>
                <div className="h-display" style={{ fontSize: 20, marginBottom: 10 }}>
                  招生群類 · 名額分配
                </div>
                {a.weights && (
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, lineHeight: 1.8, opacity: 0.88 }}>
                    採計權重 <b>{a.weights}</b>
                  </div>
                )}
                <div style={{ marginTop: 6, overflowX: "auto" }}>
                  <table style={{
                    width: "100%", borderCollapse: "collapse",
                    background: "var(--paper)", border: "2px solid var(--ink)",
                    boxShadow: "3px 3px 0 var(--ink)",
                    fontSize: 13
                  }}>
                    <thead>
                      <tr style={{ background: "var(--ink)", color: "var(--accent-yellow)", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.06em" }}>
                        <th style={{ padding: "8px 10px", textAlign: "left", border: "1px solid var(--ink)" }}>志願代碼</th>
                        <th style={{ padding: "8px 10px", textAlign: "left", border: "1px solid var(--ink)" }}>招生群類</th>
                        <th style={{ padding: "8px 10px", textAlign: "center", border: "1px solid var(--ink)" }}>一般生</th>
                        <th style={{ padding: "8px 10px", textAlign: "center", border: "1px solid var(--ink)" }}>原住民</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.groups.map((g, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,235,180,0.4)" }}>
                          <td style={{ padding: "8px 10px", border: "1px solid var(--ink)", fontFamily: "'Bowlby One',sans-serif", fontSize: 13 }}>{g.code}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid var(--ink)", fontWeight: 700 }}>{g.group}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid var(--ink)", textAlign: "center", fontWeight: 800 }}>{g.regular}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid var(--ink)", textAlign: "center", fontWeight: 800 }}>{g.indigenous == null ? "—" : g.indigenous}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>
          )}

          {/* 重要提示 — key_notes */}
          {a.key_notes && a.key_notes.length > 0 && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel variant="red" style={{ padding: 28, position: "relative" }}>
                <SFX color="yellow" rotate={-8} size={42} style={{ position: "absolute", top: 14, right: 22 }}>注意！</SFX>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.12em", marginBottom: 6, color: "var(--accent-yellow)" }}>
                  ⚠️ KEY NOTES · 重要提醒
                </div>
                <div className="h-display" style={{ fontSize: 24, marginBottom: 16, color: "#fff" }}>
                  別漏看這些關鍵點！
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {a.key_notes.map((n, i) => (
                    <li key={i} style={{
                      padding: "10px 14px",
                      marginBottom: 8,
                      background: "var(--paper)",
                      border: "2px solid var(--ink)",
                      boxShadow: "3px 3px 0 var(--accent-yellow)",
                      fontSize: 14, fontWeight: 700, lineHeight: 1.7,
                      color: "var(--ink)"
                    }}>
                      {n}
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          )}

          {/* 樹德動遊系獨家重點 */}
          {a.stu_focus && a.stu_focus.length > 0 && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel className="bg-halftone-red" style={{ padding: 28, position: "relative" }}>
                <SFX color="yellow" rotate={-6} size={42} style={{ position: "absolute", top: 14, right: 22 }}>重點！</SFX>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.12em", marginBottom: 6 }}>
                  STU FOCUS · 樹德動遊系獨家
                </div>
                <div className="h-display" style={{ fontSize: 26, marginBottom: 16 }}>
                  本系應對重點 — 你需要知道這些
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {a.stu_focus.map((s, i) => (
                    <li key={i} style={{
                      padding: "10px 14px",
                      marginBottom: 8,
                      background: "var(--paper)",
                      border: "2px solid var(--ink)",
                      boxShadow: "3px 3px 0 var(--ink)",
                      fontSize: 14, fontWeight: 600, lineHeight: 1.7
                    }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          )}

          {/* 官方資訊連結 */}
          {a.links && a.links.length > 0 && (
            <div className="comic-tier tier-1 tier-mid">
              <Panel className="bg-halftone-blue" style={{ padding: 24 }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 8 }}>
                  🔗 OFFICIAL · 官方查詢入口
                </div>
                <div className="h-display" style={{ fontSize: 22, marginBottom: 16 }}>
                  最新公告請以官方為準
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {a.links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{
                      background: "var(--paper)", color: "var(--ink)",
                      padding: "10px 16px", textDecoration: "none",
                      fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900,
                      fontSize: 14, border: "3px solid var(--ink)",
                      boxShadow: "3px 3px 0 var(--ink)",
                      display: "inline-flex", alignItems: "center", gap: 6
                    }}>
                      → {l.label}
                    </a>
                  ))}
                </div>
                <div style={{ fontSize: 12, marginTop: 14, opacity: 0.75, lineHeight: 1.7 }}>
                  📞 樹德招生諮詢專線：07-6158000 #2120-2122（招生組）／#6102（系辦）<br/>
                  📧 系辦信箱：rita@stu.edu.tw　主任信箱：treefar@stu.edu.tw
                </div>
              </Panel>
            </div>
          )}

          {/* 預約參訪頁專屬：聯絡卡 + 簡易表單 */}
          {a.contact && (
            <>
              <div className="comic-tier tier-1-1 tier-mid">
                {[a.contact.advisor, a.contact.assistant].filter(Boolean).map((p, idx) => (
                  <Panel key={idx} variant={idx === 0 ? "red" : "inkbg"} style={{ padding: 24, position: "relative" }}>
                    <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 12, letterSpacing: "0.1em",
                      color: idx === 0 ? "var(--accent-yellow)" : "var(--accent-yellow)", marginBottom: 8 }}>
                      {idx === 0 ? "★ HEAD · 系主任" : "✉ STAFF · 系助理"}
                    </div>
                    <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900, fontSize: 24,
                      color: idx === 0 ? "#fff" : "var(--paper)", lineHeight: 1.2, marginBottom: 6 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600,
                      color: idx === 0 ? "#fff" : "var(--paper)", opacity: 0.85, marginBottom: 14 }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 2,
                      color: idx === 0 ? "#fff" : "var(--paper)" }}>
                      <div>📧 <a href={`mailto:${p.email}?subject=動遊系一日參訪預約`} style={{ color: idx === 0 ? "var(--accent-yellow)" : "var(--accent-yellow)", textDecoration: "underline" }}>{p.email}</a></div>
                      <div>☎ {a.contact.phone} <span style={{ opacity: 0.7 }}>分機</span> #{p.ext}</div>
                    </div>
                  </Panel>
                ))}
              </div>

              <div className="comic-tier tier-1 tier-mid">
                <Panel variant="yellow" style={{ padding: 28, position: "relative" }}>
                  <SFX color="red" rotate={-6} size={48} style={{ position: "absolute", top: 14, right: 22 }}>留下！</SFX>
                  <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 12 }}>
                    QUICK FORM · 一鍵發信預約
                  </div>
                  <div className="h-display" style={{ fontSize: 24, marginBottom: 14 }}>
                    打開信箱、填好以下，按寄出
                  </div>
                  <div style={{ background: "var(--paper)", padding: 18, border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", fontSize: 14, lineHeight: 1.9 }}>
                    <div><b>收件人：</b>{a.contact.assistant.email}（系助理）+ {a.contact.advisor.email}（主任）</div>
                    <div><b>主旨：</b>動遊系一日參訪預約</div>
                    <div><b>內文：</b></div>
                    <ul style={{ marginTop: 6, paddingLeft: 22, lineHeight: 1.8 }}>
                      <li>學生姓名 / 就讀學校 / 年級</li>
                      <li>家長同行 N 位</li>
                      <li>希望的參訪日期（建議週六）</li>
                      <li>感興趣的方向（動畫 / 遊戲 / 互動 / VR · AR）</li>
                      <li>聯絡電話</li>
                    </ul>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
                    <a href={`mailto:${a.contact.assistant.email}?cc=${a.contact.advisor.email}&subject=${encodeURIComponent("動遊系一日參訪預約")}&body=${encodeURIComponent("學生姓名：\n就讀學校 / 年級：\n家長同行人數：\n希望參訪日期（建議週六）：\n感興趣方向（動畫/遊戲/互動/VR·AR）：\n聯絡電話：\n\n感謝安排！")}`}
                      style={{
                        background: "var(--ink)", color: "var(--accent-yellow)",
                        padding: "12px 22px", textDecoration: "none",
                        fontFamily: "'Bowlby One',sans-serif", letterSpacing: "0.06em",
                        fontSize: 16, border: "3px solid var(--ink)",
                        boxShadow: "5px 5px 0 var(--accent-red)"
                      }}>
                      ✉ 開啟信件範本 →
                    </a>
                    <a href={`tel:+886-7-6158000,${a.contact.assistant.ext}`}
                      style={{
                        background: "var(--paper)", color: "var(--ink)",
                        padding: "12px 22px", textDecoration: "none",
                        fontFamily: "'Bowlby One',sans-serif", letterSpacing: "0.06em",
                        fontSize: 16, border: "3px solid var(--ink)",
                        boxShadow: "5px 5px 0 var(--ink)"
                      }}>
                      ☎ 電話：{a.contact.phone} #{a.contact.assistant.ext}
                    </a>
                  </div>
                  <div style={{ fontSize: 12, marginTop: 14, opacity: 0.7 }}>
                    📍 {a.contact.address}
                  </div>
                </Panel>
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "20px 4px 12px", borderTop: "3px dashed var(--ink)", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 }}>
          <a href="#join" style={{ color: "var(--ink)", textDecoration: "none" }}>← 看其他招生管道</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>回首頁 →</a>
        </div>
      </div>
    </section>
  );
};

// =========================================================
// STATS detail — 歷屆得獎 / 業界合作 / 就業表現 等大型統計頁
// =========================================================
const StatsDetail = ({ slug }) => {
  const data = useDataset("stats");
  if (!data) return <Loading />;
  const s = data.find(x => x.slug === slug);
  if (!s) return <NotFound type="統計" slug={slug} />;
  const others = data.filter(x => x.slug !== slug);
  return (
    <section className="chapter">
      <div className="container">
        <BackBar />
        <DetailHeader tag="榜" title={s.title} sub={s.subtitle} />

        <div className="comic-page">
          {/* 摘要 + highlight 數字 */}
          <div className="comic-tier tier-2-1 tier-tall">
            <Panel variant="inkbg" style={{ padding: 28, position: "relative" }}>
              <div className="bg-halftone-red" style={{ position: "absolute", inset: 0, opacity: 0.22 }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color: "var(--accent-yellow)", letterSpacing: "0.1em", marginBottom: 10 }}>
                  HIGH SCORE BOARD ★
                </div>
                <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)", color: "var(--paper)", lineHeight: 1.2, marginBottom: 14 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14, color: "var(--paper)", opacity: 0.92, lineHeight: 1.8 }}>
                  {s.summary}
                </div>
              </div>
              <SFX color="red" rotate={6} size={56} style={{ position: "absolute", top: 14, right: 22 }}>強！</SFX>
            </Panel>

            <Panel variant="yellow" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
              {s.highlights.map((h, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "baseline", gap: 8,
                  borderBottom: i < s.highlights.length - 1 ? "2px dashed var(--ink)" : "none",
                  paddingBottom: i < s.highlights.length - 1 ? 8 : 0
                }}>
                  <span style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 32, lineHeight: 1, color: "var(--ink)" }}>{h.count}</span>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{h.year}</span>
                </div>
              ))}
            </Panel>
          </div>

          {/* 分組清單 */}
          {s.groups && s.groups.map((g, gi) => (
            <div key={gi} className="comic-tier tier-1">
              <Panel className={gi % 2 === 0 ? "bg-halftone-light" : "bg-halftone-red"} style={{ padding: "20px 26px" }}>
                <div style={{
                  display: "inline-block",
                  background: "var(--ink)", color: "var(--accent-yellow)",
                  padding: "4px 12px",
                  fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em",
                  marginBottom: 14
                }}>
                  {g.year}
                </div>
                <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 1.85, fontSize: 14 }}>
                  {g.items.map((it, idx) => (
                    <li key={idx} style={{ fontWeight: 500, marginBottom: 4 }}>{it}</li>
                  ))}
                </ul>
              </Panel>
            </div>
          ))}

          {s.note && (
            <div className="comic-tier tier-1">
              <Panel variant="inkbg" style={{ padding: 18 }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 12, color: "var(--accent-yellow)", letterSpacing: "0.1em", marginBottom: 6 }}>
                  NOTE
                </div>
                <div style={{ fontSize: 13, color: "var(--paper)", opacity: 0.9, lineHeight: 1.8 }}>
                  {s.note}
                </div>
              </Panel>
            </div>
          )}

          {/* 跳到其他統計 */}
          {others.length > 0 && (
            <div className="comic-tier tier-1-1">
              {others.map((o, i) => (
                <Panel key={i} clickable
                  onClick={() => { window.location.hash = "#/stats/" + o.slug; }}
                  variant={i % 2 === 0 ? "yellow" : ""}
                  className={i % 2 === 1 ? "bg-halftone-blue" : ""}
                  style={{ padding: 18 }}>
                  <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 12, letterSpacing: "0.1em", opacity: 0.8, marginBottom: 6 }}>
                    NEXT BOARD →
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 17 }}>{o.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{o.subtitle}</div>
                </Panel>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "20px 4px 12px", borderTop: "3px dashed var(--ink)", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 }}>
          <a href="#works" style={{ color: "var(--ink)", textDecoration: "none" }}>← 回 BOSS BATTLE</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>回首頁 →</a>
        </div>
      </div>
    </section>
  );
};

// =========================================================
// VIDEO detail — 內嵌 YouTube iframe，留在站內
// =========================================================
const VideoDetail = ({ slug }) => {
  const data = useDataset("videos");
  if (!data) return <Loading />;
  const v = data.find(x => x.id === slug);
  if (!v) return <NotFound type="影片" slug={slug} />;
  // 同分類其他影片（推薦）
  const related = data.filter(x => x.id !== v.id && x.category === v.category).slice(0, 6);
  return (
    <section className="chapter">
      <div className="container">
        <BackBar />
        <DetailHeader tag="畫" title={v.title} sub={v.category} />

        <div className="comic-page">
          {/* 影片本人 */}
          <div className="comic-tier tier-1 tier-tall">
            <Panel variant="inkbg" style={{ padding: 0, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "relative", aspectRatio: "16/9", background: "#000" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=0&rel=0`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
            </Panel>
          </div>

          {/* 標題卡 */}
          <div className="comic-tier tier-2-1 tier-mid">
            <Panel className="bg-halftone-light" style={{ padding: 28, position: "relative" }}>
              <div style={{ display: "inline-block", background: "var(--accent-red)", color: "#fff", padding: "3px 12px", fontFamily: "'Bowlby One',sans-serif", letterSpacing: "0.08em", fontSize: 13, marginBottom: 12 }}>
                STUDENT REEL · {v.category}
              </div>
              <div className="h-display" style={{ fontSize: 28, lineHeight: 1.3, marginBottom: 14 }}>{v.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.8 }}>
                樹德動遊系 · YouTube 公開影片。內嵌播放保留站內氛圍；如需在 YouTube 開啟原片，點下方按鈕。
              </div>
              <SFX color="red" rotate={-6} size={48} style={{ position: "absolute", top: 14, right: 24 }}>!</SFX>
            </Panel>
            <Panel variant="yellow" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginBottom: 8 }}>
                  VIDEO ID
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, wordBreak: "break-all" }}>{v.id}</div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener"
                style={{
                  background: "var(--ink)", color: "var(--paper)",
                  padding: "10px 14px", textDecoration: "none",
                  fontFamily: "'Bowlby One',sans-serif", letterSpacing: "0.06em",
                  fontSize: 13, border: "3px solid var(--ink)",
                  boxShadow: "4px 4px 0 var(--accent-red)",
                  textAlign: "center", marginTop: 12
                }}
              >YouTube 開啟 →</a>
            </Panel>
          </div>

          {/* 同類推薦 */}
          {related.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div className="chapter-header" style={{ marginBottom: 14 }}>
                <div className="chapter-tag" style={{ background: "var(--accent-blue)" }}><span>NEXT</span></div>
                <div className="title h-display" style={{ fontSize: 22 }}>同類推薦 · {v.category}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--gutter)" }}>
                {related.map((rv) => (
                  <Panel
                    key={rv.id}
                    clickable
                    onClick={() => { window.location.hash = "#/videos/" + rv.id; }}
                    className="bg-halftone-light"
                    style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--ink)" }}>
                      <PH src={`https://img.youtube.com/vi/${rv.id}/hqdefault.jpg`} alt={rv.title} fit="cover" />
                    </div>
                    <div style={{ padding: "8px 10px", fontSize: 12, fontWeight: 700, lineHeight: 1.4 }}>{rv.title}</div>
                  </Panel>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "20px 4px 12px", borderTop: "3px dashed var(--ink)", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 }}>
          <a href="#works" style={{ color: "var(--ink)", textDecoration: "none" }}>← 回成果作品</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>回首頁 →</a>
        </div>
      </div>
    </section>
  );
};

// =========================================================
// Loading + NotFound
// =========================================================
const Loading = () => (
  <section className="chapter">
    <div className="container" style={{
      padding: "100px 24px 140px", textAlign: "center", position: "relative",
      minHeight: "60vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 28
    }}>
      {/* 集中線背景 */}
      <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.18, pointerEvents: "none" }} />

      {/* 主 LOADING 字 — burst 進場後 wobble */}
      <SFX color="red" rotate={-6} size={140} anim="wobble" style={{ animationDuration: "1.2s" }}>
        LOADING
      </SFX>

      {/* 三個動點 */}
      <div style={{ display: "flex", gap: 16, marginTop: -18 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 18, height: 18, borderRadius: "50%",
            background: ["var(--accent-red)", "var(--accent-yellow)", "var(--accent-blue)"][i],
            border: "3px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)",
            animation: "loadingDot 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`
          }} />
        ))}
      </div>

      {/* 副提示文字 */}
      <div style={{
        fontFamily: "'Bangers',sans-serif", letterSpacing: "0.18em",
        fontSize: 14, opacity: 0.7
      }}>
        ◢ NOW LOADING THE NEXT CHAPTER ◣
      </div>
    </div>
  </section>
);

const NotFound = ({ type, slug }) => (
  <section className="chapter">
    <div className="container" style={{ padding: "120px 24px", textAlign: "center" }}>
      <div className="h-display" style={{ fontSize: 48, marginBottom: 12 }}>404 · 沒有這格</div>
      <div style={{ marginBottom: 24, opacity: 0.7 }}>找不到 {type} · {slug}</div>
      <a href="#" style={{ background: "var(--ink)", color: "var(--paper)", padding: "10px 22px", textDecoration: "none", fontFamily: "'Bowlby One',sans-serif", letterSpacing: "0.06em" }}>回首頁 →</a>
    </div>
  </section>
);

// =========================================================
// EN — English page for international students
// =========================================================
const EnglishDetail = ({ slug }) => {
  // Single landing page — slug currently ignored (only "intro")
  return (
    <section className="chapter" id="en-intro">
      <div className="container">
        <BackBar label="HOME" />
        <div className="chapter-header" style={{ marginBottom: 24 }}>
          <div className="chapter-tag">
            <span>EN</span>
          </div>
          <div className="title h-display" style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>
            ANIMATION × GAMES<br />MADE IN TAIWAN
          </div>
          <div className="sub">— DEPARTMENT OF ANIMATION & GAME DESIGN · SHU-TE UNIVERSITY —</div>
        </div>

        <div className="comic-page">

          {/* TIER 1 — splash */}
          <div className="comic-tier tier-2-1 tier-tall">
            <Panel variant="inkbg" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
              <div className="bg-speedlines" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", color: "var(--accent-yellow)", fontSize: 18, letterSpacing: "0.1em", marginBottom: 14 }}>
                  WELCOME, INTERNATIONAL STUDENTS!
                </div>
                <div className="h-display h-jojo" style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "#fff", lineHeight: 0.95, marginBottom: 18 }}>
                  Draw it.<br />Animate it.<br />Ship it.
                </div>
                <div style={{ fontSize: 15, color: "var(--paper)", lineHeight: 1.7, maxWidth: 560 }}>
                  We turn passion into portfolios. Our undergraduate program in Kaohsiung, Taiwan trains
                  the next generation of animators, game designers, and interactive media creators —
                  with a curriculum built around <b style={{ color: "var(--accent-yellow)" }}>real industry projects</b>,
                  <b style={{ color: "var(--accent-yellow)" }}> Japanese / Korean / Indonesian internships</b>,
                  and a 15-year award track record at international film festivals and game expos.
                </div>
              </div>
              <SFX color="yellow" rotate={-8} size={64} anim="burst" style={{ position: "absolute", top: 18, right: 28 }}>POW!</SFX>
            </Panel>

            <Panel variant="yellow" style={{ padding: 22, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
              {[
                { n: "8", u: "YEARS", t: "Japan internship program (Hautecouture Inc.)" },
                { n: "6", u: "COUNTRIES", t: "Asia-Pacific industry partners" },
                { n: "100+", u: "AWARDS", t: "Domestic & international, 15-year span" },
                { n: "94%", u: "EMPLOYED", t: "Within 1 year of graduation" },
              ].map((h, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "baseline", gap: 8,
                  borderBottom: i < 3 ? "2px dashed var(--ink)" : "none",
                  paddingBottom: i < 3 ? 8 : 0
                }}>
                  <span style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 36, lineHeight: 1, color: "var(--ink)" }}>{h.n}</span>
                  <span style={{ fontFamily: "'Bangers',sans-serif", fontSize: 12, letterSpacing: "0.1em", marginRight: 6 }}>{h.u}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.4 }}>{h.t}</span>
                </div>
              ))}
            </Panel>
          </div>

          {/* TIER 2 — Why Choose Us (4-up) */}
          <div className="comic-tier tier-1-1-1-1">
            {[
              {
                t: "Industry-Driven Studio",
                b: "Real briefs from Smilegate, ELF, ZIP-LAB and more. You graduate with a portfolio of shipped pieces, not just classroom exercises.",
                v: "red", icon: "🎬"
              },
              {
                t: "Japan Internship",
                b: "Annual MOE-funded program at Hautecouture Inc. (Matsuyama, Ehime). 16 students placed in the past 3 years — 2-month paid internship.",
                v: "yellow", icon: "🇯🇵"
              },
              {
                t: "English & Japanese",
                b: "English-medium core: Professional English for Digital Media. Free Japanese I & II for everyone — start from zero, exit conversational.",
                v: "inkbg", icon: "🗾"
              },
              {
                t: "South Taiwan Hub",
                b: "Kaohsiung — Taiwan's animation capital. 10 min to MRT, 25 min to high-speed rail, 35 min to international airport.",
                v: "", icon: "🌏"
              },
            ].map((p, i) => (
              <Panel key={i} variant={p.v} style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 36, lineHeight: 1 }}>{p.icon}</div>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 22, letterSpacing: "0.04em", lineHeight: 1.1 }}>{p.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>{p.b}</div>
              </Panel>
            ))}
          </div>

          {/* TIER 3 — What you'll learn */}
          <div className="comic-tier tier-1-2">
            <Panel variant="" bg="bg-halftone-blue" style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color: "var(--accent-red)", letterSpacing: "0.1em", marginBottom: 8 }}>
                YOUR 4-YEAR JOURNEY
              </div>
              <div className="h-display" style={{ fontSize: 32, marginBottom: 14, lineHeight: 1.05 }}>
                From sketchbook<br />to published title.
              </div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 13, lineHeight: 1.9, fontWeight: 700 }}>
                <li>Y1 · Drawing fundamentals · 2D animation · Game theory</li>
                <li>Y2 · 3D modelling (Maya / ZBrush) · Unity · Storyboard</li>
                <li>Y3 · Studio capstone · Industry mentorship · Specialise</li>
                <li>Y4 · Senior showcase + festival submissions + internship</li>
              </ul>
            </Panel>

            <Panel variant="red" style={{ padding: 24, color: "#fff", position: "relative" }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color: "var(--accent-yellow)", letterSpacing: "0.1em", marginBottom: 8 }}>
                CAREER OUTCOMES
              </div>
              <div className="h-display" style={{ fontSize: 28, color: "#fff", marginBottom: 14, lineHeight: 1.05 }}>
                Where our<br />grads land.
              </div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 13, lineHeight: 1.8, fontWeight: 700 }}>
                <li>🎮 Game studios — Smilegate, IGS, XPEC, Rayark</li>
                <li>🎬 Animation houses — CGCG, Studio2, Wonderland</li>
                <li>🎨 Freelance / SOHO illustrator & character designer</li>
                <li>🏫 Graduate school in Taiwan, Japan, UK, USA</li>
              </ul>
              <SFX color="yellow" rotate={-6} size={48} style={{ position: "absolute", top: 14, right: 18 }}>JOB!</SFX>
            </Panel>
          </div>

          {/* TIER 4 — Awards highlight */}
          <div className="comic-tier tier-1">
            <Panel variant="" bg="bg-halftone-light" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color: "var(--accent-red)", letterSpacing: "0.1em" }}>
                  RECENT INTERNATIONAL HONORS ★
                </div>
                <a href="#/stats/honors" style={{ fontSize: 12, color: "var(--ink)", textDecoration: "underline", fontWeight: 800 }}>FULL ARCHIVE →</a>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, fontSize: 12, lineHeight: 1.6 }}>
                {[
                  "🇪🇸 Barcelona Auteur Film Festival — Selection (2024)",
                  "🇮🇳 Mumbai International Short Film — Winner (2024)",
                  "🇫🇷 Prisme Animation Festival, Rome — Selection (2024)",
                  "🇹🇷 Istanbul-NewYork Short Film — Selection (2024)",
                  "🇹🇼 ClipStudio International Illustration — GRAND PRIZE",
                  "🇹🇼 TISDC, Bahamut ACG, KT Award, Vision Get Wild — multiple wins",
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "var(--paper)", border: "2px solid var(--ink)",
                    padding: "10px 12px", boxShadow: "3px 3px 0 var(--ink)",
                    fontWeight: 700
                  }}>{s}</div>
                ))}
              </div>
            </Panel>
          </div>

          {/* TIER 5 — How to apply + Contact */}
          <div className="comic-tier tier-1-2">
            <Panel variant="inkbg" style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color: "var(--accent-yellow)", letterSpacing: "0.1em", marginBottom: 8 }}>
                HOW TO APPLY
              </div>
              <div className="h-display" style={{ fontSize: 28, color: "var(--paper)", marginBottom: 14, lineHeight: 1.05 }}>
                Three paths<br />to join us.
              </div>
              <ol style={{ listStyle: "none", padding: 0, fontSize: 13, lineHeight: 1.8, color: "var(--paper)", fontWeight: 700 }}>
                <li><b style={{ color: "var(--accent-yellow)" }}>1.</b> Foreign Student Direct Admission — apply via SHU-TE OIA</li>
                <li><b style={{ color: "var(--accent-yellow)" }}>2.</b> Overseas Chinese / Hong Kong / Macau channel — UAC system</li>
                <li><b style={{ color: "var(--accent-yellow)" }}>3.</b> Exchange semester via partner schools (NTU Singapore, etc.)</li>
              </ol>
              <a href="https://oia.stu.edu.tw/" target="_blank" rel="noopener" style={{
                display: "inline-block", marginTop: 18,
                background: "var(--accent-yellow)", color: "var(--ink)", padding: "10px 18px",
                textDecoration: "none", fontFamily: "'Bowlby One',sans-serif",
                letterSpacing: "0.06em", fontSize: 14,
                border: "3px solid var(--paper)", boxShadow: "4px 4px 0 var(--paper)"
              }}>SHU-TE OIA · APPLY NOW →</a>
            </Panel>

            <Panel variant="yellow" style={{ padding: 22 }}>
              <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color: "var(--accent-red)", letterSpacing: "0.1em", marginBottom: 8 }}>
                ASK US ANYTHING
              </div>
              <div className="h-display" style={{ fontSize: 24, marginBottom: 14, lineHeight: 1.1 }}>
                Talk to a real human.
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.9, fontWeight: 700 }}>
                <div>📧 <a href="mailto:rita@stu.edu.tw" style={{ color: "var(--ink)" }}>rita@stu.edu.tw</a></div>
                <div>☎ +886-7-6158000 ext. 6100 / 6102</div>
                <div>📍 6F, Design Building, No. 59 Hengshan Rd.,<br />Yanchao Dist., Kaohsiung 824, Taiwan</div>
              </div>
              <div style={{ marginTop: 14, fontSize: 11, opacity: 0.7, fontStyle: "italic" }}>
                We reply in English, Mandarin, or Japanese — pick whichever feels easiest.
              </div>
            </Panel>
          </div>

          {/* TIER 6 — Outro */}
          <div className="comic-tier tier-1">
            <Panel variant="" style={{ padding: 30, textAlign: "center", position: "relative" }}>
              <div className="h-display h-jojo" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: 14, lineHeight: 1 }}>
                See you in Kaohsiung.
              </div>
              <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 18, fontWeight: 700 }}>
                Bring your sketchbook. We'll handle the rest.
              </div>
              <a href="#join" style={{
                background: "var(--accent-red)", color: "#fff", padding: "12px 24px",
                textDecoration: "none", fontFamily: "'Bowlby One',sans-serif",
                fontSize: 18, letterSpacing: "0.06em",
                border: "4px solid var(--ink)", boxShadow: "5px 5px 0 var(--ink)",
                transform: "rotate(-2deg)", display: "inline-block"
              }}>▶ 中文招生資訊</a>
            </Panel>
          </div>

        </div>
      </div>
    </section>
  );
};

// =========================================================
// CURRICULUM detail — 課程地圖（單頁，全系四年八學期）
// =========================================================
const CurriculumDetail = () => {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (window.__curriculumCache) { setData(window.__curriculumCache); return; }
    const t0 = Date.now();
    fetch(`data/curriculum.json?v=${_BUILD_VER}`).then(r => r.json()).then(d => {
      window.__curriculumCache = d;
      const wait = Math.max(0, 850 - (Date.now() - t0));
      setTimeout(() => setData(d), wait);
    }).catch(() => setData({ error: true }));
  }, []);
  if (!data) return <Loading />;
  if (data.error) return <NotFound type="curriculum" slug="map" />;

  const yearStartIdx = new Set([0, 2, 4, 6]);

  return (
    <section className="chapter">
      <div className="container">
        <BackBar />
        <DetailHeader tag="課" title="課程地圖 · CURRICULUM MAP" sub={data.yearTag} />

        {/* 學分總覽 */}
        <div className="comic-tier tier-1-1-1" style={{ minHeight: 0 }}>
          <Panel variant="yellow" style={{ padding: "14px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 44, lineHeight: 1 }}>{data.credits.required}</div>
            <div style={{ fontWeight: 800, marginTop: 4, fontSize: 13 }}>專業必修學分</div>
          </Panel>
          <Panel variant="red" style={{ padding: "14px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 44, lineHeight: 1 }}>{data.credits.elective}</div>
            <div style={{ fontWeight: 800, marginTop: 4, fontSize: 13 }}>專業選修學分</div>
          </Panel>
          <Panel variant="inkbg" style={{ padding: "14px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 44, color: "var(--accent-yellow)", lineHeight: 1 }}>{data.credits.total}</div>
            <div style={{ fontWeight: 800, marginTop: 4, fontSize: 13 }}>畢業總學分</div>
          </Panel>
        </div>

        {/* 主地圖 */}
        <div className="curriculum-map" style={{ marginTop: 20 }}>
          {/* 圖例 */}
          <div className="curriculum-legend">
            <div className="lg-item"><span className="lg-dot core" /><strong>專業必修主幹</strong></div>
            <div className="lg-item"><span className="lg-dot anim" />動畫創作軸線</div>
            <div className="lg-item"><span className="lg-dot game" />遊戲開發軸線</div>
            <div className="lg-item"><span className="lg-dot art" />原創美術軸線</div>
            <div className="lg-item"><span className="lg-dot cross" />跨域整合軸線</div>
            <div className="lg-item"><span className="lg-mark">▲</span>畢業專題（必修）</div>
            <div className="lg-item"><span className="lg-mark">★</span>校外實習</div>
          </div>

          {/* 課程矩陣 */}
          <div className="curriculum-scroll">
            <div className="curriculum-grid">
              {/* 學期標頭 */}
              <div className="cm-header">
                <div className="cm-corner">時序 ／ TIMELINE</div>
                {data.semesters.map((s, i) => (
                  <div key={i} className={"cm-sem" + (yearStartIdx.has(i) ? " year-start" : "")}>
                    {yearStartIdx.has(i) && <div className="cm-year">{s.year}</div>}
                    <div className="cm-term">{s.term}</div>
                  </div>
                ))}
              </div>

              {/* 軌道列 */}
              {data.tracks.map(track => (
                <div key={track.key} className={`cm-track t-${track.key}`}>
                  <div className="cm-label">
                    <div className="cm-name">{track.name}</div>
                    <div className="cm-name-en">{track.nameEn}</div>
                    <div className="cm-desc">{track.desc}</div>
                  </div>
                  {track.courses.map((semCourses, i) => (
                    <div key={i} className={"cm-cell" + (yearStartIdx.has(i) ? " year-start" : "")}>
                      {semCourses.map((c, j) => (
                        <div key={j} className={"cm-course" + (c.capstone ? " cm-capstone" : "")}>
                          <div className="cm-cname">
                            {c.mark && <span className="cm-mark">{c.mark}</span>}{c.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 流向 */}
          <div className="curriculum-flow">
            基礎累積 <span className="arrow">━━▶</span> 專業進階 <span className="arrow">━━▶</span> 整合應用 <span className="arrow">━━▶</span> <strong>畢業專題 ＋ 校外實習</strong>　／　可依興趣選擇主修 1–2 條軸線
          </div>

          {/* 註腳 */}
          <div className="curriculum-foot">
            <p><strong>學分規定：</strong>畢業總學分 {data.credits.total} 學分；系專業必修 {data.credits.required} 學分、系專業選修 {data.credits.elective} 學分（承認外院系專業課程 20 學分，不含通識學分）。</p>
            <p><span className="mark">▲</span> 畢業專題：專題設計 I、II 均為必修，依「樹德科技大學動畫與遊戲設計系畢業專題研究展演實施辦法」辦理。<span className="mark">★</span> 校外實習 {data.credits.internshipHours} 小時為畢業條件之一。</p>
            <p><strong>軸線使用說明：</strong>四條選修軸線為學習方向建議，非強制分流；學生可依職涯目標自由跨軸選修，建議至少深耕一條主軸以建立個人專業識別。</p>
          </div>
        </div>

        {/* 下一步 CTA */}
        <div className="comic-tier tier-1-1 tier-short" style={{ marginTop: 28 }}>
          <Panel clickable variant="red" style={{ padding: 24, textAlign: "center" }}
            onClick={() => { window.location.hash = "#join"; }}>
            <div className="h-display" style={{ fontSize: 26, color: "#fff" }}>看招生管道</div>
            <div style={{ fontSize: 13, color: "#fff", marginTop: 6, opacity: 0.85 }}>申請入學 · 甄選入學 · 科技繁星 · 技優甄審 · 登記分發</div>
          </Panel>
          <Panel clickable variant="yellow" style={{ padding: 24, textAlign: "center" }}
            onClick={() => { window.location.hash = "#/admission/visit"; }}>
            <div className="h-display" style={{ fontSize: 26 }}>預約一日參訪</div>
            <div style={{ fontSize: 13, marginTop: 6, opacity: 0.85 }}>實地走訪實驗室 · 與系主任面談</div>
          </Panel>
        </div>
      </div>
    </section>
  );
};

// =========================================================
// Detail dispatcher
// =========================================================
const DetailView = ({ type, slug }) => {
  React.useEffect(() => { window.scrollTo(0, 0); }, [type, slug]);
  switch (type) {
    case "news":     return <NewsDetail slug={slug} />;
    case "faculty":  return <FacultyDetail slug={slug} />;
    case "labs":     return <LabDetail slug={slug} />;
    case "works":    return <WorksDetail slug={slug} />;
    case "admission":return <AdmissionDetail slug={slug} />;
    case "videos":   return <VideoDetail slug={slug} />;
    case "stats":    return <StatsDetail slug={slug} />;
    case "en":       return <EnglishDetail slug={slug} />;
    case "curriculum": return <CurriculumDetail />;
    default:         return <NotFound type={type} slug={slug} />;
  }
};

Object.assign(window, { useHashRoute, localHref, DetailView, useDataset });
