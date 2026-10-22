import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, change, frame, capture, result, tasks, mount } from '../games/national-day.mjs';
const solve = (s, foreground = 22) => {
  const t = tasks[s.level];
  for (const [k, v] of Object.entries({ camera:t.camera, fore:foreground, mid:t.coast - 50 + t.camera*.5, far:t.ridge - 50 + t.camera*.2, order:'normal' })) s = change(s, k, v);
  return capture(s);
};
test('camera produces different parallax at three depths', () => {
  const a = frame(change(createState(), 'camera', -10));
  const b = frame(change(createState(), 'camera', 10));
  assert.ok(Math.abs(a.fore-b.fore) > Math.abs(a.mid-b.mid));
  assert.ok(Math.abs(a.mid-b.mid) > Math.abs(a.far-b.far));
});
test('occlusion, wrong depth order, and invalid inputs prevent a shot', () => {
  const initial = createState();
  assert.equal(capture(initial).level, 0);
  assert.deepEqual(change(initial, 'camera', NaN), initial);
  assert.deepEqual(change(initial, 'fore', 100), initial);
  let s = solve(initial, 0);
  assert.equal(s.level, 0);
  s = change(initial, 'order', 'reversed');
  assert.equal(capture(s).level, 0);
  assert.equal(result(initial), null);
});
test('three checked camera positions produce a real sequence, reset and alternate layout differ', () => {
  let s = createState(); s = solve(s); s = solve(s); s = solve(s);
  assert.equal(s.level, 3);
  assert.equal(result(s).replay.length, 3);
  assert.deepEqual(result(s).artifact.shots.map(x=>x.camera), [-12,0,12]);
  let other = createState(); other=solve(other,26); other=solve(other,26); other=solve(other,26);
  assert.notDeepEqual(result(s).artifact, result(other).artifact);
  assert.equal(createState().level, 0);
});
test('all three languages can capture using UI callbacks and sprite centers match sightline geometry',()=>{
  for(const lang of ['zh','en','ja']){
    const handlers={},pictures=new Map(),completions=[];
    const checkWords=v=>{for(const l of ['zh','en','ja'])assert.equal(typeof v[l],'string');};
    const ctx={lang,ui:{text:(_id,v)=>{checkWords(v);return {};},setText:(_e,v)=>checkWords(v),slider:o=>{checkWords(o.label);handlers[o.id]=o.onInput;return {setValue(){}};},choice:o=>{checkWords(o.label);o.options.forEach(x=>checkWords(x.label));handlers[o.id]=o.onChange;return {setValue(){}};},button:o=>{checkWords(o.label);handlers[o.id]=o.onClick;return {}; }},sprite:(key,p)=>{pictures.set(p.id,{key,...p});return {update(){},remove:()=>pictures.delete(p.id)};},hint:checkWords,setProgress(){},sound(){},complete:r=>completions.push(r)};
    const mounted=mount(ctx);
    handlers['island-capture']();assert.equal(completions.length,0);
    for(const [camera,mid,far]of [[-12,-1,-4],[0,0,0],[12,1,4]]){
      handlers['island-fore'](22);handlers['island-mid'](mid);handlers['island-far'](far);handlers['island-camera'](camera);handlers['island-order']('normal');
      assert.equal(pictures.get('island-scene-3').x,50-camera*.6);
      handlers['island-capture']();
    }
    assert.equal(completions.length,1);assert.deepEqual(completions[0].artifact.shots.map(s=>s.camera),[-12,0,12]);
    mounted.destroy();handlers['island-capture']();assert.equal(completions.length,1);assert.equal(pictures.size,0);
  }
});
