// Research deliverable only. This script never writes product files.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=__dirname, root=path.resolve(dir,'../../../../..');
const bytes=fs.readFileSync(path.join(dir,'raw/guide-before.json')),g=JSON.parse(bytes);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const changes=[],translations=[];
const at=p=>p.split('/').slice(1).reduce((v,k)=>v[k],g);
function change(pointer,after,source_ids,reason){changes.push({file:'data/students/guide.json',pointer,before:at(pointer),after,source_ids,reason});}
function tr(zh,en,ja){translations.push({zh,en,ja,type:'functional translation suggestion; not an official Japanese proper name'});return zh;}
const idx=id=>{const n=g.cards.findIndex(c=>c.id===id);if(n<0)throw Error(id);return n;};
const financial=idx('financial-aid'),rights=idx('support-rights'),career=idx('career');
const newSources=[];
function source(id,title,url,date,readability,note){newSources.push({id,title,url,published_or_document_date:date,checked_at:'2026-10-24',readability,note});}
source('hardship-rule-1141119','校內學生急難慰助金實施要點','https://wpc.stu.edu.tw/wp-content/uploads/sites/38/2025/11/學生急難慰助金實施要點.pdf','114年11月19日修正','官方規則全文已核對','只適用本校急難慰助金。事件發生日起六個月內；同一事件一次，同校兄弟姐妹一人。本文未列綜合頁148萬元／1000萬元門檻，不外推其他校外方案。');
const read=(file)=>JSON.parse(fs.readFileSync(path.join(dir,'raw',file),'utf8'));
const sLinks=read('bursary-entry-links.json');
source('bursary-115-1-main','115-1完善就學勵學金主公告',sLinks.find(x=>x.text.includes('9/1開放申請')).href,'2026年9月1日','官方當期公告全文已核對','補助身分與當期項目分開；不進入新生探索活動、校務系統或影片。未具既有補助身分者另依身分申請公告與文件審查。');
source('bursary-115-status','115年度勵學金補助身分申請',sLinks.find(x=>x.text.startsWith('115年度【')).href,'2026年9月9日','官方當期公告全文已核對','當年度有效與空白表寫開通一年有用語差異，指南不自行合併；公告指向正式文件專區。');
source('bursary-public-forms','完善就學勵學金身分與項目文件',sLinks.find(x=>x.href.includes('%e9%ab%98%e6%95%99%e5%8b%b5%e5%ad%b8%e9%87%91-2/%e8%a1%a8%e6%a0%bc%e4%b8%8b%e8%bc%89/')).href,'現列115年項目文件；特殊身分表為114年版','官方現列公開表單已核對','家庭突遭變故與其他經濟不利身分空白DOCX已讀。其餘項目只核現列連結，未宣稱全部附件逐份實讀。現列「其他經濟不利」表將權限寫一年，與115公告當年度用語保留衝突。');
const al=read('appeal-links.json');
source('appeal-rule-1120426','學生申訴評議辦法（112年修正）',al.find(x=>x.text==='學生申訴評議辦法').href,'112年4月26日校務會議修正；112年5月11日教育部核定','官方規則全文已核對','PDF3頁已讀；生輔組現列表單母頁為4月26日，學務彙編母頁寫4月24日，PDF正文為26日。一般申訴第六條原則次日起30日；空白表附註保留10–30日文字，不能用表附註改寫本文。');
source('appeal-public-forms','學生申訴辦法與中英文空白申訴書','https://life.sao.stu.edu.tw/學生申訴/學生申訴/','現列112年修訂辦法；中文表V4.0／英文表內標1.0','官方現列公開表單已核對','中英文ODT均已讀；空白表附註10–30日與現列規則固定30日有差異，不自訂新期限。英文檔名V4.0與正文Version1.0也有差異，直接連母頁讓承辦確認版本。');
source('appeal-public-channel','一般學生申訴受理管道','https://life.sao.stu.edu.tw/學生申訴/申訴管道/','頁面未標更新日','官方公開受理說明已核對','生輔組收件、分機2115；不把一週聯絡說明當作申請期限或法定評議完成期限。');
const gl=read('gender-rules-links.json');
source('gender-rule-1131225','校園性別事件防治辦法（113年修正）',gl.find(x=>x.text.includes('校園性別事件凌防治')).href,'113年12月25日校務會議修正','官方規則全文已核對','PDF10頁全文及頁圖已讀。官方連結文字及檔名多一「凌」，正文正式題名無「凌」。第17、18、20、22、23、31、36條區分收件、20日不受理申復、30日結果申復及後續學生申訴，保密有依法例外。');
source('gender-public-forms','校園性別事件調查申請與表單','https://www.gender.stu.edu.tw/處理事件流程圖/','現列調查書2.2；ODT上傳2025年2月','官方現列公開表單已核對','2.2 ODT全文已讀，舊2.1與2018流程圖僅現列連結，未採為現行程序。書面、言詞或電子郵件依113規則提出並確認紀錄；不承諾無例外保密。');
source('career-ep-ucan-public','學習歷程與UCAN公開使用說明','https://dcpi.sao.stu.edu.tw/ep-ucan/','頁面未標更新日；手冊連結為2021年','官方公開使用說明已核對；外部平台暫時無法使用','校務路徑與UCAN用途全文已讀。頁中舊分機2147與末段1713不同；沿用當日已核成員職掌1713。UCAN實際連結本次顯示系統錯誤，未登入或驗證帳號規則，不抄舊初始密碼或帳號格式。');
source('career-jobs-public','STU求職與徵才資訊網','https://career.sao.stu.edu.tw/','本次首頁最新職缺列表2026年6月11日','官方公開求職入口已核對','就業、實習、工讀及徵才分類各自存在。列表可讀不等於所有職缺仍受理；2026校園就博為5月5日已結束，未開啟個資報名表。');
source('taiwanjobs-public','台灣就業通公開求職資源','https://www.taiwanjobs.gov.tw/','當日公開頁；最新消息2026年10月22日','政府公開求職入口已核對','校方外部資訊列表實鏈；已讀公開首頁及Youth連結，不登入會員或提交履歷。');
source('youth-resume-public','Youth職涯線上履歷自傳診斷','https://coach.taiwanjobs.gov.tw/wdaecPublic/','當日公開服務說明；未標全文更新日','政府公開服務說明已核對','政府Youth服務，非校內預約表：18–29歲青年，每年3次免費一對一，涵蓋履歷自傳診斷、面試等；預約需登入與確認同意書，本代理未操作。');
const aidIds=['aid-115-1','low-income-115-1','hardship-rule-1141119','bursary-115-1-main','bursary-115-status','bursary-public-forms'];
const rightsIds=['appeal-rule-1120426','appeal-public-forms','appeal-public-channel','gender-rule-1131225','gender-public-forms'];
const careerIds=['career-contact','career-ep-ucan-public','career-jobs-public','taiwanjobs-public','youth-resume-public'];
const fin1=tr('按方案備文件；學產低收須從「學產助學金管理」填表列印，再繳紙本。勵學金先核對補助身分與當期學習項目，不能只完成線上填寫就算辦妥。','Prepare documents for the specific scheme. For the low-income grant, complete and print the form in the school’s grant system, then submit the paper copy. For learning bursaries, check both eligibility and the current learning activity requirements; an online form alone is not enough.','制度ごとに必要書類を確認します。低所得世帯向け学産基金助成金は、校務システムの「學產助學金管理」で入力・印刷し、紙でも提出します。勵學金は対象資格と当期の学習項目を確認し、オンライン入力だけで手続完了と思わないでください。');
const fin2=tr('依各方案期限送件並留意補件通知。校內急難應於事件發生日起六個月內申請，同一事件限一次；家庭變故慰助須經審核，不保證一定核發。','Submit within the deadline for your scheme and watch for requests for missing documents. The university’s emergency assistance must be requested within six months of the event, once per event. Family hardship assistance requires review and is not guaranteed.','各制度の期限内に提出し、追加書類の連絡を確認します。学内の緊急援助は事実発生日から6か月以内に申請し、同じ出来事につき1回です。家庭事情による援助は審査が必要で、支給は確約されません。');
change(`/cards/${financial}/step_details/1/detail`,fin1,aidIds,'補學產紙本流程與勵學金身分／項目分流');
change(`/cards/${financial}/step_details/1/source_ids`,aidIds,aidIds,'新說明逐句連正式來源');
change(`/cards/${financial}/step_details/2/detail`,fin2,aidIds,'校內急難六個月不外推校外方案');
change(`/cards/${financial}/step_details/2/source_ids`,aidIds,aidIds,'核對校內1141119完整規則');
const fq=tr('有勵學金補助身分，就會自動領到錢嗎？','Does having bursary eligibility mean I will automatically receive money?','勵學金の対象資格があれば、自動的に支給されますか。');
const fa=tr('不會。先確認系統補助身分，再依115-1項目申請、完成學習及繳件；資格認定與領款是兩件事。身分效期的公告與表單寫法不同，請向承辦確認。','No. Confirm your eligibility in the system, then apply for the relevant 115-1 activity, complete the learning requirements and submit documents. Eligibility and payment are separate. Ask the office to confirm the validity period, as the notice and form use different wording.','自動ではありません。システム上の対象資格を確認し、115学年度第1学期の項目へ申請して学習・書類提出を完了します。資格認定と受給は別です。有効期間は公告と様式で表記が異なるため、担当窓口に確認してください。');
change(`/cards/${financial}/faq`,[...g.cards[financial].faq,{q:fq,a:fa,source_ids:['bursary-115-1-main','bursary-115-status','bursary-public-forms']}],aidIds,'增加勵學金FAQ並明示文件用語差異');
change(`/cards/${financial}/source_ids`,[...g.cards[financial].source_ids,...aidIds.filter(x=>!g.cards[financial].source_ids.includes(x))],aidIds,'保留既有來源，新讀來源另外列');
const rs=tr('情緒壓力、特教支持與權益受損各有窗口，可依需要直接求助。一般學生申訴與校園性別事件分開受理，不必先諮商。','Emotional support, special education support and student rights have different contacts. You may contact the relevant office directly. General student appeals and campus gender-related incidents follow separate procedures; counseling is not a prerequisite.','心の悩み、特別支援、権利に関する問題は、必要な窓口へ直接相談できます。一般の学生不服申立てと学内の性・ジェンダーに関する事案は別の手続です。先に心理相談を受ける必要はありません。');
change(`/cards/${rights}/summary`,rs,rightsIds,'避免導師轉介或諮商成為申訴前置要求');
const rd=tr('把通知、日期與證據整理好。一般申訴原則於收到或接受處分、措施或決議的次日起30日內，以書面向生輔組提出；校園性別事件由性平會收件，另用調查申請／檢舉表。','Organize the notice, dates and evidence. General student appeals should normally be submitted in writing to Student Assistance within 30 days from the day after receiving or accepting the action, measure or decision. Campus gender-related incidents are received by the gender equity committee using a separate investigation request/report form.','通知、日付、証拠を整理します。一般の学生不服申立ては原則として処分・措置・決議を受け取った、または受けた日の翌日から30日以内に、生活輔導組へ書面で提出します。学内の性・ジェンダー事案は性平会が受け付け、別の調査申請・通報様式を使います。');
change(`/cards/${rights}/step_details/2/detail`,rd,rightsIds,'以完整現列112規則第4、6、7條及113性平規則第17、18條補具體流程');
change(`/cards/${rights}/step_details/2/source_ids`,rightsIds,rightsIds,'不再只以一般入口支持程序');
const rq=tr('一般學生申訴與性平案件怎麼分？','How do general student appeals differ from campus gender-related cases?','一般の学生不服申立てと性・ジェンダー事案はどう違いますか。');
const ra=tr('一般申訴針對學校處分、措施或決議，由生輔組受理；疑似校園性別事件向性平會申請調查或檢舉。兩者表單與期限不同，可先請窗口協助辨別。','General appeals concern university actions, measures or decisions and are received by Student Assistance. Suspected campus gender-related incidents should be submitted to the gender equity committee as an investigation request or report. The forms and deadlines differ; ask the relevant office if unsure.','一般の不服申立ては学校の処分・措置・決議が対象で、生活輔導組が受け付けます。学内の性・ジェンダー事案が疑われる場合は性平会へ調査申請または通報を行います。様式と期限が異なるため、迷ったら窓口で確認してください。');
const pq=tr('性平案件的資料會如何保護？','How is information in campus gender-related cases protected?','性・ジェンダー事案の情報はどのように保護されますか。');
const pa=tr('學校依法保護當事人隱私，但調查需要、公共安全或法律規定可能有例外。可先問承辦資料用途、會提供給誰及保護措施，再決定如何敘述。','The university protects the parties’ privacy under applicable rules, with possible exceptions for investigations, public safety or legal requirements. You may ask how information will be used, who may receive it and what safeguards apply before describing the matter.','学校は規則に従い当事者のプライバシーを守りますが、調査上の必要、公共の安全、法令の定めによる例外があります。説明する前に、情報の利用目的、提供先、保護措置を担当者に確認できます。');
change(`/cards/${rights}/faq`,[g.cards[rights].faq[0],{q:rq,a:ra,source_ids:rightsIds},{q:pq,a:pa,source_ids:['gender-rule-1131225','gender-public-forms']}],rightsIds,'分流具體化並避免無例外保密承諾');
const rw=tr('一般申訴空白表附註與現列辦法的期限寫法不同，請核對現行辦法；性平案件的不受理申復、結果申復及後續學生申訴，也有各自期限。','The general appeal form and current regulations use different deadline wording; check the current regulations. For gender-related cases, a review of non-acceptance, a review of the outcome and a later student appeal each have separate deadlines.','一般不服申立ての空白様式の注記と現列規則では期限の表記が異なるため、現行規則を確認してください。性・ジェンダー事案も、不受理への再審査、結果への再審査、その後の学生不服申立てで期限が異なります。');
change(`/cards/${rights}/warning`,rw,rightsIds,'不把普通30日、性平20日及結果30日混為同一期限');
change(`/cards/${rights}/source_ids`,[...g.cards[rights].source_ids,...rightsIds],rightsIds,'保留諮商及特教既有來源');
const cd=tr('帶作品與履歷向老師討論，再用UCAN探索職業興趣及能力缺口。本次UCAN入口暫時無法使用，可先洽職發中心；18–29歲另可看台灣就業通Youth履歷自傳診斷。','Discuss your portfolio and résumé with a teacher, and use UCAN to explore interests and skills gaps. The UCAN entry was temporarily unavailable during this check; contact the career center if needed. People aged 18–29 may also use TaiwanJobs Youth résumé and autobiography review.','作品集と履歴書を教員に見てもらい、UCANで職業への関心や能力の課題を確認します。今回の確認時はUCAN入口が一時利用できませんでした。職発センターに相談でき、18～29歳は台灣就業通Youthの履歴書・自己紹介文診断も参照できます。');
change(`/cards/${career}/step_details/1/detail`,cd,careerIds,'補實際UCAN與政府履歷服務，不承諾校內當期預約開放');
change(`/cards/${career}/step_details/1/source_ids`,careerIds,careerIds,'逐句連官方入口');
const c3=tr('校方求職徵才網分就業、實習與工讀，先讀條件、截止日及投件方式，再調整履歷。舊消息不代表仍開缺；政府台灣就業通也提供公開職缺與求職資訊。','The university’s recruitment site separates jobs, internships and part-time work. Read the requirements, deadline and submission method before tailoring your résumé. An older post does not mean a vacancy remains open. TaiwanJobs also provides public job listings and job-search information.','学校の求人サイトは就職・実習・アルバイトに分類されています。条件、締切、応募方法を読んでから履歴書を調整します。古い告知は募集中とは限りません。政府の台灣就業通にも公開求人と就職情報があります。');
change(`/cards/${career}/step_details/2/detail`,c3,careerIds,'補可操作的公開徵才分類，不把已結束活動當開放');
change(`/cards/${career}/step_details/2/source_ids`,careerIds,careerIds,'採用真正公開資源');
const cw=tr('本次查核UCAN暫時無法使用；校內履歷諮詢的當期預約表尚未找到，先洽職發中心確認安排。','UCAN was temporarily unavailable during this check. A current university résumé consultation booking form was not found; contact the career center to confirm arrangements.','今回の確認時はUCANが一時利用できませんでした。学内の履歴書相談の当期予約様式は見つかっていないため、職発センターに実施状況を確認してください。');
change(`/cards/${career}/warning`,cw,careerIds,'如實保留外部系統與校內當期預約缺件');
const cq=tr('想找人幫我看履歷，有公開入口嗎？','Is there a public resource for getting my résumé reviewed?','履歴書を見てもらえる公開窓口はありますか。');
const ca=tr('先洽職發中心確認當期校內安排。台灣就業通Youth另提供18–29歲青年線上履歷自傳診斷，需自行登入並依預約規定辦理。','Ask the career center about current university arrangements. TaiwanJobs Youth also offers online résumé and autobiography review for people aged 18–29. You must log in yourself and follow its booking rules.','まず職発センターに当期の学内対応を確認してください。台灣就業通Youthは18～29歳向けにオンラインで履歴書・自己紹介文を診断しています。本人がログインし、予約規定に従って申し込みます。');
change(`/cards/${career}/faq`,[...g.cards[career].faq,{q:cq,a:ca,source_ids:['career-contact','youth-resume-public']}],careerIds,'政府服務與校內安排分開標示');
change(`/cards/${career}/source_ids`,[...g.cards[career].source_ids,...careerIds.filter(x=>!g.cards[career].source_ids.includes(x))],careerIds,'保留既有師長來源');
const updates=[
 ['aid-115-1','官方當期公告與公開表單已核對','本頁115-1截止10/20，於2026-10-24已過；現列轉學生原校審核通過、低收住宿與生活助學流程及3份空白PDF已讀。不把這一頁套為全部一般助學資格門檻。'],
 ['low-income-115-1','官方當期公告與申請流程已核對','115-1期間9/8–10/8已截止；須線上填列印並繳紙本。115-2仍寫000年，不能當確定日期。現列7頁操作手冊含111年、2022年示例，僅用於操作，不採其舊日期與案例個資。'],
 ['hardship-application-details','官方公開申請說明已核對；各方案條件須分開確認','綜合頁148萬元／1000萬元並未列於本校1141119急難要點，不能外推全校內外急難。以各方案規則、事件期限與承辦分流。'],
 ['career-contact','官方現列職掌與窗口已核對','重用2026-10-24 contacts/raw/career-members-dom.txt完整職掌：UCAN／講座1713、證照／就業職缺1712、實習／學海1711。現行首頁職掌亦相符；舊http_recheck為2026-10-22收據原封保留，並非今天再次失敗或今天全面重查。']
];
for(const [id,readability,note] of updates){const i=g.sources.findIndex(x=>x.id===id);for(const [key,after]of Object.entries({checked_at:'2026-10-24',readability,note}))change(`/sources/${i}/${key}`,after,[id],'只刷新本次實讀或明確重用當日全文，不覆蓋舊HTTP收據');}
fs.writeFileSync(path.join(dir,'proposal.json'),JSON.stringify({schema:1,product_written:false,guide_input_sha256:sha(bytes),requires_translation_review:true,changes,new_sources:newSources},null,2),{flag:'wx'});
fs.writeFileSync(path.join(dir,'translations.json'),JSON.stringify({schema:1,status:'suggestions for root review; no product translation written',translations},null,2),{flag:'wx'});
console.log(JSON.stringify({changes:changes.length,new_sources:newSources.length,visible_translations:translations.length,guide_before_sha256:sha(bytes)}));
