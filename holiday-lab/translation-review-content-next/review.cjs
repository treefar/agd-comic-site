// Plans only; never writes product files.
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'../..'),read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')),inv=read('holiday-lab/translation-review-content-next/inventory.json'),norm=s=>s.replace(/\s+/g,' ').trim(),escape=s=>s.replace(/~/g,'~0').replace(/\//g,'~1');
const rows=inv.selected.map(r=>({...r,decisions:{en:{action:'retain',proposed:r.en,reason:'逐句對照，保留日期、數字、申請條件、作品內容及原文的敘述強度；正式專名認證另列。'},ja:{action:'retain',proposed:r.ja,reason:'逐句對照，原意可理解，無須為增加改動數量重寫；正式專名認證另列。'}}}));
function replaceText(id,lang,oldPart,newPart,reason){const r=rows.find(r=>r.id===id);if(!r)throw Error('Unknown '+id);const d=r.decisions[lang];if(!d.proposed.includes(oldPart))throw Error('Missing fragment '+id+' '+oldPart);d.proposed=d.proposed.replace(oldPart,newPart);if(d.action!=='revise')d.reasons=[];d.reasons.push(reason);d.action='revise';d.reason=d.reasons.join('；');}
function replaceAllText(id,lang,value,reason){const r=rows.find(r=>r.id===id);r.decisions[lang]={action:'revise',proposed:value,reason};}
for(const id of ['CONTENT-02','CONTENT-04','CONTENT-07'])replaceText(id,'ja','本日より定員に達し次第締切','告知日から受付を開始し、定員に達し次第締切','歷史公告的即日起指公告日，不讓日語讀者誤以為每次開頁的今天才開始；日期、名額及出席條件原樣保留。');
replaceAllText('CONTENT-08','en','Design goes global: AGD’s ninth Japan internship cohort · Four students join HC','第九屆是第九批次，不擅推成九年；避免Enter HC Company to Challenge Japanese Workplace逐字英語。四人及日本實習訊息保留。');
replaceAllText('CONTENT-09','en','Under the Ministry of Education’s 學海築夢 overseas internship program, four students joined hautecouture Inc. (HC) in Matsuyama, Ehime, Japan for nearly three months. Led by 張純雅, the group also took part in exchanges on regional revitalization and traditional crafts in Seiyo and Tobe.','分清實習地點、帶隊老師與兩地交流；學海築夢保留制度原名，不把Building Dreams Overseas假稱教育部核定英文名；教師中文姓名保留，不創造正式羅馬拼寫。');
replaceText('CONTENT-10','en','has entered its 9th year','has welcomed its ninth cohort','屆次不自行推成年數；公司正式名、原譯與本人自用拼寫另以可追查更動處理。');
replaceText('CONTENT-10','en','"Building Dreams Overseas" (學海築夢) overseas internship program','"學海築夢" overseas internship program','制度原名與摘要一致，不把未核英文解釋名當作核定正式名稱。');
replaceText('CONTENT-10','en','オートクチュール株式会社','株式会社オートクチュール','合作公司官方about頁直接列日本名及英文名，且有樹徳科技大学2015合作史與松山據點；原名順序會指向另一不同公司，須三語原文與鍵遷移一起修。');
replaceText('CONTENT-10','en',"Previous Session's Results Landed as AR Guide","The Previous Cohort’s Work Becomes an AR Guide",'上一屆是前一批實習生，AR導覽是成果實作；原譯Session和Landed不自然。');
replaceText('CONTENT-10','en','AGD Chair Deng Shu-yuan (鄧樹遠)','AGD Chair 鄧樹遠','原中文只列姓名；Deng不是網站canonical採用的TENG。此段保留原中文姓名，避免新增另一套未核定羅馬字。');
replaceText('CONTENT-10','ja','オートクチュール株式会社','株式会社オートクチュール','合作企業自有官方公司概要明列法定名順序；需中文canonical同批修正並遷移該長句key，不能只改可見日文。');
replaceText('CONTENT-10','ja','が採用され、インターンシップ期間中は','が選抜され、インターンシップ期間中は','中文錄取指實習遴選，不擴為正式僱用採用。');
replaceText('CONTENT-10','ja','前期の成果がARガイドとして実装','前回の実習成果がARガイドに','上一屆不是上學期；避免前期暗示學期制度。');
replaceText('CONTENT-10','ja','前期のインターン生','前回のインターン生','逐筆修上一屆時間單位，不把前一批學生變成上學期學生。');
replaceText('CONTENT-10','ja','学生の世界進出と学用合一を推進します','学生が世界で活躍し、学びを実践に生かせるよう支援します','學用合一未翻成日本讀者能懂的說明；保留學習結合實務的意思，不新增核准或就業保證。');
replaceAllText('CONTENT-13','ja','アニメとゲームデザイン学科 2026年コンペティション実績','佳績榜包含入圍，受賞実績可能誤認全部已得獎；用中性競賽實績。');
replaceAllText('CONTENT-14','ja','4つのコンペティションで計14件の選出・ノミネート · 卒業制作7作品','14件是跨競賽入圍紀錄，不能譯成14部不同作品；另明列實際7部畢製，保留4競賽。');
replaceAllText('CONTENT-16','ja','21件以上の選出・ノミネート · ヨーロッパ・アメリカ・アジア・オセアニアの4大陸','入圍不一律是提名；用選出・ノミネート保留不同影展階段。21+及四大洲不動，歐洲與美洲明列避免欧米合字造成讀者誤數。');
replaceText('CONTENT-17','ja','将来必ず自分に本当に合った方向性を見つけられる','将来、自分に本当に合った方向性を見つけられる可能性がある','中文仍有機會不能譯成必ず保證，原採訪原文亦只說chance；不改故事、受訪者與展出事實。');
const w=rows.find(r=>r.id==='CONTENT-18');replaceAllText('CONTENT-18','en',w.en.replace('Co-created by','The 2D animated short The Stolen Recipe (《失竊的祕方》) was co-created by').replace('and advised by Professor Chen Mei-rong (陳美蓉), the 2D animated short film The Stolen Recipe (《失竊的祕方》).','with 陳美蓉 as faculty advisor.'),'原句為懸空片語；以完整句交代四名作者與指導關係，老師不擅升為Professor職級，保留原中文姓名。既有作品英名與學生羅馬拼寫尚未認證，保留並列中文。');
replaceAllText('CONTENT-19','ja','デザイン力で世界へ！アニメとゲームデザイン学科の日本でのインターンシップが第9期を迎える','日本海外重複；清楚說在日本實習，原第九期不變。');
function pointerGet(o,p){for(const t of p.slice(1).split('/'))o=o[t.replace(/~1/g,'/').replace(/~0/g,'~')];return o;}
function pointerFind(o,predicate,p=''){if(typeof o==='string')return predicate(o,p)?[p]:[];if(!o||typeof o!=='object')return[];return Object.entries(o).flatMap(([k,v])=>pointerFind(v,predicate,p+'/'+escape(k)));}
const enDataFiles=fs.readdirSync(path.join(root,'data/en')).filter(f=>f.endsWith('.json')).map(f=>'data/en/'+f),ops=[];
for(const r of rows)for(const lang of ['en','ja']){const d=r.decisions[lang];if(d.action!=='revise'||d.proposed===r[lang])continue;let file,pointer;
 if(lang==='ja'){file='data/ja/messages.json';pointer='/'+escape(r.key);}
 else{const overlay=['data/en/ui.json','data/en/student-guide-ui.json','data/en/guide-labels.json','data/en/step-details-ui.json','data/en/editorial.json','data/en/flow-ui.json'].reverse().find(f=>Object.hasOwn(read(f),r.key));if(overlay){file=overlay;pointer='/'+escape(r.key);}else{const candidates=[];for(const f of enDataFiles)for(const p of pointerFind(read(f),v=>v.replace(/\s*\[CHECK\]/g,'').trim()===r.en))candidates.push({file:f,pointer:p});const preferred=candidates.filter(c=>c.file===r.file.replace('data/','data/en/'));if(preferred.length===1)({file,pointer}=preferred[0]);else if(candidates.length===1)({file,pointer}=candidates[0]);else throw Error('Ambiguous active source '+r.id+' '+JSON.stringify(candidates));}}
 ops.push({id:r.id+'-'+lang,lang,file,pointer,key:r.key,old:pointerGet(read(file),pointer),expected_active_old:r[lang],new:d.proposed,reason:d.reason,requires_canonical_key_migration:r.id==='CONTENT-10',applied:false});}
const head=rows.find(r=>r.id==='CONTENT-10'),newZh=head.zh.replace('オートクチュール株式会社','株式会社オートクチュール');
const canonicalProposal={id:'HC-CANONICAL-NAME',file:head.file,pointer:head.pointer,old:head.zh,new:newZh,new_key:norm(newZh),requires_ja_key_migration:{file:'data/ja/messages.json',from:head.key,to:norm(newZh)},reason:'合作方官方公司概要、松山據點與樹德合作歷史逐一交叉核對。另有同名但不同公司，不能只憑拼音或一個樣本推別名。',status:'proposal only; root must apply source and dictionary key migration together'};
const summary={source_units:rows.length,target_values:rows.length*2,revised_values:ops.length,retained_values:rows.length*2-ops.length,canonical_proposals:1};
fs.writeFileSync(path.join(__dirname,'reviewed.json'),JSON.stringify({date:'2026-10-23',summary,rows},null,2)+'\n');fs.writeFileSync(path.join(__dirname,'exact-plan.json'),JSON.stringify({date:'2026-10-23',product_modified:false,operations:ops,canonical_proposals:[canonicalProposal]},null,2)+'\n');console.log(JSON.stringify(summary));
