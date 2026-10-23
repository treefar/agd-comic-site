'use strict';
// Original global checks are immutable. Only explicit, evidenced non-target scroll
// diagnostics can be separated into the independent target-domain result.
const assert=require('node:assert/strict'),{validateBounded,CHECK_KEYS}=require('../engine-v4-root-review-20261023/bounded-guard.cjs');
const rect=r=>r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]))&&r.width>0&&r.height>0;
const disjoint=(a,b)=>a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y;
function classifyFlags(c,sample){
 const hidden=sample.evidence?.hidden_scroll_text,flags=sample.violations,proofs=[],reasons=[];
 const hiddenOK=Array.isArray(hidden)&&hidden.every(h=>typeof h.owner==='string'&&h.owner!==c.actual_owner&&typeof h.text==='string'&&h.text.trim()&&rect(h.ink)&&Array.isArray(h.clips)&&h.clips.length>0&&h.clips.every(x=>typeof x.id==='string'&&rect(x.bounds)&&typeof x.overflow==='string'&&/hidden|clip|auto|scroll/u.test(x.overflow))&&h.clips.some(x=>disjoint(h.ink,x.bounds)));
 const pending=Array.isArray(hidden)&&hidden.length?'SCROLL_CONTENT_PENDING '+hidden.length+' text nodes require additional actual scroll captures':null;
 if(!hiddenOK)reasons.push('hidden scroll ledger lacks exact non-target clipping proof');
 if(pending&&!flags.includes(pending))reasons.push('hidden scroll ledger has no exact original pending flag');
 for(const flag of flags){
  if(hiddenOK&&pending&&flag===pending){proofs.push({flag,classification:'proven_non_target_scroll',owners:hidden.map(h=>h.owner)});continue;}
  const matches=sample.nodes.filter(n=>n.owner!==c.actual_owner&&flag==='TEXT_CLIPPED_OR_UNREAD_SCROLL_CONTENT '+n.owner+' '+n.text&&rect(n.ink)&&rect(n.unclipped_ink)&&(n.ink.width<n.unclipped_ink.width-.1||n.ink.height<n.unclipped_ink.height-.1)&&n.ink.x>=n.unclipped_ink.x&&n.ink.y>=n.unclipped_ink.y&&n.ink.x+n.ink.width<=n.unclipped_ink.x+n.unclipped_ink.width+.000001&&n.ink.y+n.ink.height<=n.unclipped_ink.y+n.unclipped_ink.height+.000001);
  if(matches.length===1){proofs.push({flag,classification:'proven_non_target_scroll',owner:matches[0].owner,text:matches[0].text,ink:matches[0].ink,unclipped_ink:matches[0].unclipped_ink});continue;}
  reasons.push('target or unknown method flag: '+flag);
 }
 return {valid:reasons.length===0,proofs,reasons};
}
function validateDomain(target,data,binding){
 validateBounded(target,data,binding);const c=data.case,n=data.sample.nodes.find(n=>n.owner===c.actual_owner);
 assert.deepEqual(c.target_node,n,'saved target node mismatch');assert.equal(c.lang,target.lang);
 assert.ok(c.diagnostics&&Object.values(c.diagnostics).every(x=>Array.isArray(x)&&x.length===0),'native diagnostics not clear');
 assert.equal(c.rejection_identity.source_module,binding.bodies[binding.base+'games/labor.mjs'].sha256,'source module identity mismatch');
 const flags=classifyFlags(c,data.sample),target_checks=Object.fromEntries(CHECK_KEYS.filter(k=>k!=='method_flags').map(k=>[k,c.checks[k]]));
 return {schema:1,valid:Object.values(target_checks).every(Boolean)&&flags.valid,target_checks,flag_classification:flags,original_pass:c.pass,original_global_method_clear:c.global_method_clear,original_flags:[...data.sample.violations],global_ui_pass:c.pass,full_project_approved:false};
}
module.exports={validateDomain,classifyFlags,CHECK_KEYS};
