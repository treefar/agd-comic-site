const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = 'C:/agywork/agd-holiday-prototypes';
const out = __dirname;
const input = 'holiday-lab/reports/comprehensive-audit-20261023/translation-candidates.json';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const original = fs.readFileSync(path.join(root, input));
const expected = 'af09e4a8764b3a86adbd6d4ffbd3ecd5cb896a6e1f4386e091ff97dbdc0456b2';
if (sha(original) !== expected) throw Error('input drift');
const data = JSON.parse(original);
const rows = data.rows.filter(r => !r.direct_semantic_subset);
const ptr = (o,p) => p.slice(1).split('/').map(s=>s.replace(/~1/g,'/').replace(/~0/g,'~')).reduce((v,k)=>v[k],o);
const norm = s => s.replace(/\s+/g,' ').trim();
const source = (id,title,url,read_scope,claims,limitations=[]) => ({id,title,url,owner:'官方原始來源',accessed_at:'2026-10-23',access_method:'web 搜尋服務擷取官方頁文字；直接請求未取得全文',read_scope,claims,limitations});
const sources = [
 source('S1','學務處英文組織與服務','https://en.sao.stu.edu.tw/organization/','Student Assistance Section 標題及其職掌段落',['生活輔導組對應英文為 Student Assistance Section；職掌涵蓋減免、獎助、請假及兵役。'],['直接開啟403；本次讀到搜尋服務擷取文字，不聲稱即時網頁全文。','搜尋metadata的舊刊登日期不等於目前內文更新日期。']),
 source('S2','生活輔導組組織與成員','https://life.sao.stu.edu.tw/en/單位介紹/組織與成員/','中文頁首、組長單位及各職掌表中急難／獎助／減免／請假／兵役項目',['中文單位確為生活輔導組，職掌與S1對應。'],['URL含/en/但實讀是中文，不冒稱正式英文或日文頁。','不抄用姓名電話，避免不同舊頁承辦人資訊不一致。']),
 source('S3','學務處英文簡介','https://en.sao.stu.edu.tw/introduction/','Organization 列表',['同樣使用 Student Assistance Section。'],['其他單位英文列法與組織頁不同；不能推論全處所有英文名稱已同步。']),
 source('S4','急難慰助申請須知','https://life.sao.stu.edu.tw/急難救助/急難慰問/','頁首、申請須知、對象及依各方案期限申請段落',['該急難專區由生活輔導組網站提供。'],['直接開啟403；不在本輪重新核定所得門檻或申請期限。']),
 source('S5','校內獎助學金','https://life.sao.stu.edu.tw/獎助學金/校內獎助學金/','標題與生活輔導組頁首',['中文候選來源目錄確在生活輔導組。'],['本次擷取範圍只有目錄標題與頁首，非各獎助方案全文。']),
 source('S6','學雜費減免申請公告','https://life.sao.stu.edu.tw/學雜費減免/教育部學雜費減免/學雜費減免辦理公告/','標題、115第一學期公告及第二學期約略時程段落',['該減免公告在生活輔導組網站。'],['不同學期須依新公告；本輪不把約略時程寫成固定期限。']),
 source('S7','看見樹德英文簡介','https://about.stu.edu.tw/en','Educational systems 所在段落',['四年制：four-year undergraduate programs；二年制進修：two-year continuing education programs；二專：two-year associate degree programs。'],['內文有2022統計；©2026不是內文更新日期，不能當115招生簡章。']),
 source('S8','看見樹德日文簡介','https://about.stu.edu.tw/jp','学制としては 所在段落',['學校實際日文用語為四年制大学部／二年制進学部／二年制専科進学部。'],['候選的學士課程及専科学校課程屬解說，不是此頁逐字正式名稱。','內文年代未標，統計及例子含2022以前。']),
 source('S9','社會工作學程英文簡介','https://www.sw.stu.edu.tw/home?lang=en-US','Education System 及 Professional Recognition 學士段落',['該校該學程英文有 Four-year Bachelor\'s Program 及 Two-year Bachelor\'s Program (for continuing education)。'],['只證該學程用語，不由此推全部科系招生條件；英文頁仍稱學程。']),
 source('S10','社工系介紹','https://www.sw.stu.edu.tw/社工介紹/','104設學程、106設二技進修及112改系沿革',['中文頁記112年8月1日升格社工系，英文頁學程稱呼有年代差。']),
 source('S11','115學年度核定招生系所與名額','https://reg.aca.stu.edu.tw/【115學年度】招生系所與名額','核定員額表欄位與動遊系列；技優招生群類表動遊系列',['核定員額列動遊系進四技30名；進二技與進二專空白。技優動遊系列85商設。'],['讀到官方表格的搜尋擷取結構；未取得原生網頁截圖，數值應交招生承辦覆核後修改中文。','表格員額不等於今天仍受理招生，首頁已顯示115招生結束。']),
 source('S12','115四技二專技優甄審簡章','https://www.jctv.ntut.edu.tw/downloads/115/skill/115_enter42_rule.pdf#page=11','實際PDF：封面、實體第11–12頁／印刷第1–2頁報名資格；第13頁對照表欄名',['報名須兼具學歷與適合招生類別職種；乙級以上技術士證及相當等級單一級為其一資格，非勞動部核發不得以此報名。'],['封面114年12月，重要日程114年12月4日起公告；是115四技二專，不混用115二技技優。','未讀本系指定項目完整分則，不借名稱修正重新批准整段實作考試等細節。']),
 source('S13','技術士技能檢定及發證辦法英文條文','https://laws.mol.gov.tw/Eng/FLAWDAT0201.aspx?id=FL015100','標題修改日、Art.5分級與Art.47–48證書核發／記載',['官方英文可證 technician certificates，乙級對應Class B；不是日本資格等同性認定。'],['頁面標2023.11.02 Modified；法規沿革其他英文新聞標年出現不一致，採條文本頁標示並保留，不推最新2026修法狀態。','官方日文未查得。']),
 source('S14','教育部Higher-Level TVE','https://english.moe.gov.tw/public/Data/New182910424171.pdf','搜尋擷取中技專學制與學位段落',['技專體系二技及四技屬學士層次、專科為associate層次，可支持學制說明方向。'],['歷史PDF約15年前，僅補強學位層次，不當成115招生政策；擷取末段有疑似誤植，不引用該句。'])
];
sources.find(s=>s.id==='S12').access_method='web open 官方PDF全文文字；只讀所列頁段，未逐頁讀72頁';
const functions = ['急難慰助','校內獎助學金','學雜費減免','請假假別／證明詢問','請假系統詢問','兵役窗口','復學FAQ中的兵役窗口','學籍變動後兵役窗口','休復學流程中兵役窗口','急難協助詢問'];
const checked = rows.map(r => {
 const current_checks = r.definitions.map(x=>({file:x.file,pointer:x.pointer,matches:ptr(JSON.parse(fs.readFileSync(path.join(root,x.file))),x.pointer)===x.expected_raw}));
 const canonical_checks = r.canonical_locations.map(x=>({file:x.file,pointer:x.pointer,matches:norm(ptr(JSON.parse(fs.readFileSync(path.join(root,x.file))),x.pointer))===norm(x.canonical_raw)}));
 if(current_checks.some(x=>!x.matches)||canonical_checks.some(x=>!x.matches))throw Error('target drift '+r.id+r.lang);
 let review;
 if(r.kind==='office-name') {
   const n=Number(r.id.slice(-2));
   review={classification:'已有primary支持可實作',implementation_scope:'僅該筆生輔組英文名稱替換；不重新認定整段學務程序、時效或補助資格。',candidate_as_name_change_supported:true,official_english_name:'Student Assistance Section',official_japanese_name:null,japanese_status:'未查得',row_service:functions[n-1],primary_sources:['S1','S2','S3',...(n===1?['S4']:n===2?['S5']:n===3?['S6']:[])],reason:'逐筆原中文pointer含生輔組，且該項職掌由S1英文及S2中文互證。',conservative_description:null};
 } else if(r.kind==='program-wording') {
   review={classification:'原文待確認需維持',implementation_scope:'不直接套用整句；先核中文115進四技名額與跨管道條件，另寫新候選。維持是本輪不改產品，不代表原文已正確。',candidate_as_name_change_supported:false,official_english_name:{four_year:'four-year undergraduate programs',two_year_continuing:'two-year continuing education programs',two_year_associate:'two-year associate degree programs'},official_japanese_name:{four_year:'四年制大学部',two_year_continuing:'二年制進学部',two_year_associate:'二年制専科進学部'},japanese_status:'校方簡介有日文用語；候選括號文字是說明譯法',primary_sources:['S7','S8','S9','S10','S11','S14'],reason:r.id==='PROGRAM-01'?'學位層次修正方向有支持，但整句仍稱本系未列名額，與115官方表動遊系進四技30名產生差異。英文候選列舉也須順寫，不能照貼。':'學位層次有支持，但整段統一書審＋面試、免統測／學測、夜間時段未按各115管道簡章逐一證成；學制名稱修正不能連帶批准整段。',conservative_description:r.lang==='en'?'Continuing education: two-year and four-year bachelor’s programs, and two-year associate-degree programs. Availability and admission requirements vary by program.':'進修部：二技（2年制の学士課程）、四技（4年制の学士課程）、二專（2年制の専科課程）。募集の有無と出願条件は各募集要項を確認してください。',description_status:'供新候選審閱，非校方逐字正式名稱，不已套產品'};
 } else {
   review={classification:'已有primary支持可實作',implementation_scope:'只將技能士資格換成台灣原名「技術士證」＋說明；不改115年度、職種類別限制，不重新批准整段指定項目或全部例外。',candidate_as_name_change_supported:true,official_english_name:'technician certificates; Class B（乙級）',official_japanese_name:null,japanese_status:'未查得官方日文名稱；候選括號是保守說明而非正式日文名',primary_sources:['S12','S13'],reason:'115四技二專正式簡章及主管法規均以台灣技術士證制度為準。保留原名可避免未經查證映射成日本技能士資格；乙級與招生類別限制仍保留。',conservative_description:'「技術士證」（台湾の技能検定資格）',description_status:'描述性日文；不是日本技能検定之等同性聲明'};
 }
 return {...r,current_checks,canonical_checks,review};
});
const result={created_at:new Date().toISOString(),scope:'16候選逐筆primary名稱查證；不改產品，不構成母語審核或發布批准',input:{file:input,sha256_before:sha(original),sha256_after:sha(fs.readFileSync(path.join(root,input))),unchanged:sha(original)===sha(fs.readFileSync(path.join(root,input)))},counts:{values:checked.length,primary_supported:checked.filter(r=>r.review.classification==='已有primary支持可實作').length,retain_pending:checked.filter(r=>r.review.classification==='原文待確認需維持').length,rejected:checked.filter(r=>r.review.classification==='候選不成立').length},negative_searches:[{queries:['site:life.sao.stu.edu.tw "Student Assistance" 日本語','site:stu.edu.tw "生活輔導組" "日本語"'],result:'未找到可證正式日文名的校方頁；不宣稱不存在。'},{queries:['site:mol.gov.tw 技術士證 日本語','site:mol.gov.tw "技術士證" "日本" "翻譯"'],result:'未找到官方日文資格名稱或日台等同性聲明；保留台灣原名。'}],sources,rows:checked,product_written:false,full_project_approved:false};
if(result.counts.values!==16 || !result.input.unchanged)throw Error('count/input failure');
fs.writeFileSync(path.join(out,'comparison.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({counts:result.counts,input:result.input,values_unchanged:checked.every(x=>x.current_checks.every(y=>y.matches)),canonical_verified:checked.every(x=>x.canonical_checks.every(y=>y.matches)),product_written:false},null,2));
