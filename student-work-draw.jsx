/** @jsx siteCreateElement */
// Existing complete student posters and exact creator credits; no generated art.
const StudentWorkDraw = () => {
  const catalog = useDataset('student-work-draw');
  const host = React.useRef(null), controller = React.useRef(null), updateEnvironment = React.useRef(() => {}), manualReduced = React.useRef(false);
  const [choice,setChoice] = React.useState(false), [failedImage,setFailedImage] = React.useState(null);
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
    const rect = host.current.getBoundingClientRect();inView = rect.bottom > 0 && rect.top < window.innerHeight;sync();updateEnvironment.current = sync;
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {inView = entries[0].isIntersecting;sync();},{threshold:0.05});
    observer?.observe(host.current);document.addEventListener('visibilitychange',sync);media.addEventListener?.('change',sync);
    return () => {engine.destroy();controller.current = null;observer?.disconnect();document.removeEventListener('visibilitychange',sync);media.removeEventListener?.('change',sync);updateEnvironment.current = () => {};};
  },[catalog]);
  if (!catalog || !Array.isArray(catalog) || !catalog.length) return <section className="student-work-draw swd-loading" data-no-fx="true" data-no-splat="true" aria-label={copy.heading}><p data-language-choice="true" role="status">{catalog ? copy.error : copy.loading}</p></section>;
  const work = catalog[state.index] || catalog[0], title = work.title[siteLanguage], settled = state.phase === 'settled', drawing = state.phase === 'drawing';
  const names = work.authors.split(/\s*·\s*/).map((name,i) => <React.Fragment key={name}>{i > 0 && ' · '}<span className="swd-person" data-language-choice="true">{name}</span></React.Fragment>);
  const poster = failedImage === work.id ? <span className="swd-image-error" data-language-choice="true">{copy.imageError}</span> : <img src={work.image} alt={title} data-language-choice="true" width="320" height="420" decoding="async" onError={() => setFailedImage(work.id)} />;
  return <section ref={host} id="student-work-draw" className={'student-work-draw swd-'+state.phase} data-no-fx="true" data-no-splat="true" data-draw-phase={state.phase} data-draw-id={work.id} data-draw-timer={state.timerActive ? 'active' : 'idle'} data-draw-reduced={state.reduced ? 'true' : 'false'} aria-labelledby="student-work-draw-heading" onKeyDown={event => {if(event.key === 'Escape'){event.preventDefault();event.stopPropagation();controller.current?.stop();}}}>
    <h2 id="student-work-draw-heading" data-language-choice="true">{copy.heading}</h2>
    <figure>
      {settled ? <a className="swd-poster" href={work.href} data-language-choice="true" aria-label={copy.open+title}>{poster}</a> : <div className="swd-poster" aria-hidden="true">{poster}</div>}
      <figcaption>
        <h3 data-language-choice="true">{title}</h3>
        <p className="swd-credits"><span data-language-choice="true">{copy.authors}：</span>{names}</p>
        {work.mentor && <p className="swd-mentor"><span data-language-choice="true">{copy.mentor}：</span><span data-language-choice="true">{work.mentor}</span></p>}
      </figcaption>
    </figure>
    <p className="swd-status" role="status" aria-live="polite" data-language-choice="true">{settled ? copy.selected+' · '+title : drawing ? copy.drawing : copy.preview}</p>
    <div className="swd-actions">
      <button id="student-work-draw-start" type="button" disabled={drawing} onClick={() => controller.current?.start()} data-language-choice="true">{settled ? copy.again : copy.draw}</button>
      {drawing ? <button id="student-work-draw-stop" type="button" onClick={() => controller.current?.stop()} data-language-choice="true">{copy.stop}</button> : settled ? <a id="student-work-draw-link" href={work.href} data-language-choice="true">{copy.view} →</a> : <button id="student-work-draw-pause" type="button" onClick={() => controller.current?.togglePause()} data-language-choice="true">{state.paused ? copy.resume : copy.pause}</button>}
    </div>
    <label className="swd-motion"><input id="student-work-draw-static" type="checkbox" checked={choice || state.reduced} disabled={state.reduced && !choice} onChange={event => {manualReduced.current = event.target.checked;setChoice(event.target.checked);updateEnvironment.current();}} /><span data-language-choice="true">{copy.static}</span></label>
  </section>;
};
