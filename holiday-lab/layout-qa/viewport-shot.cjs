// CDP viewport capture preserves internal scroll. Full-page capture resets it on this browser.
async function captureViewport(page,cdp){
 const read=()=>page.evaluate(()=>({window:{x:scrollX,y:scrollY,width:innerWidth,height:innerHeight},internal:[...document.querySelectorAll('#lab *')].filter(e=>e.scrollHeight>e.clientHeight&&/auto|scroll/.test(getComputedStyle(e).overflowY)).map((e,i)=>({id:e.id||e.dataset.layoutOwner||'scroll-'+i,top:e.scrollTop,left:e.scrollLeft}))}));
 const before=await read(),clip={x:before.window.x,y:before.window.y,width:before.window.width,height:before.window.height,scale:1},result=await cdp.send('Page.captureScreenshot',{format:'webp',quality:72,clip,captureBeyondViewport:false}),after=await read();
 return {bytes:Buffer.from(result.data,'base64'),clip,before,after,scroll_unchanged:JSON.stringify(before)===JSON.stringify(after),region:'actual viewport; document coordinates in clip; no viewport resizing'};
}
module.exports={captureViewport};
