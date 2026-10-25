// One cancellable timer drives both preview and the short decelerating draw.
const StudentWorkDrawModel = Object.freeze({
  delays: Object.freeze([350, 400, 500, 650, 800]),
  // 調整模式（?adjust=1）：cx,cy = 要放在畫面正中央的海報位置（佔寬高比例），zoom >= 1（不留空白，不小於滿版）。
  // 回傳海報在畫面框內的實際寬高與左上角，拖曳與滑桿都由此換算。
  manualGeometry(manual, ratio, frameWidth, frameHeight) {
    if (!(ratio > 0 && frameWidth > 0 && frameHeight > 0)) throw Error('A poster ratio and frame size are required');
    const zoom = Math.min(Math.max(Number(manual && manual.zoom) || 1, 1), 3), cx = Math.min(Math.max(manual && manual.cx != null ? Number(manual.cx) : 0.5, 0), 1), cy = Math.min(Math.max(manual && manual.cy != null ? Number(manual.cy) : 0.5, 0), 1);
    const height = Math.max(frameWidth / ratio, frameHeight) * zoom, width = height * ratio;
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    return {width, height, left: clamp(frameWidth / 2 - cx * width, frameWidth - width, 0), top: clamp(frameHeight / 2 - cy * height, frameHeight - height, 0), zoom, cx, cy};
  },
  // The subject's horizontal extent (focus.x, measured in the automatic framing) follows the poster when it is moved or enlarged.
  remapExtent(extent, ratio, frameWidth, frameHeight, geometry) {
    const auto = StudentWorkDrawModel.manualGeometry({zoom:1,cx:0.5,cy:0.5}, ratio, frameWidth, frameHeight), clamp = v => Math.min(Math.max(v, 0), 1);
    const move = x => clamp((geometry.left + ((x * frameWidth - auto.left) / auto.width) * geometry.width) / frameWidth);
    const out = [+move(extent[0]).toFixed(3), +move(extent[1]).toFixed(3)];
    if (out[1] - out[0] >= 0.05) return out;
    const low = Math.min(out[0], 0.95);
    return [+low.toFixed(3), +Math.min(1, low + 0.05).toFixed(3)];
  },
  // Desktop framing (2026-10-25 使用者裁定：只用滿版裁切，不縮小整張、不加模糊底).
  // focus.subject = protagonist top/bottom as a share of poster height. When it fits the visible band the band is centred on it;
  // when it does not fit, the band starts at the protagonist's top so the face stays, and fits=false reports the poster for review.
  compose(focus, frameWidth, frameHeight) {
    const s = focus && focus.subject;
    if (!focus || !(focus.ratio > 0) || !Array.isArray(s) || s.length !== 2 || !(s[0] >= 0 && s[0] < s[1] && s[1] <= 1)) throw Error('A poster ratio and protagonist range are required');
    if (!(frameWidth > 0 && frameHeight > 0)) throw Error('A positive frame size is required');
    if (focus.ratio >= frameWidth / frameHeight) return {fit:'cover', y:50, x:focus.x, fits:true};
    const visible = frameHeight * focus.ratio / frameWidth; // share of the poster height on screen when it fills the width
    const fits = s[1] - s[0] <= visible;
    const top = Math.min(Math.max(fits ? (s[0] + s[1]) / 2 - visible / 2 : s[0], 0), 1 - visible);
    return {fit:'cover', y:+(100 * top / (1 - visible)).toFixed(1), x:focus.x, fits};
  },
  // Desktop only: put the hero copy in the wider free strip beside the poster's subject.
  // focus.x = [left,right] extent of the subject as a fraction of the frame width.
  layout(focus, surfaceWidth, margin = 0.035, minWidth = 220, forceSide = null) {
    if (!focus || !Array.isArray(focus.x) || focus.x.length !== 2 || !(focus.x[0] >= 0 && focus.x[0] < focus.x[1] && focus.x[1] <= 1)) throw Error('A valid subject extent is required');
    if (!(surfaceWidth > 0)) throw Error('A positive frame width is required');
    const freeLeft = focus.x[0], freeRight = 1 - focus.x[1], side = forceSide === 'left' || forceSide === 'right' ? forceSide : freeRight > freeLeft + 1e-9 ? 'right' : 'left';
    // The buttons (about 0.22 of the frame with margin) go to the opposite strip when it is wide enough, else stack under the title.
    // With the title on the right they always go left: stacking there would sit on the info panel in the bottom-right corner.
    const otherFree = side === 'left' ? freeRight : freeLeft;
    return {side, copyWidth: Math.max(minWidth, Math.round(((side === 'left' ? freeLeft : freeRight) - margin) * surfaceWidth)), actions: side === 'right' || otherFree >= 0.22 ? 'opposite' : 'stack'};
  },
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
      goto(i) { if (!destroyed && Number.isInteger(i) && i >= 0 && i < count) {cancel();index = i;previous = i;target = null;step = 0;phase = 'preview';paused = true;emit();} },
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
