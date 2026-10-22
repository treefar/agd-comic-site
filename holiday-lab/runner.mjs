import {games,text} from './catalog.mjs';
import {spriteAt,cuesBetween,captionFontSize} from './replay-model.mjs';
const params=new URLSearchParams(location.search);
const lang=['zh','en','ja'].includes(params.get('lang'))?params.get('lang'):'zh';
const w=x=>typeof x==='string'?x:(x?.[lang]??x?.zh??'');
document.documentElement.lang={zh:'zh-Hant',en:'en',ja:'ja'}[lang];
const root=document.querySelector('#lab');
const T={back:text('回首頁','Website home','ホームへ'),archive:text('節日番外篇','Festival Stories','季節の番外編'),preview:text('本機試作・尚未發布','Local prototypes · not published','ローカル試作・未公開'),start:text('開始創作','Start creating','制作スタート'),help:text('操作說明','How to play','遊び方'),settings:text('設定','Settings','設定'),exit:text('回作品列表','All prototypes','作品一覧へ'),mute:text('聲音：關','Sound: off','音：オフ'),sound:text('聲音：開','Sound: on','音：オン'),pause:text('暫停','Pause','一時停止'),resume:text('繼續','Resume','再開'),skip:text('跳過開場','Skip introduction','オープニングをスキップ'),replay:text('播放我的作品','Play my creation','自分の作品を再生'),retry:text('重新創作','Create again','もう一度作る'),done:text('創作完成','Creation complete','制作完了'),intro:text('再看開場','Watch introduction','オープニングを見る'),guide:text('在校指南','Student guide','在校ガイド'),close:text('關閉','Close','閉じる'),continue:text('回選單','Back to menu','メニューへ'),error:text('這款暫時無法載入，請回列表重試。','This prototype could not load. Return to the list and retry.','読み込めませんでした。一覧からもう一度お試しください。')};
let unmount=()=>{},epoch=0,muted=true,current=null,paused=false,result=null;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const audios=new Set();
function stopSounds(){for(const a of audios){a.pause();a.currentTime=0;}audios.clear();}
function sound(kind){if(muted||paused||document.hidden)return;const audio=new Audio(`audio/${kind}.ogg`);audio.volume=.35;audios.add(audio);audio.addEventListener('ended',()=>audios.delete(audio));audio.play().catch(()=>audios.delete(audio));}
function el(tag,props={},parent){const n=document.createElement(tag);for(const[k,v]of Object.entries(props)){if(k==='text')n.textContent=w(v);else if(k==='class')n.className=v;else n.setAttribute(k,String(v));}if(parent)parent.append(n);return n;}
function button(id,label,fn,parent,pressed){const b=el('button',{id,class:'button',type:'button',text:label},parent);if(pressed!==undefined)b.setAttribute('aria-pressed',String(pressed));b.addEventListener('click',()=>{sound('click');fn();});return b;}
function clear(){unmount();unmount=()=>{};epoch++;stopSounds();paused=false;root.replaceChildren();}
function toolbar(){const bar=el('nav',{class:'toolbar','aria-label':w(text('導覽','Navigation','ナビゲーション'))},root);el('a',{href:`../?lang=${lang}#hero`,text:T.back},bar);const a=el('div',{class:'actions'},bar);for(const code of ['zh','en','ja']){const q=new URLSearchParams(location.search);q.set('lang',code);el('a',{href:`?${q}`,text:{zh:'中文',en:'English',ja:'日本語'}[code],lang:code,'aria-current':lang===code?'page':'false'},a);}button('audio-toggle',muted?T.mute:T.sound,()=>{muted=!muted;document.querySelector('#audio-toggle').textContent=w(muted?T.mute:T.sound);if(muted)stopSounds();else sound('click');},a);return bar;}
function title(g){const h=el('header',{},root);el('p',{class:'muted',text:T.preview},h);el('h1',{text:g?.title||T.archive},h);if(g)el('p',{text:g.blurb},h);return h;}
function navigate(g){const q=new URLSearchParams({lang});if(g)q.set('game',g.id);history.pushState({},'',`?${q}`);if(g)intro(g);else archive();}
function archive(){clear();current=null;toolbar();title();el('p',{text:text(`共 ${games.length} 款試作，選擇後才載入遊戲。`,`Choose from ${games.length} prototypes. Games load after selection.`,`${games.length}作品から選べます。選んでから読み込みます。`)},root);const grid=el('div',{class:'gallery'},root);for(const g of games){const card=el('article',{class:'game-card'},grid);el('img',{src:`assets/${g.id}/cg-1.webp`,alt:'',loading:'lazy',width:300,height:188},card);el('p',{class:'muted',text:g.event},card);el('h2',{text:g.title},card);el('p',{text:g.blurb},card);button(`open-${g.id}`,T.start,()=>navigate(g),card);}el('p',{class:'status-note',text:text('開學與畢展尚未排定活動日期。所有圖像為審閱候選；不代表校方活動公告。','Semester and exhibition dates are not scheduled. Artwork is a review candidate; this is not an official event announcement.','新学期と卒展の開催日は未設定。画像は審閲候補で、大学の公式行事告知ではありません。')},root);}
function intro(g){clear();current=g;toolbar();title(g);const e=epoch;let idx=0,elapsed=0,last=performance.now(),frame=0;
 const label=el('p',{class:'intro-caption',text:'1 / 5'},root),area=el('div',{class:'intro',tabindex:0,role:'button','aria-label':w(T.skip)},root);
 let image=el('img',{class:'intro-image',src:`assets/${g.id}/cg-1.webp`,alt:w(g.title)},area);
 const mw=el('div',{class:'marquee-window'},root),mv=el('div',{class:'marquee-viewport'},mw),marquee=el('div',{class:'marquee',text:g.story},mv);marquee.style.setProperty('--scroll-duration',`${Math.max(35,w(g.story).length/3.6)}s`);
 button('intro-skip',T.skip,()=>menu(g),root);const onKey=event=>{if(event.target.closest('button,a'))return;if(event.key==='Tab')return;menu(g);};const skip=()=>menu(g);area.addEventListener('click',skip);document.addEventListener('keydown',onKey);
 const tick=now=>{if(epoch!==e)return;const dt=Math.max(0,(now-last)/1000);last=now;if(!document.hidden){elapsed+=Math.min(dt,.2);const next=Math.max(0,Math.min(4,Math.floor(elapsed/7)));if(next!==idx){idx=next;const previous=image;previous.classList.add('previous');image=el('img',{class:'intro-image',src:`assets/${g.id}/cg-${idx+1}.webp`,alt:w(g.title)},area);previous.addEventListener('animationend',()=>previous.remove(),{once:true});if(reducedMotion)previous.remove();label.textContent=`${idx+1} / 5`;}if(elapsed>=Math.max(35,w(g.story).length/3.6)){menu(g);return;}}frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
 unmount=()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',onKey);};area.focus();}
function menu(g){clear();current=g;toolbar();title(g);el('img',{class:'menu-art',src:`assets/${g.id}/cg-5.webp`,alt:''},root);const actions=el('div',{class:'actions'},root);button('start-game',T.start,()=>play(g),actions);button('show-help',T.help,()=>help(g),actions);button('show-settings',T.settings,()=>settings(g),actions);button('watch-intro',T.intro,()=>intro(g),actions);button('exit-game',T.exit,()=>navigate(null),actions);}
function help(g){clear();toolbar();title(g);el('h2',{text:T.help},root);el('p',{text:g.blurb},root);el('p',{text:text('用滑桿、選項與按鈕調整作品；按提示完成三個階段。可用 Tab 移動焦點、方向鍵調滑桿、Enter／空白鍵按按鈕。播放預覽後檢查結果。做錯可調整重試，遊戲不倒數逼迫操作。','Use sliders, options and buttons to create through three stages. Tab moves focus, arrow keys adjust sliders, and Enter or Space activates buttons. Preview, check and retry. There is no forced countdown.','スライダー、選択肢、ボタンで3段階を制作します。Tabで移動、矢印キーで調整、Enter・Spaceで決定。プレビューを見て、確認して、やり直せます。制限時間による強制終了はありません。')},root);el('p',{text:text('暫停、切到其他分頁或離開時，動畫與音效都會停止。預設靜音，可在上方開啟。','Animation and sound stop when paused, hidden or closed. Sound starts muted; enable it above.','一時停止、別タブへの移動、終了時は動きと音が止まります。音は最初オフで、上から変更できます。')},root);button('help-back',T.continue,()=>menu(g),root);}
function settings(g){clear();toolbar();title(g);el('h2',{text:T.settings},root);el('p',{text:text('聲音使用上方開關，預設關閉。減少動態沿用裝置的「減少動態效果」設定；開啟時改用靜態切換。','Use the sound toggle above; it starts off. Reduced motion follows your device preference and uses still transitions.','音は上のボタンで切り替えます。初期設定はオフ。動きを減らす設定は端末の設定に従い、静止画の切り替えになります。')},root);button('settings-back',T.continue,()=>menu(g),root);}
function makeSprite(g,stage,key,initial){if(!/^(actor[123]|prop[123]|target|token[123])$/.test(key))throw Error(`Unknown sprite ${key}`);const node=el('img',{class:'sprite',src:`assets/${g.id}/${key}.png`,alt:'','aria-hidden':'true',draggable:'false'},stage);let props={};const update=p=>{Object.assign(props,p);const {x=50,y=50,width=20,height=20,rotation=0,opacity=1,scaleX=1,scaleY=1,z=1,filter=''}=props;Object.assign(node.style,{left:`${x}%`,top:`${y}%`,width:`${width}%`,height:`${height}%`,transform:`translate(-50%,-50%) rotate(${rotation}deg) scale(${scaleX},${scaleY})`,opacity:String(opacity),zIndex:String(z),filter});if(props.id)node.id=props.id;};update(initial);return{element:node,update,remove:()=>node.remove()};}
function uiFor(parent){const ui={
 text(id,words){return el('p',{id,text:words},parent);},setText(n,words){n.textContent=w(words);},group(id){return el('div',{id,class:'control-group'},parent);},
 button({id,label,onClick}){return button(id,label,onClick,parent);},
 slider({id,label,min,max,step=1,value,onInput}){const group=el('div',{class:'control-group'},parent);el('label',{class:'control-label',for:id,text:label},group);const row=el('div',{class:'slider-row'},group);let input,output;
 const setValue=n=>{input.value=String(Math.min(max,Math.max(min,Number(n))));output.value=input.value;output.textContent=input.value;};
 button(id+'-minus',text('減','−','−'),()=>{setValue(Number(input.value)-step);onInput(Number(input.value));},row);
 input=el('input',{id,type:'range',min,max,step,value,'aria-label':w(label)},row);output=el('output',{for:id},row);output.textContent=value;
 button(id+'-plus',text('加','+','+'),()=>{setValue(Number(input.value)+step);onInput(Number(input.value));},row);
 input.addEventListener('input',()=>{output.textContent=input.value;onInput(Number(input.value));});return{element:group,input,setValue,getValue:()=>Number(input.value)};},
 choice({id,label,options,value,onChange}){const group=el('div',{class:'control-group',id},parent);el('p',{class:'control-label',text:label},group);const optionsEl=el('div',{class:'choice-options',role:'group','aria-label':w(label)},group);let selected=value;const bs=options.map((o,i)=>button(`${id}-${i}`,o.label,()=>{setValue(o.value);onChange(o.value);},optionsEl,o.value===value));function setValue(v){selected=v;bs.forEach((b,i)=>b.setAttribute('aria-pressed',String(options[i].value===v)));}return{element:group,setValue,getValue:()=>selected};}
 };return ui;}
async function play(g){clear();current=g;result=null;toolbar();title(g);const token=epoch;const actions=el('div',{class:'actions'},root);const pause=button('pause-game',T.pause,()=>{paused=!paused;pause.textContent=w(paused?T.resume:T.pause);pause.setAttribute('aria-pressed',String(paused));controls.inert=paused;if(paused)stopSounds();hint.textContent=w(paused?text('已暫停','Paused','一時停止中'):g.blurb);},actions,false);button('leave-game',T.exit,()=>navigate(null),actions);if(g.id==='semester')el('a',{class:'site-link',href:`../?lang=${lang}#/students/guide`,text:T.guide},actions);
 const progress=el('p',{id:'game-progress',class:'progress',text:'0 / 3'},root),hint=el('p',{id:'game-hint',class:'hint',text:g.blurb},root);
 const layout=el('div',{class:'game-layout'},root),stage=el('div',{id:'game-stage',class:'stage','aria-label':w(g.title)},layout);stage.style.backgroundImage=`url('assets/${g.id}/scene.webp')`;
 const controls=el('section',{id:'game-controls',class:'controls','aria-label':w(T.help)},layout);let frame=0,last=performance.now(),elapsed=0,instance;const frames=new Set(),keys=new Set();
 const onKey=event=>{if(!paused&&!document.hidden&&event.key!=='Tab')for(const fn of keys)fn(event);};document.addEventListener('keydown',onKey);
 const onHidden=()=>{if(document.hidden)stopSounds();last=performance.now();};document.addEventListener('visibilitychange',onHidden);
 const tick=now=>{const dt=Math.max(0,Math.min((now-last)/1000,.1));last=now;if(!paused&&!document.hidden){elapsed+=dt;for(const fn of [...frames])fn({dt,elapsed});}frame=requestAnimationFrame(tick);};
 unmount=()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',onKey);document.removeEventListener('visibilitychange',onHidden);frames.clear();keys.clear();instance?.destroy?.();controls.inert=false;};
 try{const module=await import(`./games/${g.id}.mjs`);if(epoch!==token)return;instance=module.mount({lang,words:w,stage,controls,ui:uiFor(controls),sprite:(key,p)=>makeSprite(g,stage,key,p),onFrame(fn){frames.add(fn);return()=>frames.delete(fn);},onKey(fn){keys.add(fn);return()=>keys.delete(fn);},hint:words=>{hint.textContent=w(words);},setProgress:(n,total)=>{progress.textContent=`${n} / ${total}`;progress.dataset.current=n;progress.dataset.total=total;},sound,complete:data=>{if(epoch!==token||result)return;result=JSON.parse(JSON.stringify(data));queueMicrotask(()=>{if(epoch===token)results(g,result);});},reducedMotion});frame=requestAnimationFrame(tick);}catch(error){console.error(error);el('p',{class:'error',text:T.error},controls);}}
function results(g,data){clear();current=g;toolbar();title(g);el('h2',{text:T.done},root);el('p',{id:'result-score',text:`${Math.round(data.score)} / 100`},root);el('p',{id:'result-summary',text:data.summary},root);const actions=el('div',{class:'actions'},root);button('play-result',T.replay,()=>replay(g,data),actions);button('retry-game',T.retry,()=>play(g),actions);button('result-exit',T.exit,()=>navigate(null),actions);const detail=el('details',{},root);el('summary',{text:text('本次創作紀錄','This creation’s data','今回の制作記録')},detail);el('pre',{class:'result-artifact',id:'result-artifact',text:JSON.stringify(data.artifact,null,2)},detail);}
function replay(g,data){
 clear();toolbar();title(g);
 const stage=el('div',{class:'stage',id:'replay-stage'},root);stage.style.backgroundImage=`url('assets/${g.id}/scene.webp')`;
 const caption=el('p',{class:'replay-caption',id:'replay-caption'},root);
 const shots=Array.isArray(data.replay)?data.replay:[];
 let i=0,t=0,previous=-1,frame=0,last=performance.now(),sprites=[],layers=[];
 // The replay consumes saved creation data; it never substitutes fixed animation or audio.
 const sizeText=()=>{for(const {node,layer}of layers)node.style.fontSize=`${captionFontSize(layer,stage.clientWidth)}px`;};
 const resize=new ResizeObserver(sizeText);resize.observe(stage);
 function draw(){const shot=shots[i];if(!shot)return;for(const {handle,source}of sprites)handle.update(spriteAt(source,reducedMotion?shot.duration:t));for(const cue of cuesBetween(shot,previous,t))sound(cue.kind);previous=t;}
 function show(){
  stopSounds();stage.replaceChildren();sprites=[];layers=[];previous=-1;
  const shot=shots[i];if(!shot){caption.textContent='';return;}
  caption.textContent=w(shot.caption);stage.dataset.shot=i;
  sprites=(shot.sprites??[]).map(source=>({source,handle:makeSprite(g,stage,source.key,spriteAt(source,0))}));
  for(const layer of shot.textLayers??[]){
   const node=el('div',{class:'replay-text',text:layer.words},stage);
   Object.assign(node.style,{left:`${layer.x}%`,top:`${layer.y}%`,width:`${layer.width}%`,height:`${layer.height}%`,lineHeight:String(layer.lineHeight??1.05),color:layer.color??'#191d22',textAlign:layer.align??'center',justifyContent:layer.align==='left'?'flex-start':layer.align==='right'?'flex-end':'center'});
   layers.push({node,layer});
  }
  sizeText();draw();
 }
 const onHidden=()=>{if(document.hidden)stopSounds();last=performance.now();};document.addEventListener('visibilitychange',onHidden);
 show();button('replay-back',T.close,()=>results(g,data),root);
 const tick=now=>{
  if(!document.hidden&&shots.length){
   const duration=Math.max(1,shots[i].duration||1000);
   t=Math.min(duration,t+Math.max(0,Math.min(now-last,100)));draw();
   if(t>=duration){i=(i+1)%shots.length;t=0;show();}
  }
  last=now;frame=requestAnimationFrame(tick);
 };
 frame=requestAnimationFrame(tick);
 unmount=()=>{cancelAnimationFrame(frame);resize.disconnect();document.removeEventListener('visibilitychange',onHidden);stopSounds();};
}
addEventListener('popstate',()=>{const g=games.find(x=>x.id===new URLSearchParams(location.search).get('game'));g?menu(g):archive();});
addEventListener('pagehide',()=>{unmount();stopSounds();});
addEventListener('keydown',event=>{if(event.key==='Escape'&&parent!==window){event.preventDefault();parent.postMessage({type:'agd-holiday-close'},location.origin);}});
const initial=games.find(g=>g.id===params.get('game'));if(initial)intro(initial);else archive();
