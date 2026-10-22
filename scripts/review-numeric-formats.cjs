// Each flagged pair was read against its original. These are formatting resolutions,
// bound to the full source and translation so future edits invalidate the decision.
const fs=require('node:fs'),assert=require('node:assert/strict'),audit=JSON.parse(fs.readFileSync('docs/qa/japanese/catalog-audit.json'));
const decisions=[
 ['10 萬 ~ 43 萬','10萬及43萬分別等於100,000及430,000，金額未減少。'],
 ['2025 指導學生 ×6','six為6，年度與第34屆保留。'],
 ['2025 指導學生入圍 2025青春','相同2025年度重複字樣合併一次，賽事年度不變。'],
 ['2025 指導學生入圍 2025年全國','相同2025年度重複字樣合併一次，賽事年度不變。'],
 ['2024 指導學生 ×10','ten為10，年度與第33屆保留。'],
 ['金犢獎國際競賽指導 7','seven為7，組數保留。'],
 ['一、開課名稱：「Unity Certified User','115年11月14至15日、15日考試以November 14–15, 2026及November 15, 2026呈現，月份與民國年改格式。'],
 ['一、開課名稱：「SSE-Adobe After Effects','115年12月5至6日、6日考試以December 5–6, 2026及December 6, 2026呈現，月份與民國年改格式。'],
 ['一、開課名稱：「ACP Photoshop','115年12月12至13日、13日考試以December 12–13, 2026及December 13, 2026呈現，月份與民國年改格式。'],
 ['根據最新公布的 2025 年《全球前 2%','重複出現的榜單名稱2%精簡，門檻2%、年度2025與1,470人仍保留。'],
 ['全國技專專題、青春設計節、放視大賞','Seven為7、four為4，14件保留；這是摘要，賽事名稱另在詳細資訊列出。'],
 ['想看每學期上什麼課？4 年','FOUR為4，128學分保留。'],
 ['核心專業必修 + 動畫／遊戲／美術／跨域','animation、games、art、cross-disciplinary四軸線完整列出，專題及實習保留。'],
 ['學海築夢計畫近 4 年共派 22','four為4、eight為8，22人保留，Japan、Korea、Indonesia三國完整列出。'],
 ['專業必修 44 學分 · 選修 45','Four為4，44必修與45選修學分保留。'],
 ['📞 樹德招生諮詢：07','台灣市話07改國際格式+886-7，分機及信箱不變。'],
 ['★ 4 競賽全入圍','FOUR為4，全部入圍含意保留。'],
 ['📞 樹德招生諮詢專線：07','台灣市話07改國際格式+886-7，分機2120至2122及6102不變。'],
 ['3 題找出入學管道','THREE為3，題數不變。'],
 ['2026 青春設計節創意設計競賽','Four為4，四作品名稱與2026保留。'],
 ['2026 放視大賞 — 複選入圍 7','Seven為7，七作品及遊戲／動畫分組保留。'],
 ['2026 金點新秀設計獎 — 入圍 2','Two為2，兩作品、類別及2026保留。'],
 ['第 21 屆全國技專校院電腦動畫競賽','Four為4，第21屆與四作品保留。'],
 ['2025 TISDC 台灣國際學生創意設計大賽','three為3，組數與2025保留。'],
 ['2025 ACG（巴哈姆特）創作大賽','Three為3，2D及2025保留。'],
 ['2025 放視大賞 — 2D 動畫入圍','Three為3，2D及2025保留。'],
 ['115年學海計畫第2次','Second為2，115年度保留。'],
 ['8/1至9/30是學校上傳計畫期間','October、November為10月、11月；8/1至9/30及10/22與非學生仍受理的提醒保留。']
];
assert.equal(audit.languages.en.numericReview.length,decisions.length);assert.equal(audit.languages.ja.numericReview.length,0);
const resolutions=audit.languages.en.numericReview.map((row,i)=>{assert.ok(row.zh.startsWith(decisions[i][0]),'Review order changed at '+i);return{language:'en',zh:row.zh,translated:row.translated,resolved:true,reason:decisions[i][1]};});
fs.writeFileSync('docs/qa/japanese/numeric-resolutions.json',JSON.stringify({checked_at:'2026-10-22',resolutions},null,2));console.log('Reviewed numeric formatting:',resolutions.length,'English pairs; Japanese omissions 0');
