import fs from 'node:fs';import {createHash} from 'node:crypto';
const heading='## 2026-10-23 最新：翻譯審校與三款玩法深化（本機驗證中）';
const block=`${heading}

- 本輪有實際進展：root報告 C:/agywork/agd-holiday-prototypes/holiday-lab/reports/integration-20261023.md；原始/失敗/修正後輸出與截圖均保留，不push、不發布、不碰main、不刪檔。穩定8800仍.review-local-09，舊local09 ZIP未替換。內部.measure-layout-07 / 8819(session76777)僅供測量，非新試玩交付。
- 跨年及年獸兩款已合併：三幕意圖、不同合法創作、具體回饋、探索不扣分、保存實際輸入回放。root新06各8/8三語320/1440+keyboard/reduced通關，純測試15/16；不是學生盲測或美術確認。新生圖任務/窗口版本已回件14pure/8DOM/24次真指南查找，待窗口名稱一致性補件後整合。
- 30組FAQ全部日英逐句審完，兩批聯集30組/120字串與canonical/編譯字典一致；18FAQ續批17修正已套。4個115招生原文錯誤依正式簡章校正，保留普通科跨選例外與群類/校系限制。AdmissionDetail原漏a.content，8817真缺席→補官網紙格→8818三語可見，名額/日期/其餘既有更新由精確允許欄位基準保護。
- rendered-delta：新17FAQ+3資格段，06/8818兩寬40案例、1844逐字配對missing0/unknown0。師資13位349來源欄/698目標值審校，9修正已套(8生效、1原已正確raw同步)；07 faculty-rendered 18案例/660逐字配對missing0/unknown0、13位姓名/職級source與compiled約束不變。正式專名/學位類型未核者仍列待確認，沒有冒稱全站母語認證。
- 字幕超大/出位時完整草稿移到可讀控制紙面，沒有裁掉內容或偷偷改玩家設定；有效幾何仍保留低對比/時間試驗。作品JSON/控制區都改固定原生成紙框外包、內部捲動，原strict紅轉小批0，562/562作品字可讀。07原180ms短shot亦取得九鏡同ID實際截圖，未freeze/seek。
- layout-qa已補真實捲頁圖層檢查/內捲anchoring保持/固定無框紙面8px承載區，保留紙框原圖內框與負例。26ebb96、PHASE-REPORT及各checkpoint可回查。07十四款phase矩陣正在分款跑，semester暫跳過，不能把小批0當2076必要案例全過；官方完整gate仍RED，不能產新版ZIP。
- 最近日誌node-tests-20261023-fixed.txt為163/163；精確翻譯各固定基準測試另10/10。dashboard/out已重產，23/23權威檢查、桌淺/手機深搜尋篩選展開2/2；15模組功能通關由當前模組SHA取證，歷史外框56yes/1未驗分列，使用者確認0。儀表板不是整包完成證明。
- TF-BASE WebGL仍待原始專案/結果：2026-10-23 Drive交接夾實查只有5份工單/腳本。沒有重送舊queue、沒有啟Unity或更動遠端權限。下一輪先回收semester術語補件與矩陣真失敗，固定整合來源後補足完整UI必要案例，過官方gate才出新包；其餘新聞/作品等長文仍待翻譯續審。

`;
const handoff='C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md',original=fs.readFileSync(handoff,'utf8');
const section=t=>t.match(/## C\.[\s\S]*?(?=\r?\n## )/)?.[0],sha=t=>createHash('sha256').update(t).digest('hex');
if(!section(original)||sha(section(original))!=='95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680')throw Error('C_SECTION_CHANGED');
const repair=t=>t.replaceAll('「任何 UI 放進使用者可測試包前，都必須有可重跑的版面證據」','要求打包前強制執行 ui-layout-policy');
fs.writeFileSync(handoff,block+repair(original));if(section(fs.readFileSync(handoff,'utf8'))!==section(original))throw Error('C_SECTION_CHANGED_AFTER');
const status='holiday-lab/STATUS.md';fs.writeFileSync(status,block+repair(fs.readFileSync(status,'utf8')));
const vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md';let text=repair(fs.readFileSync(vault,'utf8')),end=text.indexOf('\n---',3)+4;text=text.replace('updated: 2026-10-22','updated: 2026-10-23');end=text.indexOf('\n---',3)+4;fs.writeFileSync(vault,text.slice(0,end)+'\n\n'+block+text.slice(end));
const index='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/05 專案索引.md';let idx=fs.readFileSync(index,'utf8');const rows=idx.split('\n'),matches=rows.map((s,i)=>s.startsWith('| 系網漫畫版 AGDComicSite |')?i:-1).filter(i=>i>=0);if(matches.length!==1)throw Error('PROJECT_INDEX_ROW_UNCLEAR');const n=matches[0],parts=rows[n].split('|');parts[3]=' 2026-10-23：正式英文main1b8322e保留；本機09/8800及舊ZIP穩定。兩款玩法深化、全30FAQ日英審校/120compiled核對、師資9修正已套；40+18明列畫面/字型新批無缺字，163Node與各DOM回歸已存。07十四款phase矩陣中、完整UI gate仍RED；新生圖術語補件/WebGL來源待回，未發布。詳LATEST_HANDOFF及專案紀錄（source_agent: codex） ';rows[n]=parts.join('|');fs.writeFileSync(index,rows.join('\n'));
console.log('HANDOFF_AND_VAULT_UPDATED; C_SHA='+sha(section(original)));
