// Proposal only: change exactly the eligibility paragraph, leaving all other content untouched.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),norm=s=>s.replace(/\s+/g,' ').trim(),sha=s=>createHash('sha256').update(s).digest('hex');
const zh=JSON.parse(read('data/admission.json')).find(x=>x.slug==='selection').content,en=JSON.parse(read('data/en/admission.json')).find(x=>x.slug==='selection').content,ja=JSON.parse(read('data/ja/messages.json'))[norm(zh)];
const old={zh:'適用對象：高職 / 綜合高中應屆畢業生（採統測成績）',en:'Target Audience: Graduating seniors from vocational high schools / comprehensive high schools (using TCTE scores)',ja:'適用対象：専門高校／総合高校の卒業見込者（統測成績を利用）'};
const proposed={
 zh:'115學年度一般組：高職等專業群科畢業生不限應屆；普通科畢業滿1年，或符合簡章同等學力等資格者也可申請。綜高應屆須截至高三上修畢專門學程25學分。普通科應屆原則不適用；若截至高三上跨選專業群科或專門學程達25學分或450小時，依簡章另核。須取得115統測成績，且符合群類、校系及其他資格限制；青年儲蓄帳戶組另核。',
 en:'General group, Academic Year 115: Eligible graduates and graduating students of vocational/professional programs, general-track high school graduates who graduated at least one year ago, and applicants meeting the guide’s equivalent-qualification or other eligibility provisions may apply. Graduating comprehensive high school students must have completed 25 credits in a specialized program by the end of the first semester of their final year. Current-year general-track graduates are generally ineligible; those who have completed 25 credits or 450 hours of cross-enrolled vocational/professional or specialized-program courses by that semester require separate assessment under the guide. Applicants must have AY 115 TCTE scores and meet examination-category, program and other eligibility restrictions. The Youth Savings Account group has separate requirements.',
 ja:'115学年度一般枠：専門群科の卒業者・条件を満たす卒業見込者、普通科卒業後1年以上の者、募集要項の同等学力等の条件を満たす者が対象です。総合高校の卒業見込者は、高校最終学年の前期末までに専門課程（專門學程）25単位の修得が必要です。普通科の卒業見込者は原則対象外ですが、その時点までに専門群科または専門課程の科目を跨選（他課程の科目履修）して25単位または450時間に達する場合は、募集要項に基づく個別確認が必要です。115学年度の統測成績に加え、受験区分、志望学科等の条件とその他の出願資格制限も満たす必要があります。青年貯蓄口座枠は別途確認してください。'
};
const replace=(s,a,b)=>{if(s.split(a).length!==2)throw Error('EXPECTED_ONE_ELIGIBILITY_PARAGRAPH');return s.replace(a,b);};
const next={zh:replace(zh,old.zh,proposed.zh),en:replace(en,old.en,proposed.en),ja:replace(ja,old.ja,proposed.ja)};
const files=['data/admission.json','data/en/admission.json','data/ja/messages.json'].map(file=>({file,before_sha256:sha(read(file))}));
const plan={checked_at:'2026-10-23',source_commit:'329da94a490f24f80c998aceb5b637de22090987',scope:'Selection admission eligibility paragraph only; proposal, not product changes',files,paragraphs:{old,proposed},changes:[
 {id:'selection-content-zh',kind:'set-record',file:'data/admission.json',slug:'selection',field:'content',old:zh,new:next.zh},
 {id:'selection-content-en',kind:'set-record',file:'data/en/admission.json',slug:'selection',field:'content',old:en,new:next.en},
 {id:'selection-content-ja',kind:'rename-key',file:'data/ja/messages.json',oldKey:norm(zh),newKey:norm(next.zh),old:ja,new:next.ja}
]};
fs.writeFileSync(path.join(__dirname,'exact-plan.json'),JSON.stringify(plan,null,2)+'\n');console.log(JSON.stringify({operations:plan.changes.length,files:files.map(f=>f.file),paragraphs:proposed},null,2));
