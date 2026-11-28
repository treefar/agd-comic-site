// 新對話接手只讀檢查：C節SHA、8897 HTTP 與量測建置 SHA 比對（不改任何產品檔）
const fs = require('fs'), crypto = require('crypto'), http = require('http'), path = require('path');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');

// C節擷取方式沿用 work-orders/20261024/save-newchat-handoff.cjs
const t = fs.readFileSync('C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md', 'utf8');
const i = t.indexOf('## C. 要使用者決定的事（Codex 不要自己做）');
const s = t.slice(i), n = s.slice(1).search(/\r?\n## /);
const out = { c_section: sha(n < 0 ? s : s.slice(0, n + 1)), c_expected: '95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680' };
out.c_ok = i >= 0 && out.c_section === out.c_expected;

const site = '.measure-poster-corner-20261024-03';
const get = u => new Promise(r => http.get(u, res => { const a = []; res.on('data', d => a.push(d)); res.on('end', () => r({ status: res.statusCode, body: Buffer.concat(a) })); }).on('error', e => r({ status: 0, err: String(e) })));

(async () => {
  out.http = [];
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const js = walk(site).filter(p => /app-[A-Z0-9]+\.js$/.test(p)).map(p => path.relative(site, p).split(path.sep).join('/'));
  for (const p of ['index.html', ...js]) {
    const r = await get('http://127.0.0.1:8897/' + (p === 'index.html' ? '' : p));
    out.http.push({ path: p, status: r.status, same_sha_as_build: r.body ? sha(r.body) === sha(fs.readFileSync(path.join(site, p))) : false });
  }
  for (const p of ['?lang=en', '?lang=ja', 'progress/']) { const r = await get('http://127.0.0.1:8897/' + p); out.http.push({ path: p, status: r.status }); }
  out.pass = out.c_ok && out.http.every(h => h.status === 200 && h.same_sha_as_build !== false);
  console.log(JSON.stringify(out, null, 1));
  process.exitCode = out.pass ? 0 : 1;
})();
