/* 英文版頁面；本次公開發布不含試玩區。 */

// 顯示用：拿掉 [CHECK] 與含中文的括號註記
const enText = (s) =>
  String(s ?? "")
    .replace(/\s*\[CHECK\]/g, "")
    .replace(/\s*\((?=[^()]*[㐀-鿿])[^()]*\)/g, "")
    .replace(/\s*（[^（）]*）/g, "")
    .replace(/《([^《》]*[㐀-鿿][^《》]*)》/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const EN_NAV = [
  { slug: "intro", label: "Home" },
  { slug: "highlights", label: "Highlights" },
  { slug: "faculty", label: "Faculty" },
  { slug: "curriculum", label: "Curriculum" },
  { slug: "labs", label: "Labs" },
  { slug: "works", label: "Student Works" },
  { slug: "visit", label: "Visit & Contact" },
];

const enPill = (active) => ({
  display: "inline-block", padding: "6px 12px", textDecoration: "none",
  fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 15,
  color: active ? "#fff" : "var(--ink)",
  background: active ? "var(--accent-red)" : "var(--paper)",
  border: "3px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
});

const EnSubNav = ({ current }) => (
  <nav aria-label="English site sections" style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "0 0 24px" }}>
    {EN_NAV.map((n) => (
      <a key={n.slug} href={`#/en/${n.slug}`} data-no-splat="true" style={enPill(n.slug === current)}
        aria-current={n.slug === current ? "page" : undefined}>{n.label}</a>
    ))}
    <a href="#" data-no-splat="true" style={{ ...enPill(false), background: "var(--ink)", color: "var(--paper)" }}>中文版 →</a>
  </nav>
);

const EnFrame = ({ current, title, sub, children }) => (
  <section className="chapter" id={`en-${current}`} lang="en">
    <div className="container">
      <BackBar label="HOME" right="SHU-TE AGD — ENGLISH" />
      <DetailHeader tag="EN" title={title} sub={sub} />
      <EnSubNav current={current} />
      {children}
    </div>
  </section>
);

const EnKicker = ({ children, color = "var(--accent-red)" }) => (
  <div style={{ fontFamily: "'Bangers',sans-serif", fontSize: 14, color, letterSpacing: "0.1em", marginBottom: 8 }}>{children}</div>
);

const enDetailsStyle = { marginTop: 10, fontSize: 13, lineHeight: 1.7 };
const enSummaryStyle = { cursor: "pointer", fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", fontSize: 14 };

// ---------------------------------------------------------
// Highlights — 中文首頁的有趣重點（數字取自首頁與 stats.json）
// ---------------------------------------------------------
const EN_FACTS = [
  { n: "2006", u: "", t: "Founded as Taiwan's first Department of Digital Game Design; renamed Animation & Game Design in 2011", to: "#/en/intro" },
  { n: "13", u: "FACULTY", t: "Industry-experienced teachers, 15+ years in the field on average", to: "#/en/faculty" },
  { n: "12", u: "LABS", t: "Motion capture, VR / body-sensing, stop-motion, 3D printing and more", to: "#/en/labs" },
  { n: "811", u: "CERTIFICATES", t: "Earned by students in AY 109–113 (Adobe, Autodesk, Unity and more)", to: "#/en/highlights" },
  { n: "90+", u: "AWARDS", t: "Student competition awards across 5 academic years", to: "#/en/works" },
  { n: "9th", u: "COHORT", t: "Japan internship with Hautecouture Inc. (MOE program)", to: "#/en/visit" },
  { n: "94%", u: "EMPLOYED", t: "Average graduate employment ratio, AY 109–112 (MOE graduate tracking survey)", to: "#/en/visit", hot: true },
];

const EnHighlights = () => {
  const news = useDataset("en/news");
  const stats = useDataset("en/stats");
  if (!news || !stats) return <Loading />;
  const awards = (Array.isArray(stats) ? stats : []).find((s) => s.slug === "awards");
  const bars = (awards?.highlights || []).filter((h) => typeof h.count === "number");
  const max = Math.max(1, ...bars.map((b) => b.count));
  return (
    <EnFrame current="highlights" title="WHY IT'S FUN HERE" sub="QUICK FACTS · NEWS · AWARDS">
      <div className="comic-tier tier-1">
        <Panel variant="" bg="bg-halftone-light" style={{ padding: 22 }}>
          <EnKicker>BY THE NUMBERS</EnKicker>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {EN_FACTS.map((f, i) => (
              <a key={i} href={f.to} style={{
                display: "block", textDecoration: "none", padding: "12px 14px",
                background: f.hot ? "var(--accent-red)" : "var(--paper)", color: f.hot ? "#fff" : "var(--ink)",
                border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)",
              }}>
                <span style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 34, lineHeight: 1 }}>{f.n}</span>
                <span style={{ fontFamily: "'Bangers',sans-serif", fontSize: 13, letterSpacing: "0.1em", marginLeft: 6 }}>{f.u}</span>
                <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.45, marginTop: 6 }}>{f.t}</div>
              </a>
            ))}
          </div>
        </Panel>
      </div>

      {bars.length > 0 && (
        <div className="comic-tier tier-1">
          <Panel variant="inkbg" style={{ padding: 22 }}>
            <EnKicker color="var(--accent-yellow)">STUDENT AWARDS PER ACADEMIC YEAR</EnKicker>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 180, paddingTop: 10 }}>
              {bars.map((b, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ fontFamily: "'Bowlby One',sans-serif", color: "var(--accent-yellow)", fontSize: 20 }}>{b.count}</div>
                  <div style={{ width: "100%", maxWidth: 70, height: `${(b.count / max) * 120}px`, background: "var(--accent-yellow)", border: "3px solid var(--paper)" }} />
                  <div style={{ color: "var(--paper)", fontSize: 12, fontWeight: 800, textAlign: "center" }}>{enText(b.year)}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      <div className="comic-tier tier-1">
        <Panel variant="" style={{ padding: 22 }}>
          <EnKicker>LATEST NEWS</EnKicker>
          <div style={{ display: "grid", gap: 12 }}>
            {news.slice(0, 10).map((p) => (
              <details key={p.slug || p.id} style={{ border: "3px solid var(--ink)", padding: "10px 14px", background: "var(--paper)", boxShadow: "3px 3px 0 var(--ink)" }}>
                <summary style={{ cursor: "pointer", listStyle: "revert" }}>
                  <span style={{ fontFamily: "'Bangers',sans-serif", letterSpacing: "0.08em", color: "var(--accent-red)", marginRight: 8 }}>{enText(p.tag)}</span>
                  <span style={{ fontSize: 12, opacity: 0.6, marginRight: 8 }}>{p.date}</span>
                  <b style={{ fontSize: 15 }}>{enText(p.title)}</b>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{enText(p.excerpt)}</div>
                </summary>
                <div style={{ ...enDetailsStyle, whiteSpace: "pre-wrap" }}>{enText(p.content)}</div>
              </details>
            ))}
          </div>
        </Panel>
      </div>
    </EnFrame>
  );
};

// ---------------------------------------------------------
// Faculty
// ---------------------------------------------------------
const EnList = ({ title, items }) => {
  const list = (Array.isArray(items) ? items : items ? [items] : []).filter(Boolean);
  if (!list.length) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontWeight: 900, fontSize: 12, letterSpacing: "0.06em" }}>{title}</div>
      <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
        {list.map((x, i) => (
          <li key={i}>{typeof x === "object" ? enText([x.year, x.title, x.venue].filter(Boolean).join(" · ")) : enText(x)}</li>
        ))}
      </ul>
    </div>
  );
};

const EnFaculty = () => {
  const data = useDataset("en/faculty");
  if (!data) return <Loading />;
  return (
    <EnFrame current="faculty" title="MEET THE FACULTY" sub={`${data.length} TEACHERS · ANIMATION · GAMES · ART`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
        {data.map((f) => (
          <Panel key={f.slug} variant="" style={{ padding: 16, display: "flex", flexDirection: "column" }}>
            <img src={f.photo} alt={f.en} loading="lazy"
              onError={(e) => { if (f.photoFallback && e.currentTarget.src !== f.photoFallback) e.currentTarget.src = f.photoFallback; }}
              style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", border: "3px solid var(--ink)", background: "#ddd" }} />
            <div className="h-display" style={{ fontSize: 22, marginTop: 10, lineHeight: 1.1 }}>{f.en}</div>
            <div style={{ fontSize: 12.5, fontWeight: 800, marginTop: 4, lineHeight: 1.45 }}>{enText(f.role)}</div>
            <div style={{ fontSize: 12.5, marginTop: 6, color: "var(--accent-blue)", fontWeight: 800 }}>{enText(f.spec)}</div>
            <details style={enDetailsStyle}>
              <summary style={enSummaryStyle}>PROFILE ▸</summary>
              <EnList title="EDUCATION" items={enText(f.education) ? [f.education] : []} />
              <EnList title="COURSES" items={f.courses ? [f.courses] : []} />
              <EnList title="CERTIFICATIONS" items={f.certs ? [f.certs] : []} />
              <EnList title="ACHIEVEMENTS" items={f.achievements} />
              <EnList title="EXPERIENCE" items={f.experience} />
              <EnList title="SELECTED PUBLICATIONS" items={(f.papers || []).slice(0, 5)} />
              {f.email && <div style={{ marginTop: 8 }}>📧 <a href={`mailto:${f.email}`} style={{ color: "var(--ink)" }}>{f.email}</a> · ext. {f.ext}</div>}
            </details>
          </Panel>
        ))}
      </div>
    </EnFrame>
  );
};

// ---------------------------------------------------------
// Curriculum — 與中文課程地圖同版型（共用 CSS）
// ---------------------------------------------------------
const EnCurriculum = () => {
  const data = useDataset("en/curriculum");
  if (!data) return <Loading />;
  if (!data.tracks) return <NotFound type="curriculum" slug="en" />;
  const yearStartIdx = new Set([0, 2, 4, 6]);
  return (
    <EnFrame current="curriculum" title="CURRICULUM MAP" sub={enText(data.yearTag)}>
      <div className="comic-tier tier-1-1-1" style={{ minHeight: 0 }}>
        {[
          { v: "yellow", n: data.credits.required, t: "Required major credits" },
          { v: "red", n: data.credits.elective, t: "Elective major credits" },
          { v: "inkbg", n: data.credits.total, t: "Credits to graduate" },
        ].map((c, i) => (
          <Panel key={i} variant={c.v} style={{ padding: "14px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bowlby One',sans-serif", fontSize: 44, lineHeight: 1, color: c.v === "inkbg" ? "var(--accent-yellow)" : undefined }}>{c.n}</div>
            <div style={{ fontWeight: 800, marginTop: 4, fontSize: 13 }}>{c.t}</div>
          </Panel>
        ))}
      </div>
      <div className="curriculum-map" style={{ marginTop: 20 }}>
        <div className="curriculum-scroll">
          <div className="curriculum-grid">
            <div className="cm-header">
              <div className="cm-corner">TIMELINE</div>
              {data.semesters.map((s, i) => (
                <div key={i} className={"cm-sem" + (yearStartIdx.has(i) ? " year-start" : "")}>
                  {yearStartIdx.has(i) && <div className="cm-year">{enText(s.year)}</div>}
                  <div className="cm-term">{enText(s.term)}</div>
                </div>
              ))}
            </div>
            {data.tracks.map((track) => (
              <div key={track.key} className={`cm-track t-${track.key}`}>
                <div className="cm-label">
                  <div className="cm-name">{track.nameEn}</div>
                  <div className="cm-desc">{enText(track.desc)}</div>
                </div>
                {track.courses.map((semCourses, i) => (
                  <div key={i} className={"cm-cell" + (yearStartIdx.has(i) ? " year-start" : "")}>
                    {semCourses.map((c, j) => (
                      <div key={j} className={"cm-course" + (c.capstone ? " cm-capstone" : "")}>
                        <div className="cm-cname">{c.mark && <span className="cm-mark">{c.mark}</span>}{enText(c.name)}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="curriculum-flow">
          Foundations <span className="arrow">━━▶</span> Specialisation <span className="arrow">━━▶</span> Integration <span className="arrow">━━▶</span> <strong>Capstone + Internship</strong> / pick 1–2 streams that fit you
        </div>
        <div className="curriculum-foot">
          <p><strong>Credits:</strong> {data.credits.total} credits to graduate, including {data.credits.required} required and {data.credits.elective} elective major credits.</p>
          <p><span className="mark">▲</span> Capstone Project I and II are required. <span className="mark">★</span> A {data.credits.internshipHours}-hour off-campus internship is a graduation requirement.</p>
          <p><strong>Streams:</strong> the four elective streams are suggestions, not fixed tracks. Students may mix streams; we recommend going deep in at least one.</p>
        </div>
      </div>
    </EnFrame>
  );
};

// ---------------------------------------------------------
// Labs
// ---------------------------------------------------------
const EnLabs = () => {
  const data = useDataset("en/labs");
  if (!data) return <Loading />;
  return (
    <EnFrame current="labs" title="LABS & STUDIOS" sub={`${data.length} SPECIALIST SPACES`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {data.map((l) => (
          <Panel key={l.slug} variant="" style={{ padding: 14 }}>
            {l.photos?.[0] && <img src={l.photos[0]} alt={enText(l.name)} loading="lazy"
              style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", border: "3px solid var(--ink)" }} />}
            <div style={{ fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em", color: "var(--accent-red)", marginTop: 8 }}>{l.code} · {l.tagline}</div>
            <div className="h-display" style={{ fontSize: 20, lineHeight: 1.15 }}>{enText(l.name)}</div>
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.55, fontWeight: 700 }}>{enText(l.shortDesc)}</div>
            <details style={enDetailsStyle}>
              <summary style={enSummaryStyle}>MORE ▸</summary>
              <div style={{ whiteSpace: "pre-wrap" }}>{enText(l.content)}</div>
            </details>
          </Panel>
        ))}
      </div>
    </EnFrame>
  );
};

// ---------------------------------------------------------
// Student works + award archive
// ---------------------------------------------------------
const EnWorks = () => {
  const works = useDataset("en/works");
  const stats = useDataset("en/stats");
  const videos = useDataset("en/videos");
  if (!works || !stats || !videos) return <Loading />;
  const awards = (Array.isArray(stats) ? stats : []).find((s) => s.slug === "awards");
  return (
    <EnFrame current="works" title="STUDENT WORKS" sub="AWARDS · FILMS · GAMES">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {works.map((w) => (
          <Panel key={w.id} variant="" style={{ padding: 14 }}>
            {w.image && <img src={w.image} alt={enText(w.title)} loading="lazy"
              style={{ width: "100%", aspectRatio: "4 / 3", objectFit: w.imageFit || "cover", border: "3px solid var(--ink)", background: "#eee" }} />}
            <div style={{ fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em", color: "var(--accent-red)", marginTop: 8 }}>{w.year} · {enText(w.kind)}</div>
            <div className="h-display" style={{ fontSize: 19, lineHeight: 1.15 }}>{enText(w.title)}</div>
            <div style={{ fontSize: 13, fontWeight: 800, marginTop: 4 }}>{enText(w.award)}</div>
            <details style={enDetailsStyle}>
              <summary style={enSummaryStyle}>STORY ▸</summary>
              <div style={{ whiteSpace: "pre-wrap" }}>{enText(w.content)}</div>
            </details>
          </Panel>
        ))}
      </div>

      <div className="comic-tier tier-1" style={{ marginTop: 20 }}>
        <Panel variant="" bg="bg-halftone-light" style={{ padding: 22 }}>
          <EnKicker>WATCH & PLAY — STUDENT VIDEOS</EnKicker>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {videos.map((v) => (
              <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener"
                style={{ textDecoration: "none", color: "var(--ink)", border: "3px solid var(--ink)", background: "var(--paper)", boxShadow: "3px 3px 0 var(--ink)" }}>
                <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "6px 10px", fontSize: 13, fontWeight: 800 }}>{enText(v.title)}</div>
                <div style={{ padding: "0 10px 8px", fontSize: 11, opacity: 0.7 }}>{enText(v.category)}</div>
              </a>
            ))}
          </div>
        </Panel>
      </div>

      {awards && (
        <div className="comic-tier tier-1">
          <Panel variant="" style={{ padding: 22 }}>
            <EnKicker>{enText(awards.title)} — {enText(awards.subtitle)}</EnKicker>
            <div style={{ fontSize: 13, marginBottom: 10, lineHeight: 1.6 }}>{enText(awards.summary)}</div>
            {(awards.groups || []).map((g, i) => (
              <details key={i} style={{ ...enDetailsStyle, borderTop: "2px dashed var(--ink)", paddingTop: 8 }}>
                <summary style={enSummaryStyle}>{enText(g.year)} ▸</summary>
                <ul style={{ paddingLeft: 18, margin: "6px 0 0" }}>
                  {(g.items || []).map((it, k) => <li key={k}>{enText(it)}</li>)}
                </ul>
              </details>
            ))}
          </Panel>
        </div>
      )}
    </EnFrame>
  );
};

// ---------------------------------------------------------
// Visit & contact
// ---------------------------------------------------------
const EnVisit = () => {
  const data = useDataset("en/admission");
  if (!data) return <Loading />;
  const visit = (Array.isArray(data) ? data : []).find((a) => a.slug === "visit") || {};
  const c = visit.contact || {};
  return (
    <EnFrame current="visit" title="VISIT & CONTACT" sub="COME SEE THE LABS IN PERSON">
      <div className="comic-tier tier-1-2">
        <Panel variant="" bg="bg-halftone-blue" style={{ padding: 24 }}>
          <EnKicker>{enText(visit.schedule_short)}</EnKicker>
          <div className="h-display" style={{ fontSize: 28, marginBottom: 10, lineHeight: 1.1 }}>{enText(visit.title)}</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{enText(visit.summary)}</div>
          <div style={{ fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{enText(visit.content)}</div>
        </Panel>
        <Panel variant="yellow" style={{ padding: 22 }}>
          <EnKicker>ASK US ANYTHING</EnKicker>
          <div style={{ fontSize: 13, lineHeight: 1.9, fontWeight: 700 }}>
            {[c.advisor, c.assistant].filter(Boolean).map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div>{enText(p.name)} — {enText(p.title)}</div>
                <div>📧 <a href={`mailto:${p.email}`} style={{ color: "var(--ink)" }}>{p.email}</a> · ext. {p.ext}</div>
              </div>
            ))}
            {c.phone && <div>☎ +886-7-6158000</div>}
            {c.address && <div>📍 {enText(c.address)}</div>}
          </div>
          <a href="https://oia.stu.edu.tw/" target="_blank" rel="noopener" style={{ ...enPill(true), marginTop: 14 }}>INTERNATIONAL OFFICE (OIA) →</a>
        </Panel>
      </div>
    </EnFrame>
  );
};

// ---------------------------------------------------------
const EnglishDetail = ({ slug }) => {
  switch (slug) {
    case "intro": return <EnglishIntro />;
    case "highlights": return <EnHighlights />;
    case "faculty": return <EnFaculty />;
    case "curriculum": return <EnCurriculum />;
    case "labs": return <EnLabs />;
    case "works": return <EnWorks />;
    case "visit": return <EnVisit />;
    default: return <NotFound type="en" slug={slug} />;
  }
};
Object.assign(window, { EnglishDetail, EnSubNav, enText });
