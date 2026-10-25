/** @jsx siteCreateElement */
// Original poster files fill the comic panel; exact creator credits stay visible.
const StudentWorkDraw = () => {
  const catalog = useDataset('student-work-draw');
  const host = React.useRef(null), controller = React.useRef(null), updateEnvironment = React.useRef(() => {}), manualReduced = React.useRef(false);
  const [choice,setChoice] = React.useState(false), [failedImage,setFailedImage] = React.useState(null);
  // 調整模式：網址加 ?adjust=1 才啟用；草稿只存在這個瀏覽器（localStorage），確認後用「複製設定」交給網站資料。
  const [adjust,setAdjust] = React.useState(false), [drafts,setDrafts] = React.useState({});
  const draftKey = 'agd-poster-adjust-v1';
  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).get('adjust') !== '1') return;
    let saved = {};try {saved = JSON.parse(window.localStorage.getItem(draftKey) || '{}') || {};} catch (e) {}
    setDrafts(saved);setAdjust(true);
  },[]);
  const draftsRef = React.useRef(drafts); draftsRef.current = drafts; const dragRef = React.useRef(null);
  const updateDrafts = next => {setDrafts(next);try {window.localStorage.setItem(draftKey,JSON.stringify(next));} catch (e) {}};
  const [state,setState] = React.useState({phase:'preview',index:0,reduced:false,paused:false,visible:true,timerActive:false});
  const copy = {
    zh:{heading:'抽一件作品',loading:'正在載入學生作品…',error:'作品暫時無法讀取，請稍後重試。',preview:'八件學生作品・點一下，停下來看看',drawing:'慢慢停下來…',selected:'這次抽到',draw:'抽一件作品',again:'再抽一件',pause:'暫停輪播',resume:'繼續輪播',stop:'立即停格',view:'看完整作品',authors:'創作團隊',mentor:'指導老師',static:'靜態模式',imageError:'海報暫時無法載入，可由作品連結查看。',open:'查看作品：'},
    en:{heading:'Discover a student work',loading:'Loading student works…',error:'The works could not be loaded. Please try again later.',preview:'Eight student works · select one to explore',drawing:'Slowing down…',selected:'Your pick',draw:'Pick a work',again:'Pick another',pause:'Pause preview',resume:'Resume preview',stop:'Stop now',view:'View full work',authors:'Creators',mentor:'Faculty advisor',static:'Static mode',imageError:'The poster could not be loaded. Open the work to read more.',open:'View work: '},
    ja:{heading:'学生作品をひとつ選ぼう',loading:'学生作品を読み込んでいます…',error:'作品を読み込めませんでした。時間をおいてお試しください。',preview:'8つの学生作品・押すとひとつに止まります',drawing:'ゆっくり止まります…',selected:'今回の作品',draw:'作品を選ぶ',again:'もう一度選ぶ',pause:'プレビューを一時停止',resume:'プレビューを再開',stop:'今すぐ止める',view:'作品を詳しく見る',authors:'制作チーム',mentor:'指導教員',static:'静止モード',imageError:'ポスターを読み込めませんでした。リンクから作品をご覧ください。',open:'作品を見る：'}
  }[siteLanguage];
  React.useEffect(() => {
    if (!Array.isArray(catalog) || !catalog.length) return;
    const engine = StudentWorkDrawModel.create(catalog.length,setState);controller.current = engine;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');let inView = false;
    const sync = () => engine.environment(inView && !document.hidden,media.matches || manualReduced.current);
    const surface = host.current.querySelector('.swd-surface');
    const rect = surface.getBoundingClientRect();inView = rect.bottom > 0 && rect.top < window.innerHeight;sync();updateEnvironment.current = sync;
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {inView = entries[0].isIntersecting;sync();},{threshold:0.05});
    observer?.observe(surface);document.addEventListener('visibilitychange',sync);media.addEventListener?.('change',sync);
    // Preload the other posters one at a time, only after the page has loaded, so they never compete with the app bundle
    // (2026-10-25: preloading all 8 at once pushed DOMContentLoaded from 3 s to 40 s on simulated 4G).
    let preloadStopped = false;
    const preloadNext = i => {if (preloadStopped || i >= catalog.length) return;const img = new Image();img.decoding = 'async';img.onload = img.onerror = () => preloadNext(i + 1);img.src = catalog[i].image;};
    const startPreload = () => preloadNext(0);
    if (document.readyState === 'complete') startPreload();else window.addEventListener('load',startPreload,{once:true});
    // Desktop quick links appear from the second screen on: flag while more than half the window still shows the poster frame.
    const root = document.documentElement;
    const markHero = () => {const frame = host.current && host.current.closest('.hero-original-tier'), r = frame && frame.getBoundingClientRect();root.dataset.heroInView = r && r.bottom > window.innerHeight * 0.5 ? 'true' : 'false';};
    markHero();window.addEventListener('scroll',markHero,{passive:true});window.addEventListener('resize',markHero);
    return () => {preloadStopped = true;window.removeEventListener('load',startPreload);engine.destroy();controller.current = null;observer?.disconnect();window.removeEventListener('scroll',markHero);window.removeEventListener('resize',markHero);delete root.dataset.heroInView;document.removeEventListener('visibilitychange',sync);media.removeEventListener?.('change',sync);updateEnvironment.current = () => {};};
  },[catalog]);
  // 調整模式：引擎建立後才能停在目前這一張（宣告順序在引擎 effect 之後）。
  React.useEffect(() => { if (adjust && controller.current) controller.current.goto(state.index); }, [adjust, catalog]);
  // Desktop: move the title block and buttons beside the subject of the poster on screen (see StudentWorkDrawModel.layout).
  const lastPlan = React.useRef(null);
  // Layout effect: framing is applied before the new slide is painted, so it never shows with the previous crop first.
  (typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect)(() => {
    if (!Array.isArray(catalog) || !catalog.length) return;
    const place = animate => {
      const tier = host.current && host.current.closest('.hero-original-tier');
      if (!tier) return;
      const title = tier.querySelector('#hero-title'), focus = catalog[state.index] && catalog[state.index].focus, surface = host.current.querySelector('.swd-surface');
      if (!focus || window.innerWidth < 1181) {
        tier.removeAttribute('data-copy-side');tier.removeAttribute('data-actions');tier.removeAttribute('data-bubbles');tier.removeAttribute('data-tagline');tier.style.removeProperty('--hero-tagline-dx');tier.style.removeProperty('--hero-copy-w');tier.style.removeProperty('--hero-fit-h');if (title) title.style.removeProperty('font-size');
        surface.removeAttribute('data-fit');surface.removeAttribute('data-manual');tier.removeAttribute('data-fit');if (focus) surface.style.setProperty('--poster-y',focus.y+'%');lastPlan.current = null;return;
      }
      // Fill the first screen: the poster frame ends at the bottom of the window (460–1000px).
      const fitHeight = Math.round(Math.min(1000,Math.max(460,window.innerHeight - (tier.getBoundingClientRect().top + window.scrollY) - 16)));
      tier.style.setProperty('--hero-fit-h',fitHeight+'px');
      // Frame each poster so its protagonist stays whole (see StudentWorkDrawModel.compose), then lay the copy beside it.
      const frame = surface.getBoundingClientRect(), shot = StudentWorkDrawModel.compose(focus,frame.width,frame.height);
      surface.dataset.fit = shot.fit;tier.dataset.fit = shot.fit;surface.style.setProperty('--poster-y',shot.y+'%');
      const draft = adjust ? drafts[catalog[state.index].id] : undefined, manual = draft !== undefined ? (draft || null) : focus.manual;
      let extent = shot.x;
      if (manual) {
        const geometry = StudentWorkDrawModel.manualGeometry(manual,focus.ratio,frame.width,frame.height);
        surface.dataset.manual = 'true';
        for (const [name,value] of [['w',geometry.width],['h',geometry.height],['l',geometry.left],['t',geometry.top]]) surface.style.setProperty('--poster-'+name,value.toFixed(1)+'px');
        extent = StudentWorkDrawModel.remapExtent(focus.x,focus.ratio,frame.width,frame.height,geometry);
      } else surface.removeAttribute('data-manual');
      const plan = StudentWorkDrawModel.layout({x:extent},frame.width,0.035,220,manual && manual.side || null);
      tier.dataset.copySide = plan.side;tier.dataset.actions = plan.actions;
      if (focus.bubbles === 'top') tier.dataset.bubbles = 'top';else tier.removeAttribute('data-bubbles');
      // Optional per-poster: with the title on the left, the tagline box moves to the empty top-right corner of the frame.
      const taglineRight = focus.tagline === 'right' && plan.side === 'left', copyEl = tier.querySelector('.hero-original-copy');
      if (taglineRight && copyEl) {tier.dataset.tagline = 'right';tier.style.setProperty('--hero-tagline-dx',Math.round(frame.right - frame.width * 0.035 - plan.copyWidth - copyEl.getBoundingClientRect().left)+'px');}
      else {tier.removeAttribute('data-tagline');tier.style.removeProperty('--hero-tagline-dx');}
      tier.style.setProperty('--hero-copy-w',plan.copyWidth+'px');
      if (title) {
        title.style.removeProperty('font-size');title.style.setProperty('white-space','nowrap');title.style.setProperty('width','max-content');
        const natural = parseFloat(getComputedStyle(title).fontSize), lineWidth = title.getBoundingClientRect().width;
        title.style.removeProperty('white-space');title.style.removeProperty('width');
        let size = Math.max(40,Math.min(natural,Math.floor(natural*plan.copyWidth/lineWidth)));
        title.style.setProperty('font-size',size+'px','important');
        // A short window: shrink again until the title block plus the highlight bubbles under it fit in the frame (88%).
        const copyBox = tier.querySelector('.hero-original-copy'), bubbles = tier.querySelector('.hero-original-highlights'), limit = fitHeight * 0.88 - 32;
        const used = () => (bubbles ? bubbles.getBoundingClientRect().bottom : copyBox.getBoundingClientRect().bottom) - copyBox.getBoundingClientRect().top;
        for (let i = 0; i < 4 && copyBox && used() > limit && size > 40; i++) {
          size = Math.max(40,Math.floor(size * Math.max(0.6, limit / used())));
          title.style.setProperty('font-size',size+'px','important');
        }
      }
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || manualReduced.current, previous = lastPlan.current;
      lastPlan.current = plan;
      if (animate && !calm && tier.animate && previous && (previous.side !== plan.side || previous.copyWidth !== plan.copyWidth || previous.actions !== plan.actions)) {
        const dir = plan.side === 'left' ? -1 : 1, slide = side => [{opacity:0,transform:'translateX('+side*28+'px)'},{opacity:1,transform:'none'}], timing = {duration:320,easing:'ease-out'};
        tier.querySelector('.hero-original-copy')?.animate(slide(dir),timing);
        tier.querySelector('.hero-original-actions')?.animate(slide(plan.actions === 'stack' ? dir : -dir),timing);
      }
    };
    place(true);
    const onResize = () => place(false);
    window.addEventListener('resize',onResize);
    return () => window.removeEventListener('resize',onResize);
  },[catalog,state.index,adjust,drafts]);
  if (!catalog || !Array.isArray(catalog) || !catalog.length) return <section className="student-work-draw swd-loading" data-no-fx="true" data-no-splat="true" aria-label={copy.heading}><p data-language-choice="true" role="status">{catalog ? copy.error : copy.loading}</p></section>;
  const work = catalog[state.index] || catalog[0];
  // 這張目前的手動設定；沒有時從自動取景換算出起點，滑桿與拖曳才不會跳位置。
  const baseManual = (w, rect) => {
    const d = draftsRef.current[w.id], m = d !== undefined ? d : w.focus.manual;
    if (m) return { zoom: m.zoom || 1, cx: m.cx != null ? m.cx : 0.5, cy: m.cy != null ? m.cy : 0.5, ...(m.side ? { side: m.side } : {}) };
    const shot = StudentWorkDrawModel.compose(w.focus, rect.width, rect.height), vis = Math.min(1, rect.height * w.focus.ratio / rect.width);
    return { zoom: 1, cx: 0.5, cy: vis >= 1 ? 0.5 : +(shot.y / 100 * (1 - vis) + vis / 2).toFixed(3) };
  };
  const dragStart = event => {
    if (!adjust || window.innerWidth < 1181 || event.button > 0) return;
    const rect = event.currentTarget.getBoundingClientRect(), base = baseManual(work, rect), g0 = StudentWorkDrawModel.manualGeometry(base, work.focus.ratio, rect.width, rect.height);
    dragRef.current = { x: event.clientX, y: event.clientY, base, g0, rect, id: work.id, ratio: work.focus.ratio };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const dragMove = event => {
    const d = dragRef.current; if (!d) return;
    const cand = StudentWorkDrawModel.manualGeometry({ ...d.base, cx: d.g0.cx - (event.clientX - d.x) / d.g0.width, cy: d.g0.cy - (event.clientY - d.y) / d.g0.height }, d.ratio, d.rect.width, d.rect.height);
    updateDrafts({ ...draftsRef.current, [d.id]: { ...d.base, zoom: cand.zoom, cx: +((d.rect.width / 2 - cand.left) / cand.width).toFixed(3), cy: +((d.rect.height / 2 - cand.top) / cand.height).toFixed(3) } });
  };
  const dragEnd = () => { dragRef.current = null; };
  const title = work.title[siteLanguage], settled = state.phase === 'settled', drawing = state.phase === 'drawing';
  const linkProps = /^https?:/.test(work.href) ? {target:'_blank',rel:'noopener noreferrer'} : {};
  const names = work.authors.split(/\s*·\s*/).map((name,i) => <React.Fragment key={name}>{i > 0 && ' · '}<span className="swd-person" data-language-choice="true">{name}</span></React.Fragment>);
  const poster = failedImage === work.id ? <span className="swd-image-error" data-language-choice="true">{copy.imageError}</span> : <img className="swd-art" draggable="false" onDragStart={event => event.preventDefault()} src={work.image} alt={title} data-language-choice="true" width="320" height="420" decoding="async" onError={() => setFailedImage(work.id)} />;
  return <section ref={host} id="student-work-draw" className={'student-work-draw swd-'+state.phase} data-no-fx="true" data-no-splat="true" data-draw-phase={state.phase} data-draw-id={work.id} data-draw-timer={state.timerActive ? 'active' : 'idle'} data-draw-reduced={state.reduced ? 'true' : 'false'} aria-labelledby="student-work-draw-heading" onKeyDown={event => {if(event.key === 'Escape'){event.preventDefault();event.stopPropagation();controller.current?.stop();}}}>
    <figure>
      <div className="swd-surface" data-adjust={adjust ? 'true' : undefined} style={work.focus ? {'--poster-mx':work.focus.mobileX+'%'} : undefined} onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={dragEnd}>
      {settled && !adjust ? <a className="swd-poster" href={work.href} {...linkProps} data-language-choice="true" aria-label={copy.open+title}>{poster}</a> : <div className="swd-poster" aria-hidden="true">{poster}</div>}
      </div>
      <figcaption className="swd-console">
      <div className="swd-meta">
        <h2 id="student-work-draw-heading" data-language-choice="true">{copy.heading}</h2>
        <h3 data-language-choice="true">{title}</h3>
        <p className="swd-credits"><span data-language-choice="true">{copy.authors}：</span>{names}</p>
        {work.mentor && <p className="swd-mentor"><span data-language-choice="true">{copy.mentor}：</span><span data-language-choice="true">{work.mentor}</span></p>}
      </div>
      <div className="swd-interaction">
    <p className="swd-status" role="status" aria-live="polite" data-language-choice="true">{settled ? copy.selected+' · '+title : drawing ? copy.drawing : copy.preview}</p>
    <div className="swd-actions">
      <button id="student-work-draw-start" type="button" disabled={drawing} onClick={() => controller.current?.start()} data-language-choice="true">{settled ? copy.again : copy.draw}</button>
      {drawing ? <button id="student-work-draw-stop" type="button" onClick={() => controller.current?.stop()} data-language-choice="true">{copy.stop}</button> : settled ? <a id="student-work-draw-link" href={work.href} {...linkProps} data-language-choice="true">{copy.view} →</a> : <button id="student-work-draw-pause" type="button" onClick={() => controller.current?.togglePause()} data-language-choice="true">{state.paused ? copy.resume : copy.pause}</button>}
    </div>
    <label className="swd-motion"><input id="student-work-draw-static" type="checkbox" checked={choice || state.reduced} disabled={state.reduced && !choice} onChange={event => {manualReduced.current = event.target.checked;setChoice(event.target.checked);updateEnvironment.current();}} /><span data-language-choice="true">{copy.static}</span></label>
      </div>
      </figcaption>
    </figure>
    {adjust && createPortal(<StudentWorkAdjustPanel catalog={catalog} index={state.index} drafts={drafts} update={updateDrafts} controller={controller} baseManual={baseManual} surface={() => host.current && host.current.querySelector('.swd-surface')} />, document.body)}
  </section>;
};


// 調整模式面板（?adjust=1）：逐張手動調位置與大小；草稿存在本機瀏覽器，確認後複製設定交給網站資料。
const StudentWorkAdjustPanel = ({catalog,index,drafts,update,controller,baseManual,surface}) => {
  const work = catalog[index], desktop = typeof window !== 'undefined' && window.innerWidth >= 1181;
  const [note,setNote] = React.useState(''), [,resized] = React.useState(0);
  React.useEffect(() => {const again = () => resized(n => n + 1);window.addEventListener('resize',again);return () => window.removeEventListener('resize',again);},[]);
  const rect = () => { const e = surface(); return e ? e.getBoundingClientRect() : {width:1277,height:777}; };
  const draft = drafts[work.id], manual = draft !== undefined ? draft : work.focus.manual, shown = baseManual(work, rect());
  const set = patch => update({...drafts,[work.id]:{...shown,...patch}});
  const exportAll = () => {
    const out = {};
    for (const w of catalog) {
      const d = drafts[w.id], m = d !== undefined ? d : w.focus.manual;
      if (d === false) out[w.id] = null;
      else if (m) out[w.id] = {zoom:+(m.zoom || 1).toFixed(3),cx:+(m.cx != null ? m.cx : 0.5).toFixed(3),cy:+(m.cy != null ? m.cy : 0.5).toFixed(3),...(m.side ? {side:m.side} : {})};
    }
    return JSON.stringify(out,null,2);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(exportAll()); setNote('已複製，貼給 Claude 或存成檔案。'); } catch (e) { setNote('瀏覽器不讓程式複製，請在下方框內全選後自行複製。'); } };
  const download = () => { const url = URL.createObjectURL(new Blob([exportAll()],{type:'application/json'})), a = document.createElement('a'); a.href = url; a.download = 'poster-adjust.json'; a.click(); URL.revokeObjectURL(url); };
  const go = step => controller.current && controller.current.goto((index + step + catalog.length) % catalog.length);
  const row = {display:'flex',alignItems:'center',gap:8,margin:'6px 0'}, btn = {padding:'6px 10px',border:'2px solid #111',background:'#ffd60a',font:'inherit',fontWeight:800,cursor:'pointer'}, light = {...btn,background:'#f4ecd8'};
  const slider = (label,min,max,step,value,onChange,text) => <label style={row}><span style={{width:78}}>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={onChange} style={{flex:1}} disabled={!desktop} /><b style={{width:46,textAlign:'right'}}>{text}</b></label>;
  return <aside id="swd-adjust-panel" aria-label="海報調整模式" style={{position:'fixed',left:12,bottom:12,zIndex:2147483000,width:330,maxHeight:'calc(100vh - 24px)',overflow:'auto',padding:12,background:'#fffdf5',color:'#111',border:'3px solid #111',boxShadow:'4px 4px 0 #111',font:'14px/1.5 sans-serif'}}>
    <strong style={{fontSize:16}}>調整模式（只有你看得到）</strong>
    {!desktop && <p style={{color:'#b00020'}}>視窗寬度需要 1181px 以上才能調整（桌面版畫面）。</p>}
    <div style={row}><button type="button" style={light} onClick={() => go(-1)}>◀ 上一張</button><span style={{flex:1,textAlign:'center'}}>{index + 1} / {catalog.length}　{work.title.zh}</span><button type="button" style={light} onClick={() => go(1)}>下一張 ▶</button></div>
    <p style={{margin:'4px 0',fontSize:12}}>直接在海報上按住拖曳可移動位置；下面的拉桿可微調。放大最小 100%（不留空白）。</p>
    {slider('放大',100,300,1,Math.round(shown.zoom * 100),e => set({zoom:+(e.target.value / 100).toFixed(3)}),Math.round(shown.zoom * 100) + '%')}
    {slider('左右位置',0,100,0.5,+(shown.cx * 100).toFixed(1),e => set({cx:+(e.target.value / 100).toFixed(3)}),Math.round(shown.cx * 100))}
    {slider('上下位置',0,100,0.5,+(shown.cy * 100).toFixed(1),e => set({cy:+(e.target.value / 100).toFixed(3)}),Math.round(shown.cy * 100))}
    <label style={row}><span style={{width:78}}>標題位置</span><select value={shown.side || ''} onChange={e => { const next = {...shown}; if (e.target.value) next.side = e.target.value; else delete next.side; update({...drafts,[work.id]:next}); }} disabled={!desktop} style={{flex:1,font:'inherit',padding:4}}><option value="">自動</option><option value="left">靠左</option><option value="right">靠右</option></select></label>
    <div style={row}><button type="button" style={light} onClick={() => update({...drafts,[work.id]:false})}>還原成自動取景</button><button type="button" style={light} onClick={() => { const next = {...drafts}; delete next[work.id]; update(next); }}>放棄這張草稿</button></div>
    <div style={row}><button type="button" style={btn} onClick={copy}>複製全部設定</button><button type="button" style={light} onClick={download}>下載 JSON</button><button type="button" style={light} onClick={() => update({})}>清空草稿</button></div>
    {note && <p role="status" style={{margin:'4px 0',color:'#0a6'}}>{note}</p>}
    <textarea readOnly value={exportAll()} onFocus={e => e.target.select()} aria-label="目前全部設定" style={{width:'100%',height:110,font:'12px/1.4 monospace',boxSizing:'border-box'}} />
    <p style={{margin:'4px 0 0',fontSize:12}}>{manual ? '這張目前：手動設定' : '這張目前：自動取景'}　草稿只存在這個瀏覽器。</p>
  </aside>;
};
