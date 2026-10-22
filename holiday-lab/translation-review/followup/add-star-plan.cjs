const fs=require('node:fs');const p='holiday-lab/translation-review/followup/build-plan.cjs';let s=fs.readFileSync(p,'utf8');const addition=`
const starZh='115 學年度科技繁星錄取生，不論是否放棄，均不得參加當年度四技二專甄選入學；其他管道請依各招生簡章與報到／放棄規定辦理。';
const starEn='Students admitted through the Academic Year 115 Technical Star program may not participate in that year’s Four-Year/Two-Year Selection-Based Admission (四技二專甄選入學), whether or not they give up their place. For other pathways, follow each guide and its registration and withdrawal rules.';
const starJa='115学年度の科技繁星合格者は、入学資格を辞退したかどうかにかかわらず、当該年度の四技二専甄選入学（選抜入試）には出願できません。その他の入試区分は、それぞれの募集要項、入学手続き・辞退の規定に従ってください。';
tri('STAR-115-RESTRICTION','tech-star','key_notes/2','🚫 '+starZh,'🚫 '+starEn,'🚫 '+starJa);
const oldStarNote='科技繁星一旦錄取且未放棄資格，就不能再報名其他四技入學管道，記得先和學校老師討論順序。';
replace('STAR-115-GUIDE/zh','admission-policy','pages.jsx',JSON.stringify(oldStarNote),JSON.stringify(starZh));rename('STAR-115-GUIDE/en','admission-policy','data/en/ui.json',oldStarNote,starZh,starEn);rename('STAR-115-GUIDE/ja','admission-policy','data/ja/messages.json',oldStarNote,starZh,starJa);
`;
s=s.replace('const after={};',addition+'\nconst after={};');fs.writeFileSync(p,s);
const t='holiday-lab/translation-review/followup/apply-safe.test.mjs';s=fs.readFileSync(t,'utf8').replaceAll('All 72 exact operations','All 78 exact operations').replace('p.report.operations,72','p.report.operations,78');fs.writeFileSync(t,s);
const r='holiday-lab/translation-review/followup/record-review.cjs';s=fs.readFileSync(r,'utf8').replace('未納此72操作，已通知root。','已依root核定加入canonical key_notes、導覽提示與兩語全部精確引用；限115該項甄選限制，不擴成全部管道永久禁報。');fs.writeFileSync(r,s);
