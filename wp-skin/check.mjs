// 漫畫外衣回歸檢查：守住 comic-edition 風格硬規則與「不影響首頁」
// 用法：node wp-skin/check.mjs   → 全過離開碼 0，有錯離開碼 1
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify, buildHeader, buildFooter } from './build.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, 'comic-skin.css'), 'utf8');
const bar = readFileSync(join(here, 'comic-bar.html'), 'utf8');
const min = minify(css);
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };

// 1. 圓角一律 0
for (const m of min.matchAll(/border-radius:([^;}]+)/g)) {
  ok(/^0(\s*!important)?$/.test(m[1].trim()), `圓角不是 0：border-radius:${m[1]}`);
}

// 2. 陰影只能實心偏移（第三個長度必須是 0，不能有模糊）
for (const m of min.matchAll(/(box-shadow|text-shadow):([^;}]+)/g)) {
  const val = m[2].replace(/!important/, '').trim();
  if (val === 'none') continue;
  for (const layer of val.split(/,(?![^(]*\))/)) {
    const lens = layer.replace(/inset/, '').match(/-?\d*\.?\d+(px)?(?=\s|$)/g) || [];
    ok(lens.length < 3 || parseFloat(lens[2]) === 0, `出現模糊陰影：${m[1]}:${layer.trim()}`);
  }
}

// 3. 每條規則都要限定範圍：body:not(.home)、#agdc-bar 或 :root，避免蓋到首頁
const blocks = min.replace(/@media[^{]+\{/g, '').split('}');
for (const b of blocks) {
  const sel = b.split('{')[0].trim();
  if (!sel || !b.includes('{')) continue;
  for (const one of sel.split(',')) {
    const s = one.trim();
    ok(/^(body(\.page)?:not\(\.home\)|#agdc-bar|:root)/.test(s), `選擇器沒有限定範圍：${s}`);
  }
}

// 4. 不准出現深色模式
ok(!/prefers-color-scheme/.test(min), '不應該做深色模式');

// 5. 色票必須跟漫畫版線上版一致
for (const [name, hex] of [['paper', '#f4ecd8'], ['ink', '#0f0d0a'], ['red', '#e63946'], ['blue', '#1d4ed8'], ['yellow', '#ffd60a']]) {
  ok(new RegExp(`--agdc-${name}:\\s*${hex}`).test(min), `色票 ${name} 不是 ${hex}`);
}

// 6. 橫幅腳本：首頁不插、不重複插、連回首頁
ok(/classList\.contains\('home'\)/.test(bar), '橫幅沒有排除首頁');
ok(/getElementById\('agdc-bar'\)/.test(bar), '橫幅沒有防重複');
ok(/href = 'https:\/\/www\.dgd\.stu\.edu\.tw\/'/.test(bar), '橫幅連結不是漫畫版首頁');

// 7. 產出的 HFCM 片段結構正確，且大括號成對
const header = buildHeader(css);
ok(/<style id="agdc-skin"[^>]*>[\s\S]+<\/style>/.test(header), 'header 片段缺 <style>');
ok((min.match(/\{/g) || []).length === (min.match(/\}/g) || []).length, 'CSS 大括號不成對');
ok(/^<!--[\s\S]*<script>[\s\S]*<\/script>\n$/.test(buildFooter(bar)), 'footer 片段格式不對');

if (fails.length) {
  console.error(`FAIL ${fails.length} 項：\n- ` + fails.join('\n- '));
  process.exit(1);
}
console.log(`PASS 全部檢查通過（CSS ${min.length} 字元）`);
