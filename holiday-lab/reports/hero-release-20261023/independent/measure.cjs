// DOM/Range observations only; no text, clock or application-state changes.
function measure(){
 const nodes=[],issues=[],orphans=[],rect=r=>({x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height});
 const visible=e=>{for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;}return !!e.getClientRects().length;};
 for(const e of document.querySelectorAll('#festival-preview h1,#festival-preview h2,#festival-preview h3,#festival-preview p,#festival-preview label,#festival-preview button,#festival-preview a,#festival-preview select')){
  if(!visible(e))continue;const s=getComputedStyle(e),owner=rect(e.getBoundingClientRect()),lines=[];if(e.tagName==='SELECT'){nodes.push({id:e.id,text:e.options[e.selectedIndex]?.text,font:s.fontFamily,fontSize:s.fontSize,owner,kind:'native-select'});continue;}
  const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){for(const seg of new Intl.Segmenter(document.documentElement.lang,{granularity:'grapheme'}).segment(n.data)){
   if(!seg.segment.trim())continue;const r=document.createRange();r.setStart(n,seg.index);r.setEnd(n,seg.index+seg.segment.length);const b=r.getBoundingClientRect();if(!b.width||!b.height)continue;let line=lines.find(l=>Math.abs(l.y-(b.y+scrollY))<2);if(!line){line={y:b.y+scrollY,text:'',left:b.x+scrollX,right:b.right+scrollX};lines.push(line);}line.text+=seg.segment;line.left=Math.min(line.left,b.x+scrollX);line.right=Math.max(line.right,b.right+scrollX);
   if((e.matches('button,a,label')||e.classList.contains('hero-tagline'))&&(b.left<e.getBoundingClientRect().left-1||b.right>e.getBoundingClientRect().right+1||b.top<e.getBoundingClientRect().top-1||b.bottom>e.getBoundingClientRect().bottom+1))issues.push({kind:'text-outside-owner',id:e.id,text:e.textContent,char:seg.segment,bounds:rect(b),owner});
  }}
  const row={id:e.id,tag:e.tagName,text:e.textContent,font:s.fontFamily,fontSize:s.fontSize,owner,lines};nodes.push(row);
  if(lines.length>1&&/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]\p{P}*$/u.test(lines.at(-1).text))orphans.push({id:e.id,text:row.text,lines:lines.map(l=>l.text)});
  if(e.scrollWidth>e.clientWidth+1)issues.push({kind:'owner-horizontal-overflow',id:e.id,text:row.text,scroll:e.scrollWidth,client:e.clientWidth});
  for(let a=e.parentElement;a&&a.id!=='hero';a=a.parentElement){const st=getComputedStyle(a);if(!['hidden','clip'].includes(st.overflowX)&&!['hidden','clip'].includes(st.overflowY))continue;const ar=rect(a.getBoundingClientRect());if(lines.some(l=>l.left<ar.x-1||l.right>ar.x+ar.width+1))issues.push({kind:'clipped-text-x',id:e.id,text:row.text,ancestor:a.id||a.className});}
 }
 if(document.documentElement.scrollWidth>innerWidth+1)issues.push({kind:'page-horizontal-overflow',scroll:document.documentElement.scrollWidth,width:innerWidth});
 return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,fonts:document.fonts.status,nodes,issues,orphans};
}
module.exports={measure};
