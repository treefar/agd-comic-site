// Read-only audit of existing evidence; never starts a browser, Unity, build, or old runner.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {games} from '../../catalog.mjs';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const root='C:/Projects/系網漫畫版_AGDComicSite';
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const json=file=>JSON.parse(fs.readFileSync(file));
const sourceFiles=[
 'holiday-lab/STATUS.md',root+'/LATEST_HANDOFF.md','holiday-lab/catalog.mjs',
 'holiday-lab/dashboard/data.json','holiday-lab/dashboard/out/dashboard-data.json','holiday-lab/dashboard/progress-policy.json','holiday-lab/dashboard/progress-source-receipts.json',
 'holiday-lab/layout-qa/supplement-integration-20261023/v4/coverage-current.json',
 'holiday-lab/reports/ui-polish-20261023/REPORT.md','holiday-lab/reports/ui-polish-20261023/root/verification.json','holiday-lab/reports/ui-polish-20261023/audit/font-coverage.json','holiday-lab/reports/ui-polish-20261023/audit/design-notes.md',
 'holiday-lab/reports/hero-release-20261023/REPORT.md','holiday-lab/reports/hero-release-20261023/root/student-verification.json',
 'holiday-lab/student-webgl/REPORT.md','holiday-lab/student-webgl/queued-inspection.json','holiday-lab/student-webgl/WORK-ORDER-index.md','holiday-lab/student-webgl/BACKGROUND-TESTING.md',
 'data/students/guide.json','student-guide-model.js',root+'/work-orders/20261022/ja-comic-review/research-flows/coverage.json',
 'holiday-lab/reports/guide-index-evidence/result.json','holiday-lab/reports/current-preview-smoke-20261023/REPORT.md',
 'holiday-lab/reports/faculty-portrait/REPORT.md','holiday-lab/reports/faculty-portrait/browser.json','holiday-lab/reports/floating-cta-result.json',
 'holiday-lab/redesign/style-options/REPORT.md',
 'holiday-lab/translation-review/independent-language-recheck-20261023/findings.json','holiday-lab/translation-review/independent-language-recheck-20261023/REPORT.md',
 'holiday-lab/translation-review/dedicated-language-audit-20261023/REPORT.md','holiday-lab/translation-review/guide-terms-rendered11/summary.json',
 root+'/work-orders/20261022/shared-interface-release/VERIFY-shared-interface.md','docs/qa/i18n-catalog.json'
];
const before=sourceFiles.map(file=>({file,sha256:sha(file),bytes:fs.statSync(file).size}));
const dashboard=json('holiday-lab/dashboard/data.json'),current=json('holiday-lab/dashboard/out/dashboard-data.json'),coverage=json('holiday-lab/layout-qa/supplement-integration-20261023/v4/coverage-current.json');
const guide=json('data/students/guide.json'),research=json(root+'/work-orders/20261022/ja-comic-review/research-flows/coverage.json');
const polish=json('holiday-lab/reports/ui-polish-20261023/root/verification.json'),hero=json('holiday-lab/reports/hero-release-20261023/root/student-verification.json');
const compactSections=d=>d.sections.map(s=>({id:s.id,rows:s.rows.map(r=>({id:r.id,title:r.title,built:r.built,tool:r.tool,user:r.user,workflow:r.workflow,result:r.result}))}));
const receipt=json('holiday-lab/dashboard/progress-source-receipts.json');
const receiptChecks=receipt.sources.map(r=>({file:r.file,expected:r.sha256,current:sha(r.file),matches:sha(r.file)===r.sha256}));
const scope=[];
function row(id,title,status,data,tool,user,remaining,evidence){scope.push({id,title,status,data,tool,user,remaining,evidence});}
row('english-live','英文共用介面公開版','done','deployed 1b8322e','2026-10-22 212 routes +28 delta +16 live','authorization recorded','本輪沒有重新連線查站；只認定既有發布已完成，不冒稱即時線上健康。',[sourceFiles[31],root+'/LATEST_HANDOFF.md']);
row('remove-acting-chair','移除鄧樹遠電競代理主任','done','zh/en published','release report confirms role','requested','後續日文採學科長／准教授；不把電競合聘他人職稱一起移除。',[sourceFiles[31]]);
row('shared-three-languages','中英日共用介面與完整主網站','user-review','local built','prior321 routes; selected later deltas','pending','日文及新版指南未發布；全文母語審校、專名仍未全部核定。',[sourceFiles[1],sourceFiles[0]]);
row('guide-ui','四字標題／白話分類／三欄索引／身分／流程／FAQ','done','15 cards,47 details,30FAQ,8 categories,6 audience choices','prior9 index contexts; later6 selected smoke','pending','桌3／中2／手機1欄；標籤不是資格。使用者內容審閱與法規研究另列。',['data/students/guide.json','student-guide-model.js',sourceFiles[21],sourceFiles[22]]);
for(const c of guide.cards){const units=research.units.filter(u=>u.card_ids.includes(c.id));row('guide-'+c.id,c.title,'incomplete','summary+steps+all step_details+2FAQ present','prior selected guide DOM flow','pending','尚未完成各相關處室所有資料之調研；具體缺件見單位表，不把辦事建議冒稱現行完整規章。',units.map(u=>({unit:u.name,missing:u.missing})));}
row('faculty-core-translations','13人核心職級與助理教授／助教／TA區分','done','current role values checked','independent13 exact values','pending','個人最新聘任／九筆證照／正式學位、人事附註與電競系英文全名仍待一手來源。',[sourceFiles[28],sourceFiles[29]]);
row('translation-followup','26key／28譯值候選尚未套用','incomplete','reviewed proposals present','17 source SHA +28 pointer precheck','not required for semantic-only edits','可先處理12語意值；其餘10 office、4學制、2證名分組。見translation-candidates.json。',[sourceFiles[27],sourceFiles[28],'translation-candidates.json']);
row('full-language-review','全站英日逐句母語與正式專名','unknown','large dictionaries built','bounded independent reviews','not obtained','2310+字典覆蓋不是全文母語認證；正式機構／資格仍有待查。',[sourceFiles[29],sourceFiles[1]]);
row('font-local','保原字型、缺字與孤字末行修整','done','no font swap; selected wrapping fixed','84 game contexts; candidate stack missing0 unknown0','pending','限既有來源與本機量測；每字實際fallback及全部長文／平台未證。',[sourceFiles[10],sourceFiles[9]]);
row('navigation-wrap','導覽不要剩一字換行','done','nowrap links +early compact nav','prior27 widths/languages','pending','不是全站任何長度字串永不換行。',[sourceFiles[1]]);
row('faculty-photos','教師頭高與水平眼線','user-review','13 exact-source transforms','78 source matches; annotated geometric alignment','pending','人工標記近似，幾何誤差不是生物辨識精度；使用者尚未看圖確認。',[sourceFiles[23],sourceFiles[24]]);
row('floating-links','分流按鈕不遮老師照片','done','page flow under1900px','21 selected language/width contexts','pending','沒有刪掉各分流連結。',[sourceFiles[25],sourceFiles[1]]);
row('style-options','清爽原創小改版三案','user-review','A/B/C local comparison','36 layout +4 interactions reported','not selected','首頁學生作品方向已選；不能推論整站A案或三案已被確認。',[sourceFiles[26]]);
row('student-hero','學生作品同格首頁','user-review','3 whole posters +credits +source links','current9 contexts +2 embedded','direction confirmed; appearance pending','小favicon生成圖仍保留；未證學生製程零AI／新增改編授權。',[sourceFiles[12],sourceFiles[13]]);
row('curation-demo','單款學生作品策展示範','user-review','3 works,3 exhibition slots,keyboard/reset','current9 contexts','pending','先回收此款意見再擴大；不把整個14款素材替換當完成。',[sourceFiles[12],sourceFiles[13]]);
for(const g of games)row('game-'+g.id,g.event.zh+'｜'+g.title.zh,g.id==='labor'?'deferred':'user-review','existing local prototype',g.id==='labor'?'prior function receipt only; no current test':'current selected core3lang×2width proof','pending',g.id==='labor'?'使用者明確暫緩，不啟續接。':'玩法可試；原生成素材分批調整、真人趣味與30–90秒時長尚未確認。',[{catalog:'holiday-lab/catalog.mjs',game:g.id,module:'holiday-lab/games/'+g.id+'.mjs',date:g.date,end:g.end},sourceFiles[9]]);
row('seasonal-home-entry','節日首頁同格入口／平時回顧／點擊才載','done','14 non-Labor choices +archive','9 current lazyload contexts','pending','學生作品主格取代大CG；尚未定案每季主視覺如何輪替。',[sourceFiles[12],sourceFiles[13]]);
row('event-dates','正式開學與畢展日期','incomplete','catalog dates null','no official event dates set','not supplied','須查本系正式當期公告；不可編日期或以其他系活動套用。',['holiday-lab/catalog.mjs',sourceFiles[0]]);
row('human-fun-duration','真人試玩樂趣與30–90秒','unknown','mechanics implemented','automation is not blind playtest','not obtained','需要實際玩家與感受；工具通關不等於符合使用者預期。',[sourceFiles[1]]);
for(const id of ['flora','fat-hamster'])row('webgl-'+id,id==='flora'?'Flora WebGL':'你是一隻胖鼠 WebGL','incomplete','work orders and preflight ready','no source/no real wasm build','TF-BASE handoff selected','完整來源、產品身分、版本、模組、Build與瀏覽器實玩都尚缺；queued不是執行。',[sourceFiles[14],sourceFiles[15],sourceFiles[16],sourceFiles[17]]);
row('unity-no-dialog','不反覆跳Unity選擇器的背景方式','done','background testing instructions','preflight PS5.1/7 recorded; not game build','requested','只完成工作方式與防護，不宣稱已在TF-BASE執行。',[sourceFiles[17],sourceFiles[14]]);
row('release-preflight','本機發布技術補驗','done','current360 files','12yes0no1unknown; full UI approval false','pending','done只指已完成本次技術清單，不代表可公開發布。',[sourceFiles[13]]);
row('real-background','真實背景分頁暫停','unknown','pause/cleanup logic present','headless never met hidden=true prerequisite','not obtained','未注入假hidden；需可建立真隱藏前提的原生瀏覽器實測。',[sourceFiles[13]]);
row('physical-mobile','實體手機測試','unknown','emulated320/390 available','no actual mobile proof','not obtained','Chrome窄viewport不是iOS/Android真裝置。',[sourceFiles[0]]);
row('full-ui-contract','完整發布UI／來源／墨跡義務','incomplete','contract and partial evidence','historical2046/2076; gate false','pending','30為歷史最長動態字串證據缺口，含Labor6；不是30畫面bug，也不是整個原始用戶範圍。',[sourceFiles[7],sourceFiles[12]]);
row('current-package','最新可攜試玩檔','incomplete','historicallocal09 ZIP exists','historical unpack/HTTP proofs only','not approved for new package','最新8863尚無新ZIP；不交舊ZIP冒充新成果，完整gate與審閱分開。',[sourceFiles[1],sourceFiles[12]]);
row('dashboard','離線儀表板與權威數字','done','single-file offline dashboard','latest34 checks,11 regression,2+offline smoke reported','pending','資料／工具／使用者三層分開；不得拿歷史coverage當總完成率。',[sourceFiles[3],sourceFiles[4],sourceFiles[12]]);
row('handoff','原clone交接與狀態同步','done','latest8863 recorded','file exists+SHA recorded','not required','本機Git保存不等於跨機push備份。',[sourceFiles[0],sourceFiles[1]]);
const valid=new Set(['done','incomplete','deferred','user-review','unknown']);assert.ok(scope.every(r=>valid.has(r.status)));assert.equal(games.length,15);assert.equal(guide.cards.length,15);
const result={created_at:new Date().toISOString(),scope:'completion audit of original user requests; no product/dashboard/STATUS/C/Labor changes and no browser/Unity',sources:before,source_stable_after:before.every(r=>sha(r.file)===r.sha256),summary:{scope_rows:scope.length,by_status:Object.fromEntries([...valid].map(k=>[k,scope.filter(r=>r.status===k).length])),not_completion_percentage:true},facts:{catalog:games.map(g=>({id:g.id,title:g.title,event:g.event,date:g.date,end:g.end})),guide:{as_of:guide.as_of,publication_status:guide.publication_status,cards:guide.cards.length,steps:guide.cards.reduce((n,c)=>n+c.steps.length,0),details:guide.cards.reduce((n,c)=>n+c.step_details.length,0),faq:guide.cards.reduce((n,c)=>n+c.faq.length,0),sources:guide.sources.length,categories:guide.categories.length},research_scope:research.scope,research_units:research.units.map(u=>({name:u.name,card_ids:u.card_ids,missing:u.missing,documents_read:u.documents_read})),dashboard_sections:compactSections(dashboard),dashboard_built_sections:compactSections(current),dashboard_receipt_checks:receiptChecks,polish:{verified:polish.verified,contexts:polish.contexts,states:polish.states,screenshots:polish.screenshots,text_rows:polish.text_rows,layout_issues:polish.layout_issues,errors:polish.errors,full_project_approved:polish.full_project_approved},hero:{pass:hero.pass,site:hero.site,hero:hero.hero,release:hero.release,public_release:hero.public_release,full_project_approved:hero.full_project_approved},historical_coverage:{required:coverage.required,covered:coverage.covered,missing_count:coverage.missing_count,missing:coverage.missing},unpaired:json('docs/qa/i18n-catalog.json').unpaired,webgl_queue:json('holiday-lab/student-webgl/queued-inspection.json')},rows:scope};
assert.ok(result.source_stable_after);fs.writeFileSync(path.join(out,'scope.json'),JSON.stringify(result,null,2));
const line=`AUDIT rows${scope.length} games${games.length} guide${guide.cards.length}/steps${result.facts.guide.steps}/FAQ${result.facts.guide.faq}/sources${guide.sources.length}; sources${before.length} stable=true; dashboardReceipts${receiptChecks.filter(r=>r.matches).length}/${receiptChecks.length}; browser0 unity0 productWrites0`;
fs.writeFileSync(path.join(out,'audit-output.txt'),line+'\n');console.log(line);
