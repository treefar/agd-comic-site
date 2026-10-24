// One cancellable timer drives both preview and the short decelerating draw.
const StudentWorkDrawModel = Object.freeze({
  delays: Object.freeze([350, 400, 500, 650, 800]),
  pick(count, previous, random = Math.random) {
    if (!Number.isInteger(count) || count < 1) throw Error('A nonempty catalog is required');
    if (count === 1) return 0;
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw Error('Random value must be in [0,1)');
    const slot = Math.floor(value * (count - 1));
    return slot >= previous ? slot + 1 : slot;
  },
  create(count, notify, clock = {setTimeout:(fn,delay) => globalThis.setTimeout(fn,delay), clearTimeout:id => globalThis.clearTimeout(id)}, random = Math.random) {
    if (!Number.isInteger(count) || count < 1) throw Error('A nonempty catalog is required');
    let timer = null, destroyed = false, visible = true, reduced = false, paused = false;
    let phase = 'preview', index = 0, previous = null, target = null, step = 0;
    const emit = () => { if (!destroyed) notify({phase, index, reduced, paused, visible, timerActive:timer !== null}); };
    const cancel = () => { if (timer !== null) clock.clearTimeout(timer); timer = null; };
    const schedule = (delay, fn) => { timer = clock.setTimeout(() => {timer = null;if (!destroyed) fn();}, delay);emit(); };
    const finish = () => { cancel(); index = target === null ? index : target; previous = index; target = null; phase = 'settled';emit(); };
    const preview = () => {
      cancel();
      if (!destroyed && phase === 'preview' && visible && !reduced && !paused) schedule(1800, () => {index = (index + 1) % count;preview();});
      else emit();
    };
    const tick = () => {
      if (!visible || reduced || step === StudentWorkDrawModel.delays.length - 1) {finish();return;}
      index = StudentWorkDrawModel.pick(count,index,random);step++;
      schedule(StudentWorkDrawModel.delays[step],tick);
    };
    const api = {
      start() {
        if (destroyed || phase === 'drawing') return;
        cancel();target = StudentWorkDrawModel.pick(count,previous === null ? index : previous,random);step = 0;phase = 'drawing';
        if (reduced || !visible) finish();else schedule(StudentWorkDrawModel.delays[0],tick);
      },
      stop() { if (!destroyed) {if (phase === 'drawing') finish();else {paused = true;preview();}} },
      togglePause() { if (!destroyed && phase === 'preview') {paused = !paused;preview();} },
      environment(isVisible, reduceMotion) {
        if (destroyed) return;
        visible = Boolean(isVisible);reduced = Boolean(reduceMotion);
        if (phase === 'drawing') {if (!visible || reduced) finish();}
        else preview();
      },
      destroy() {cancel();destroyed = true;}
    };
    preview();return api;
  }
});
