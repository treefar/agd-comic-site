/** @jsx siteCreateElement */
/* Chinese review page: shared official-site shell, concise copy and linked primary sources. */
const StudentGuideDetail = () => {
  const [data, setData] = React.useState(window.__STUDENT_GUIDE__ || null);
  const [error, setError] = React.useState(false);
  const [category, setCategory] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [focus, setFocus] = React.useState(null);
  const input = React.useRef(null);
  React.useEffect(() => {
    if (data) return;
    const controller = new AbortController();
    fetch('data/students/guide.json?v=20261022students', {signal: controller.signal})
      .then(r => { if (!r.ok) throw Error('guide unavailable'); return r.json(); })
      .then(setData).catch(e => { if (e.name !== 'AbortError') setError(true); });
    return () => controller.abort();
  }, []);
  React.useEffect(() => {
    if (!focus) return;
    const element = document.getElementById('student-' + focus);
    if (element) { element.focus({preventScroll:true}); element.scrollIntoView({block:'start',behavior:'instant'}); }
    setFocus(null);
  }, [focus]);
  if (error) return <main className="chapter student-guide"><div className="container sg-error" role="alert"><h1>資料暫時讀不到</h1><p>請重新整理；急件可先聯絡動遊系辦 07-6158000 分機 6102。</p><button onClick={() => window.location.reload()}>重新整理</button></div></main>;
  if (!data) return <Loading />;
  const cards = StudentGuideModel.filter(data.cards, category, query);
  const sourceMap = Object.fromEntries(data.sources.map(s => [s.id,s]));
  const categoryName = id => data.categories.find(c=>c.id===id)?.title || id;
  const jump = id => {setCategory('all');setQuery('');setFocus(id);};
  const sourceLinks = ids => ids.map(id => sourceMap[id]).filter(Boolean).map(s => <li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a><span className="sg-source-note">{s.readability} · 查核 {s.checked_at}</span></li>);
  return <main id="student-guide" className="chapter student-guide" aria-labelledby="student-guide-title">
    <div className="container">
      <BackBar />
      <div className="sg-review"><strong>官網版型審閱稿</strong><span>內容查核 {data.as_of} · 尚未上線</span></div>
      <section className="sg-hero" aria-labelledby="student-guide-title">
        <div className="sg-hero-copy">
          <div className="sg-eyebrow">STUDENT GUIDE · 動遊在校生</div>
          <h1 id="student-guide-title">在校指南</h1>
          <h2 className="sg-directory-title">分類索引</h2>
        <div className="sg-categories sg-directory" role="group" aria-label="資訊分類">
          <button aria-pressed={category==='all'} onClick={()=>{setCategory('all');document.getElementById("student-topics").scrollIntoView({block:"start",behavior:"instant"});}}>全部 <span>{data.cards.length}</span></button>
          {data.categories.map(c=><button key={c.id} aria-pressed={category===c.id} onClick={()=>{setCategory(c.id);document.getElementById("student-topics").scrollIntoView({block:"start",behavior:"instant"});}}>{c.title} <span>{data.cards.filter(x=>x.category===c.id).length}</span></button>)}
        </div>
          <button onClick={() => document.getElementById("student-faq").scrollIntoView({block:"start",behavior:"instant"})}>常見問題 ↓</button>
        </div>
        <div className="sg-start"><h2>常用項目</h2><div className="sg-shortcuts">{data.quick_links.map(x=><button key={x.card_id||x.target||x.id} onClick={()=>jump(x.card_id||x.target||x.id)}>{x.label||x.title}<span aria-hidden="true">↗</span></button>)}</div></div>
      </section>
      <aside className="sg-note"><strong>畢業規則先看「入學年度＋班別」</strong><p>這份指南以日間四技在校生為主。一般班、技優班與不同入學年度可能不同；申請資格和日期請以各處室當期公告為準。</p></aside>
      <section id="student-topics" className="sg-browse" aria-labelledby="student-topics-title">
        <div className="sg-section-heading"><span className="sg-number">01</span><div><h2 id="student-topics-title">辦理資訊</h2></div></div>
        <div className="sg-toolbar"><label htmlFor="student-search">搜尋資訊<input id="student-search" ref={input} type="search" placeholder="輸入問題或關鍵字" value={query} onChange={e=>setQuery(e.target.value)}/></label><button className="sg-clear" onClick={()=>{setCategory('all');setQuery('');input.current?.focus();}}>清除篩選</button></div>
        <p className="sg-count" role="status">顯示 {cards.length}／{data.cards.length} 項資訊</p>
        {cards.length===0?<div className="sg-empty"><h3>沒有找到符合的資訊</h3><p>換個關鍵字，或按「清除篩選」看全部項目。</p></div>:<div className="sg-card-grid">{cards.map(card=><article id={'student-'+card.id} className="sg-card" key={card.id} tabIndex="-1" data-guide-card={card.id}>
          <div className="sg-card-heading"><span className="sg-category-tag">{categoryName(card.category)}</span><h3>{card.title}</h3><p className="sg-summary">{card.summary}</p></div>
          <ol className="sg-steps" aria-label="辦理步驟">{card.steps.map((step,i)=><li key={i}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><p>{step}</p></li>)}</ol>
          {card.warning&&<p className="sg-warning"><strong>留意</strong> {card.warning}</p>}
          <div className="sg-contact"><span className="sg-contact-label">找誰辦</span><strong>{card.contact.primary}</strong>{card.contact.phone&&StudentGuideModel.phones(card.contact.phone).map(phone=><a key={phone} href={StudentGuideModel.phone(phone)}>{phone}</a>)}{card.contact.secondary&&<p>其他協助：{card.contact.secondary}{card.contact.secondary_phone&&<span> · <a href={StudentGuideModel.phone(card.contact.secondary_phone)}>{card.contact.secondary_phone}</a></span>}</p>}{card.contact.url&&<a className="sg-office-link" href={card.contact.url} target="_blank" rel="noopener noreferrer">前往承辦單位 ↗</a>}</div>
          <details className="sg-sources"><summary>官方資料與查核狀態</summary><ul>{sourceLinks(card.source_ids)}</ul></details>
        </article>)}</div>}
      </section>
      <section id="student-faq" className="sg-faq" aria-labelledby="student-faq-title">
        <div className="sg-section-heading"><span className="sg-number">02</span><div><h2 id="student-faq-title">常見問題</h2></div></div>
        <div className="sg-faq-list">{cards.flatMap(card=>card.faq.map((faq,i)=><details className="sg-faq-item" key={card.id+'-'+i}><summary><span><small>{categoryName(card.category)}</small>{faq.q}</span><b aria-hidden="true">＋</b></summary><div className="sg-faq-answer"><p>{faq.a}</p><div className="sg-faq-links">{faq.source_ids.map(id=>sourceMap[id]).filter(Boolean).map(s=><a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a>)}</div></div></details>))}</div>
        {!cards.length&&<p className="sg-empty">目前的篩選沒有相關問題。</p>}
      </section>
      <aside className="sg-bottom-note"><strong>還是不知道找誰？</strong><p>把「入學年度、班別、要辦的事」一起告訴系辦，協助你確認承辦窗口。</p><a href="tel:076158000,6102">動遊系辦 · 07-6158000 分機 6102 ↗</a></aside>
      <p className="sg-editor-note">依學校及系所官方資料整理，閱讀限制已附在各項來源；尚未取得的當期規定保留提醒。本頁為審閱版本。</p>
    </div>
  </main>;
};
