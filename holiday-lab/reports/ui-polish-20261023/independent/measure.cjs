// Read-only DOM text measurement: no game state or clock mutation.
function measure(){
 const rect=r=>({x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height});
 const show=e=>{for(let x=e;x;x=x.parentElement){const s=getComputedStyle(x);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;}return !!e.getClientRects().length;};
 const selector=e=>{if(e.id)return '#'+CSS.escape(e.id);const a=[];for(let x=e;x&&x!==document.body;x=x.parentElement){a.unshift(x.tagName.toLowerCase()+':nth-child('+([...x.parentElement.children].indexOf(x)+1)+')');if(x.parentElement?.id){a.unshift('#'+CSS.escape(x.parentElement.id));break;}}return a.join('>');};
 const rows=[],issues=[],orphans=[];const walk=document.createTreeWalker(document.querySelector('#lab')||document.body,NodeFilter.SHOW_TEXT);
 while(walk.nextNode()){
  const n=walk.currentNode,e=n.parentElement,text=n.textContent;if(!text.trim()||!show(e)||e.closest('script,style,option,#result-artifact'))continue;
  const s=getComputedStyle(e),range=document.createRange();range.selectNodeContents(n);const boxes=[...range.getClientRects()].filter(r=>r.width&&r.height).map(rect);if(!boxes.length)continue;
  const lines=[];for(let i=0;i<text.length;i++){range.setStart(n,i);range.setEnd(n,i+1);const r=range.getBoundingClientRect();if(!r.width||!r.height||!text[i].trim())continue;let line=lines.find(l=>Math.abs(l.y-(r.y+scrollY))<1);if(!line){line={y:r.y+scrollY,text:'',x:r.x+scrollX,right:r.right+scrollX};lines.push(line);}line.text+=text[i];line.x=Math.min(line.x,r.x+scrollX);line.right=Math.max(line.right,r.right+scrollX);}
  const row={selector:selector(e),text,family:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,boxes,lines,owner:rect(e.getBoundingClientRect()),overflowX:s.overflowX,overflowY:s.overflowY,fontsReady:document.fonts.status};rows.push(row);
  // Short last lines are reported separately; numbers/punctuation alone are not a CJK orphan.
  if(lines.length>1&&/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]\p{P}*$/u.test(lines.at(-1).text))orphans.push({selector:row.selector,text,lastLine:lines.at(-1).text,lines:lines.map(x=>x.text)});
  const button=e.closest('button,a'),owner=button||e;const br=rect(owner.getBoundingClientRect());
  if(button&&boxes.some(r=>r.x<br.x-1||r.x+r.width>br.x+br.width+1||r.y<br.y-1||r.y+r.height>br.y+br.height+1))issues.push({kind:'control-text-outside',selector:row.selector,text,boxes,control:br});
  for(let x=e;x&&x.id!=='lab';x=x.parentElement){const st=getComputedStyle(x);if(!['hidden','clip'].includes(st.overflowX)&&!['hidden','clip'].includes(st.overflowY))continue;const pr=rect(x.getBoundingClientRect()),bad=boxes.some(r=>(['hidden','clip'].includes(st.overflowX)&&(r.x<pr.x-1||r.x+r.width>pr.x+pr.width+1))||(['hidden','clip'].includes(st.overflowY)&&(r.y<pr.y-1||r.y+r.height>pr.y+pr.height+1)));if(bad&&!e.closest('.marquee'))issues.push({kind:'clipped-text',selector:row.selector,text,clip:selector(x),boxes,bounds:pr});}
 }
 return {url:location.href,width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,fontStatus:document.fonts.status,faces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight})),rows,issues,orphans};
}
module.exports={measure};
