// Independent pure-data negative cases. No browser, HTTP, capture or original-file mutation.
const test=require('node:test'),assert=require('node:assert/strict'),N=require('../qingming-error-domain-20261023/native-tools.cjs'),V=require('../qingming-error-domain-20261023/verify-native-run.cjs');
function fixture(){
 const selector='output[for="kite-angle"]',node={id:'numeric-angle',owner:'owner-angle',text:'0',ink:{x:5,y:5,width:10,height:10},unclipped_ink:{x:5,y:5,width:10,height:10},safe:{x:0,y:0,width:40,height:30},safe_sources:[{asset:'holiday-lab/assets/ui/panel.png',sha256:'panel'}],measurements:[{text:'0',baseline:15,advance:{x:5},baseline_probe:{range_unchanged:true,on_original_line:true}}]},fonts=[{familyName:'Microsoft JhengHei UI',postScriptName:'MicrosoftJhengHeiUIRegular',isCustomFont:false,glyphCount:1}];
 return {selector,node,expected:'0',fonts,allowed_fonts:fonts.map(({glyphCount,...x})=>x),font_receipt:{selector,nodeId:42,response:{fonts}},dom_receipt:{selector,document_node_id:1,query_response:{nodeId:42},description:{node:{nodeId:42,backendNodeId:90,nodeName:'OUTPUT',attributes:['for','kite-angle','data-layout-owner','owner-angle']}}},sample:{nodes:[node],blockers:[],violations:[]},shot:{clip:{x:0,y:0,width:320,height:900},before:{x:0,y:0},after:{x:0,y:0},scroll_unchanged:true},panel:'panel'};
}
test('equal text on a different numeric output cannot stand in for requested owner',()=>{
 const good=fixture();assert.equal(N.target(good).pass,true);
 const bad=fixture();bad.selector='output[for="kite-tension"]';bad.font_receipt.selector=bad.selector;bad.dom_receipt.selector=bad.selector;
 assert.equal(N.target(bad).pass,false,'unchanged original CDP for=angle must reject requested tension even both text0');
});
test('target absent from full sample, query-font node mismatch and unrelated font all reject',()=>{
 for(const mutate of [x=>x.sample.nodes=[],x=>x.dom_receipt.description.node.nodeId=43,x=>x.font_receipt.nodeId=43,x=>{x.fonts[0].familyName='Consolas';x.font_receipt.response.fonts=x.fonts;},x=>x.node.measurements[0].text='1',x=>x.sample.violations=['ORIGINAL_FAIL'],x=>x.shot.after.x=1]){const bad=fixture();mutate(bad);assert.equal(N.target(bad).pass,false);}
});
test('wrong fixed owner is rejected even matching text/font and self-consistent node IDs',()=>{
 const x=fixture();x.selector='#game-progress';x.font_receipt.selector=x.selector;x.dom_receipt.selector=x.selector;x.dom_receipt.description.node.nodeName='P';x.dom_receipt.description.node.attributes=['id','kite-status','data-layout-owner','owner-angle'];assert.equal(N.target(x).pass,false);
});
test('source time ordering and case/sample/PNG chain all fail closed',()=>{
 const before=[{finished:'2026-10-23T01:00:00Z'}],after=[{started:'2026-10-23T01:02:00Z'}];assert.equal(V.timeBound(before,'2026-10-23T01:01:00Z',after),true);assert.throws(()=>V.timeBound(before,'2026-10-23T01:03:00Z',after));
 const cp={index:0,previous_sha256:'0'.repeat(64),case_file:'0000.case.json',case_sha256:'case',sample_file:'0000.sample.json',sample_sha256:'sample',png_file:'0000.png',png_sha256:'png'};assert.equal(V.checkpoint(cp,0,'0'.repeat(64),'case','sample','png'),true);assert.throws(()=>V.checkpoint({...cp,png_sha256:'replaced'},0,'0'.repeat(64),'case','sample','png'));assert.throws(()=>V.checkpoint({...cp,previous_sha256:'wrong-chain'},0,'0'.repeat(64),'case','sample','png'));
});
test('calibration value claims require corresponding actual input/output and the correct control action',()=>{
 const axes=[{id:'kite-angle',values:[{string:'0'},{string:'1'}]},{id:'kite-length',values:[{string:'100'}]},{id:'kite-tension',values:[{string:'0'}]}],job={expected_status:'source status',expected_hint:'source hint',expected_progress:'0 / 3'},row={axis:'kite-angle',string:'0',dom:{text:'0'}},event={action:'range',detail:{id:'kite-angle',value:'0'},dom:{status:job.expected_status,hint:job.expected_hint,progress:job.expected_progress,inputs:[{id:'kite-angle',value:'0',output:'0'},{id:'kite-length',value:'100',output:'100'},{id:'kite-tension',value:'0',output:'0'}]}};
 assert.equal(V.calibrationEvent(row,event,job,axes),true);
 for(const change of [x=>x.dom.inputs[0].output='1',x=>x.dom.inputs[0].value='1',x=>x.dom.hint='not source hint',x=>x.detail.id='kite-tension',x=>x.dom.inputs.push({...x.dom.inputs[0]})]){const bad=structuredClone(event);change(bad);assert.throws(()=>V.calibrationEvent(row,bad,job,axes));}
 const step={axis:'kite-angle',string:'1',method:'native-stepper-plus'},click=structuredClone(event);click.action='click';click.detail='kite-angle-plus';click.dom.inputs[0]={id:'kite-angle',value:'1',output:'1'};assert.equal(V.calibrationEvent(step,click,job,axes),true);click.detail='kite-angle-minus';assert.throws(()=>V.calibrationEvent(step,click,job,axes));
});
module.exports={fixture};
