const fs=require('node:fs'),path=require('node:path');const dir=__dirname,b=require('./semantic-batch.json');
const reviews={
 'faq/graduation/0':['retain','兩語保留入學年度112與113–115、16/20學分上限及類別/認列限制。這是語義核對，未重新驗原課表每頁。'],
 'faq/graduation/1':['revise','英文Special Talent Program容易與特殊選才混淆，改解釋性skills-excellence class並留技優班原名；最低128、0學分必修、一般班不可套技優班均保留。'],
 'faq/credit-transfer/0':['revise','日文將提出≠核准改白話，保留須自行確認退選與期限；窗口保留實際註冊課務組名。'],
 'faq/credit-transfer/1':['revise','英文credit waiver改credit-transfer以區別免修；兩語截止日期及不可假定補交的意義保留。日文其他窗口別名仍待全站統一。'],
 'faq/english/0':['retain','兩語區分分級免修與學分補足，8學分及入學年度核對均保留。未把免修等同學分取得。'],
 'faq/english/1':['retain','兩語均保留先確認適用測驗/分數/效期/替代方案再報考，以及不可照搬別校/往年資訊。'],
 'faq/status-military/0':['retain','兩語均保留登記日起含當日7日、逾期重新辦理與退費基準會變；沒有自行延長期限。日文再申請較泛，但本句未改行政規則。'],
 'faq/status-military/1':['revise','英問句/答案統一leave of absence及return to study，保留通知、更新聯絡資料與兵役另詢的三個動作。'],
 'faq/overseas-internship/0':['revise','日文同一学年段階可能被讀為年級，改同一の教育段階；英文same level of study並保留among other conditions，不把三條列舉當成全部資格。'],
 'faq/overseas-internship/1':['revise','英問句刪除casually by oneself直譯；兩語答案均保留保險/合法簽證、不可預設觀光簽、補助須依核定契約。'],
 'faq/overseas-study-visit/0':['retain','兩語均保留參訪≠實習/學分保證，須依當期課程/本系規定並先確認。英文大寫Overseas屬風格問題，未列為意義錯誤。'],
 'faq/overseas-study-visit/1':['retain','兩語均保留歷屆照片≠本期招募，以及年級/名額/費用/補助各自查證。'],
 'home/hero-tagline':['retain','英日均有將想像化為會動角色/故事的邀請語意，屬適合主視覺的文案轉譯，不要求逐字硬譯。'],
 'home/news-2026-10-06-unity-115-1':['retain','兩語保留證照名、11/14–15、D0625、20人及授課教師；未重新驗證當期開班或發照機構名稱。'],
 'home/news-2026-10-06-after-effects-115-1':['retain','兩語保留SSE-Adobe After Effects CC、12/5–6、D0625、20人及授課教師；未把原資料的證照名當成已完成發照官方核定。']
};for(const u of b.units){if(!reviews[u.id])throw Error('Missing manual disposition '+u.id);u.review={decision:reviews[u.id][0],note:reviews[u.id][1],reviewer:'Codex translation review; not native-speaker certification',facts_reverified: u.id==='faq/overseas-internship/0'||u.id==='faq/overseas-internship/1'?'MOE rule scope read; program-specific decisions remain official documents':'translation meaning compared with current canonical Chinese only'};}
fs.writeFileSync(path.join(dir,'semantic-reviewed.json'),JSON.stringify({...b,counts:{...b.counts,reviewed_units:b.units.length,retained_units:b.units.filter(u=>u.review.decision==='retain').length,revised_units:b.units.filter(u=>u.review.decision==='revise').length,reviewed_target_strings:54,source_faq_pairs_not_reviewed:18,whole_site_longform_complete:false}},null,2));
const facts=[
 {id:'selection',source:'https://www.jctv.ntut.edu.tw/enter42/apply/contents.php?academicYear=115&subId=182',access:'official full page read',scope:'115 FAQ first-stage Q3/Q6',finding:'總申請數上限6，學校可另限本校報名系科數；不得套用116。',names:'沒有查得此頁核定英日名。用Selection-Based Admission與甄選入学（選抜入試）是保留原制度的解釋性譯法，不冒稱官方名稱。'},
 {id:'skill',source:'https://www.jctv.ntut.edu.tw/enter42/skill/contents.php?academicYear=115&subId=160',access:'official full page read',scope:'115 application qualifications and Q10',finding:'技優甄審資格包含符合簡章採認的競賽、勞動部乙級以上等；不是僅高職應屆競賽得獎，亦非任意證照皆可。'},
 {id:'skill-procedures',source:'https://www.jctv.ntut.edu.tw/enter42/skill/contents.php?academicYear=115&subId=168',access:'official indexed system instructions read',scope:'115 system instructions',finding:'此頁另有乙級技術士報名說明；與四技二專技優FAQ交叉核對，未套用二技enter/的規則。'},
 {id:'technician-english',source:'https://laws.mol.gov.tw/Eng/PrintFLAWDAT0201.aspx?beginpos=2&id=FL015100',access:'official full page read',scope:'2023-11-02 English regulation; Article5/7 terminology',finding:'官方英語有Class B及technician/technical certificate。此處只核英語等級用語，不以技術士考照報名規定替代大學技優招生規定。日文以台灣勞動部+原名技術士證避免誤認日本技術士。'},
 {id:'xuehai-current',source:'https://edu.law.moe.gov.tw/LawContent.aspx?id=FL038574',access:'official full page read',scope:'2025-11-04 amendment; sections2/4',finding:'學海築夢為非新南向國家實習，新南向學海築夢另類；研修和實習不能混譯。受補助條件同一教育階段不是同年級。沒有將參與實習等同必得補助。'},
 {id:'xuehai-english',source:'https://english.moe.gov.tw/cp-14-16877-E246C-1.html',access:'official full page read',scope:'2016-06-30 news; historical usage only',finding:'教育部此舊英文新聞使用Pilot Overseas Internships。不能據此斷言2026正式唯一英文名，也未查得Building Dreams Overseas已核定。保留學海築夢原名，英文可解釋為overseas internship program；不把目前創意譯名判成已證實錯名。此輪未自動改新聞正式名稱。'},
 {id:'program-level',source:'https://ryugaku.jasso.go.jp/oversea_info/region/asia/taiwan/info_tw_university.html',access:'official full page read in initial audit; no changed numerical policy used',scope:'JASSO page updated2024-08-19',finding:'以4年制学士課程區別專科；校方英語介紹另有four-year undergraduate programs。這是學制說明而非資格等同認定。'},
 {id:'star-blocker',source:'https://www.jctv.ntut.edu.tw/star/?academicYear=115',access:'official full page read',scope:'115-04-22 bulletin; URL query115 even footer already116',finding:'115科技繁星錄取生不論是否放棄，都不得參加115四技二專甄選；舊文案暗示放棄即可走全部管道，仍需修正。已依root核定加入canonical key_notes、導覽提示與兩語全部精確引用；限115該項甄選限制，不擴成全部管道永久禁報。'}
];fs.writeFileSync(path.join(dir,'official-terminology.json'),JSON.stringify({checked_at:'2026-10-22',source_agent:'codex',entries:facts,unconfirmed:['未查得全國統一核定的甄選/技優英日官方譯名；採原中文+解釋性翻譯。','學海築夢/新南向學海築夢2026唯一英日官方名稱未核定。','個人採認證照職種對85商設及各校資格仍須讀當年對照表，不在本輪作個案核定。']},null,2));console.log('Reviewed 15 units / 54 target strings; 9 retain, 6 targeted revision; full-site longform remains incomplete.');
