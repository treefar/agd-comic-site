const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
test('English uses the same home and detail components',()=>{
const i=fs.readFileSync('en-pages.jsx','utf8');assert.match(i,/siteCreateElement/);assert.doesNotMatch(i,/const EnFaculty|const EnWorks|slice\(0, 10\)|slice\(0, 5\)/);
assert.match(fs.readFileSync('app.jsx','utf8'),/siteLanguage/);
});
test('Canonical Chinese data preserve published updates',()=>{const crypto=require('node:crypto');const baseline=require('./production-baseline.json');for(const [file,digest]of Object.entries(baseline.data))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('data/'+file,'utf8').replace(/\r\n/g,'\n')).digest('hex'),digest,file);});
test('English translation contains the shared navigation and footer',()=>{const m=JSON.parse(fs.readFileSync('data/en/ui.json','utf8'));for(const key of ['最新消息','系所簡介','師資陣容','聯絡我們','立即報名 →','樹德科技大學','回首頁'])assert.ok(m[key],key);});

test('Recent published facts remain current in English',()=>{const vm=require('node:vm'),ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('locale-en.js','utf8')+';this.m=SITE_EN_MESSAGES',ctx);const m=ctx.m;for(const [key,expected]of [['46 名（設計 22 / 商管 14 / 資電 8 / 青儲 2）',/46 places/],['109-114 學年度 · 共 120+ 件',/109–114.*120/],['2011-2026 · 連載 16 年的得獎紀錄',/2011–2026.*16/],['16 年',/^16 years$/],['130+ 件',/^130/],['副教授 · 從聘',/^Associate Professor/]])assert.match(m[key],expected,key);const works=JSON.parse(fs.readFileSync('data/works.json'));const current=works.find(x=>x.id==='soothing-sounds');assert.match(m[current.content.replace(/\s+/g,' ').trim()],/A game combining/);});
