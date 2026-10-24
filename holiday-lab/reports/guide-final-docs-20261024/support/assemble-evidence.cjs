// Build research evidence metadata, not website data.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=__dirname,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const downloads=JSON.parse(fs.readFileSync(path.join(dir,'raw/download-results.json')));
const doms=[
 ['aid-115-1-dom.txt','https://life.sao.stu.edu.tw/不利處境學生助學/辦理須知-2/','115學年度第1學期公告全文；申請10/20截止。現頁列轉學生原校已核准、低收住宿優惠及生活助學，不能外推為所有一般申請資格。'],
 ['low-income-dom.txt','https://life.sao.stu.edu.tw/訊息公告/','115-1申請9/8–10/8；具有效低收證明、學籍及前學期及格等條件，新生第一學期成績例外。115-2留000年，不採。'],
 ['hardship-details-dom.txt','https://life.sao.stu.edu.tw/急難救助/急難慰問/','綜合急難頁，含148萬與1000萬，但須依方案確認，不外推校內1141119規則。'],
 ['bursary-115-1-dom-r2.txt','bursary-115-1-main','115-1主公告正文：身分開通與學習項目分開，完成任務不代表無條件得款。'],
 ['bursary-status-dom.txt','bursary-115-status','115年度其他經濟不利、家庭變故、懷孕育兒身分申請，效期為當年度。'],
 ['bursary-forms-dom.txt','bursary-public-forms','現列115項目及114特殊身分表。家庭變故半年內、每學期期中前；其他經濟不利表寫開通一年，與115公告用語有差異。'],
 ['appeal-forms-dom.txt','https://life.sao.stu.edu.tw/學生申訴/學生申訴/','現列112規則、空白中英申訴書及流程；母頁日期4/26。'],
 ['appeal-channel-dom.txt','https://life.sao.stu.edu.tw/學生申訴/申訴管道/','生輔受理與2115，說明一週內聯絡不是申請期限。'],
 ['gender-home-dom.txt','https://www.gender.stu.edu.tw/','官網實鏈與性平委員會公開頁；網站聯絡2145不可當所有實體程序唯一收件方式。'],
 ['gender-procedure-dom.txt','https://www.gender.stu.edu.tw/處理事件流程圖/','現列2.2調查表及舊2.1與2018圖，採2.2原表及113現列規則，不採舊圖作現行全流程。'],
 ['gender-rules-dom.txt','https://www.gender.stu.edu.tw/法規專區/','1131225校園性別事件防治辦法現列；舊109附件亦存，不把舊檔當最新版。'],
 ['career-home-dom.txt','https://dcpi.sao.stu.edu.tw/','現列學習歷程、UCAN、求職網真鏈及職掌。'],
 ['ucan-ep-dom.txt','https://dcpi.sao.stu.edu.tw/ep-ucan/','完整公開說明：校務→學務系統→職發中心→學生歷程；UCAN興趣與職能。頁內2147與頁末1713並存，舊2021手冊與帳號格式不採。'],
 ['ucan-live-error-dom.txt','https://ucan.moe.edu.tw/Account/Login.aspx','實際目的地只顯示系統錯誤；不算可用診斷或登入通過。'],
 ['career-jobs-dom.txt','https://career.sao.stu.edu.tw/','求職、實習、工讀分類公開可讀；本次首頁最新列2026/6/11，不能承諾所有職缺仍開。'],
 ['career-external-dom.txt','https://career.sao.stu.edu.tw/career_con/','校方公開外部鏈有台灣就業通、UCAN等。'],
 ['career-fair-2026-dom.txt','career-fair-2026','2026就博5/5、廠商報名3/25，現在已結束；代收履歷不等同當期校內履歷諮詢預約。'],
 ['taiwanjobs-dom.txt','https://www.taiwanjobs.gov.tw/','政府公開就業入口與Youth真鏈；10/22新聞只證明列表當期更新，不冒充每則全文已讀。'],
 ['youth-career-consult-dom.txt','https://coach.taiwanjobs.gov.tw/wdaecPublic/','18–29歲、每年3次免費一對一；履歷自傳診斷與面試、職涯諮詢公開說明已讀。未進同意書或會員。']
];
const proposal=JSON.parse(fs.readFileSync(path.join(dir,'proposal.json')));
const jobsLinks=JSON.parse(fs.readFileSync(path.join(dir,'raw/career-jobs-links.json')));
const sources=doms.map(([file,url,finding])=>{const b=fs.readFileSync(path.join(dir,'raw',file));return {id:file.replace('-dom.txt',''),url:proposal.new_sources.find(s=>s.id===url)?.url||(url==='career-fair-2026'?jobsLinks.find(x=>x.text.includes('—')).href:url),file:'raw/'+file,captured_at:fs.statSync(path.join(dir,'raw',file)).mtime.toISOString(),http_status:null,read_level:'browser public rendered body; not HTTP-status evidence',sha256:sha(b),bytes:b.length,finding};});
for(const d of downloads)sources.push({...d,url:d.href,read_level:d.id.includes('flow')?'PDF all pages visually read; historical illustrations only':d.file.endsWith('.pdf')?'PDF full text plus all page images read':'public blank OpenXML document full text read',checked_at:'2026-10-24'});
const questions=[
 {id:'aid-current',card_id:'financial-aid',question:'115-1一般助學、低收公告是否讀到正文、期限與紙本流程？',yes:true,sources:['aid-115-1-dom.txt','low-income-dom.txt','aid-transfer','aid-living','aid-hardship-declaration','low-income-flow'],confirmed:'兩項115-1期限均已過；低收先校務填表列印、再繳紙本；不利處境目前頁面列轉學生、低收宿舍與生活助學分項。',unresolved:'115-2的000年未解；未完整調查所有校內外獎助，不能稱全校所有補助均已核。'},
 {id:'hardship-current',card_id:'financial-aid',question:'是否有完整校內急難現列規則，可與綜合頁區分？',yes:true,sources:['hardship-rules-1141119','hardship-details-dom.txt'],confirmed:'1141119校內要點1頁，第4點六個月、事件一次、同校兄弟姊妹一人；第5點文件及家庭變故審核。',unresolved:'綜合頁148萬／1000萬未見於本校要點，不推定任何外部方案也無此門檻。各校外急難計畫非本輪全部調查。'},
 {id:'bursary-current',card_id:'financial-aid',question:'115-1勵學金、115身分申請與公開空白表是否實讀？',yes:true,sources:['bursary-115-1-dom-r2.txt','bursary-status-dom.txt','bursary-forms-dom.txt','bursary-sudden-form','bursary-disadvantage-form'],confirmed:'身分認定與學習項目申請／完成／繳件分開。文件專區現列當期項目，兩種經濟不利身分空白表全文已讀。',unresolved:'115公告當年度、114表開通一年用語不同，保留承辦確認；未對其他所有6類項目附件或影片逐份實讀。'},
 {id:'appeal-current',card_id:'support-rights',question:'一般學生申訴現列完整規則與中英空白表是否已讀？',yes:true,sources:['appeal-rules','appeal-form-zh','appeal-form-en','appeal-flow','appeal-channel-dom.txt'],confirmed:'1120426規則3頁，第3條分流、第4條生輔受理、第6條原則收到或接受次日起30日、第7條申訴書與補正、第8條副本送原處分單位。',unresolved:'空白表附註10–30日與規則固定30日不一致；學務彙編母頁4/24與PDF4/26不一致；英文檔名V4.0與內文1.0不一致。未自己改官方表。'},
 {id:'gender-current',card_id:'support-rights',question:'校園性別事件現列規則10頁及空白2.2表是否全文實讀？',yes:true,sources:['gender-rules-1131225','gender-form-v22','gender-procedure-dom.txt','gender-rules-dom.txt'],confirmed:'1131225規則第17條書面／言詞／電子郵件及確認、第18條性平會收件、第20條受理通知與不受理申復、第22、23條隱私保護與例外、第31條結果申復與第36條後續救濟各自分開。',unresolved:'同頁舊2.1與2018圖不當現行程序；不宣稱無例外保密。指向行為人所屬學校及校長案主管機關等例外不塞簡短摘要，保留完整規則連結。'},
 {id:'ucan-real-entry',card_id:'career',question:'UCAN公開說明及真正目的地已核，診斷服務目前可用？',yes:false,sources:['ucan-ep-dom.txt','ucan-live-error-dom.txt'],confirmed:'校方完整使用說明與官方Account/Login.aspx鏈均已核；實際目的地顯示系統錯誤。',unresolved:'目前服務可用性no；未登入，不驗帳號規則與測驗或上傳。頁內舊2147與末段1713分機不同，採已核成員頁1713。'},
 {id:'campus-resume-booking',card_id:'career',question:'是否找到115-1校內履歷諮詢目前可預約的公開表？',yes:false,sources:['career-home-dom.txt','career-jobs-dom.txt','career-fair-2026-dom.txt'],confirmed:'現列職掌提供職涯輔導；公開學習歷程可編履歷。2026就博5/5已過。',unresolved:'未找到當期校內履歷預約表，不把舊就博代收履歷或一般職掌當現在開放的預約服務。限定搜索後結案。'},
 {id:'public-jobs-resume',card_id:'career',question:'有實際可讀的公開徵才與額外履歷輔導說明入口？',yes:true,sources:['career-jobs-dom.txt','career-external-dom.txt','taiwanjobs-dom.txt','youth-career-consult-dom.txt'],confirmed:'校方公開分類與政府台灣就業通入口可讀；政府Youth線上履歷自傳診斷服務限18–29歲、每年3次免費一對一，需會員自行依規定預約。',unresolved:'服務不是校內表單，不承諾每人立即有時段、錄取或取得工作。未登入／送件。'}
];
fs.writeFileSync(path.join(dir,'source-matrix.json'),JSON.stringify({schema:1,checked_at:'2026-10-24',scope:'three student-guide cards; official public sources only',questions,sources,reused_sources:[{file:'holiday-lab/reports/followup-20261024/contacts/raw/career-members-dom.txt',checked_at:'2026-10-24',usage:'formal current duties; not refetched',sha256:sha(fs.readFileSync(path.resolve(dir,'../../followup-20261024/contacts/raw/career-members-dom.txt')))}],limits:['not exhaustive all aid schemes','not a private form or account test','not a website QA pass','not a declaration of source conflict resolution']},null,2),{flag:'wx'});
console.log(JSON.stringify({questions:questions.length,yes:questions.filter(x=>x.yes).length,no:questions.filter(x=>!x.yes).length,html_bodies:doms.length,attachments:downloads.length,pdf_all_pages:25}));
