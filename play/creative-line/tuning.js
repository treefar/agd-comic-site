// 調校預設；可將面板複製的 JSON 貼在等號後。orbHitRadius 保留供後續碰撞規格確認。
window.TUNING = {
  common: { grabRadius:68, touchOffset:40, orbHitRadius:10, failFreeze:0.25, rewind:0.25, forgiveAfterFails:2, ghostAfterFails:3, checkpointAfterFails:6, checkpointRatio:0.25, maxSpeed:900 },
  step: { interval:0.083, maxJump:48 },
  ink: { sampleMs:50, angleMouse:70, angleTouch:90, costMouse:10, costTouch:7, regenAngle:30, regenPerSample:1.5, minSpeed:80, lowInk:30, shakeInk:15 },
  spring: { omega:14, zeta:0.85, afterimageMinSpeed:100, tiltMaxDeg:2.5, tiltSpeedDiv:160 },
  stars: { maxFails:2 }
};
(() => {
  if (new URLSearchParams(location.search).get('tune') !== '1') return;
  const defaults = JSON.parse(JSON.stringify(window.TUNING)), tuning = window.TUNING;
  const bounds = {
    grabRadius:[10,160,1],touchOffset:[0,100,1],orbHitRadius:[1,30,1],failFreeze:[0,1,.01],rewind:[.01,1,.01],
    forgiveAfterFails:[0,12,1],ghostAfterFails:[1,12,1],checkpointAfterFails:[1,20,1],checkpointRatio:[0,.75,.01],maxSpeed:[100,1800,10],
    interval:[.02,.3,.001],maxJump:[4,100,1],sampleMs:[10,200,1],angleMouse:[10,180,1],angleTouch:[10,180,1],
    costMouse:[0,30,1],costTouch:[0,30,1],regenAngle:[0,90,1],regenPerSample:[0,10,.1],minSpeed:[0,300,1],lowInk:[1,80,1],shakeInk:[0,50,1],
    omega:[2,30,.1],zeta:[.2,2,.01],afterimageMinSpeed:[0,500,1],tiltMaxDeg:[0,5,.1],tiltSpeedDiv:[40,500,1],maxFails:[0,10,1]
  };
  try {
    const saved=JSON.parse(localStorage.getItem('cl-tuning'));
    for(const [g,values] of Object.entries(tuning))for(const k of Object.keys(values)){
      const n=saved?.[g]?.[k], [min,max]=bounds[k];
      if(typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max)tuning[g][k]=n;
    }
  } catch {}
  addEventListener('DOMContentLoaded',()=>{
    const panel=document.createElement('aside');panel.id='cl-tune';panel.setAttribute('aria-label','手感調校');
    panel.style.cssText='position:fixed;right:8px;top:8px;width:min(320px,90vw);max-height:90vh;overflow:auto;background:rgba(0,0,0,.88);color:white;padding:10px;z-index:10000;font:14px/1.6 system-ui;box-sizing:border-box';
    document.body.appendChild(panel);
    const header=document.createElement('div');header.textContent='手感調校（拖曳移動）';header.style.cssText='touch-action:none;cursor:move';panel.appendChild(header);
    const stats=document.createElement('output');stats.id='cl-tune-stats';stats.style.display='block';panel.appendChild(stats);
    const body=document.createElement('div');body.id='cl-tune-body';body.hidden=true;panel.appendChild(body);body.appendChild(stats);
    const inputs=[];
    const persist=()=>{try{localStorage.setItem('cl-tuning',JSON.stringify(tuning));}catch{}};
    for(const [g,values] of Object.entries(tuning))for(const k of Object.keys(values)){
      const label=document.createElement('label'),value=document.createElement('output'),input=document.createElement('input');
      label.style.display='block';label.append(`${g}.${k} `,value);input.type='range';input.dataset.key=`${g}.${k}`;input.setAttribute('aria-label',`${g}.${k}`);
      [input.min,input.max,input.step]=bounds[k];input.value=tuning[g][k];value.textContent=input.value;
      if(k==='orbHitRadius')label.title='規格保留值；目前遮罩只查中心，調整此值不改碰撞';
      input.style.width='100%';input.oninput=()=>{tuning[g][k]=Number(input.value);value.textContent=input.value;persist();};label.appendChild(input);body.appendChild(label);inputs.push({input,value,g,k});
    }
    const area=document.createElement('textarea');area.setAttribute('aria-label','調校 JSON');area.style.cssText='display:none;width:100%;height:160px';body.appendChild(area);
    const button=(text,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;panel.insertBefore(b,body);return b;};
    const status=document.createElement('output');status.setAttribute('aria-live','polite');panel.insertBefore(status,body);
    button('複製 JSON',async()=>{const json=JSON.stringify(tuning,null,2);area.value=json;area.style.display='block';setExpanded(true);try{await navigator.clipboard.writeText(json);status.textContent='已複製';}catch{status.textContent='請在下方全選複製';area.focus();area.select();}});
    button('還原預設',()=>{for(const g of Object.keys(defaults))Object.assign(tuning[g],defaults[g]);try{localStorage.removeItem('cl-tuning');}catch{}inputs.forEach(({input,value,g,k})=>{input.value=tuning[g][k];value.textContent=input.value;});status.textContent='已還原';setExpanded(true);});
    const setExpanded=expanded=>{body.hidden=!expanded;collapse.textContent=expanded?'收合':'展開';collapse.setAttribute('aria-expanded',String(expanded));};
    const collapse=button('展開',()=>setExpanded(body.hidden));collapse.setAttribute('aria-controls',body.id);collapse.setAttribute('aria-expanded','false');
    let drag=null;
    header.onpointerdown=e=>{const b=panel.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:b.left,top:b.top};header.setPointerCapture(e.pointerId);e.preventDefault();};
    header.onpointermove=e=>{if(!drag)return;panel.style.right='auto';panel.style.left=Math.max(0,Math.min(innerWidth-panel.offsetWidth,drag.left+e.clientX-drag.x))+'px';panel.style.top=Math.max(0,Math.min(innerHeight-40,drag.top+e.clientY-drag.y))+'px';};
    header.onpointerup=header.onpointercancel=()=>{drag=null;};
    setInterval(()=>{const s=window.__cl?.stats;if(s)stats.textContent=`失誤 ${s.fails} · ${s.seconds.toFixed(1)} 秒 · 扣墨 ${s.jitterCount} 次 · 落後 ${s.springLag.toFixed(1)} px · 步數/秒 ${s.stepsPerSecond.toFixed(1)}`;},200);
  });
})();
