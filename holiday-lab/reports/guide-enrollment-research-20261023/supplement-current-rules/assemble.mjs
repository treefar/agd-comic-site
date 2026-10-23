import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const old=path.dirname(base), repo=path.resolve(old,'../../..');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,x)=>fs.writeFileSync(path.join(base,p),JSON.stringify(x,null,2)+'\n');
const prior=read(path.join(old,'source-catalog.json'));
const sources=[
 {id:'A15',key:'credit',version:'114年9月10日教務會議通過',pages:[1,2,3],read_scope:'全部3頁、第一至十七條及修訂沿革',summary:['第2條抵修含科目及學分，免修不含學分須補足','第3、7條身分事因與證照免修；第4條四技抵修上限依年級及例外','第9條入學當學期依行事曆辦理；第10條開課單位實質初審、教務處複審','第13條每身分事因一次；第14條複審通知後一週內申覆'],limitations:['官網當日所連版本；Drive修改時間不能證施行時間','當期系統印表與2018舊空白表一致性仍未核']},
 {id:'A16',key:'course',version:'114年2月19日教務會議通過',pages:[1,2,3],read_scope:'全部3頁、第一至二十條及修訂沿革',summary:['第4條按入學年課程，轉學生按轉入年級入學年；入學首學期即休學得按復學年','第5條四技1至3年級12至27學分，4年級6至27，延修至少1科至多27，低於或超過須申請','第6條超減修須符合條件並核准，第7條完成教學成效問卷才可次學期初選','第11條不得衝堂，第14條棄選後不得低於最低學分、同課一次、成績W，學分費不退且欠費仍補繳','第15條特殊選課限列舉情形、公告期間與未額滿加選，仍須授課教師/開課主管/教務同意','第16條以系統紀錄為準，未完成退棄選仍依教師評量給分'],limitations:['沒有由法規日期推定115-1棄選或特殊選課現在受理','本輪未取得115棄選及特殊處理表/公告']},
 {id:'A17',key:'intermission',version:'112年4月26日校務會議通過',pages:[1,2],read_scope:'全部2頁、第一至十四條及修訂沿革',summary:['第4、5條自請休學須核准，其他原因由系所協助專案報學院院長；未滿18歲須法定代理人/監護人同意','第5條領表七日內簽核回教務，核准才生效；核准日起兩週內得因故申請撤銷但有考試/兵役通報限制','第6條每次一學期、原則累計二學年；休學當學期期末考結束前辦下期復學或續休','第6條開學逾三分之一學期後原則不得提早復學，僅列英文能力培養/論文研討延畢生例外；須與較新學則核對','第7條服役、懷孕生產哺育幼兒不計休學累計，第11條重傷病重大事故可專案核准延長','第8條註冊後自請休學須期末考開始日（不含）一週前；第9條休學中不得請求轉系','第12條退費原則以領表日為基準，但原檔引用不存在的第4條第1項第7款，不能自行套用回溯退費'],limitations:['第12條所引第4條第1項第7款與原檔第4條僅3款不符，已視覺核對，須承辦釐清','112細則的提早復學例外與115學則未明列例外存在適用待核，不直接保證例外可用','本期休復學表單、通知樣本仍未取得']},
 {id:'A18',key:'transfer',version:'114年2月19日教務會議通過',pages:[1,2],read_scope:'全部2頁、第一至十三條及修訂沿革',summary:['第2條每學期第4週申請；實際收件日依當期公告','第3條不得跨學制、休學中不得申請及招生簡章限制等；第2條另有特殊提案及系調整輔導例外','第5條親至教務申辦不收郵遞，限1志願提交不得改，未成年須家長/監護人同意，當期休退申請失效','第6條各系另訂審查要點；第8條核准公告不得變更撤銷','第9條轉入年級前已及格科目須由轉入系核准承認，限一次，轉入當學期加退選前送教務登錄，逾期不受理'],limitations:['校級法規不能代替115-2各系資格/書審附件','當期轉系申請表與動遊系現行審查要點仍未完整取得']}
].map(s=>{const d=read(path.join(base,'raw',s.key+'-connector.json'));return {...s,title:d.title,url:d.url,unit:'教務處註冊課務組',checked_at:'2026-10-23',read_level:'official_linked_drive_pdf_full_text_and_visual',raw:'raw/'+s.key+'.pdf',raw_sha256:hash(path.join(base,'raw',s.key+'.pdf')),bytes:fs.statSync(path.join(base,'raw',s.key+'.pdf')).size,provider_text:'raw/'+s.key+'-connector.json',provider_sha256:hash(path.join(base,'raw',s.key+'-connector.json'))};});
const shared=path.join(repo,'holiday-lab/reports/guide-support-career-research-20261023');
sources.push({id:'A19',title:'樹德科技大學學則（1150202教育部備查本）',url:'https://drive.google.com/file/d/1ekLHsxdn5iXd7CdZ9daFtSbii7c0p2OC/view',unit:'教務處',checked_at:'2026-10-23',version:'檔名1150202備查；正文臺教技(四)字第1150002455號函備查',read_level:'shared_official_drive_pdf_selected_text_and_visual',raw:path.join(shared,'raw/school-regulations.pdf'),raw_sha256:hash(path.join(shared,'raw/school-regulations.pdf')),pages:[1,3,4,6,7],read_scope:'16頁中實讀及視覺核對1、3、4、6、7頁：標題/第9條及續頁、第20至27條相關規定；非全16頁實讀',summary:['第9條確認註冊、選課及抵免應依期限，未如期繳費及未准延緩註冊可能退學','第20條因故請假經核准，任課教師不得拒絕補考申請，仍應申請並於次學期上課前完成','第23、24條依請假規則，核准為缺課，未准為曠課；孕產育兒等另有彈性規定','第25條每次休一學期原則二學年，逾三分之一學期不得復學；義務役、孕產/育三歲以下子女、所列青年教育與就業儲蓄/青年生涯領航計畫可不計休學年限','第26條依原系相銜接學年/學期復學，中途休學回原休學學年或學期，開學即到課；已及格科目不得重複修習','第27條逾期未註冊或休學逾期未復學應令退學'],limitations:['共享官方原檔，沒有重抓；只實讀選定5頁','115學則逾三分之一學期禁止與112休學細則延畢例外需適用釐清，不推定較舊例外自動有效','不是完整最新版請假規則或個別補考自動核准']});
write('sources.json',{as_of:'2026-10-23',prior_catalog:'../source-catalog.json',added_sources:sources,source_count_added:5,source_count_with_prior:19,anonymous_drive_public_verified:false});
const v=read(path.join(base,'visual-pages.json')).filter(x=>x.key!=='school-regulations');for(const x of v)x.visual_read=true;
for(const n of [1,3,4,6,7]){const png=path.join(base,'raw/school-regulations-page-'+n+'.png');v.push({key:'school-regulations',pdf:sources[4].raw,pdf_sha256:sources[4].raw_sha256,page:n,png,png_sha256:hash(png),visual_read:true});}
write('visual-pages.json',v);
const draft=read(path.join(old,'student-draft.json'));draft.scope='首版五題流程的當前官網法規補正；僅研究審閱，未套產品';draft.supplements='../REPORT.md';
const by=Object.fromEntries(draft.topics.map(x=>[x.id,x]));
by.course.steps[0]={title:'核對適用課程表和總學分',kind:'規定與辦事建議',text:'一般按入學學年度課程表檢查必修與重補修；轉學生按轉入年級學生的入學年度，入學首學期即休學者另有復學年度規定。四技一至三年級每學期12至27學分、四年級6至27學分，延修至少一科且至多27學分，超減修要另申請核准。',source_ids:['A16']};
by.course.steps[1].text='選課分初選、加退選與棄選，115-1一般加退選已於9月14日上午9時截止。現在想異動應先查當期棄選或特殊處理公告，特殊逾期加選另有資格、未額滿及核准限制，不能只取得老師口頭同意。';by.course.steps[1].source_ids=['A02','A16'];
by.course.steps[2].source_ids=['A02','A16'];by.course.steps[3].source_ids=['A16'];
by.course.faq[0].source_ids=['A16'];by.course.faq[1]={q:'現在不想修，直接不去上課可以嗎？',a:'要完成正式退選或棄選；棄選後不能低於最低學分、同課限一次且成績登W，學分費不退，未繳仍須補繳，115-1當期棄選日程本輪仍未取得。',source_ids:['A16','A02']};
for(const s of by.credit.steps){s.source_ids=s.source_ids.map(x=>x==='A04'?'A15':x);s.kind=s.kind.replace('A04所列版本','1140910辦法');s.text=s.text.replace('A04辦法列','1140910辦法規定');}for(const f of by.credit.faq){f.source_ids=f.source_ids.map(x=>x==='A04'?'A15':x);f.a=f.a.replace('A04及115-1','1140910辦法及115-1').replace('A04列','1140910辦法列');}
by.leave.steps[2].text='假期較長、包含考試或事情發生後才補請時，先問導師與生輔組要補哪些證明或簽核。學則規定因故請假經核准者，任課教師不得拒絕補考申請，但仍應提出補考申請並核對該考試的文件和期限。';by.leave.steps[2].source_ids=['A19','A13'];
by.leave.faq[2].a='學則保障因故請假經核准者提出補考申請，仍不是自動排好補考；例如通識英文會考另列准假畫面、申請與切結，應照該考試程序辦理。';by.leave.faq[2].source_ids=['A19','A13'];
by.status.steps[0].source_ids=['A17','A19'];by.status.steps[2].source_ids=['A08','A17'];by.status.steps[3].text='完成離校後確認休學已核准，再向承辦核對學費、貸款或所需證明。休學辦法原則以領表日計退費，原檔另有引用不存在款次的疑義，不能自行推定可回溯退費。';by.status.steps[3].source_ids=['A17'];
by.status.steps[4].text='休學辦法要求在休學當學期期末考結束日前，辦理下學期復學或續休，並配合學校通知完成回覆。更換聯絡方式要更新資料，沒有收到通知就主動問承辦，不能當成自動續休。';by.status.steps[4].source_ids=['A17','A19','A08'];
by.status.steps[5].text='依核定安排完成註冊、選課並在開學時到課，已及格科目不要重複修習。115學則與112休學辦法對逾三分之一學期後提早復學的例外寫法不同，若想學期中復學，先請註冊課務組確認適用規定，不自行認定可以或一律不行。';by.status.steps[5].source_ids=['A17','A19'];
by.status.faq[1].a='不能；休學辦法要求期末考結束前辦理復學或續休，學則也把逾期未復學列為應令退學事由，應依通知主動完成程序。';by.status.faq[1].source_ids=['A17','A19'];
by.status.faq[2].a='不是所有情況都一樣；115學則列義務役、孕產或育三歲以下子女及指定青年計畫持證明可不計年限，重傷病或重大事故另可專案申請延長，不能把一般兩年上限套給所有人。';by.status.faq[2].source_ids=['A17','A19'];
by.transfer.steps[0].source_ids=['A09','A18'];by.transfer.steps[2].text='使用當期申請表，只填一個轉入志願並核對內容，提交後不能改，未成年申請者另須家長或監護人同意。校級辦法原則禁止跨學制或休學中申請，招生簡章禁轉者另有特殊提案程序，須先確認自己的資格。';by.transfer.steps[2].source_ids=['A18'];
by.transfer.steps[3].text='依當期公告先送原系核章，再於期限內親至教務處申辦，校級辦法不接受郵遞或其他方式。轉入系要求書審或面試時也要按時完成，不能只交原系就當作已送完。';by.transfer.steps[3].source_ids=['A09','A18'];
by.transfer.steps[4].text='依公告查審查結果，核准公告後不得變更撤銷，申請當學期休退學會使申請失效。核准後，轉入年級前已及格課程的學分承認限申請一次，必須在轉入當學期加退選前完成並送教務處登錄。';by.transfer.steps[4].source_ids=['A18','A09'];
by.transfer.faq[1].source_ids=['A18','A09'];by.transfer.faq[2].source_ids=['A18','A09'];
write('student-draft.json',draft);
const gaps=[
{id:1,prior:'現行學則及學生選課準則全文',status:'resolved_for_assigned_scope',now:'學則原檔完整取得；相關第9、20至27條選頁實讀。選課準則全20條全文及3頁視覺實讀；不能聲稱學則16頁全實讀。',sources:['A16','A19']},
{id:2,prior:'115棄選／特殊逾期日程及表',status:'not_ready',now:'法規資格及法律效果已補；當期操作公告、期限及表仍未查得。',sources:['A16']},
{id:3,prior:'最新版抵免辦法與當期印表版本一致性',status:'partial',now:'當日官網列版1140910全17條已補；與115B4附錄核重要條文一致；當期印表/2018舊表一致性仍未核。',sources:['A15']},
{id:4,prior:'完整最新請假規則、假別及操作附件',status:'not_ready',now:'學則第20、23、24條補母法與補考權益；完整最新版請假規則、全假別及操作附件仍缺。',sources:['A19']},
{id:5,prior:'休復學母法、本期表單及通知樣本',status:'partial',now:'112休學辦法全14條、115學則相關條文已補；本期表單/通知仍缺，提早復學例外及第12條錯引待釐清。',sources:['A17','A19']},
{id:6,prior:'115轉系申請表與各系審查附件',status:'not_ready',now:'1140219校級辦法全13條已補；115-2申請表、附件二三及各系當期審查仍缺。',sources:['A18']},
{id:7,prior:'本系轉系Word全文及當期適用',status:'not_ready',now:'原101年DOC仍只有部分字串；校級辦法不能代替本系要點，不提升全文/現行性。',sources:['A18']},
{id:8,prior:'匿名公開Drive及個人核准',status:'not_verified',now:'僅使用學校已連接Drive讀官網指定法規；未測匿名公開，未登入學生系統或取得個人核准。',sources:['A15','A16','A17','A18','A19']}
];write('gap-status.json',gaps);
const all=new Map([...prior.sources,...sources].map(s=>[s.id,s]));const cite=ids=>ids.map(id=>'['+id+']('+all.get(id).url+')').join('、');
let md='# 在校指南：當前官網法規補研\n\n查閱基準：2026-10-23。動遊系日間四技研究審閱稿，未套產品、未發布。承接上層首版 REPORT.md（SHA e6ea2c15567c42d9e1bf937f9bda664b56896a942f581cda8ce06b715ab2d16f），原報告、raw及verification不覆寫。首版曾列未取得的四份法規現已實讀，歷史缺件狀態不刪，以下另記更新。\n\n## 本次新增來源與實讀\n\n新增5件法規來源：4件由官網母鏈指定Drive取得全文及原PDF，全部10頁已抽文、視覺核對；共享學則原PDF16頁，只實讀與視覺核對1、3、4、6、7頁。合計本次15頁視覺實讀，與首版14件來源合計19件；不是19件全部當日live全文。官網入口由另一代理Chrome唯讀取得，母鏈收據路徑在sources.json/共享目錄；本代理未把Drive建立/修改時間當作法規施行證據。\n\n';
for(const s of sources)md+='### '+s.id+' '+s.title+'\n\n'+s.version+'。'+s.read_scope+'。 '+cite([s.id])+'\n\n'+s.summary.map(x=>'- '+x).join('\n')+'\n\n限制：'+s.limitations.join('；')+'。\n\n原檔 SHA-256：`'+s.raw_sha256+'`。\n\n';
md+='## 首版八類缺口逐條更新\n\n|項目|狀態|此次解除與剩餘|\n|---|---|---|\n'+gaps.map(g=>'|'+g.id+' '+g.prior+'|'+g.status+'|'+g.now+'|').join('\n')+'\n\n第1項只就本任務相關條文解除原檔缺件；不把學則16頁全讀完。整體正式現行規章、表單與當期日程全齊仍為 no。\n\n## 文案補正與來源歧異\n\n1. 原稿「教務FAQ列學期中不得復學」不能作全面禁止：112細則第6條明列逾三分之一學期後延畢生例外，但較新115學則第25條未列此例外。改成請承辦確認學期中復學的適用規定，不宣稱可自動使用舊例外。\n2. 休學年限不只一般兩年：115學則第25條增加指定青年計畫等不計年限情形，應檢證明；重傷病/重大事故延長是專案核准，不等於自動免計。\n3. 休學112原PDF第12條引用「第4條第1項第7款」，該第4條僅3款，視覺確認並非抽文錯誤；不猜回溯退費適用範圍，學生稿只說確認核准與承辦計算。\n4. 校內轉系核准後的學分承認，依1140219第9條限一次，須轉入當學期加退選前完成送教務。先前泛稱核准後確認抵免過於粗略，現補實際截止與核准流程。\n5. 抵免1140910第2、9、10、13、14條與首版115B4附錄同列規定相符；兩PDF封裝SHA不同，不宣稱逐位元一致。2018空白表「在學期間一次」仍不取代新條文「每身分事因一次」。\n6. 請假稿補學則第20條：因故請假經核准，教師不得拒絕補考申請；須申請與按指定期限完成，不能寫成所有補考只看教師自由決定，也不保證自動排考。\n\n## 更新後學生流程草稿\n\n規定依各處明列版本；辦事建議是整理與追蹤動作。115-1加退選9/14及抵免9/21、115-2轉系10/8的原期限截至查閱日已過，沒有用舊日期當作目前仍受理。請假最新全規則、115棄選等未取得處仍明列缺件。\n\n';
for(const t of draft.topics){md+='### '+t.title+'\n\n';if(t.branch_note)md+=t.branch_note+'\n\n';const flow=t.mermaid||'flowchart LR\n'+t.flow.map((x,i)=>t.id+i+'["'+x+'"]'+(i<t.flow.length-1?' --> '+t.id+(i+1):'')).join('\n');md+='~~~mermaid\n'+flow+'\n~~~\n\n';for(const [i,s] of t.steps.entries())md+='#### '+(i+1)+'. '+s.title+'\n\n'+s.kind+'。\n\n'+s.text+' '+cite(s.source_ids)+'\n\n';md+='#### 常見問題\n\n';for(const f of t.faq)md+='- **'+f.q+'** '+f.a+' '+cite(f.source_ids)+'\n\n';}
md+='## 取用分層、期限與窗口\n\n本次四份是官網所列、已連接學校Drive的原PDF全文；共享學則是完整原檔與選定條文實讀。沒有新增當日匿名live網頁全文，也不把首版官方搜尋索引提升成當日live；首版18次HTTP的202空回應、403與200空殼仍原封保留，請看上層來源清冊和失敗raw。未取得：115棄選/特殊選課當期日程與表、115抵免系統列印版、現行完整請假規則與附件、休復學本期表單/通知、115-2各系轉系附件與本系現行要點。\n\n行政窗口沿用首版官方組織分工：動遊選課/抵免/休退學2016，校級轉系/復學2009，生輔請假獎懲單位頁2114；2026請假公告承辦2126與單位頁不同，未推定人員異動。學生可先由導師/系辦協助確認，沒有對外聯絡或進入個人校務系統。\n\n## 驗證\n\n以 verify.mjs 唯讀重算首版不變、4份PDF SHA/頁數、5個新增來源、15頁實讀收據、引用、每題4–6步/每步2句/3FAQ與8類缺件；完整實際stdout寫 verification-output.txt，結果寫 verification.json。這是文件/收據檢查，不把結構通過當作個人核准或當期申請已受理。\n\n```powershell\nnode holiday-lab/reports/guide-enrollment-research-20261023/supplement-current-rules/verify.mjs\n```\n\n實際取得：4次Drive原檔下載，HTTP200依序196504、174534、146065、163125 bytes，Node各exit0；PDF抽文與15頁渲染Python exit0。命令及工具參數另存commands.json，原文含在 raw/*-connector.json與raw/*-pages.json。\n\n';
for(const [id,s] of all)md+='['+id+']: '+s.url+'\n';fs.writeFileSync(path.join(base,'REPORT.md'),md);
console.log('assembled sources='+sources.length+' visual_pages='+v.length+' topics='+draft.topics.length+' prior_files_unchanged=true');
