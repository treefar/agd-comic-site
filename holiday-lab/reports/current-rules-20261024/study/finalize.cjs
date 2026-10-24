// Research artifacts only: no product writes, network calls or branch operations.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const dir=__dirname,repo=path.resolve(dir,'../../../..');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(n,v)=>fs.writeFileSync(path.join(dir,n),JSON.stringify(v,null,2)+'\n');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const old=path.join(repo,'holiday-lab/reports/guide-capstone-study-research-20261023/raw');
const guide=read(path.join(repo,'data/students/guide.json'));
const receipts=[...read(path.join(dir,'download-receipts.json')),...read(path.join(dir,'supplement-receipts.json'))];
const docxs=['capstone-rule','capstone-group','capstone-change'].map(id=>{
 const m=read(path.join(dir,'raw',id+'-fetch.json')),file=path.join(dir,'raw',id+'.docx');
 return {...m,local_file:'raw/'+id+'.docx',sha256:sha(file),same_as_20261023:sha(file)===sha(path.join(old,id+'.docx'))};
});
write('source-catalog.json',{recorded_at:new Date().toISOString(),direct_receipts:receipts,public_documents:docxs,
 reused_text:{file:'holiday-lab/reports/guide-capstone-study-research-20261023/raw/graduate116A1-text.json',reason:'Fresh registrar PDF and institute PDF both exactly match the previously read PDF SHA; reuse prior extraction and visual page evidence, not a claim of fresh full rendering.'}});
const instituteURL='https://www.ad.stu.edu.tw/2026/09/30/%e3%80%90116%e5%ad%b8%e5%b9%b4%e5%ba%a6%e7%a2%a9%e5%a3%ab%e7%8f%ad%e7%94%84%e8%a9%a6%e3%80%91%e6%a8%b9%e5%be%b7%e7%a7%91%e6%8a%80%e5%a4%a7%e5%ad%b8-%e8%a8%ad%e8%a8%88%e5%89%b5%e6%96%b0%e8%88%87/';
write('native-observations.json',{
 method:'CUA native Chrome own research tab, public DOM read during this research turn. Recorded after reading; public source details only. No private account data, signed download URLs or credentials retained.',
 recorded_at:new Date().toISOString(),
 forms_chain:['https://www.dgd.stu.edu.tw/常用表單/','https://sites.google.com/stu.edu.tw/agdfiles','https://docs.google.com/folderview?authuser=0&id=11x7JyAYyALro3xrd_UYDBnezQXwepCtK','https://drive.google.com/drive/folders/1XPq9ucg3Za7lYRiz6b13CQgQtAIt88nS','https://drive.google.com/drive/folders/1uf3wk07YaDIaPh_17k6EcAeLIjaxnKJU'],
 capstone_folder:{public:true,visible_files:docxs.map(x=>({title:x.title,id:x.id})),scope:'Visible capstone folder main grid showed these three documents. This does not assert every non-public cohort announcement has been inspected.'},
 institute_article:{url:instituteURL,published:'2026-09-30',title:'【116學年度碩士班甄試】樹德科技大學 設計創新與經營研究所 熱烈招生中！',
 relevant_body:'甄試項目：書面資料審查（跨域學習研究計畫、個人成就證明、歷年成績單）。招生名額：碩士班9名。網路報名時間：115/09/29至115/11/02；現場報名115/11/03。詳細相關訊息公佈於本校招生考試服務網。',
 attachment:receipts.find(x=>x.id==='institute116').url,
 correction_label_present:false,explicit_no_interview_statement_present:false,
 direct_fetch_limitation:'Direct GET article returned HTTP202 with 0 bytes; raw/institute-post.html is not usable article text. Native Chrome article DOM succeeded.'},
 search_scope:{queries:['site:dgd.stu.edu.tw 專題 115 二審 三審','site:ad.stu.edu.tw 116 更正 甄試','site:reg.aca.stu.edu.tw 116 碩士班 考試 更正'],result:'Search results mostly stale 115 admission pages; no dated formal correction found in this bounded search. Negative search results are not proof of non-publication.'}
});
const matrix=[
 {id:'S01',question:'已取得當屆專題正式辦法，足以套用本屆？',answer:'no',status:'缺件',finding:'目前官網公開夾仍為第十二屆、108/12/30修訂版。三份原檔與10/23保存檔逐位元相同；未取得當屆適用公告。',sources:docxs.map(x=>x.url)},
 {id:'S02',question:'換組二審／三審期限衝突已有正式解釋或更正？',answer:'no',status:'版本衝突',finding:'變更申請單寫二審前；分組單與實施辦法伍3、伍5寫三審前。此次原檔仍保留兩種說法，不擇一代學校裁決。',sources:docxs.map(x=>x.url)},
 {id:'S03',question:'已核本屆評分、補審與各次交件清單？',answer:'no',status:'缺件',finding:'108版有六次審查、評分比例與補審最高60分等舊規定；當屆時程、評分表、補審通知、交件及權利清單未見於目前三份文件，不能套用舊表。',sources:[docxs[0].url]},
 {id:'S04',question:'116設創碩甄書審100%與口試文字已有正式更正？',answer:'no',status:'版本衝突',finding:'招生處與設創所當前PDF均與10/23原檔同SHA。實體第16頁（印刷第15頁）仍同時有書面資料審查100%與規定事項1的口試文字。9/30所方公告寫書審，但未明示更正或免口試，不能消除矛盾。',sources:[receipts.find(x=>x.id==='graduate116A1').url,receipts.find(x=>x.id==='institute116').url,instituteURL]},
 {id:'S05',question:'此次實讀官方簡章索引已有116碩士班入學考試A4連結？',answer:'no',status:'本次未找到',finding:'本次兩個官方索引實讀只見115A4與114A4，116僅A1。lt=A4實際仍回全類別表；未猜116A4下載URL，也不宣稱全校沒有公告。',sources:[receipts.find(x=>x.id==='index').url,receipts.find(x=>x.id==='A4-index').url]},
 {id:'S06',question:'已取得本次公開正文／原附件並綁定版本與雜湊？',answer:'yes',status:'研究證據已落地',finding:'三份DOCX、招生處及所方兩份116A1 PDF、兩份索引HTML已保存原檔與SHA；所方公告已原生Chrome實讀，直連202限制明列。',sources:docxs.map(x=>x.url)}
];
write('matrix.json',{as_of:'2026-10-24',scope:'專題製作、繼續升學；不得將研究檔案技術通過當作校規已釐清',rows:matrix});
const definitions=[
 ['capstone','warning','目前公開專題辦法為108年修訂版，換組表單也有期限差異。組隊、評分、補審與交件，先向系辦確認當屆文件。',['S01','S02','S03']],
 ['capstone','faq/1/a','公開變更單寫「二審前」，分組單與辦法寫「三審前」，尚未取得統一說明。換組前請系辦確認本屆期限與表單；評分、補審也要看當屆文件。',['S01','S02','S03']],
 ['graduate-study','warning','116設創碩甄簡章同頁列書審100%，卻仍有口試文字，尚未核得正式更正。報考前請招生選才組或設創所確認，不直接當成免口試。',['S04']]
];
const at=(obj,p)=>p.split('/').reduce((a,k)=>a[k],obj);
const operations=definitions.map(([id,p,after,ids])=>{
 const i=guide.cards.findIndex(c=>c.id===id),pointer='/cards/'+i+'/'+p;
 return {op:'replace',file:'data/students/guide.json',pointer,before:at(guide.cards[i],p),after,source_matrix_ids:ids,sources:[...new Set(matrix.filter(x=>ids.includes(x.id)).flatMap(x=>x.sources))],reason:'具體揭露已實讀文件的版本與待確認事項，維持向正式窗口確認，不代為裁決衝突。'};
});
write('proposal.json',{as_of:'2026-10-24',status:'proposal_only_not_applied',product_sha256:sha(path.join(repo,'data/students/guide.json')),operations,
 dependencies:['若套用，需同步data/en與data/ja中這三個中文key的完整譯文及引用；先搜尋全部key引用，勿保留過期來源文字。','FAQ既有dept-forms來源連到目前公開文件入口；升學既有graduate-handbook-116綁定實讀116A1。可將本報告source-catalog連結放入審閱證據，不自行稱當屆規章確認。','本提案未補造116A4日期、當屆專題評分表、免口試結論；無產品變更、無Build／UI驗收。']});
write('attachment-comparison.json',docxs.map(x=>({id:x.id,file:x.local_file,sha256:x.sha256,same_as_20261023:x.same_as_20261023,modified_time:x.modified_time})));
console.log(JSON.stringify({written:['source-catalog.json','native-observations.json','matrix.json','proposal.json','attachment-comparison.json'],policy_yes:matrix.filter(x=>x.answer==='yes').length,policy_no:matrix.filter(x=>x.answer==='no').length,operations:operations.length,product_modified:false},null,2));
