'use strict';
// 唯讀重查工單問題；僅寫入腳本所在審閱資料夾，不執行 git、Build 或伺服器操作。
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
module.exports = (async () => {
  const root = __dirname;
  const site = path.dirname(root);
  const origin = 'http://127.0.0.1:8910';
  const get = async (p, method = 'GET') => {
    const u = new URL(p, origin + '/');
    if (u.origin !== origin) throw Error('禁止外部連線：' + u.origin);
    return fetch(u, {method, redirect: 'manual'});
  };
  const read = p => fs.readFile(path.join(site,p),'utf8');
  const loadJson = async p => {
    const r = await get('/'+p);
    if (r.status !== 200) throw Error(p+' HTTP '+r.status);
    const text = await r.text();
    if (text !== await read(p)) throw Error('供應資料與來源不同：'+p);
    return JSON.parse(text);
  };
  const messages = async lang => {
    const c=vm.createContext({});
    vm.runInContext(await read('locale-'+lang+'.js')+'\nthis.messages=SITE_'+lang.toUpperCase()+'_MESSAGES;',c);
    return c.messages;
  };
  const [en,ja,news,faculty,labs,works,stats,guide,studentSource] = await Promise.all([
    messages('en'),messages('ja'),loadJson('data/news.json'),loadJson('data/faculty.json'),
    loadJson('data/labs.json'),loadJson('data/works.json'),loadJson('data/stats.json'),
    loadJson('data/students/guide.json'),read('student-guide.jsx')
  ]);
  const flatten=(o,p='',out=[])=>{if(typeof o==='string')out.push({path:p,value:o});else if(o&&typeof o==='object')for(const k in o)flatten(o[k],p+'/'+k,out);return out;};
  const n=slug=>news.find(x=>x.slug===slug);
  const f=slug=>faculty.find(x=>x.slug===slug);
  const note='依學校及系所官方資料整理，閱讀限制已附在各項來源；尚未取得的當期規定保留提醒。本頁為審閱版本。';
  const checks=[];
  const add=(id,issuePresent,evidence)=>checks.push({id,issuePresent:!!issuePresent,evidence});
  add('E01',studentSource.includes(note)&&en[note].includes('review draft')&&ja[note].includes('レビュー版'),{zh:note,en:en[note],ja:ja[note]});
  add('E02',en['非應屆生個資登錄']==='Personal data registration for non-graduating students',{source:'非應屆生個資登錄',translation:en['非應屆生個資登錄']});
  const namePairs=[['tengshuyuan','2026-08-19-obsessive-reality-5-more-festivals','Deng Shu-yuan'],['chenmeijung','2026-08-19-obsessive-reality-5-more-festivals','Chen Mei-rong'],['yangchihchang','2026-04-08-unity-114-2','Yang Zhi-zhang']].map(([slug,newsSlug,variant])=>({slug,name:f(slug).name,profile:f(slug).en,newsSlug,variant,found:!!en[n(newsSlug).content.replace(/\s+/g,' ').trim()]?.includes(variant)}));
  add('E03',namePairs.every(x=>x.found),namePairs);
  const workVariantEntries=Object.entries(en).filter(([k,v])=>/人造人|神癒|喀嚓|今食堂/.test(k)&&/Android|Zephyranthes|Divine Healing|Holy Algorithm|Kacha|Click|Today Restaurant|Jin Diner/.test(v));
  add('E04',workVariantEntries.some(([k,v])=>v.includes('Android'))&&workVariantEntries.some(([k,v])=>v.includes('Zephyranthes'))&&workVariantEntries.some(([k,v])=>v.includes('Holy Algorithm'))&&workVariantEntries.some(([k,v])=>v.includes('Divine Healing')),workVariantEntries.map(([source,translation])=>({source,translation})));
  add('E05',n('2025-08-28-bahamut-acg').content.includes('陳政民')&&n('2025-05-21-fangshi-2025').content.includes('陳政名'),{first:n('2025-08-28-bahamut-acg').slug,second:n('2025-05-21-fangshi-2025').slug,variants:['陳政民','陳政名']});
  const leaks=flatten(guide).filter(x=>x.value.includes('holiday-lab/'));
  const metadataResults=[];
  for(const p of [...new Set(leaks.map(x=>x.value))]){const r=await get('/'+p,'HEAD');metadataResults.push({path:p,status:r.status});}
  add('E06',leaks.length>0,{fields:leaks,requests:metadataResults});
  const rawChecks=[];
  for(const type of ['faculty','news','stats','works'])for(const item of flatten(await loadJson('data/en/'+type+'.json')))if(item.value.includes('[CHECK]'))rawChecks.push({file:'data/en/'+type+'.json',...item});
  add('E07',rawChecks.length>0,{count:rawChecks.length,sample:rawChecks[0]});
  const duplicated=Object.entries(en).filter(([k,v])=>k.includes('邀請國際專家開設工作坊')&&v.includes('邀請國際專家開設工作坊'));
  add('E08',duplicated.length>0,duplicated.map(([source,translation])=>({source,translation})));
  const jp=Object.entries(ja).filter(([k,v])=>v.includes('官網'));
  add('E09',jp.length>0,jp.map(([source,translation])=>({source,translation})));
  const employment=stats.find(x=>x.slug==='employment');
  const metricEntries=Object.entries(en).filter(([k,v])=>k===employment.note||k===employment.subtitle);
  add('E10',metricEntries.some(([k,v])=>v.includes('Average Employment Rate'))&&metricEntries.some(([k,v])=>v.includes('Military Service')&&v.includes('Study Abroad')),metricEntries.map(([source,translation])=>({source,translation})));
  const lab=labs.find(x=>x.slug==='db101-1');
  add('E11',lab.name.includes('週邊'),{slug:lab.slug,name:lab.name});
  const index=await get('/'); const indexText=await index.text();
  const bundleName=[...indexText.matchAll(/<script[^>]*src=["']([^"']+)/g)][0][1];
  const bundleResponse=await get('/'+bundleName); const bundle=await bundleResponse.text();
  const output={checkedAt:new Date().toISOString(),method:'唯讀資料與語系字串重查；不是瀏覽器測試',bundle:bundleName,bundleSha256:crypto.createHash('sha256').update(bundle).digest('hex'),issueCount:checks.filter(x=>x.issuePresent).length,checks};
  const target=path.resolve(root,'findings-recheck.json');
  if(path.dirname(target)!==path.resolve(root))throw Error('範圍鎖');
  await fs.writeFile(target,JSON.stringify(output,null,2),'utf8');
  return {issueCount:output.issueCount,checks:checks.map(({id,issuePresent})=>({id,issuePresent})),output:target};
})();
