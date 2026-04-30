/* 漫畫格元件 — 樹德動遊系 */
const { useState, useEffect, useRef } = React;

// 圖片占位 — 給 src 就直接顯示真圖（保留漫畫格邊框感）；src 載入失敗時自動切到 fallback
const PH = ({ label = "image", className = "", src, fallback, alt, fit = "cover", pos = "center" }) => {
  const [current, setCurrent] = useState(src);
  React.useEffect(() => { setCurrent(src); }, [src]);
  if (current) {
    return (
      <div className={`placeholder-img ${className}`} style={{ background: "var(--ink)", overflow: "hidden", padding: 0 }}>
        <img
          src={current}
          alt={alt || label}
          loading="lazy"
          onError={() => { if (fallback && current !== fallback) setCurrent(fallback); }}
          style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: pos, display: "block" }}
        />
      </div>
    );
  }
  return (
    <div className={`placeholder-img ${className}`}>
      <span>◢ {label}</span>
    </div>
  );
};

// 對話框
const Bubble = ({ children, variant = "", style = {}, className = "" }) => (
  <div className={`bubble ${variant} ${className}`} style={style}>{children}</div>
);

// 狀聲詞 — 預設帶 wobble 動畫，可用 anim 屬性切換
const SFX = ({ children, color = "red", rotate = -8, size = 64, anim = "wobble", style = {}, className = "" }) => (
  <span
    className={`sfx sfx--${color} ${anim ? `sfx--anim-${anim}` : ""} ${className}`}
    style={{ fontSize: size, transform: `rotate(${rotate}deg)`, "--r": `${rotate}deg`, ...style }}
  >
    {children}
  </span>
);

// 章節標籤
const ChapterTag = ({ num, title, jp }) => (
  <div className="chapter-header">
    <div className="chapter-tag">
      <span>第</span><span className="num">{num}</span><span>話</span>
    </div>
    <div className="title h-display">{title}</div>
    {jp && <div className="sub">— {jp} —</div>}
  </div>
);

// 螢光墨水色盤 — 純粹 neon/highlighter 感（移除太飽合的純色）
const INK_PALETTE = [
  "#d4ff3a",  // 螢光黃綠（highlighter yellow）
  "#5cff7a",  // 螢光薄荷綠
  "#7df9ff",  // 螢光淡青（highlighter cyan）
  "#ff8fc8",  // 螢光淡粉（highlighter pink）
  "#ffb347",  // 螢光柔橘（highlighter orange）
];

// Web Audio：合成噴墨音效（不需音檔，純 oscillator + noise）
let _audioCtx = null;
const playSplatSound = () => {
  try {
    _audioCtx = _audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (_audioCtx.state === "suspended") _audioCtx.resume();
    const ctx = _audioCtx;
    const t = ctx.currentTime;
    // 1. 下滑音 → 噴出感
    const osc = ctx.createOscillator();
    const oGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(720 + Math.random() * 200, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.18);
    oGain.gain.setValueAtTime(0.18, t);
    oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(oGain).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.25);
    // 2. 短噪音 → 墨水濺裂質感
    const len = Math.floor(ctx.sampleRate * 0.13);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const nGain = ctx.createGain();
    nGain.gain.value = 0.10;
    // 用 lowpass 過濾，避免太刺耳
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 2400;
    noise.connect(lp).connect(nGain).connect(ctx.destination);
    noise.start(t);
  } catch (e) { /* 靜音降級 */ }
};

// 程序生成 Splatoon 風墨滴：圓潤水滴感 + 0-2 條溫和暈染
const generateSplatShape = () => {
  // 24 個外緣點 → 非常平滑的圓形基底
  const numPts = 24;
  // 0-2 個暈染突起（多數情況沒有或只有一條 → 像水珠）
  const dripCount = Math.floor(Math.random() * 3); // 0, 1 or 2
  const dripIndices = new Set();
  while (dripIndices.size < dripCount) {
    dripIndices.add(Math.floor(Math.random() * numPts));
  }
  const points = [];
  for (let i = 0; i < numPts; i++) {
    const angle = (i / numPts) * Math.PI * 2;
    let r;
    if (dripIndices.has(i)) {
      // 暈染：溫和地突出（不像尖刺，像水珠的鼓起）
      r = 36 + Math.random() * 8; // 36-44
    } else {
      // 圓形核心：半徑微幅波動（27-31）保持圓潤水滴感
      r = 27 + Math.random() * 4;
    }
    points.push([
      50 + Math.cos(angle) * r,
      50 + Math.sin(angle) * r,
    ]);
  }
  // Catmull-Rom → 三次貝茲，產生超平滑曲線（水滴感比 Q-curve 好很多）
  const tension = 1.0;
  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length; i++) {
    const p0 = points[(i - 1 + points.length) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];
    // 控制點 = p1 + (p2-p0)/6, p2 - (p3-p1)/6
    const c1x = p1[0] + (p2[0] - p0[0]) * tension / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) * tension / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) * tension / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) * tension / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  d += " Z";
  // 周圍 0-2 個飛濺小斑點（密度降低）
  const speckCount = Math.floor(Math.random() * 3);
  const specks = Array.from({ length: speckCount }, () => {
    const a = Math.random() * Math.PI * 2;
    const dist = 45 + Math.random() * 28;
    return {
      cx: 50 + Math.cos(a) * dist,
      cy: 50 + Math.sin(a) * dist,
      r: 1.5 + Math.random() * 3,
    };
  });
  return { d, specks };
};

// 產生一組墨滴 — 同色，第 1 顆主滴位於滑鼠中心，其餘呈放射狀向外擴散
const makeSplats = (range = 95, [minN, maxN] = [2, 3]) => {
  const n = minN + Math.floor(Math.random() * (maxN - minN + 1));
  // ★ 一次點擊只用一個顏色（在這裡選定）
  const color = INK_PALETTE[Math.floor(Math.random() * INK_PALETTE.length)];
  // 起始角度隨機，後續均分一圈，營造放射感
  const startAngle = Math.random() * Math.PI * 2;
  return Array.from({ length: n }, (_, i) => {
    if (i === 0) {
      // 主滴 — 落在滑鼠中心，較大
      return {
        id: i,
        color,
        dx: 0,
        dy: 0,
        size: 52 + Math.random() * 14, // 52-66
        rot: Math.random() * 360,
        delay: 0,
        shape: generateSplatShape(),
      };
    }
    // 周圍衛星滴 — 沿圓周均分，徑向距離隨機
    const angle = startAngle + ((i - 1) / Math.max(1, n - 1)) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const dist = range * (0.55 + Math.random() * 0.45); // 約 0.55-1.0 倍 range
    return {
      id: i,
      color,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      size: 22 + Math.random() * 22, // 衛星滴較小：22-44
      rot: Math.random() * 360,
      delay: 30 + Math.random() * 60, // 衛星稍晚一點抵達
      shape: generateSplatShape(),
    };
  });
};

// === 狀聲詞詞庫（給 Panel 跟 GlobalClickFx 共用） ===
const POPS = [
  "碰！","砰！","咚！","轟！","喀！","啪！","鏘！","叮！","噹！","登登！","登愣！",
  "嘩！","刷！","咻！","唰！","噠噠噠！","咕嘟！","嗡嗡！","閃！","爆！","炸！",
  "畫！","想！","做！","成！","耶！","讚！","哇！","哦！","來！","上！","衝！",
  "轟隆隆！","嘎嘎嘎！","劈哩啪啦！","咻咻！","碰碰！",
  // 流行用語
  "GO！","YES！","WOW！","OMG！","NICE！","LET'S GO！","COOL！","EPIC！",
  "蹦！","啊哈！","好欸！","太神啦！","欸嘿！","好耶！","DOPE！","SLAY！",
  "嘿嘿！","咩噗！","嗶嗶！","噔噔！","嘿呦！","就是這個！","起飛！","狂！",
  "香！","好料！"
];

// === 全域點擊特效 — 3-zone 邏輯 ===
// Zone A（功能性元件） → 完全無效果：a / button / topnav / 標題 / chapter-tag / chapter-header
// Zone B（圖片）       → 噴墨：img / .placeholder-img / [data-fx='splat']
// Zone C（其他區塊）   → 狀聲詞：一般 div / 非 clickable Panel
// 例外：clickable Panel 由 Panel.handle 內部處理狀聲詞 + shake 動畫，全域不重複觸發
const GlobalClickFx = () => {
  const [splats, setSplats] = React.useState([]);
  const [sfxs, setSfxs] = React.useState([]);
  React.useEffect(() => {
    const onClick = (e) => {
      // 表單元素不打擾
      if (e.target.matches?.("input, textarea, select, [contenteditable='true']")) return;

      // ZONE A — 純功能元件 / 標題 / 選單 → 無任何效果，避免干擾功能性
      if (e.target.closest?.(
        "a[href], button, [role='button'], " +
        ".topnav, .chapter-tag, .chapter-header, " +
        ".h-display, .h-jojo, .hero-tagline, " +
        "[data-no-fx='true'], [data-no-splat='true']"
      )) return;

      // ZONE B — 圖片 → 噴墨
      if (e.target.closest?.("img, .placeholder-img, [data-fx='splat']")) {
        const id = Date.now() + "-s-" + Math.random();
        const isMobile = window.matchMedia?.("(max-width: 760px)").matches;
        const splatList = isMobile ? makeSplats(60, [2, 2]) : makeSplats(80, [3, 4]);
        setSplats(prev => [...prev, { id, x: e.clientX, y: e.clientY, splats: splatList }]);
        playSplatSound();
        setTimeout(() => setSplats(prev => prev.filter(f => f.id !== id)), 900);
        return;
      }

      // ZONE C — 其他區塊 → 狀聲詞
      // clickable Panel 自有狀聲詞 + shake，全域跳過避免雙重出現
      if (e.target.closest?.(".is-clickable")) return;

      const id = Date.now() + "-w-" + Math.random();
      const word = POPS[Math.floor(Math.random() * POPS.length)];
      const rot = Math.random() * 16 - 8;
      setSfxs(prev => [...prev, { id, x: e.clientX, y: e.clientY, word, rot }]);
      setTimeout(() => setSfxs(prev => prev.filter(s => s.id !== id)), 600);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return (
    <>
      {/* 噴墨層 */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
        {splats.flatMap(fx => fx.splats.map(s => (
          <div key={fx.id + "-" + s.id} style={{
            position: "fixed",
            left: fx.x + s.dx - s.size / 2,
            top: fx.y + s.dy - s.size / 2,
            width: s.size,
            height: s.size,
            transform: `rotate(${s.rot}deg)`,
            pointerEvents: "none",
          }}>
            <div className="ink-splat-anim" style={{ animationDelay: `${s.delay}ms`, width: "100%", height: "100%", opacity: 0.55 }}>
              <svg viewBox="0 0 100 100" width="100%" height="100%" style={{
                overflow: "visible", display: "block",
                filter: `drop-shadow(0 0 3px ${s.color}99) drop-shadow(0 0 10px ${s.color}66)`
              }}>
                <path d={s.shape.d} fill={s.color} fillOpacity="0.78" />
                {s.shape.specks.map((sp, i) => (
                  <circle key={i} cx={sp.cx} cy={sp.cy} r={sp.r} fill={s.color} fillOpacity="0.7" />
                ))}
              </svg>
            </div>
          </div>
        )))}
      </div>
      {/* 狀聲詞層（fixed 跟著 viewport） */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998 }}>
        {sfxs.map(s => (
          <span key={s.id} className="click-sfx" style={{
            position: "fixed",
            left: s.x - 60,
            top: s.y - 40,
            "--r": `${s.rot}deg`
          }}>{s.word}</span>
        ))}
      </div>
    </>
  );
};

// === 彩蛋熱區 — 連點 N 次才會閃現巨大「彩蛋！」字樣，淡出 ===
// data-no-splat → 跟 GlobalClickFx 約定不放噴墨
// 預設 40px 圓形熱區（半徑 20px），放在父層 position:relative 的中心
// threshold = 10 → 要連點 10 下才觸發；觸發後重置計數，下次又要 10 下
const EasterEgg = ({ size = 40, label = "彩蛋！", threshold = 10, style = {} }) => {
  const [tick, setTick] = React.useState(0);    // 觸發次數（重啟動畫用）
  const countRef = React.useRef(0);
  const trigger = (e) => {
    e.stopPropagation();
    countRef.current += 1;
    if (countRef.current >= threshold) {
      countRef.current = 0;
      setTick(t => t + 1);
    }
  };
  return (
    <div
      data-no-splat="true"
      onClick={trigger}
      style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: size, height: size,
        borderRadius: "50%",
        cursor: "default",
        zIndex: 8,
        userSelect: "none",
        WebkitUserSelect: "none",
        ...style,
      }}
    >
      {tick > 0 && (
        <span key={tick} className="easter-egg-text">{label}</span>
      )}
    </div>
  );
};

// 漫畫格 — 通用容器
const Panel = ({
  children,
  className = "",
  variant = "",
  style = {},
  bg = "",
  clickable = false,
  rotate = 0,
  cut = "",
  onClick,
}) => {
  const [fx, setFx] = React.useState(null);
  const handle = (e) => {
    if (!clickable) return onClick && onClick(e);
    // 3-zone 對齊 GlobalClickFx：點圖片 / 標題 → Panel 不放狀聲詞（圖片由 Global 噴墨、標題完全 no effect），仍允許 navigation
    if (e.target.closest?.("img, .placeholder-img, [data-fx='splat'], .h-display, .h-jojo, .hero-tagline, .chapter-tag, .chapter-header, [data-no-fx='true']")) {
      if (onClick) onClick(e);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const word = POPS[Math.floor(Math.random()*POPS.length)];
    const r = (Math.random()*16 - 8);
    // Panel 只負責狀聲詞；墨水濺射由 GlobalClickFx 處理（每個 click 都觸發）
    setFx({ x, y, word, r, id: Date.now() });
    setTimeout(() => setFx(null), 600);
    // 延遲 onClick 讓狀聲詞顯示後再 navigate
    if (onClick) setTimeout(() => onClick(e), 400);
  };
  const clicked = fx ? "is-clicked" : "";

  if (cut) {
    return (
      <div
        className={`panel-cut cut--${cut} ${clickable ? "is-clickable" : ""} ${clicked} ${className}`}
        style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
        onClick={handle}
      >
        <div className={`panel-cut-inner ${variant ? `panel--${variant}` : ""} ${bg}`}>
          {children}
          {fx && <span className="click-speedlines" />}
          {fx && <span className="click-sfx" style={{ left: fx.x - 60, top: fx.y - 40, "--r": `${fx.r}deg` }}>{fx.word}</span>}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`panel ${variant ? `panel--${variant}` : ""} ${bg} ${clickable ? "is-clickable" : ""} ${clicked} ${className}`}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
      onClick={handle}
    >
      {children}
      {fx && <span className="click-speedlines" />}
      {fx && <span className="click-sfx" style={{ left: fx.x - 60, top: fx.y - 40, "--r": `${fx.r}deg` }}>{fx.word}</span>}
    </div>
  );
};

// 動線箭頭 (SVG)
const FlowArrow = ({ d, color = "#0f0d0a", style = {} }) => (
  <svg className="flow-arrow" viewBox="0 0 200 100" style={style}>
    <defs>
      <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
      </marker>
    </defs>
    <path d={d} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" markerEnd="url(#ar)" strokeDasharray="0" />
  </svg>
);

// Topnav — 選單採頁內錨點，點選即捲動到對應章節
const TopNav = () => {
  const items = [
    { label: "最新消息", href: "#news" },
    { label: "系所簡介", href: "#about" },
    { label: "作品成果", href: "#works" },
    { label: "師資陣容", href: "#faculty" },
    { label: "實驗室",   href: "#labs" },
    { label: "招生資訊", href: "#join" },
    { label: "聯絡我們", href: "#contact" },
  ];
  const [open, setOpen] = React.useState(false);
  // 點到 nav 內任何連結 → 自動關閉抽屜
  const closeOnNav = () => setOpen(false);
  // hash 變動（任何頁內跳轉）→ 自動關抽屜
  React.useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return (
    <header className={`topnav ${open ? "is-open" : ""}`} style={{ position: "sticky", top: 0 }}>
      <a href="#hero" className="brand" data-no-splat="true" onClick={closeOnNav} style={{ textDecoration: "none", color: "inherit", flexShrink: 0 }}>
        <span className="logo-mark">AGD</span>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, marginLeft: 4 }}>
          <span style={{ fontSize: 16, fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 900 }}>動畫與遊戲設計系</span>
          <span style={{ fontFamily: "'Bangers',sans-serif", color: "var(--accent-yellow)", fontSize: 11, letterSpacing: "0.06em", marginTop: 2 }}>SHU-TE · ANIMATION & GAME DESIGN</span>
        </div>
      </a>
      <nav onClick={closeOnNav}>
        {items.map((it) => (
          <a key={it.href} href={it.href}>{it.label}</a>
        ))}
        {/* 語言切換 — 放在 nav 尾端，跟一般選單視覺一致，但加一條短直線分隔 */}
        <span aria-hidden="true" className="nav-divider" style={{
          display: "inline-block", width: 2, height: 16, background: "var(--paper)",
          opacity: 0.4, alignSelf: "center"
        }} />
        <a href="#/en/intro" title="English introduction for international students" style={{
          color: "var(--accent-yellow)", letterSpacing: "0.08em",
          fontFamily: "'Bangers',sans-serif", fontWeight: 900
        }}>🌐 EN</a>
      </nav>
      {/* 漢堡按鈕：只在 ≤760px 顯示（CSS 控制） */}
      <button
        className="hamburger"
        aria-label={open ? "關閉選單" : "開啟選單"}
        aria-expanded={open}
        data-no-splat="true"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
      >
        <span /><span /><span />
      </button>
      <a href="#join" title="查看所有招生管道 — 高中申請 / 科技繁星 / 技優甄選 / 甄選入學 / 特殊選才" style={{
        background: "var(--accent-red)", color: "#fff", padding: "8px 14px",
        textDecoration: "none", border: "3px solid var(--paper)",
        boxShadow: "3px 3px 0 var(--paper)", fontFamily: "'Noto Sans TC',sans-serif",
        fontWeight: 900, fontSize: 14, letterSpacing: "0.04em", transform: "rotate(-2deg)"
      }}>立即報名 →</a>
    </header>
  );
};

// 章節之間的「翻頁」CTA — 可點 anchor / hash route
// to: 目的 anchor 或 hash（"#about" 或 "#/news/123"）
// num: 下一話的編號 ("03")
// title: 下一話標題 ("第三話 — 我們在做什麼")
// hint: 上方小字提示 ("讀完了嗎?" / 預設 "READ NEXT")
const ChapterNext = ({ to, num, title, hint = "READ NEXT", currentLabel }) => (
  <a
    href={to}
    style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      gap: 20, padding: "10px 14px", borderTop: "3px dashed var(--ink)",
      fontFamily: "'Bangers',sans-serif", letterSpacing: "0.1em",
      fontSize: 14, marginTop: 8,
      textDecoration: "none", color: "var(--ink)",
      background: "transparent", transition: "background 0.15s",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-yellow)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
  >
    <span>{hint} →</span>
    {currentLabel && <span style={{ opacity: 0.5 }}>{currentLabel}</span>}
    <span style={{
      background: "var(--ink)", color: "var(--paper)",
      padding: "6px 14px", border: "3px solid var(--ink)",
      boxShadow: "3px 3px 0 var(--accent-red)",
      transform: "rotate(-1deg)"
    }}>
      第 {num} 話 · {title} ↘
    </span>
  </a>
);

Object.assign(window, { PH, Bubble, SFX, ChapterTag, Panel, FlowArrow, TopNav, ChapterNext, GlobalClickFx });
