import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, change, fold, unfold, result, coverage, mount } from '../games/dragon-boat.mjs';
const step = (s, leaf, angle) => fold(change(change(change(s, 'leaf', leaf), 'angle', angle), 'face', 'inside'));
test('folded plane projects over paper filling; an open plane cannot cover it', () => {
  assert.equal(coverage('left', 0), 0);
  assert.ok(coverage('left', 140) > .9);
  assert.ok(coverage('top', 160) > .9);
});
test('wrong order, wrong face, and invalid angle never complete', () => {
  let s = createState();
  assert.deepEqual(change(s, 'angle', Infinity), s);
  assert.deepEqual(change(s, 'leaf', 'unknown'), s);
  assert.equal(step(s, 'top', 160).folded.length, 0);
  s = change(change(s, 'angle', 140), 'face', 'outside');
  assert.equal(fold(s).folded.length, 0);
  assert.equal(result(s), null);
});
test('unfold restores previous stage and the final artifact uses actual angles', () => {
  let s = step(createState(), 'left', 140);
  assert.equal(s.folded.length, 1);
  const undone = unfold(s);
  assert.equal(undone.folded.length, 0);
  s = step(s, 'right', 140); s = step(s, 'top', 160);
  assert.equal(s.folded.length, 3);
  assert.equal(result(s).replay.length, 3);
  let other = step(createState(), 'left', 145);
  other = step(other, 'right', 145); other = step(other, 'top', 165);
  assert.notDeepEqual(result(s).artifact, result(other).artifact);
  assert.equal(createState().folded.length, 0);
});
test('mount permits wrong fold, retry, undo and actual completion in three languages',()=>{
  for(const lang of ['zh','en','ja']){
    const handlers={},pictures=new Map(),completions=[];
    const checkWords=v=>{for(const l of ['zh','en','ja'])assert.equal(typeof v[l],'string');};
    const ctx={lang,ui:{text:(_id,v)=>{checkWords(v);return {};},setText:(_e,v)=>checkWords(v),slider:o=>{checkWords(o.label);handlers[o.id]=o.onInput;return {setValue(){}};},choice:o=>{checkWords(o.label);o.options.forEach(x=>checkWords(x.label));handlers[o.id]=o.onChange;return {setValue(){}};},button:o=>{checkWords(o.label);handlers[o.id]=o.onClick;return {}; }},sprite:(key,p)=>{pictures.set(p.id,{key,...p});return {update(){},remove:()=>pictures.delete(p.id)};},hint:checkWords,setProgress(){},sound(){},complete:r=>completions.push(r)};
    const mounted=mount(ctx);
    handlers['fold-commit']();assert.equal(completions.length,0);
    handlers['fold-angle'](140);handlers['fold-commit']();
    handlers['fold-unfold']();assert.equal(completions.length,0);
    for(const [leaf,angle]of [['left',140],['right',140],['top',160]]){
      handlers['fold-leaf'](leaf);handlers['fold-angle'](angle);handlers['fold-face']('inside');handlers['fold-commit']();
    }
    assert.equal(completions.length,1);assert.equal(completions[0].artifact.folds[2].angle,160);
    mounted.destroy();handlers['fold-commit']();assert.equal(completions.length,1);assert.equal(pictures.size,0);
  }
});
