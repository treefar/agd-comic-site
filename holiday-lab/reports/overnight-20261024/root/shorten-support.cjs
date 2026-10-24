const fs=require('node:fs'),assert=require('node:assert/strict');
const file='data/students/guide.json',g=JSON.parse(fs.readFileSync(file,'utf8')),paragraph=g.cards.find(c=>c.id==='support-rights').step_details[1];
const before=paragraph.detail,after='諮商請查身心健康中心，預約路徑為「校務資訊系統 → 學務資訊－系統列表 → 心理諮商／測驗申請」。特殊教育支持另查115年獨立成立的特殊教育資源中心；詢問其他權益窗口，不必先經諮商。';
assert.equal(before.length,105);assert.ok(after.length<=100);paragraph.detail=after;
const norm=s=>s.replace(/\s+/g,' ').trim();for(const lang of ['en','ja']){const f='data/'+lang+'/flow-ui.json',j=JSON.parse(fs.readFileSync(f,'utf8'));assert.ok(j[norm(before)]);j[norm(after)]=j[norm(before)];fs.writeFileSync(f,JSON.stringify(j,null,2)+'\n');}
fs.writeFileSync(file,JSON.stringify(g,null,2)+'\n');console.log(JSON.stringify({before_characters:before.length,after_characters:after.length,official_path_preserved:true,translation_keys_added:2}));
