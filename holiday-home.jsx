/** @jsx siteCreateElement */
// Original posters; the graduate illustrator credit was supplied by the department head on 2026-10-23.
const STUDENT_HERO_WORKS = Object.freeze([
  {
    title: 'Clip Studio Paint · Grand Prize',
    image: 'images/posters/clipstudio-grand-prize.jpg',
    designers: '小颯',
    creatorRole: 'graduate',
    mentor: null,
    sourceHref: '#/works/clipstudio-grand-prize'
  },
  {
    "title": "Dear, All Robots",
    "image": "images/news/2026-awards/dear-all-robots.jpg",
    "designers": "王愛吉 · 黃承義 · 梁潔美 · 林巧玲 · 馬聖淞",
    "mentor": "陳美蓉",
    "sourceNewsId": 7140,
    "sourceDate": "2026-04-29",
    "sourceHref": "#/news/2026-04-29-awards-showcase/work-04"
  },
  {
    "title": "喀嚓",
    "image": "images/news/2026-awards/kacha.jpg",
    "designers": "吳立凡 · 張自祥 · 陶延娣 · 鄭羽軒",
    "mentor": "鄧樹遠",
    "sourceNewsId": 7140,
    "sourceDate": "2026-04-29",
    "sourceHref": "#/news/2026-04-29-awards-showcase/work-05"
  },
  {
    "title": "今食堂",
    "image": "images/news/2026-awards/today-restaurant.jpg",
    "designers": "許瑗玶 · 高樂怡 · 陳書凱 · 黎躒嬈",
    "mentor": "鄧樹遠",
    "sourceNewsId": 7140,
    "sourceDate": "2026-04-29",
    "sourceHref": "#/news/2026-04-29-awards-showcase/work-06"
  }
]);
// The splash shows student work. Playtest controls render separately at the page bottom.
const HolidayHome = ({placement='hero'}={}) => {
 const gamesOnly=placement==='games';
 const [selected,setSelected]=React.useState('new-year');
 const [playing,setPlaying]=React.useState(false);
 const [studentIndex,setStudentIndex]=React.useState(0);
 const student=STUDENT_HERO_WORKS[studentIndex];
 const frame=React.useRef(null),trigger=React.useRef(null),dialog=React.useRef(null),closeButton=React.useRef(null),detachFrame=React.useRef(()=>{});
 const words=(zh,en,ja)=>({zh,en,ja})[siteLanguage];
 const entries=[['new-year','明年的第一格','The First Frame Ahead','新しい年の最初のコマ'],['lunar-new-year','年獸表演課','Nian Performance Class','年獣の演技レッスン'],['lantern','燈影借位','Shadow Stage','灯りと影の舞台'],['children','玩具聲音偵探','Toy Sound Detective','おもちゃ音の探偵'],['dragon-boat','粽葉折疊局','Leaf Folding Studio','葉っぱ折りスタジオ'],['mid-autumn','月光剪接台','Moonlight Editing Desk','月明かりの編集室'],['teachers','老師，這格謝謝你','A Panel of Thanks','先生へ、感謝の一コマ'],['national-day','島嶼場景工作室','Island Scene Studio','島の風景スタジオ'],['semester','新生第一張地圖','Your First Campus Map','はじめてのキャンパスマップ'],['exhibition','畢展策展接力','Exhibition Curator Relay','卒展キュレーターリレー'],['peace-memory','把話聽完整','Listen to the Whole Story','最後まで聴こう'],['qingming','紙鳶借風','A Kite Borrows the Wind','風を借りる凧'],['retrocession','時光對照室','The Time Comparison Room','時の見比べアトリエ'],['constitution','同一頁，都看懂','One Page for Everyone','同じページを、みんなに']];
 const name=entries.find(e=>e[0]===selected)[{zh:1,en:2,ja:3}[siteLanguage]];
 const close=()=>setPlaying(false);
 const focusable=doc=>[...doc.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(n=>!n.closest('[inert]')&&n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden');
 const attachFrame=()=>{
  detachFrame.current();
  const doc=frame.current?.contentDocument;if(!doc)return;
  const key=e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
   if(e.key!=='Tab')return;
   const nodes=focusable(doc),index=nodes.indexOf(doc.activeElement);
   if(!nodes.length||(e.shiftKey&&index<=0)||(!e.shiftKey&&index===nodes.length-1)){e.preventDefault();closeButton.current?.focus();}
  };
  doc.addEventListener('keydown',key,true);detachFrame.current=()=>doc.removeEventListener('keydown',key,true);
 };
 React.useEffect(()=>{
  if(!playing)return;
  const oldOverflow=document.body.style.overflow,oldInert=[...document.body.children].filter(n=>n!==dialog.current).map(n=>[n,n.inert]);
  oldInert.forEach(([n])=>{n.inert=true;});document.body.style.overflow='hidden';closeButton.current?.focus();
  const key=e=>{
   if(e.key==='Escape'){e.preventDefault();close();return;}
   if(e.key==='Tab'&&e.shiftKey&&document.activeElement===closeButton.current){
    e.preventDefault();const nodes=frame.current?.contentDocument?focusable(frame.current.contentDocument):[];(nodes.at(-1)||frame.current||closeButton.current)?.focus();
   }
  };
  const guard=e=>{if(dialog.current&&!dialog.current.contains(e.target))closeButton.current?.focus();};
  const message=e=>{if(e.origin===location.origin&&e.source===frame.current?.contentWindow&&e.data?.type==='agd-holiday-close')close();};
  document.addEventListener('keydown',key);document.addEventListener('focusin',guard);window.addEventListener('message',message);
  return()=>{detachFrame.current();detachFrame.current=()=>{};document.removeEventListener('keydown',key);document.removeEventListener('focusin',guard);window.removeEventListener('message',message);oldInert.forEach(([n,value])=>{n.inert=value;});document.body.style.overflow=oldOverflow;trigger.current?.focus();};
 },[playing]);
 return <div id={gamesOnly?'student-play-zone':'festival-preview'} className={gamesOnly?'festival-home festival-home--bottom':'festival-home festival-home--integrated'} data-no-fx="true" data-no-splat="true">
  {!gamesOnly&&<div className="hero-identity">
   <p className="hero-kicker">SHU-TE UNIVERSITY · ANIMATION &amp; GAME DESIGN</p>
   <h1 id="hero-title" className="h-display hero-integrated-title"><span>{words('畫出來，','Draw it.','描こう。')}</span><span>{words('動起來。','Bring it to life.','動かそう。')}</span></h1>
   <p className="hero-summary">{words('動畫、遊戲、互動媒體。把腦內的世界，變成會動的角色與故事。','Animation, games and interactive media. Turn the worlds in your head into characters and stories that move.','アニメ、ゲーム、インタラクティブメディア。頭の中の世界を、動くキャラクターと物語に。')}</p>
   <a className="hero-news-link" href="#news">{words('看系上消息','Department news','学科ニュース')} <span aria-hidden="true">↓</span></a>
  </div>}
  {!gamesOnly&&<div className="festival-work student-hero-work">
   <figure className="student-work-figure">
    <a className="student-poster-link" href={student.sourceHref} aria-label={words('查看作品消息','Read the work’s news','作品の記事を見る')}><img id="student-work-poster" className="student-work-poster" src={student.image} alt={student.title} width="1200" height="1697" /></a>
    <figcaption>
     <p className="student-work-kicker">{student.creatorRole==='graduate'?words('畢業生手繪','Graduate illustration','卒業生のイラスト'):words('學生作品','Student work','学生作品')}</p>
     <h2 id="student-work-title" data-language-choice="true">{student.title}</h2>
     <p className="student-work-credit"><span>{student.creatorRole==='graduate'?words('畢業生・繪者','Graduate artist','卒業生・作者'):words('創作者','Creators','制作者')}</span><span id="student-work-authors" data-language-choice="true">{student.designers}</span></p>
     {student.mentor&&<p className="student-work-credit"><span>{words('指導教師','Advisor','指導教員')}</span><span id="student-work-mentor" data-language-choice="true">{student.mentor}</span></p>}
     <a id="student-work-source" href={student.sourceHref}>{words('看作品消息','Read about the work','作品の記事へ')} <span aria-hidden="true">→</span></a>
    </figcaption>
   </figure>
   <div className="student-work-picker" role="group" aria-label={words('切換學生作品','Switch student work','学生作品を切り替える')}>
    <button id="student-work-previous" className="student-text-button" onClick={()=>setStudentIndex(i=>(i+STUDENT_HERO_WORKS.length-1)%STUDENT_HERO_WORKS.length)}>{words('上一件','Previous','前の作品')}</button>
    <span id="student-work-position" aria-live="polite">{studentIndex+1} / {STUDENT_HERO_WORKS.length}</span>
    <button id="student-work-next" className="student-text-button" onClick={()=>setStudentIndex(i=>(i+1)%STUDENT_HERO_WORKS.length)}>{words('下一件','Next','次の作品')}</button>
   </div>
  </div>}
  {gamesOnly&&<div className="festival-copy">
   <h2 id="student-play-title" className="h-display">{words('創作試玩','Creative Playtests','創作の試遊')}</h2>
   <p className="student-curation-entry"><a id="student-curation-start" href={`holiday-lab/student-curation.html?lang=${siteLanguage}`}>{words('試做一場小型策展','Try a small curation exercise','小さな展示を組んでみよう')} <span aria-hidden="true">→</span></a></p>  </div>}
  {!gamesOnly&&<nav className="hero-highlights" aria-label={words('系所亮點','Department highlights','学科の特徴')}>
   <a href="#about">{words('全台第一所動畫與遊戲科系','Taiwan’s first animation and game department','台湾初のアニメ・ゲーム学科')}</a>
   <a href="#/stats/international">{words('日本海外實習・第9屆','Japan internships · ninth cohort','日本での海外実習・第9期')}</a>
   <a href="#labs">{words('12間實驗室・動作捕捉／虛擬製片棚','12 labs · motion capture and virtual production','12の実習室・モーションキャプチャ／バーチャル制作')}</a>
  </nav>}
  {playing&&createPortal(<div ref={dialog} className="festival-modal" role="dialog" aria-modal="true" aria-label={name}>
   <button ref={closeButton} id="festival-close" className="festival-button festival-close" onClick={close}>{words('關閉試玩 Esc','Close playtest · Esc','試遊を閉じる Esc')}</button>
   <iframe ref={frame} id="festival-game-frame" title={name} src={`holiday-lab/?lang=${siteLanguage}&game=${selected}`} onLoad={attachFrame} allow="autoplay" />
  </div>,document.body)}
 </div>;
};
