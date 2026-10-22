// Real internal scroll coverage, measured grapheme by grapheme. Accessibility != safe-layout PASS.
async function observeScroll(page,selector,onFrame=async()=>{}){
 const initial=await page.locator(selector).evaluate(e=>({top:e.scrollTop,height:e.clientHeight,max:e.scrollHeight-e.clientHeight,text:e.textContent}));
 const seen=new Set(),positions=[];let expected=[];
 for(let top=0;;top=Math.min(initial.max,top+Math.max(1,Math.floor(initial.height/2)))){
  await page.locator(selector).evaluate((e,top)=>{e.scrollTop=top;},top);await page.waitForTimeout(35);
  const sample=await page.locator(selector).evaluate(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e),left=b.left+parseFloat(s.borderLeftWidth),right=b.right-parseFloat(s.borderRightWidth),up=b.top+parseFloat(s.borderTopWidth),bottom=b.bottom-parseFloat(s.borderBottomWidth),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),seen=[],expected=[];let node,n=0;while(node=walker.nextNode()){for(const p of new Intl.Segmenter(document.documentElement.lang,{granularity:'grapheme'}).segment(node.textContent)){if(!p.segment.trim())continue;const id=n++;expected.push({id,char:p.segment});const r=document.createRange();r.setStart(node,p.index);r.setEnd(node,p.index+p.segment.length);const box=r.getBoundingClientRect();if(box.width&&box.height&&box.left>=left-.1&&box.right<=right+.1&&box.top>=up-.1&&box.bottom<=bottom+.1)seen.push(id);}}return {top:e.scrollTop,seen,expected};});
  expected=sample.expected;sample.seen.forEach(i=>seen.add(i));positions.push({top:sample.top,visible:sample.seen});await onFrame(positions.length-1);
  if(top===initial.max)break;
 }
 await page.locator(selector).evaluate((e,top)=>{e.scrollTop=top;},initial.top);
 const missing=expected.filter(c=>!seen.has(c.id));return {selector,method:'actual scrollTop at half-client-height increments and per-grapheme real Range within actual element overflow clip; does not substitute viewport for writable paper',initial,positions,expected_nonspace:expected.length,seen_nonspace:seen.size,missing,all_content_reachable:missing.length===0,text_unchanged:await page.locator(selector).textContent()===initial.text};
}
module.exports={observeScroll};
