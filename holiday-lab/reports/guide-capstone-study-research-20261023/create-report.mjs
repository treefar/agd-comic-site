import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const b=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const read=n=>JSON.parse(fs.readFileSync(path.join(b,n),'utf8'));
const save=(n,v)=>fs.writeFileSync(path.join(b,n),JSON.stringify(v,null,2)+'\n');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const receipts=[...read('fetch-receipts.json'),...read('fetch-curricula-receipts.json')];
const visual={curriculum112:[1],curriculum113:[1],curriculum114:[1],curriculum115:[1],graduate116A1:[3,4,5,8,9,10,11,12,13,14,15,16,17,18,21,22,23,29,30,31,32,33,34,35],graduate115A1:[4],graduate115A4:[4]};
const titles={curriculum112:'112入學日間四技課程表',curriculum113:'113入學日間四技課程表',curriculum114:'114入學日間四技課程表',curriculum115:'115入學日間四技課程表',graduate116A1:'116碩士班甄試簡章',graduate115A1:'115碩士班甄試簡章',graduate115A4:'115碩士班考試簡章',graduateIndex:'官方招生簡章查詢表',apply116:'116碩甄報名系統說明',deptforms:'系網常用表單入口',deptnews:'系網消息索引',exhibition:'系網畢業展索引',examPage:'教務處碩士班考試入口',designSchool:'設計學院首頁',designInstitute:'設計創新與經營研究所網站',architecture:'室內設計系網站',publicRestPosts:'官方消息REST嘗試',publicRestPages:'官方頁面REST嘗試'};
const sources=receipts.map(r=>({...r,title:titles[r.id],access_layer:r.pdf_signature?'raw_pdf_relevant_pages_read':r.bytes?'html_full_text_read':'empty_http202_no_body',visual_pdf_pages:visual[r.id]||[],scope:r.id.startsWith('curriculum')?'一般日間四技第1頁及註記；其他學制頁未讀':r.id==='graduate116A1'?'招生通則、9所招生表、上傳程序、結果與報到、7附表；非全37頁逐頁目視':r.id.startsWith('graduate115')?'歷史日程第3頁；不當目前開放':'詳見分層，空內容不算已讀規章'}));
const ids=['capstone-rule','capstone-group','capstone-change'];
const dr=read('drive-text-receipts.json');
for(let i=0;i<dr.length;i++){const d=dr[i],f='raw/'+ids[i]+'.docx';sources.push({id:ids[i],title:d.file.title,url:d.result.structuredContent.structuredContent.url,mime_type:d.file.mime_type,file:f,bytes:fs.statSync(path.join(b,f)).size,sha256:sha(path.join(b,f)),access_layer:'official_linked_docx_full_xml_paragraphs_and_tables_read',connector_text:'drive-text-receipts.json',independent_xml:'raw/'+ids[i]+'-xml.json',metadata_created:d.file.created_time,metadata_modified:d.file.modified_time,anonymous_public_access_verified:false,applicability:'官網列出的版本；114/115學年度或當屆現行適用未核實'});}
const chainFile='C:/agywork/agd-holiday-prototypes/holiday-lab/reports/integrated-review-20261023/root/official-form-entry.json';
const chain=JSON.parse(fs.readFileSync(chainFile,'utf8'));
const catalog={as_of:'2026-10-23',counts:{unique_document_or_page_urls:sources.length,actual_nonempty_sources:sources.filter(s=>s.bytes>0).length,raw_pdf:sources.filter(s=>s.pdf_signature).length,raw_docx:3,html_nonempty:sources.filter(s=>s.access_layer==='html_full_text_read').length,empty_http202:sources.filter(s=>s.access_layer==='empty_http202_no_body').length,visually_read_pdf_pages:Object.values(visual).flat().length},sources,discovery_chain:{mother_receipt:chainFile,sha256:sha(chainFile),recorded_at_note:'收據寫檔時間，不是假定精確瀏覽時間',official_chain:chain.chain,capstone_folder:'https://drive.google.com/drive/folders/1uf3wk07YaDIaPh_17k6EcAeLIjaxnKJU',folder_direct_children:3,anonymous_public_access_verified:false},evidence_policy:'下載/抽字不等於當屆適用；索引不等於公告全文；規章、空白表、成果新聞、在用日期各自判定。'};
save('source-catalog.json',catalog);
const gaps=[
{id:'P01',topic:'capstone',needed:'當屆專題研究展演實施辦法與修訂/適用公告',reason:'已取得第十二屆108/12/30修訂官網列版，未取得114/115學年度或目前畢業屆別之適用確認',owner:'系辦／當屆專題總監',sources:['capstone-rule','curriculum114','curriculum115']},
{id:'P02',topic:'capstone',needed:'當屆分組/更換指導老師/組員調整期限公告及有效空白表',reason:'辦法與分組表三審前；變更表二審前，不能自行選一個',owner:'系辦／當屆專題總監',sources:['capstone-rule','capstone-group','capstone-change']},
{id:'P03',topic:'capstone',needed:'專題企畫、專題設計Ⅰ/Ⅱ先修、重修或跨屆修課規定',reason:'課表只列課程位置/學分；舊版延畢條款課名為專題研究I/II，不能從序號推定先修或等同現課名',owner:'系辦／課務單位',sources:['curriculum114','curriculum115','capstone-rule']},
{id:'P04',topic:'capstone',needed:'當屆分組人數、超額申請、論文組申請及指導老師配置確認',reason:'舊文列人數與機關舊稱，但沒有當屆適用公告或老師接案名額',owner:'系辦／當屆專題總監',sources:['capstone-rule','capstone-group']},
{id:'P05',topic:'capstone',needed:'當屆審查日程、各審交件/評量/補審公告',reason:'舊表的相對週次與比例可讀，但不等於本年度實際日程或評分表',owner:'當屆專題總監',sources:['capstone-rule']},
{id:'P06',topic:'capstone',needed:'當屆成果繳交規格、收件位置、繳交期限及必要授權/切結表',reason:'專題資料夾只有3DOCX，未列完整交件清單，不能自創檔名/格式/表單正式名稱',owner:'系辦／當屆專題總監',sources:['capstone-rule']},
{id:'P07',topic:'capstone',needed:'當屆校內外展公告與畢業展演基金繳費規定',reason:'舊文15000元與各屆公告機制未核為當屆金額；不得沿用往年展期',owner:'當屆畢籌會／總監',sources:['capstone-rule','exhibition']},
{id:'P08',topic:'capstone',needed:'系網For跳牆畢展單篇消息全文、日期及屆別對應',reason:'僅消息/畢展索引見標題，未取得單篇URL與日期，不能映射114/115屆',owner:'系辦／系網編輯',sources:['deptnews','exhibition']},
{id:'G01',topic:'graduate-study',needed:'116設計創新與經營研究所口試規定之更正或書面說明',reason:'同頁書審100%但規定事項要求準備口試；未決定免試或必試',owner:'設創所分機5201/5202、教務招生2004/2015',sources:['graduate116A1']},
{id:'G02',topic:'graduate-study',needed:'116碩士班考試招生簡章/實際開放公告',reason:'本輪查詢入口未取得；只有115A4已截止，不能推算116日期',owner:'教務處招生選才單位',sources:['graduateIndex','examPage','graduate115A4']},
{id:'G03',topic:'graduate-study',needed:'116附表四委託書內115學年度字樣之版本確認',reason:'附表表頭116，勾選項目寫115錄取報到，不能代校方更正',owner:'教務處招生選才單位',sources:['graduate116A1']}
];
save('gaps.json',gaps);
const programs=[
['資訊管理系碩士班',8,'口試20%、書審80%'],
['電腦與通訊系碩士班',9,'書審100%'],
['資訊工程系碩士班',10,'書審100%'],
['金融管理系碩士班',11,'口試20%、書審80%'],
['企業管理系經營管理碩士班',12,'口試20%、書審80%'],
['兒童與家庭服務系碩士班',13,'口試20%、書審80%'],
['人類性學研究所',14,'口試20%、書審80%'],
['室內設計系建築與室內設計碩士班',15,'書審100%'],
['設計創新與經營研究所',16,'書審100%；同頁口試文字衝突待核']
];
const forms=[
['一',29,'應屆畢業生身分證明書','應屆申請者依資格條件檢附，須教務單位核章'],
['二',30,'同等學力資格認定申請表','特定同等學力資格認定；不是所有一般學士申請者都交'],
['三',31,'成績複查申請表','成績複查用途，依簡章期限'],
['四',32,'委託書','委託辦理；勾選項目115與116表頭不一致待校方確認'],
['五',33,'考生申訴書','申訴用途，非每位報名者必繳'],
['六',34,'境外學歷（力）切結書','境外學歷文件未完成驗證時依簡章規定使用'],
['七',35,'考生聯絡方式修改申請表','已報名考生聯絡方式變更用途']
];
save('graduate-forms.json',forms.map(([number,pdf_page,title,purpose])=>({number,pdf_page,printed_page:pdf_page-1,title,purpose,url:sources.find(s=>s.id==='graduate116A1').url+'#page='+pdf_page,visually_read:true})));
const draft=read('draft.json');
const byId=Object.fromEntries(sources.map(s=>[s.id,s]));
function cites(ids,pages=[]){return ids.map(id=>{const s=byId[id],pg=pages.length&&s.pdf_signature?'#page='+pages[0]:'';return '['+s.title+']('+s.url+pg+')';}).join('、');}
let out='# 專題製作、繼續升學：補充研究與審閱稿\n\n查閱基準：2026-10-23（台灣）。服務對象：動遊系日間四技。這是研究草稿，未改網站、原指南或翻譯，未發布。\n\n';
out+='已補到可追查的專題辦法及兩張空白表，也讀完116碩甄相關資格、9所招生表及7附表。專題取得的是官網列出的第十二屆108年修訂版，當屆適用仍待確認；變更表截止點與辦法不一致。116設創所的書審比例與口試敘述也不一致，兩處都保留問題，不代校方判定。\n\n';
out+='## 一、可以交給學生看的流程草稿\n\n每步2句，標成建議的動作不冒充校方規定。專題的人數、審查週次、費用等舊版細節，不能在未核對當屆版本前做成目前必辦指令。\n\n';
for(const t of draft.topics){
 out+='### '+t.title+'\n\n';
 out+='~~~mermaid\nflowchart LR\n'+t.workflow.map((w,i)=>'S'+i+'["'+w+'"]'+(i<t.workflow.length-1?' --> S'+(i+1):'')).join('\n')+'\n~~~\n\n';
 for(let i=0;i<t.steps.length;i++){const s=t.steps[i];out+=(i+1)+'. **'+s.title+'**\n\n'+s.sentences.join('')+' '+cites(s.sources,s.pages)+'\n\n';}
 out+='#### 常見問題\n\n';
 for(const f of t.faq)out+='**'+f.question+'**\n\n'+f.answer+' '+cites(f.sources,f.pages)+'\n\n';
}
out+='## 二、專題規章、年度與表單核對\n\n';
out+='### 課表的「入學年度」不等於畢展屆別\n\n| 入學課表 | 表內大四學年度 | 本輪核實範圍 |\n|---|---|---|\n';
for(const [y,yr] of [[112,115],[113,116],[114,117],[115,118]])out+='| '+y+'入學 | '+yr+'學年度 | 一般日間四技第1頁，專題設計Ⅰ、Ⅱ各3學分；'+cites(['curriculum'+y])+' |\n';
out+='\n不能把115入學課表當成115學年度畢業班規則，也不能把新聞寫的畢展年份自動對應114或115屆。課表列出課程與學分，不足以證明Ⅰ是Ⅱ的系統先修條件；先修、延畢、跨屆修課仍缺當屆可適用規定。 '+cites(['curriculum114','curriculum115','capstone-rule'])+'\n\n';
out+='### 官網列版辦法：已讀內容與不可直接沿用的項目\n\n來源內文標第十二屆，103/11/19通過、108/12/30修訂。Drive顯示2020年修改不代表2020年新訂，也不能只因年代較早判定已失效；本輪尚無114/115當屆沿用或替代公告。 '+cites(['capstone-rule'])+'\n\n';
out+='| 項目 | 官網列版實際內容摘要 | 當屆還要核實 |\n|---|---|---|\n';
out+='| 分組 | 動畫、遊戲原則2至5人，論文1人；超額另經提案及會議程序 | 人數、例外、論文組資格與實際截止日 |\n';
out+='| 指導 | 由系上專任教師申請指導，確認表簽名後繳系辦 | 今年老師可接組數、分配及表單版本 |\n';
out+='| 審查 | 初、二、三、四、五、終審六階段；大三到大四逐步完成 | 實際日期、送審規格、評分與補審通知 |\n';
out+='| 展演 | 動畫/遊戲展演、論文發表投稿分開；校外展另經評定 | 當屆展期地點、資格、交件與授權文件 |\n';
out+='| 費用 | 舊文列畢業展演基金15000元，繳法另由當屆公告 | 不能當今年應繳金額或立即繳費依據 |\n';
out+='\n以上每列都是第十二屆文件內容的摘要，不是已確認的今年規定。 '+cites(['capstone-rule'])+'\n\n';
out+='### 3份附件逐件實讀\n\n| 檔案 | 讀取層級／重要欄位 | 判定 |\n|---|---|---|\n';
out+='| '+cites(['capstone-rule'])+' | DOCX全文段落及評分表XML；版首、分組、指導、變更、審查、展演均讀 | 官網列版，當屆適用未核 |\n';
out+='| '+cites(['capstone-group'])+' | 空白分組表；組別、組員、組長、指導意願與確認簽名 | 表內寫大三上完成分組，調整在三審前；當屆未核 |\n';
out+='| '+cites(['capstone-change'])+' | 空白變更表；原/新組別與名單、原/新老師簽名 | 注意事項寫二審前交畢籌會，與前二文三審前不同 |\n';
out+='\n三審前與二審前有文件衝突，不能擅選較晚期限。指南可先說「變更前先問當屆總監，使用確認有效的表單」，待系辦確認後才放確切截止點。\n\n';
out+='官方引鏈由主控Chrome讀取常用表單→AGD Files→學生事務→畢業專題；本代理以既有學校Drive連線讀3個官網列檔。匿名存取未驗證，沒有讀取教師專用、行政或個人填寫資料。母收據：['+path.basename(chainFile)+']('+chainFile+')。\n\n';
out+='系網畢展索引可見2025幻想咀嚼、2024璀璨的午夜怪盜等歷史成果，以及For跳牆標題；本輪未取得For跳牆單篇全文日期和屆別，不能用它補當屆規定或展期。 '+cites(['exhibition','deptnews'])+'\n\n';
out+='## 三、升學年度與校所資料\n\n';
out+='### 招生管道狀態（截至2026-10-23）\n\n| 管道 | 官方一般網路報名日期 | 本輪判定 |\n|---|---|---|\n';
out+='| 115碩甄 | 2025/10/1至2025/11/3 16:00 | 已截止的歷史梯次；'+cites(['graduate115A1'],[4])+' |\n';
out+='| 115碩士班考試 | 2026/1/19至2026/3/9 16:00 | 已截止的歷史梯次；'+cites(['graduate115A4'],[4])+' |\n';
out+='| 116碩甄 | 2026/9/29 10:00至2026/11/2 16:00 | 日期區間內；特殊資格另提前至10/27，個人資格仍需審查；'+cites(['graduate116A1'],[4])+' |\n';
out+='| 116碩士班考試 | 未取得可核實簡章/公告 | 不推算日期、不宣稱一定未公布；'+cites(['graduateIndex','examPage'])+' |\n\n';
out+='116是招生學年度，報名發生在民國115年（西元2026年），不能把簡章內115年日期誤當115招生梯次。官方報名系統也明列116碩甄及同一截止時間。 '+cites(['apply116','graduate116A1'],[4])+'\n\n';
out+='### 116碩甄9個實際名稱與評量方式\n\n以下只表示該簡章列名與比例，不保證動遊系每位同學均符合全部資格，更不保證錄取。每列招生表已抽字並實際看PDF頁面。\n\n| 系所完整名稱 | 招生表標示 | 原頁 |\n|---|---|---|\n';
for(const [name,pg,sc]of programs)out+='| '+name+' | '+sc+' | '+cites(['graduate116A1'],[pg])+'，PDF實體'+pg+'頁／印'+(pg-1)+'頁 |\n';
out+='\n### 設計領域兩個選項\n\n| 系所 | 116指定書審重點 | 聯絡 |\n|---|---|---|\n';
out+='| 室內設計系建築與室內設計碩士班 | 履歷、研究/讀書計畫、作品或成果、成績；非本科系依擅長領域備相關資料 | 07-6158000分機3502；'+cites(['graduate116A1'],[15])+' |\n';
out+='| 設計創新與經營研究所 | 跨域研究計畫需交代題目、背景動機、既有/擬跨專業、支援資源、預期成果；另附成果與成績 | 07-6158000分機5201、5202；'+cites(['graduate116A1'],[16])+' |\n\n';
out+='設創所同頁比例表為書審100%，規定事項卻寫準備口試；總口試日程也未列設創所。這是待官方說明的內部不一致，指南不能直接寫免面試或指定面試日。 '+cites(['graduate116A1'],[16])+'、'+cites(['graduate116A1'],[21])+'\n\n';
out+='### 資格、上傳與報到\n\n116通則允許符合學士或應屆等資格者報考；應屆證明見附表一，資格認定與境外學歷依個別規則處理，不把所有證照、在學或工作年資一概視為可報。報名後確認送出、上傳、繳費是不同動作；書審確認後不得任意補換件，不應因系統有補件查詢鈕就解讀成可自由改稿。 '+cites(['graduate116A1'],[5])+'、'+cites(['graduate116A1'],[18])+'、'+cites(['apply116'])+'\n\n';
out+='正取/備取依公告辦報到；逾期或手續不完整可能失去錄取資格，應屆生仍須依期限補齊學歷文件。讀到的是簡章所列報到規則，實際錄取名單或個人結果本輪均未查閱。 '+cites(['graduate116A1'],[22])+'、'+cites(['graduate116A1'],[23])+'\n\n';
out+='### 116簡章7附表逐件核對\n\n7張表都已讀文字與PDF圖面；按用途使用，不是每人全部必繳。\n\n| 附表 | 名稱 | 用途／注意 | PDF頁 |\n|---|---|---|---|\n';
for(const [no,pg,name,purpose]of forms)out+='| '+no+' | '+name+' | '+purpose+' | '+cites(['graduate116A1'],[pg])+' |\n';
out+='\n附表四是額外版本問題：表頭116，但報到勾選項寫115；本稿只標示待確認，不代校方改表。 '+cites(['graduate116A1'],[32])+'\n\n';
out+='## 四、尚缺的具體文件與官方確認\n\n| 編號 | 尚需取得 | 為什麼影響指南 |\n|---|---|---|\n';
for(const g of gaps)out+='| '+g.id+' | '+g.needed+' | '+g.reason+'；窗口：'+g.owner+' |\n';
out+='\n這份工作補的是兩個主題，不代表已讀完各處室全部資料，也不代表15卡原指南已補齊所有規章。已取得檔案、來源驗證、當屆適用與使用者審閱分開記錄。\n\n';
out+='## 五、實際查閱與驗證\n\n';
out+='來源清冊：[source-catalog.json]('+b+'/source-catalog.json)；缺件：[gaps.json]('+b+'/gaps.json)；結構化草稿：[draft.json]('+b+'/draft.json)。\n\n';
out+='本代理唯一文件/頁面URL '+catalog.counts.unique_document_or_page_urls+' 個：實際非空 '+catalog.counts.actual_nonempty_sources+' 個（7份PDF、3份DOCX、2份HTML），另9個HTTP202空本文嘗試，沒有把空本文算已讀。PDF逐頁目視 '+catalog.counts.visually_read_pdf_pages+' 個相關頁面；下載7份不代表7份全部頁數均已目視。Google Sites與資料夾屬導航引鏈，另計在母收據，不灌入文件數。\n\n';
out+='| 驗收項目 | yes/no | 實際證據 |\n|---|---|---|\n';
out+='| 兩主題都有大流程、每步2至3句及3FAQ | yes | verify.mjs核對draft結構及REPORT含每段 |\n';
out+='| 事實附精確官方URL／PDF相關頁 | yes | source-catalog＋REPORT引用，PDF頁使用實體頁碼 |\n';
out+='| 7PDF及3DOCX原檔雜湊可重驗 | yes | verify.mjs重新讀檔比對SHA與signature |\n';
out+='| 7附表及當屆/歷史招生時程已區分 | yes | graduate-forms.json、來源頁圖面及日期表 |\n';
out+='| 已證明專題列版就是114/115當屆現行全文 | no | 缺P01適用公告，另有P02文件衝突 |\n';
out+='| 已取得116碩士班考試最新梯次簡章 | no | 只有115A4，缺G02 |\n';
out+='| 已確認設創所口試與附表四版本 | no | 缺G01、G03官方更正／說明 |\n';
out+='| 已改產品或上線 | no | 本輪只新增本研究目錄；不build、不push |\n\n';
out+='實際指令與輸出保存 [verification.json]('+b+'/verification.json) 及 [verification-output.txt]('+b+'/verification-output.txt)。驗證只檢查本研究證據與結構，不冒稱全站功能、當屆規定或使用者已確認。\n';
fs.writeFileSync(path.join(b,'REPORT.md'),out);
save('page-visual-ledger.json',Object.entries(visual).flatMap(([id,pages])=>pages.map(p=>({source_id:id,pdf_page:p,printed_page:id.startsWith('graduate')?p-1:null,image:'pages/'+id+'-p'+p+'.png',sha256:sha(path.join(b,'pages/'+id+'-p'+p+'.png')),inspection:'view_image已實際讀取此頁；非只產圖'}))));
console.log('REPORT_CREATED sources='+sources.length+' nonempty='+catalog.counts.actual_nonempty_sources+' visual_pages='+catalog.counts.visually_read_pdf_pages+' topics='+draft.topics.length+' steps='+draft.topics.reduce((a,t)=>a+t.steps.length,0)+' faq='+draft.topics.reduce((a,t)=>a+t.faq.length,0));

