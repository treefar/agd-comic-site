import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const hash=t=>createHash('sha256').update(t).digest('hex');const heading='## 2026-10-22 最新：節日番外篇全面本機試作（驗收收尾中）';
const block=`${heading}

- 本機整合 C:/agywork/agd-holiday-prototypes，codex/holiday-prototypes；最新root提交782f3aa（另有子代理後續工作）。不push、不發布、不碰main、不刪檔，C節保護不變。
- 已擴大到15款：原8節日＋開學/畢展，再加和平紀念、清明、勞動、臺灣光復、行憲。剩餘假日官方來源見extra-plan/RESEARCH.md，不把政府行事曆當成學校停課公告。
- 新5款追加獨立DOM驗證11/11：5桌機、5手機390、行憲日文390；真實錯誤→修正→完成→3段回放→重試，console/HTTP/解碼圖無錯。第一次3筆圖片尚在解碼競態已修驗證器，同served SHA重測通過；失敗紀錄保留。extra-qa/REPORT.md。
- children音效與mid-autumn位移在原獨立分支修好再整合。renderer8b9d2a0保留audio cues/frames/textLayers；瀏覽器紅0/3→綠3/3，相關21tests pass，字幕手機至少16px。真正背景分頁仍未驗證，模擬hidden不代替真切頁。
- Node整合108/108；257候選素材、75CG及6短音效來源落地。圖片尚未使用者確認。dashboard23/23，15已建/13目前模組SHA相符的完整通關/0使用者確認；children/moon完整通關舊SHA不同，故未升格（另有針對性修正綠燈）。外框56yes/1未驗為04歷史結果，不能當最新整包已全過。
- 指南已實作3/2/1欄摘要卡、展開完整15項47步/30FAQ、6身分篩選（全部/新生/在校生/轉學生/準畢業生/畢業生）；三語×1440/900/390九組瀏覽器pass。畢業生標籤僅就業/升學查找需求，不新增服務資格。清除身分漏reset曾失敗，已修同測全通過。
- 使用者截圖要求導覽不要單字掉行：nav各項不拆字，英日1900px內提早選單；27組三語×390–2484驗證通過，日文1440/2484實拍已留。最新可看8805/.review-local-08（後續老師照片/字體調整尚未包含）。8800仍04舊整包、8804固定extraQA01；8797/8785不動。
- 缺字：首輪3語首頁127font/CDP/cmap稽核完成，fallback不等於tofu。使用者新規則：優先不換字體，用不改原意的改句避缺字；密集缺字才提相似字體，人名/系名/法規/資格專名不改。font_coverage_audit正在glyph-copy中日102狀態初批，尚未收件。
- 視覺小改版3案比較已完成，推薦A清爽漫畫（尚未選案/套全站）；redesign/style-options/index.html，36版面/4互動pass。手機CTA遮擋已在root改頁內流。使用者最新要求老師照片頭大小/眼睛水平：replay_fix改chapters-2.jsx，新增faculty-portrait模型/CSS逐人量測，執行中。
- WebGL：TF-BASE原始專案尚未取得。工單5檔同步Google Drive ClaudeShare/handoffs/20261022-student-webgl，BACKGROUND-TESTING明定固定6000.5.10f1、單次hidden批次PID/log、Chrome真實WebGL驗證，避免反覆Unity視窗。未建置成功，不重送舊fleet queue。
- 舊10款delivery/holiday-preview.zip及唯一影片仍保留；新15款delivery-v2子代理正準備參數化打包，等待照片/字體/最終freshbuild，不可把舊ZIP當新成果。
- 下一輪第一件事：回收glyph-copy與faculty-portrait實際產出，先完成使用者可感知的老師對齊/日文不拆字畫面；fresh build後更新8800與Chrome，交delivery-v2實際打包驗證，補最新共用外框/來源SHA證據，再更新dashboard與本交接。不要重跑生圖/不要啟動UnityGUI。

`;
const original='C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';const before=fs.readFileSync(original,'utf8');const c=before.match(/## C\.[\s\S]*?(?=\r?\n## )/)?.[0];if(hash(c||'')!=='95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680')throw Error('Protected C differs');
function replace(text){const start=text.indexOf(heading);if(start<0)return text+'\n'+block;const end=text.indexOf('\n## ',start+heading.length);return text.slice(0,start)+block+(end<0?'':text.slice(end+1));}
const after=replace(before);if(hash(after.match(/## C\.[\s\S]*?(?=\r?\n## )/)?.[0]||'')!==hash(c))throw Error('C mutation');fs.writeFileSync(original,after);
const memory='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md';const memo=fs.readFileSync(memory,'utf8');if(!memo.includes('source_agent: codex'))throw Error('Unexpected memory');fs.writeFileSync(memory,replace(memo));
fs.writeFileSync('holiday-lab/STATUS.md','# 全面試作進度\n\nsource_agent: codex\n\n'+block);
console.log('Original handoff first, then canonical memory and STATUS saved; protected C SHA '+hash(c)+'. No sync/push.');
