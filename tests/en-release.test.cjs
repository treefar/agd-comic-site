const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
test('No game assets or game routes are released',()=>{assert.equal(fs.existsSync('play'),false);assert.equal(fs.existsSync('data/play.json'),false);assert.doesNotMatch(fs.readFileSync('en-pages.jsx','utf8'),/PlayZone|PlayCard/);for(const p of ['dist/play','dist/data/play.json','dist/tests','dist/LATEST_HANDOFF.md'])assert.equal(fs.existsSync(p),false,p);});
test('All canonical field strings have exact English translations',()=>{assert.deepEqual(JSON.parse(fs.readFileSync('docs/qa/i18n-data-missing.json')),[]);});
test('Shared renderer translates labels, preserves filters and preserves Chinese rendering',()=>{
 const plain=fs.readFileSync('en-pages.jsx','utf8').split('const EnSubNav')[0];
 for(const english of [false,true]){
 const ctx={SITE_EN_MESSAGES:{'最新消息':'News','動畫':'Animation','聯絡我們':'Contact'},URL,URLSearchParams,Map,Set,React:{createElement:(type,props,...children)=>({type,props,children})},window:{location:{hash:'',search:english?'?lang=en':'',href:'https://example.test/'+(english?'?lang=en':'')},history:{replaceState(){}}},document:{}};
 vm.createContext(ctx);vm.runInContext(plain,ctx);
 const result=vm.runInContext('siteCreateElement("option",{value:"動畫",title:"聯絡我們"},"最新消息")',ctx);
 assert.equal(result.children[0],english?'News':'最新消息');assert.equal(result.props.value,'動畫');assert.equal(result.props.title,english?'Contact':'聯絡我們');
 assert.equal(vm.runInContext('siteText("共用未翻譯原文")',ctx),'共用未翻譯原文');
 }
});
test('Chinese style rules and all production images stay available',()=>{const crypto=require('node:crypto'),baseline=require('./production-baseline.json');const style=fs.readFileSync('styles.css','utf8').replace(/\r\n/g,'\n');assert.equal(crypto.createHash('sha256').update(style.slice(0,baseline.style.length)).digest('hex'),baseline.style.sha256);const path=require('node:path');function check(x){if(typeof x==='string'&&/^images\//.test(x))assert.ok(fs.existsSync(x),x);else if(Array.isArray(x))x.forEach(check);else if(x&&typeof x==='object')Object.values(x).forEach(check);}for(const f of fs.readdirSync('data').filter(f=>f.endsWith('.json')))check(JSON.parse(fs.readFileSync(path.join('data',f),'utf8')));});
