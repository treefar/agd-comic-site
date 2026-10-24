// Produce review proposals only; never write product data.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const d=__dirname,repo=path.resolve(d,'../../../..');
const read=n=>JSON.parse(fs.readFileSync(path.join(d,n),'utf8'));
const write=(n,x)=>fs.writeFileSync(path.join(d,n),JSON.stringify(x,null,2)+'\n');
const guide=JSON.parse(fs.readFileSync(path.join(repo,'data/students/guide.json'),'utf8'));
const receipts=read('retrievals.json'),receipt=id=>receipts.find(x=>x.id===id);
const sourceDefs=[
 ['internship-school-rules-113','學生校外實習辦法','school-rules','113年10月9日修正通過','已核對目前職發中心列出的校級辦法全文。實習地點、時間、成績及替代方案仍由各系規定；不等於本系當屆細則。'],
 ['internship-school-details-113','學生校外實習施行細則','school-details','113年9月18日修正通過','已核對目前列出的校級細則全文，包含合約、個別計畫、保險、報告與評量。系上期限及本屆成績比例仍須另查。'],
 ['internship-student-guide-113','學生校外實習說明：申請、合約與交件','student-system-guide','2024年12月5日學生版','已核對現列申請路徑及交件說明；其中113年工資數字及保險年度不可當成現在標準。系統實際畫面及當屆清單仍向承辦確認。'],
 ['internship-transfer-form-113','校外實習轉換／停止實習機構申請表','transfer-stop','現列V3.0空白表；表內未見修訂日期','已核對空白表全文與學生、輔導老師、系主任的申請順序。是否適用本屆及已完成時數如何處理，仍由系上確認。'],
 ['overseas-selection-school-112','本校學海築夢專案計畫甄選要點','school-overseas-selection','112年9月13日修正通過','已核對目前列出的校內要點全文；這是學校計畫規則，不是本系115當期學生甄選公告或個人核定契約。補助額與新梯次條件另查。']
];
const new_sources=sourceDefs.map(([id,title,rid,date,readability])=>({id,title,url:receipt(rid).url,published_or_document_date:date,checked_at:'2026-10-24',readability,note:'現列版本與本屆適用性分開核對；原文及版本證據見本輪研究報告。'}));
const operations=[];
const get=p=>p.split('/').slice(1).reduce((a,k)=>a[k],guide);
const replace=(pointer,after,source_ids,reason,translations)=>operations.push({op:'replace',file:'data/students/guide.json',pointer,card_id_guard:guide.cards[Number(pointer.split('/')[2])]?.id,before:get(pointer),after,source_ids,reason,translations});
const cardIndex=id=>guide.cards.findIndex(x=>x.id===id);
const a=cardIndex('internship'),b=cardIndex('overseas-internship');
const ids={rules:'internship-school-rules-113',details:'internship-school-details-113',guide:'internship-student-guide-113',transfer:'internship-transfer-form-113',sea:'overseas-selection-school-112'};
const strings=[
 [`/cards/${a}/step_details/0/detail`,'先向系辦確認入學年、班別與適用文件，再到校務資訊系統的「學務資訊→校外實習（實習紀錄輸入）」申請。公司不在名單時，先請系辦協助評估與新增。',[ids.guide,ids.details],{
 en:'Confirm your entry year, programme and applicable documents with the department office. Then apply through the student portal: Student Affairs → Off-campus Internship (Internship Record Entry). If the company is not listed, ask the office about evaluation and registration first.',
 ja:'入学年度・課程と適用書類を学科事務室に確認し、校務システムの「学務情報→学外実習（実習記録入力）」から申請します。企業一覧にない場合は、先に事務室へ評価と登録を相談してください。'}],
 [`/cards/${a}/step_details/2/detail`,'合約經指導老師同意後再列印，並請承辦確認雙方用印、個別實習計畫與投保證明。系上和機構確認報到日期後再開始，不自行把公司口頭錄取當作程序完成。',[ids.details,ids.guide],{
 en:'Print the agreement after your supervisor approves it. Ask the coordinator to check both parties’ seals, your individual internship plan and insurance certificate. Start on the date confirmed by the department and host; a verbal job offer does not complete the school procedure.',
 ja:'指導教員の承認後に契約書を印刷し、双方の押印、個別実習計画と保険加入証明を担当者に確認してもらいます。学科と受入先が確認した開始日に従ってください。企業からの口頭の採用連絡だけでは手続きは完了しません。'}],
 [`/cards/${a}/warning`,'系網仍列107年修訂手冊，本屆適用尚待確認。自找公司、打工認列或中止實習，先問系辦；校級113年辦法不能取代本系細則。',['dept-forms',ids.rules,ids.details],{
 en:'The department still lists a handbook revised in ROC 107 (2018); its applicability to your cohort is unconfirmed. Ask the department before arranging your own host, seeking work-hour credit or stopping an internship. The university’s ROC 113 (2024) rules do not replace departmental requirements.',
 ja:'学科サイトには民国107年（2018年）改訂の手引きが掲載されており、現学年への適用は未確認です。受入先の自己開拓、アルバイトの認定、実習中止は先に学科へ相談してください。民国113年（2024年）の全学規則は学科の細則に代わるものではありません。'}],
 [`/cards/${a}/flow_note`,'開始前先辦合約與保險；結束後仍要依系上期限交成果報告、自評，並完成老師與機構評量。',[ids.details,ids.guide],{
 en:'Complete the agreement and insurance before starting. Afterward, submit your report and self-assessment by the department’s deadline and complete the supervisor and host evaluations.',
 ja:'開始前に契約と保険の手続きを済ませます。終了後も学科の期限までに成果報告と自己評価を提出し、指導教員と受入先による評価を受けてください。'}],
 [`/cards/${b}/step_details/2/detail`,'錄取後核對契約中的機構、期間、補助與自付費，再確認醫療、意外保險及合法實習簽證。出發前問清楚行前說明與緊急聯絡；實習期間維持學籍，結束後依計畫完成返校報到及成果交件。',[ids.rules,ids.sea,'moe-studyabroad-rules'],{
 en:'After acceptance, check the host, dates, grant and personal costs in your agreement, along with medical and accident insurance and a visa that permits the internship. Confirm pre-departure guidance and emergency contacts. Remain enrolled during the internship and complete the required return report and submissions afterward.',
 ja:'採用後は契約の受入先・期間・補助・自己負担額、医療・傷害保険と実習を認める査証を確認します。出発前に説明会と緊急連絡先を確認し、実習中は学籍を維持してください。終了後は計画に従って帰校報告と成果提出を行います。'}],
 [`/cards/${b}/warning`,'本次尚未取得本系115當期甄選與個人補助契約。校內學海要點或歷屆成果不能代替招募；名額、語言、費用及返校期限以當期正式文件為準。',[ids.sea,'hc-internship-2026'],{
 en:'This review has not obtained the department’s current ROC 115 (2026) recruitment notice or individual grant agreement. University programme rules and past achievements do not establish an open call. Check the current documents for places, language requirements, costs and return deadlines.',
 ja:'今回の確認では、本学科の民国115年（2026年）の募集要項と個人の補助契約は未取得です。学内の計画規則や過去の成果は募集案内の代わりにはなりません。定員・語学条件・費用・帰校期限は当期の正式書類で確認してください。'}]
];
for(const [pointer,after,source_ids,tr] of strings)replace(pointer,after,source_ids,'補入目前官方全文已核的辦理步驟，或清楚揭露本屆缺件；不套過時金額與時限。',tr);
const faqAdd=[
 [a,{q:'實習結束後，只交時數證明就好嗎？',a:'不只時數。校級細則要求成果報告與實習生自評，由指導老師及機構共同評量；交件期限依系上規定。現列說明的線上自評須在合約雙方用印完成後才會出現。',source_ids:[ids.details,ids.guide]},
 {q:'Is proof of completed hours enough after the internship?',a:'No. The university rules require a report and student self-assessment, with evaluation by the supervisor and host. Follow the department’s submission deadline. The listed system guide says the online self-assessment appears after both parties’ seals are recorded.'},
 {q:'実習が終わったら、時間数の証明だけ出せばよいですか？',a:'時間数だけではありません。全学細則では成果報告と自己評価、指導教員と受入先による評価が必要です。提出期限は学科の規定に従います。掲載中の操作説明では、双方の押印完了が登録されるとオンライン自己評価が表示されます。'}],
 [a,{q:'實習不適應，能直接不去或換公司嗎？',a:'先聯絡實習輔導老師與系辦，說明原因。現列表單的流程是學生申請、老師與系主任審核；轉換、中止及已完成時數如何處理，須由系上確認，不自行離開後才補辦。',source_ids:[ids.rules,ids.transfer]},
 {q:'Can I stop attending or change companies if the placement is unsuitable?',a:'Contact your internship supervisor and department first. The listed form goes from the student to the supervisor and department chair for approval. Ask the department how a transfer, termination and completed hours will be handled; do not leave first and apply afterward.'},
 {q:'実習が合わないとき、無断で休んだり企業を変えたりできますか？',a:'先に実習指導教員と学科事務室へ事情を伝えてください。掲載中の申請書は学生から指導教員、学科長へと審査されます。変更・中止と実施済み時間の扱いは学科に確認し、無断で離れてから手続きしないでください。'}],
 [b,{q:'有學海補助，就代表全部免費嗎？',a:'不能這樣推定。校內要點說明實際補助由計畫安排，不保證涵蓋全部費用。錄取後請核對個人核定額、自付項目與契約條件，不用新聞或別人的金額估自己的支出。',source_ids:[ids.sea]},
 {q:'Does a grant under 學海築夢 (overseas professional internships) cover all costs?',a:'Not necessarily. The university rules leave the actual award to the project; they do not guarantee that every expense is covered. Check your individual award, personal costs and agreement after acceptance. Do not estimate your budget from news reports or another student’s grant.'},
 {q:'「學海築夢」（海外専門実習への補助）の補助があれば、費用はすべて無料ですか？',a:'そうとは限りません。学内要点では実際の補助は計画ごとに定められ、全費用の負担を保証していません。採用後に個人の決定額、自己負担項目と契約条件を確認し、ニュースや他の学生の金額で予算を決めないでください。'}]
];
for(const index of [a,b]){
 const adds=faqAdd.filter(x=>x[0]===index);
 replace(`/cards/${index}/faq`,[...guide.cards[index].faq,...adds.map(x=>x[1])],[...new Set(adds.flatMap(x=>x[1].source_ids))],'保留既有FAQ並增加原件可支持的實作疑問。',adds.map(x=>({zh:x[1],en:x[2],ja:x[3]})));
 const refs=[...new Set([...guide.cards[index].source_ids,...new_sources.filter(x=>index===a?x.id!==ids.sea:[ids.rules,ids.sea].includes(x.id)).map(x=>x.id)])];
 replace(`/cards/${index}/source_ids`,refs,refs,'補入新實讀原件；不動career-contact原條目。');
 for(const k of index===a?[0,2]:[2]){
  const op=strings.find(x=>x[0]===`/cards/${index}/step_details/${k}/detail`);
  replace(`/cards/${index}/step_details/${k}/source_ids`,[...new Set([...guide.cards[index].step_details[k].source_ids,...op[2]])],op[2],'小說明同步新增來源引用。');
 }
}
write('proposal.json',{as_of:'2026-10-24',status:'proposal_only',operations,new_sources,retained:[{pointer:'/cards/14',id:'overseas-study-visit',reason:'本次沒有取得本系115當期見學招募／費用退費／學分文件。原卡已正確提醒需查當期，不為湊改動而改寫。',before:guide.cards[14],after:guide.cards[14]}],translation_notes:['translations為英日審閱建議，不宣稱官方譯名或母語簽核。','保留民國115／115學年度，不套日本年度前期。校務選單英日為說明譯文；實際操作保留中文原路徑可對照。','source新增後，須同步英日來源title/readability與全部新key引用；career-contact由其他代理負責，本組不替換。'],source_operations:new_sources.map(after=>({op:'add',file:'data/students/guide.json',pointer:'/sources/-',guard:{id_absent:after.id},before:null,after}))});
const rows=[
 ['I01','校級實習辦法、施行細則全文已取得？','yes','目前職發官方清單現列1131009辦法與1130918細則，原PDF及全文已讀。不是只核舊索引。',['school-rules','school-details']],
 ['I02','學生申請、合約、實習前後交件流程已補得？','yes','現列1131205學生版提供實際路徑、審核列印與交件。只採穩定程序，不引用113工資／113保單當115。',['student-system-guide']],
 ['I03','現掛合約、機構評估、轉換停止、自評空白表全文已讀？','yes','兩種合約及三項ODT全文已解析；是現列空白範本，不等於已核任何人的簽約或系內成績比例。',['employment-contract','nonemployment-contract','institution-evaluation','transfer-stop','student-self-assessment']],
 ['I04','已確認107本系手冊可直接用於115／本屆？','no','官網公開夾仍四個檔。手冊PDF與兩個DOC新取原件均與10/23相同；未見本屆適用聲明。校級細則要求各系另訂，不能反推107仍有效。',['department-manual','department-recognition','department-evaluation']],
 ['I05','兩份舊DOC申請／考核表全文已核且屬當屆？','no','舊DOC原件已重新取得但provider無正文，尚未完整Word解析。本屆期限、成績配比亦未取得，不以現掛ODT校級問卷代替系內考核。',['department-recognition','department-evaluation']],
 ['I06','校級現掛學海甄選要點全文已補得？','yes','現列1120913校內要點3頁全文，支持系所計畫安排、行政契約、學籍維持及返校報到；不沿用其中固定天數代115公告。',['school-overseas-selection']],
 ['I07','本系115當期海外實習學生甄選／名額語言／個人核定費用契約已齊？','no','本次職發計畫頁獲補助表只列至113，未見本系115學生招募與個人契約。2026HC成果、109別校文件及教師申請時程均不作正在受理證據。',['plan-native']],
 ['I08','本系115海外見學招募／行程費用補助退費／認列文件已齊？','no','國際處當前入口有交流說明及境外交換生欄位，沒有本系115團簡章。搜尋找到其他系成果不套用；原卡保留。',['oica-native']],
 ['I09','實習事故及權益中止有目前校級依據？','yes','1130918緊急事故細則與1131009辦法列老師、機構及校方協助程序；轉換停止表有簽核流程。',['school-emergency','school-rules','transfer-stop']]
].map(([id,question,answer,finding,sources])=>({id,question,answer,finding,sources}));
write('matrix.json',{as_of:'2026-10-24',scope:'三卡分層核對，不以現掛校級113版等同本系115當期文件全部完成',rows});
const old=path.join(repo,'holiday-lab/reports/guide-internship-research-20261023/drive');
write('department-comparison.json',['manual','recognition','evaluation'].map(id=>{const m=read('department-'+id+'.json'),oldFile=path.join(old,id+(id==='manual'?'.pdf':'.doc'));return{id,url:m.url,modified_time:m.modified_time,sha256:m.sha256,same_as_20261023:crypto.createHash('sha256').update(fs.readFileSync(oldFile)).digest('hex')===m.sha256}}));
console.log(JSON.stringify({operations:operations.length,new_sources:new_sources.length,policy_yes:rows.filter(x=>x.answer==='yes').length,policy_no:rows.filter(x=>x.answer==='no').length,product_modified:false},null,2));
