// 唯讀複核：只寫本報告資料夾；不產生 locale 或執行 Build。
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const out=__dirname,root=path.resolve(out,'../../..'),prior='holiday-lab/translation-review/dedicated-language-audit-20261023/findings.json';
const read=f=>fs.readFileSync(path.join(root,f),'utf8'),json=f=>JSON.parse(read(f)),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
const packet=json(prior),recommended=packet.findings.filter(r=>r.decision==='recommend');
const sourceFiles=new Set([prior,'data/faculty.json','locale-en.js','locale-ja.js','student-guide.jsx','data/ja/ui.json','scripts/build-translations.cjs','scripts/build-ja-translations.cjs']);
for(const r of recommended)for(const loc of [...r.canonical_locations,...r.en_definitions,...r.ja_definitions])sourceFiles.add(loc.file);
const before=Object.fromEntries([...sourceFiles].sort().map(f=>[f,sha(f)])),ctx={};
for(const lang of ['en','ja'])vm.runInNewContext(read(`locale-${lang}.js`)+`;this.${lang}=SITE_${lang.toUpperCase()}_MESSAGES;`,ctx);
const pointer=(obj,p)=>p.split('/').slice(1).reduce((v,k)=>v[k.replaceAll('~1','/').replaceAll('~0','~')],obj);
const roleDefinitions=new Map([
 ['系主任 · 副教授',['Department Chair · Associate Professor','学科長・准教授']],
 ['助理教授',['Assistant Professor','助教']],
 ['助理教授 · 電競娛樂系合聘',['Assistant Professor · Joint Appointment with Department of Esports and Entertainment Industries (電競娛樂系合聘)','助教・eスポーツエンターテインメント学科との共同任用（原職：助理教授・合聘）']],
 ['講師 · 電競娛樂系合聘',['Lecturer · Joint Appointment with Department of Esports and Entertainment Industries (電競娛樂系合聘)','講師・eスポーツエンターテインメント学科との共同任用（原職：講師・合聘）']],
 ['助理教授 · 從聘',['Assistant Professor · Secondary Appointment (從聘)','助教・共同任用（本学科は従たる所属）']],
 ['副教授 · 從聘',['Associate Professor · Secondary Appointment','准教授・共同任用（本学科は従たる所属）']],
 ['助理教授 · 留職停薪',['Assistant Professor · On Leave Without Pay (留職停薪)','助教・無給休職中']]
]);
const faculty=json('data/faculty.json');assert.equal(faculty.length,13);
const ranks=faculty.map((f,index)=>{const expected=roleDefinitions.get(f.role);assert.ok(expected,f.slug);assert.equal(ctx.en[f.role],expected[0],f.slug+' EN');assert.equal(ctx.ja[f.role],expected[1],f.slug+' JA');assert.ok(!/Teaching Assistant|ティーチング|助教授/u.test(expected.join(' ')));const supplementary=/合聘|從聘|留職停薪/u.test(f.role);return {index,slug:f.slug,name:f.name,canonical_path:`data/faculty.json#/${index}/role`,zh:f.role,en:ctx.en[f.role],ja:ctx.ja[f.role],core_rank_translation_accepted:'yes',exact_current_value_match:'yes',supplementary_appointment_official_ja_term_confirmed:supplementary?'pending':'not-applicable',individual_latest_appointment_recertified:'no',basis:['kyushu-current','jst','mext','kyushu-titles','stu-idd-index']};});
const reasons={
 PROGRAM:'二技學士與二專層次不可只用two-year college混在一起；保留原稱及本系名額待公告限制。JASSO本次全文可確認台灣専科学校及副學士，非日本資格法律等同。EN建議列舉語法可再順寫，不影響學制修正方向。',
 'JA-ABSENCE':'請假情境的長假不是預定校曆長期休暇；長期欠席及事後の欠席申請保留學生申請/核准差異。',
 'JA-EFFECTIVE-DATE':'中文生效日期是開始生效日，不是整段期間或發行日；有効開始日保義。',
 'JA-MAKEUP':'補修不必然已修過，不應限制為再履修；不足科目の追加履修可保缺科目的語意。認列也不擅加単位。',
 'EN-CERT-RECOGNITION':'畢業門檻認列不能自行加授予學分；另須完整保留獎助金，避免只剩certification awards而縮小補助範圍。',
 'EN-ENGLISH-RECOGNITION':'修課成績及能力證明是兩類送件，認列不等於一律認學分；新句保留送件後查檢核與未通過再核對。',
 'JA-APPLICATION-DOCUMENT':'自傳與自己推薦書不同；自伝附自己介紹/經歷說明保留原文件種類，未替學校命名新正式文件。',
 'EN-STUDENT-ASSISTANCE':'逐筆中文皆生輔組；英文Section有樹德學務處官方索引支持，僅名稱統一而不重派窗口或承諾受理。',
 'JA-CLEAR-BUTTON':'實際locale的按鈕值由data/ja/ui.json覆蓋為条件をリセット，原空結果句與按鈕不同；不是只看messages.json。',
 'JA-QUALIFICATION-NAME':'維持台灣勞動部乙級以上與職種限制；保留技術士證原名並說明台灣技能檢定，不建立日本技能士資格等同。',
 'EN-CONTACT-PLAIN':'point of contact/responsible office/office to contact保留找承辦及待確認，主要是可讀性與直譯問題，非新增校務規則。'
};
const valueRows=[];
for(const r of recommended){
  const locations=r.canonical_locations.map(loc=>{const actual=loc.pointer?pointer(json(loc.file),loc.pointer):read(loc.file);const normalized=s=>s.replace(/\s+/gu,' ').trim();assert.ok(loc.pointer?normalized(actual)===normalized(r.key):actual.includes(r.key),r.id+' canonical '+loc.file);return {...loc,canonical_matches:'yes',canonical_raw:loc.pointer?actual:r.key,comparison:loc.pointer?'whitespace-normalized canonical display key; original raw retained':'literal source inclusion'};});
  for(const lang of ['en','ja']){
    assert.equal(ctx[lang][r.key],r.current[lang],r.id+' current '+lang);
    for(const def of r[lang+'_definitions']){const raw=pointer(json(def.file),def.pointer);assert.equal(raw,def.raw,r.id+' raw '+def.file);}
    if(r.current[lang]===r.proposed[lang])continue;
    const refine=r.id==='EN-CERT-RECOGNITION-01';
    const revised=refine?r.proposed[lang].replace('certification awards','financial awards or subsidies'):r.proposed[lang];
    assert.notEqual(revised,r.current[lang]);
    valueRows.push({id:r.id,lang,priority:r.priority,key:r.key,canonical_locations:locations,current_en:ctx.en[r.key],current_ja:ctx.ja[r.key],current_value:ctx[lang][r.key],prior_proposal:r.proposed[lang],independent_proposal:revised,reason:reasons[r.group],current_needs_change:'yes',prior_semantic_direction_accepted:'yes',prior_exact_proposal_accepted:refine?'no':'yes',decision:refine?'refine-proposal':'retain-proposal',source_file_definitions:r[lang+'_definitions'],source_urls:r.source_urls,existing_guide_source_links:r.linked_canonical_sources,linked_procedures_newly_recertified:'no',checked_at:'2026-10-23'});
  }
}
assert.equal(valueRows.length,28);assert.equal(ctx.ja['清除篩選'],'条件をリセット');assert.equal(json('data/ja/ui.json')['清除篩選'],ctx.ja['清除篩選']);
const after=Object.fromEntries([...sourceFiles].sort().map(f=>[f,sha(f)]));assert.deepEqual(after,before,'Source drift during read-only recheck');
const result={checked_at:new Date().toISOString(),pass:true,scope:'Independent targeted source/rank and prior-proposal semantic recheck; not whole-site or native-speaker certification',counts:{faculty:ranks.length,distinct_role_keys:roleDefinitions.size,recommendation_keys:recommended.length,recommendation_values:valueRows.length,retain_exact_proposal:valueRows.filter(r=>r.decision==='retain-proposal').length,refine_proposal:valueRows.filter(r=>r.decision==='refine-proposal').length,source_files:sourceFiles.size},rank_rows:ranks,value_rows:valueRows,source_receipts:{before,after,stable:true},checks:{source_paths_and_current_values:'yes',ranks13_individually_listed:'yes',prior28_values_reviewed:'yes',new_official_japanese_rank_sources_read:'yes',individual_current_appointments_officially_recertified:'no',all_linked_school_procedures_newly_researched:'no',product_writes:'no',whole_site_native_language_certified:'no',locale_build_or_browser_run:'no'}};
fs.writeFileSync(path.join(out,'findings.json'),JSON.stringify(result,null,2));
const cell=x=>String(x).replaceAll('|','／').replaceAll('\n','<br>');
fs.writeFileSync(path.join(out,'REVIEW-TABLE.md'),'# 本次逐值複核\n\n|ID／語言／優先級|中文原文與來源|現譯|前案建議|本次建議／判斷|\n|---|---|---|---|---|\n'+valueRows.map(r=>`|${r.id}／${r.lang}／${r.priority}|${cell(r.key)}<br>${cell(r.canonical_locations.map(l=>l.file+(l.pointer||':'+l.line)).join('\n'))}|${cell(r.current_value)}|${cell(r.prior_proposal)}|${cell(r.independent_proposal)}<br>${r.decision}<br>${cell(r.reason)}|`).join('\n')+'\n');
console.log(JSON.stringify({pass:result.pass,counts:result.counts,checks:result.checks},null,2));
