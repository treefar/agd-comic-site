import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, change, project, submit, result, tasks, mount } from '../games/lantern.mjs';

const solve = (s, extra = 0) => {
  const t = tasks[s.level];
  s = change(s, 'lamp', 20 + extra);
  s = change(s, 'depth', t.depth);
  s = change(s, 'paper', (t.x + (20 + extra) * t.depth / 100) / (1 + t.depth / 100));
  return submit(change(s, 'order', t.order));
};
test('projection changes with lamp and depth, not just object position', () => {
  assert.deepEqual(project({ lamp: 20, paper: 50, depth: 50 }), { x: 65, scale: 1.5 });
  assert.notEqual(project({ lamp: 30, paper: 50, depth: 50 }).x, 65);
});
test('invalid inputs do not alter state; initial submission cannot win', () => {
  const s = createState();
  assert.deepEqual(change(s, 'depth', NaN), s);
  assert.deepEqual(change(s, 'lamp', 1000), s);
  assert.deepEqual(change(s, 'order', 'invented'), s);
  assert.equal(submit(s).level, 0);
  assert.equal(result(s), null);
});
test('three independent spatial tasks, failed ordering, and actual replay', () => {
  let s = createState();
  s = solve(s);
  assert.equal(s.level, 1);
  let candidate = change(s, 'depth', tasks[1].depth);
  candidate = change(candidate, 'paper', (tasks[1].x + candidate.lamp * .5) / 1.5);
  candidate = change(candidate, 'order', 'front');
  assert.equal(submit(candidate).level, 1);
  s = solve(s); s = solve(s);
  assert.equal(s.level, 3);
  const r = result(s);
  assert.equal(r.replay.length, 3);
  assert.equal(r.artifact.shots.length, 3);
  assert.ok(r.replay[1].sprites.some(s=>s.key==='token1'&&s.z===3));
  assert.ok(r.replay[1].sprites.some(s=>s.key==='token2'&&s.z===2));
  let other = createState();
  other = solve(other, 5); other = solve(other, 5); other = solve(other, 5);
  assert.notDeepEqual(result(other).artifact, r.artifact);
  assert.equal(createState().level, 0);
});
test('mount controls finish in all three languages; destroy prevents later completion',()=>{
  for(const lang of ['zh','en','ja']){
    const handlers={},pictures=new Map(),completions=[];
    const checkWords=v=>{for(const l of ['zh','en','ja'])assert.equal(typeof v[l],'string');};
    const ctx={lang,ui:{text:(_id,v)=>{checkWords(v);return {};},setText:(_e,v)=>checkWords(v),slider:o=>{checkWords(o.label);handlers[o.id]=o.onInput;return {setValue(){}};},choice:o=>{checkWords(o.label);o.options.forEach(x=>checkWords(x.label));handlers[o.id]=o.onChange;return {setValue(){}};},button:o=>{checkWords(o.label);handlers[o.id]=o.onClick;return {}; }},sprite:(key,p)=>{pictures.set(p.id,{key,...p});return {update:q=>pictures.set(p.id,{...pictures.get(p.id),...q}),remove:()=>pictures.delete(p.id)};},hint:checkWords,setProgress(){},sound(){},complete:r=>completions.push(r)};
    const mounted=mount(ctx);
    handlers['lan-check']();assert.equal(completions.length,0);
    for(const [depth,paper,order]of [[20,57.5,'front'],[50,43.3,'back'],[75,48.6,'front']]){
      handlers['lan-lamp'](20);handlers['lan-depth'](depth);handlers['lan-paper'](paper);handlers['lan-order'](order);
      const expected=project({lamp:20,paper,depth}).x;
      assert.ok(Math.abs(pictures.get('lan-shadow').x-expected)<.001);
      handlers['lan-check']();
    }
    assert.equal(completions.length,1);assert.equal(completions[0].replay.length,3);
    mounted.destroy();handlers['lan-check']();assert.equal(completions.length,1);assert.equal(pictures.size,0);
  }
});
