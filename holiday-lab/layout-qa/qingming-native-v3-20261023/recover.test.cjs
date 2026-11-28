'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const R=require('./recover.cjs');
const fixture=()=>({c:{nodes:[{owner:'kite-status',text:'錯句'}],blockers:[],replay_shot:null},s:{nodes:[{owner:'kite-status',text:'錯句'}],blockers:[],replay_shot:null,violations:[]}});
test('full nodes/blockers and original flags are mandatory',()=>{const {c,s}=fixture();assert.equal(R.guardPair(c,s),true);for(const change of [x=>delete x.nodes,x=>delete x.blockers,x=>delete x.violations,x=>x.nodes[0].text='截斷']){const bad=structuredClone(s);change(bad);assert.throws(()=>R.guardPair(c,bad));}});
test('node domain check rejects missing measurement rather than synthesizing it',()=>{assert.throws(()=>R.nodeChecks({text:'test',owner:'kite-status'}),/measurement/);});
