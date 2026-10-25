// 一次性改寫 student-work-draw.jsx：加入調整模式（?adjust=1）的拖曳與面板。每個 rep 都檢查目標存在，找不到就整支失敗、不寫檔。
const fs = require('fs'), path = require('path');
process.chdir(path.resolve(__dirname, '../../../..'));
let s = fs.readFileSync('student-work-draw.jsx', 'utf8');
if (s.includes('StudentWorkAdjustPanel')) throw new Error('already applied');
function rep(a, b) { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 80)); s = s.replace(a, b); }

// 草稿語意：undefined＝沿用資料；false＝強制自動取景；物件＝手動
rep("const manual = adjust && drafts[catalog[state.index].id] ? drafts[catalog[state.index].id] : focus.manual;",
  "const draft = adjust ? drafts[catalog[state.index].id] : undefined, manual = draft !== undefined ? (draft || null) : focus.manual;");

rep("  const updateDrafts = next => {",
  "  const draftsRef = React.useRef(drafts); draftsRef.current = drafts; const dragRef = React.useRef(null);\n" +
  "  React.useEffect(() => { if (adjust && controller.current) controller.current.goto(state.index); }, [adjust, catalog]);\n" +
  "  const updateDrafts = next => {");

rep("  const work = catalog[state.index] || catalog[0], title",
  "  const work = catalog[state.index] || catalog[0];\n" +
  "  // 這張目前的手動設定；沒有時從自動取景換算出起點，滑桿與拖曳才不會跳位置。\n" +
  "  const baseManual = (w, rect) => {\n" +
  "    const d = draftsRef.current[w.id], m = d !== undefined ? d : w.focus.manual;\n" +
  "    if (m) return { zoom: m.zoom || 1, cx: m.cx != null ? m.cx : 0.5, cy: m.cy != null ? m.cy : 0.5, ...(m.side ? { side: m.side } : {}) };\n" +
  "    const shot = StudentWorkDrawModel.compose(w.focus, rect.width, rect.height), vis = Math.min(1, rect.height * w.focus.ratio / rect.width);\n" +
  "    return { zoom: 1, cx: 0.5, cy: vis >= 1 ? 0.5 : +(shot.y / 100 * (1 - vis) + vis / 2).toFixed(3) };\n" +
  "  };\n" +
  "  const dragStart = event => {\n" +
  "    if (!adjust || window.innerWidth < 1181 || event.button > 0) return;\n" +
  "    const rect = event.currentTarget.getBoundingClientRect(), base = baseManual(work, rect), g0 = StudentWorkDrawModel.manualGeometry(base, work.focus.ratio, rect.width, rect.height);\n" +
  "    dragRef.current = { x: event.clientX, y: event.clientY, base, g0, rect, id: work.id, ratio: work.focus.ratio };\n" +
  "    event.currentTarget.setPointerCapture(event.pointerId);\n" +
  "  };\n" +
  "  const dragMove = event => {\n" +
  "    const d = dragRef.current; if (!d) return;\n" +
  "    const cand = StudentWorkDrawModel.manualGeometry({ ...d.base, cx: d.g0.cx - (event.clientX - d.x) / d.g0.width, cy: d.g0.cy - (event.clientY - d.y) / d.g0.height }, d.ratio, d.rect.width, d.rect.height);\n" +
  "    updateDrafts({ ...draftsRef.current, [d.id]: { ...d.base, zoom: cand.zoom, cx: +((d.rect.width / 2 - cand.left) / cand.width).toFixed(3), cy: +((d.rect.height / 2 - cand.top) / cand.height).toFixed(3) } });\n" +
  "  };\n" +
  "  const dragEnd = () => { dragRef.current = null; };\n" +
  "  const title");

rep("<div className=\"swd-surface\" style={work.focus ? {'--poster-mx':work.focus.mobileX+'%'} : undefined}>",
  "<div className=\"swd-surface\" data-adjust={adjust ? 'true' : undefined} style={work.focus ? {'--poster-mx':work.focus.mobileX+'%'} : undefined} onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={dragEnd}>");

rep("    </figure>\n  </section>;",
  "    </figure>\n" +
  "    {adjust && createPortal(<StudentWorkAdjustPanel catalog={catalog} index={state.index} drafts={drafts} update={updateDrafts} controller={controller} baseManual={baseManual} surface={() => host.current && host.current.querySelector('.swd-surface')} />, document.body)}\n" +
  "  </section>;");

s += `

// 調整模式面板（?adjust=1）：逐張手動調位置與大小；草稿存在本機瀏覽器，確認後複製設定交給網站資料。
const StudentWorkAdjustPanel = ({catalog,index,drafts,update,controller,baseManual,surface}) => {
  const work = catalog[index], desktop = typeof window !== 'undefined' && window.innerWidth >= 1181;
  const [note,setNote] = React.useState('');
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
`;
fs.writeFileSync('student-work-draw.jsx', s);
console.log('jsx ok');
