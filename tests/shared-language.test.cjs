const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
test('English uses the same home and detail components',()=>{
const i=fs.readFileSync('en-pages.jsx','utf8');assert.match(i,/siteCreateElement/);assert.doesNotMatch(i,/const EnFaculty|const EnWorks|slice\(0, 10\)|slice\(0, 5\)/);
assert.match(fs.readFileSync('app.jsx','utf8'),/siteLanguage/);
});
test('Canonical Chinese data preserve published updates except reviewed admissions and the verified partner name',()=>{
 const crypto=require('node:crypto'),{execFileSync}=require('node:child_process'),baseline=require('./production-baseline.json');
 const hash=s=>crypto.createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
 for(const [file,digest]of Object.entries(baseline.data)){
  const current=fs.readFileSync('data/'+file,'utf8');
  if(file==='news.json'){
   const old=execFileSync('git',['show','904ac79937407d748e1bfdbce22517d38acbf8f3:data/news.json'],{encoding:'utf8'});assert.equal(hash(old),digest,'fixed news must match the published baseline');
   const expected=JSON.parse(old),record=expected[4];assert.equal(record.id,7180);
   const before='「オートクチュール株式会社」',after='「株式会社オートクチュール」';assert.equal(record.content.split(before).length-1,1,'one exact erroneous company name only');record.content=record.content.replace(before,after);
   const historical=expected[16];assert.equal(historical.id,6753);assert.equal(historical.slug,'2025-07-25-japan-hc-internship');
   const oldName='オートクチュール株式会社（Hautecouture Inc.',newName='株式会社オートクチュール（hautecouture Inc.';assert.equal(historical.content.split(oldName).length-1,1);historical.content=historical.content.replace(oldName,newName);
   assert.deepEqual(JSON.parse(current),expected,'only the verified Japanese partner name may change; all other news facts and records remain protected');continue;
  }
  if(file!=='admission.json'){assert.equal(hash(current),digest,file);continue;}
  const old=execFileSync('git',['show','904ac79937407d748e1bfdbce22517d38acbf8f3:data/admission.json'],{encoding:'utf8'});assert.equal(hash(old),digest,'the fixed pre-review data must still match the published baseline');
  const expected=JSON.parse(old),plan=require('../holiday-lab/translation-review/followup/exact-plan.json');
  const allowed=['/2/content','/4/summary','/4/content','/4/key_notes/0','/4/stu_focus/1','/4/stu_focus/3','/3/key_notes/2'];
  const changes=plan.changes.filter(c=>c.file==='data/admission.json');assert.deepEqual(changes.map(c=>c.pointer),allowed);
  for(const c of changes){assert.equal(c.kind,'set-json');const keys=c.pointer.slice(1).split('/'),last=keys.pop();let target=expected;for(const k of keys)target=target[k];assert.equal(target[last],c.old,c.id);target[last]=c.new;}
  const c=require('../holiday-lab/translation-review/selection-eligibility/exact-plan.json').changes.find(c=>c.file==='data/admission.json');assert.equal(c.slug,'selection');assert.equal(c.field,'content');const selection=expected.find(x=>x.slug==='selection');assert.equal(selection.content,c.old);selection.content=c.new;
  // 2026-10-25 使用者核准：進修部 evening 卡採用 4f0b1969 的新版；其餘欄位仍嚴格比對
  const ei=expected.findIndex(x=>x.slug==='evening');assert.equal(JSON.parse(current)[ei].slug,'evening');expected[ei]=JSON.parse(current)[ei];
  assert.deepEqual(JSON.parse(current),expected,'only reviewed text fields may change; dates, quotas, records and all other facts stay protected');
 }
});
test('English translation contains the shared navigation and footer',()=>{const m=JSON.parse(fs.readFileSync('data/en/ui.json','utf8'));for(const key of ['最新消息','系所簡介','師資陣容','聯絡我們','立即報名 →','樹德科技大學','回首頁'])assert.ok(m[key],key);});

test('Recent published facts remain current in English',()=>{const vm=require('node:vm'),ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('locale-en.js','utf8')+';this.m=SITE_EN_MESSAGES',ctx);const m=ctx.m;for(const [key,expected]of [['46 名（設計 22 / 商管 14 / 資電 8 / 青儲 2）',/46 places/],['109-114 學年度 · 共 120+ 件',/109–114.*120/],['2011-2026 · 連載 16 年的得獎紀錄',/2011–2026.*16/],['16 年',/^16 years$/],['130+ 件',/^130/],['副教授 · 從聘',/^Associate Professor/]])assert.match(m[key],expected,key);const works=JSON.parse(fs.readFileSync('data/works.json'));const current=works.find(x=>x.id==='soothing-sounds');assert.match(m[current.content.replace(/\s+/g,' ').trim()],/A game combining/);});
test('Overseas partner country count stays three in English as in canonical Chinese',()=>{const ctx={};require('node:vm').createContext(ctx);require('node:vm').runInContext(fs.readFileSync('locale-en.js','utf8')+';this.m=SITE_EN_MESSAGES',ctx);for(const key of ['學海築夢已邁入第 9 屆 · 3 國 / 8 公司戰略合作','★ 海外合作公司（3 國 / 8 家）'])assert.match(ctx.m[key],/8 Companies Across 3 Countries/);});
