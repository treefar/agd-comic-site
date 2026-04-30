/* App + Tweaks */
const { useState: u, useEffect: ue } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "style": "shonen",
  "halftone": true,
  "speedlines": true,
  "sfx": true,
  "borderWidth": 5,
  "accentRed": "#e63946",
  "accentBlue": "#1d4ed8",
  "accentYellow": "#ffd60a",
  "paperColor": "#f4ecd8"
}/*EDITMODE-END*/;

function applyStyleVars(t) {
  const r = document.documentElement.style;
  r.setProperty("--accent-red", t.accentRed);
  r.setProperty("--accent-blue", t.accentBlue);
  r.setProperty("--accent-yellow", t.accentYellow);
  r.setProperty("--paper", t.paperColor);
  r.setProperty("--bw", t.borderWidth + "px");

  // 隱藏狀聲詞
  document.querySelectorAll(".sfx").forEach((el) => {
    el.style.display = t.sfx ? "" : "none";
  });
  // 隱藏網點 / 集中線
  document.querySelectorAll(".bg-halftone-light, .bg-halftone-dense, .bg-halftone-red, .bg-halftone-blue").forEach((el) => {
    el.style.backgroundImage = t.halftone ? "" : "none";
  });
  document.querySelectorAll(".bg-speedlines").forEach((el) => {
    el.style.display = t.speedlines ? "" : "none";
  });

  // 風格切換 — 改變 paper / 邊框
  document.body.classList.remove("style-shonen", "style-novel", "style-webtoon");
  document.body.classList.add("style-" + t.style);

  if (t.style === "novel") {
    r.setProperty("--paper", "#1a1714");
    document.body.style.color = "#f4ecd8";
  } else if (t.style === "webtoon") {
    r.setProperty("--paper", "#fafafa");
    document.body.style.color = "#0f0d0a";
  } else {
    r.setProperty("--paper", t.paperColor);
    document.body.style.color = "";
  }
}

const App = () => {
  const [tweaks, setTweaks] = u(TWEAKS_DEFAULTS);

  ue(() => {
    applyStyleVars(tweaks);
    window.parent.postMessage({ slideIndexChanged: 0 }, "*");
  }, [tweaks]);

  // Tweaks panel protocol
  const [tweaksOpen, setTweaksOpen] = u(false);
  ue(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      else if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
  };

  // 路由：hash 形如 #/news/<slug>、#/faculty/<slug> 等 → 顯示詳情頁
  // 否則（包含 #news / #faculty 這類錨點）顯示完整首頁
  const route = useHashRoute();
  const isDetail = !!route.type;

  // 首頁初次載入 LOADING（讓動畫露面 1.5 秒），detail page 由各自 useDataset 處理
  const [bootLoading, setBootLoading] = u(true);
  ue(() => {
    const t = setTimeout(() => setBootLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // LOADING 結束後 / 從 detail 切回首頁後，補一次錨點滾動
  // （hash=#join 的初次載入時，章節元素還沒掛 DOM，useHashRoute 那邊 rAF 找不到 → 這裡再滾一次）
  ue(() => {
    if (bootLoading || isDetail) return;
    const hash = window.location.hash;
    if (!hash || hash.startsWith("#/")) return;
    const id = hash.slice(1);
    if (!id) return;
    // 多次重試 — bootLoading 結束後 layout 還在變化，先 50ms 試一次 + 600ms 再校正
    const t1 = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    const t2 = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // 若元素還沒貼近視窗頂端 → 再 snap 一次
      if (Math.abs(rect.top) > 100) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [bootLoading, isDetail]);

  // 全站攔截：所有 a[href="#X"] 錨點 → 完全自己接管
  // 用 window.scrollTo 替代 scrollIntoView — 後者在某些 chromium iframe / 沙盒環境會被 CSS smooth 卡住，前者更可靠
  // 重試是為了涵蓋初次載入 LOADING 期間元素還沒掛 DOM 的情況
  ue(() => {
    const scrollToId = (id) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      if (Math.abs(rect.top) <= 30) return true; // 已到位
      const targetY = rect.top + window.pageYOffset - 60; // 留 60px 給 sticky topnav
      window.scrollTo({ top: targetY, behavior: "instant" });
      return true;
    };
    const scrollWithRetry = (id) => {
      [0, 800, 1700].forEach(ms => setTimeout(() => scrollToId(id), ms));
    };
    const onClick = (e) => {
      const a = e.target.closest?.("a[href^='#']");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href || href === "#" || href.startsWith("#/")) return;
      const id = href.slice(1);
      e.preventDefault();
      // 同步更新 hash（讓 useHashRoute 也知道；若已相同就不會觸發 hashchange）
      if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
        // 手動派發 hashchange，讓 useHashRoute 也跟上（用通用 Event 確保跨瀏覽器）
        window.dispatchEvent(new Event("hashchange"));
      }
      scrollWithRetry(id);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (bootLoading && !isDetail) {
    return (
      <>
        <TopNav />
        <Loading />
        <GlobalClickFx />
      </>
    );
  }

  return (
    <>
      <TopNav />
      <GlobalClickFx />
      {isDetail ? (
        <DetailView type={route.type} slug={route.slug} />
      ) : (
        <>
          <HeroChapter />
          <NewsChapter />
          <AboutChapter />
          <WorksChapter />
          <FacultyChapter />
          <LabsChapter />
          <JoinChapter />
        </>
      )}
      <FooterChapter />

      {tweaksOpen && (
        <TweaksPanel onClose={() => {
          setTweaksOpen(false);
          window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
        }}>
          <TweakSection title="風格">
            <TweakRadio
              value={tweaks.style}
              options={[
                { value: "shonen", label: "少年漫" },
                { value: "novel", label: "Graphic Novel" },
                { value: "webtoon", label: "Webtoon" },
              ]}
              onChange={(v) => update({ style: v })}
            />
          </TweakSection>
          <TweakSection title="漫畫元素">
            <TweakToggle label="網點 Halftone" value={tweaks.halftone} onChange={(v) => update({ halftone: v })} />
            <TweakToggle label="集中線 Speed lines" value={tweaks.speedlines} onChange={(v) => update({ speedlines: v })} />
            <TweakToggle label="狀聲詞 SFX" value={tweaks.sfx} onChange={(v) => update({ sfx: v })} />
          </TweakSection>
          <TweakSection title="格框">
            <TweakSlider label="邊框粗細" min={2} max={10} step={1} value={tweaks.borderWidth} onChange={(v) => update({ borderWidth: v })} />
          </TweakSection>
          <TweakSection title="主色">
            <TweakColor label="熱血朱紅" value={tweaks.accentRed} onChange={(v) => update({ accentRed: v })} />
            <TweakColor label="遊戲寶藍" value={tweaks.accentBlue} onChange={(v) => update({ accentBlue: v })} />
            <TweakColor label="點題黃" value={tweaks.accentYellow} onChange={(v) => update({ accentYellow: v })} />
            <TweakColor label="紙底色" value={tweaks.paperColor} onChange={(v) => update({ paperColor: v })} />
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
