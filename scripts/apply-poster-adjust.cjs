// 把調整模式「複製全部設定」的 JSON 寫進 data/student-work-draw.json 的 focus.manual。
// 用法：node scripts/apply-poster-adjust.cjs <設定檔.json> [--data <作品資料路徑>]
//   設定檔格式：{ "<作品id>": { "zoom": 1.2, "cx": 0.5, "cy": 0.4, "side": "left" }, "<作品id>": null }
//   null＝拿掉該張的手動設定（回到自動取景）。每筆都先驗證，有任何一筆不合法就整份不寫。
const fs = require('node:fs'), path = require('node:path');
function apply(data, adjust) {
  const ids = new Set(data.map(w => w.id)), out = JSON.parse(JSON.stringify(data)), log = [];
  for (const [id, m] of Object.entries(adjust)) {
    if (!ids.has(id)) throw new Error('找不到作品 id：' + id);
    const work = out.find(w => w.id === id);
    if (m === null) { if (work.focus && work.focus.manual) { delete work.focus.manual; log.push(id + '：移除手動設定'); } continue; }
    if (typeof m !== 'object' || Array.isArray(m)) throw new Error(id + '：設定必須是物件或 null');
    const zoom = Number(m.zoom), cx = Number(m.cx), cy = Number(m.cy);
    if (!(zoom >= 1 && zoom <= 3)) throw new Error(id + '：zoom 必須在 1 到 3 之間');
    if (!(cx >= 0 && cx <= 1 && cy >= 0 && cy <= 1)) throw new Error(id + '：cx、cy 必須在 0 到 1 之間');
    if (m.side !== undefined && !['left', 'right'].includes(m.side)) throw new Error(id + '：side 只能是 left 或 right');
    if (!work.focus) throw new Error(id + '：缺少 focus');
    work.focus.manual = { zoom: +zoom.toFixed(3), cx: +cx.toFixed(3), cy: +cy.toFixed(3), ...(m.side ? { side: m.side } : {}) };
    log.push(id + '：zoom ' + work.focus.manual.zoom + '、cx ' + work.focus.manual.cx + '、cy ' + work.focus.manual.cy + (m.side ? '、標題' + (m.side === 'left' ? '靠左' : '靠右') : ''));
  }
  return { data: out, log };
}
module.exports = { apply };
if (require.main === module) {
  const args = process.argv.slice(2), di = args.indexOf('--data'), dataPath = di >= 0 ? args.splice(di, 2)[1] : path.resolve(__dirname, '../data/student-work-draw.json');
  if (!args[0]) { console.error('用法：node scripts/apply-poster-adjust.cjs <設定檔.json> [--data <作品資料路徑>]'); process.exit(2); }
  const adjust = JSON.parse(fs.readFileSync(args[0], 'utf8').replace(/^﻿/, '')), data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const { data: next, log } = apply(data, adjust);
  const text = JSON.stringify(next, null, 2) + '\n';
  if (!text.trim()) throw new Error('序列化結果為空，不寫檔');
  fs.writeFileSync(dataPath, text);
  console.log(log.length ? log.join('\n') : '沒有任何變更');
}
