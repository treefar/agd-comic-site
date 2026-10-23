/** @jsx siteCreateElement */
// Review-only entry. No game module, iframe or audio is loaded before a click.
const HolidayHome = () => {
 const [selected,setSelected]=React.useState('new-year');
 const [playing,setPlaying]=React.useState(false);
 const frame=React.useRef(null),trigger=React.useRef(null);
 const words=(zh,en,ja)=>({zh,en,ja})[siteLanguage];
 React.useEffect(()=>{import('./holiday-lab/catalog.mjs').then(({festivalAt})=>{const active=festivalAt(Date.now());if(active)setSelected(active.id);}).catch(()=>{});},[]);
 const entries=[['new-year','明年的第一格','The First Frame Ahead','新しい年の最初のコマ'],['lunar-new-year','年獸表演課','Nian Performance Class','年獣の演技レッスン'],['lantern','燈影借位','Shadow Stage','灯りと影の舞台'],['children','玩具聲音偵探','Toy Sound Detective','おもちゃ音の探偵'],['dragon-boat','粽葉折疊局','Leaf Folding Studio','葉っぱ折りスタジオ'],['mid-autumn','月光剪接台','Moonlight Editing Desk','月明かりの編集室'],['teachers','老師，這格謝謝你','A Panel of Thanks','先生へ、感謝の一コマ'],['national-day','島嶼場景工作室','Island Scene Studio','島の風景スタジオ'],['semester','新生第一張地圖','Your First Campus Map','はじめてのキャンパスマップ'],['exhibition','畢展策展接力','Exhibition Curator Relay','卒展キュレーターリレー'],["peace-memory","把話聽完整","Listen to the Whole Story","最後まで聴こう"],["qingming","紙鳶借風","A Kite Borrows the Wind","風を借りる凧"],["labor","動畫接力班","Animation Relay Studio","アニメ制作リレーチーム"],["retrocession","時光對照室","The Time Comparison Room","時の見比べアトリエ"],["constitution","同一頁，都看懂","One Page for Everyone","同じページを、みんなに"]];
 const name=entries.find(e=>e[0]===selected)[{zh:1,en:2,ja:3}[siteLanguage]];
 const close=()=>{setPlaying(false);trigger.current?.focus();};
 React.useEffect(()=>{if(!playing)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';const key=e=>{if(e.key==='Escape')close();};const message=e=>{if(e.origin===location.origin&&e.source===frame.current?.contentWindow&&e.data?.type==='agd-holiday-close')close();};document.addEventListener('keydown',key);window.addEventListener('message',message);frame.current?.focus();return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key);window.removeEventListener('message',message);};},[playing]);
 return <section id="festival-preview" className="festival-home" aria-labelledby="festival-title">
  <div className="festival-copy"><p>{words('本機限定試玩','Local playtest','ローカル試遊')}</p><h2 id="festival-title">{words('節日番外篇','Festival Stories','季節の番外編')}</h2>
   <label htmlFor="festival-select">{words('選一款試玩','Choose a prototype','作品を選ぶ')}</label>
   <select id="festival-select" value={selected} onChange={e=>setSelected(e.target.value)}>{entries.map(e=><option key={e[0]} value={e[0]}>{e[{zh:1,en:2,ja:3}[siteLanguage]]}</option>)}</select>
   <h3>{name}</h3><p>{words('30–90 秒，做一小段自己的創作。','30–90 seconds to create something of your own.','30〜90秒で、小さな自分の作品を。')}</p>
   <button ref={trigger} id="festival-start" className="festival-button" onClick={()=>setPlaying(true)}>{words('開始試玩','Play prototype','試遊する')}</button>
   <a className="festival-button" href={`holiday-lab/?lang=${siteLanguage}`}>{words('全部十五款','All fifteen prototypes','全15作品')}</a>
  </div><img className="festival-hero-art" src={`holiday-lab/assets/${selected}/cg-5.webp`} alt="" loading="lazy" width="550" height="360" />
  {playing&&createPortal(<div className="festival-modal" role="dialog" aria-modal="true" aria-label={name}>
   <button className="festival-button festival-close" onClick={close}>{words('關閉試玩 Esc','Close playtest · Esc','試遊を閉じる Esc')}</button>
   <iframe ref={frame} title={name} src={`holiday-lab/?lang=${siteLanguage}&game=${selected}`} allow="autoplay" />
  </div>,document.body)}
 </section>;
};
