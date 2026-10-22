import fs from 'node:fs';import {createHash} from 'node:crypto';
const hash=t=>createHash('sha256').update(t).digest('hex'),heading='## 2026-10-22 最新：節日番外篇全面本機試作（驗收收尾中）';
const block=`${heading}

- 本輪可直接審閱：Chrome已保留 http://127.0.0.1:8800/?lang=zh#hero；伺服器session8730、來源.review-local-09（356檔）。中英日首頁、15款遊戲、新版指南、師資對齊與12筆P1譯文均在本機，不push、不發布、不碰main、不刪檔。8797/8785未動。原remote/main仍1b8322e；此clone沒有本地main分支。
- 最新試玩包 holiday-lab/delivery-v2/.outputs/local09-01/holiday-preview-v2.zip，40,584,255 bytes；SHA256 7d7a9e65f6e8c80c21fec75fc934d866ff71f0a6ffa1f1ccd3c33433ead495e8。解壓後Start-Preview.cmd，Node18+，不用Unity；遊戲素材隨包，部分官網照片/字型/處室連結需網路。366解壓逐檔SHA＋356 HTTP200/bodySHA、啟停/缺Node/占埠/重用與9組指南全pass；REPORT.md及原始輸出均留存。05與舊10款ZIP保留不當最新。
- 15款：原8節日＋開學/畢展，追加和平紀念、清明、勞動、臺灣光復、行憲。additional_holidays獨立分支完成5款，extra-qa桌機/390/日文代表11/11；原10款本輪12組首測11/12，唯一英文390仍期待10入口（實際15）是測試舊預期，修後單獨1/1pass，原始歷程保留。dashboard按成功case＋當輪模組SHA核對15/15，而非假造同一輪全狀態驗證。23/23 dashboard authority pass；外框56yes/1未驗仍是04歷史結果。
- Children材質音效/月光位移回放已在原分支修正；renderer支援audio/frames/textLayers，針對性瀏覽器紅0/3→綠3/3，手機字幕至少16px。257候選圖/75CG/6短音效來源完整；美術尚未使用者確認。
- 師資：13張原圖逐人標冠頂/下巴/眼中點，CSS等比縮放與裁切，66%頭高/50%眼線；13條原照1024×2純背景技術裁切伸展補邊，無改臉/重繪/重複人像。6組三語桌機/手機、78原照SHA/完整性、13位窗寬/投影頭高一致通過；不是生物辨識精度。完整報告/紅燈修法/座標/原始及派生SHA、桌手機拼版在reports/faculty-portrait。
- 真Chrome又發現1264px快捷4鈕遮第四位臉，root把<=1900px改頁內流，全部連結保留；21組三語×7寬零照片重疊。09與05逐檔比較僅styles.css變、355檔相同，app/語系/照片/字體鏈完全相同，無需重跑全部遊戲。reports/local09-delta.json及floating-cta-result.json。
- 指南3/2/1欄摘要＋展開完整15項47說明/30FAQ；全部/新生/在校生/轉學生/準畢業生/畢業生6身分，標籤僅查找需求非申請資格。9組三語/尺寸/身分/完整說明pass。導覽各項不拆字、英日空間不足提早選單，27組390–2484 pass。
- 字型：font_coverage_audit首批105狀態/1462種漢字假名/77608配對cmap有據，missing0/unknown0；沒有為改而改。使用者原則：先保留字型，真缺字一般說明優先等義換句，密集缺字才考慮相似字型，專名/人名/法規不改。後續個別詳頁/通關後文案/全手機跨平台尚未驗。新12筆譯文3頁/272字元配對含英文標點亦pass；03→05字典/字體鏈一致，05→09僅CTA CSS，證據可沿用。redesign/glyph-copy及post-translation報告。
- 日英translation_review獨立分支首批24決策：2保留/21建議/1待官方；根據日本JST與本系官方職級保留助理教授→助教、副教授→准教授，不誤為助手或舊助教授。已套12筆P1（合聘/從聘、留職停薪、英文請假/休學、日文註冊課務組及技優班），12資料＋12生成map＋3保留條件逐筆pass；8/8是審校前快照驗證，之後7/1快照漂移不能拿來當現產品判定，verify-applied.mjs才是套後檢查。全文2310長篇未逐句母語審校，9筆P2建議及甄選正式用詞仍待處理。
- 小改版3案研究與可操作比較稿已完成：redesign/style-options/index.html，36版面＋4互動pass，推薦A清爽漫畫；尚未經使用者選案，不擅套整站。僅已授權的索引/不拆字/遮擋/照片修改已整合。
- 最終Node113/113、UI素材政策257/9 pass，Build exit0；保留既有duplicate color警告2筆。reports/final-node-tests.txt、integration-guide.md及各子報告有逐條yes/no。舊delivery唯一影片保留（38.56s開場展示，預設靜音），沒有新造BGM或多交影片。
- WebGL仍未完成：TF-BASE原始專案/執行結果未到，Drive交接資料夾實查仍只有5份工單/腳本，不能把排隊當Build成功。使用者選TF-BASE開Codex，固定6000.5.10f1、單次hidden batch/PID/log、Chrome WebGL驗證，避免反覆Unity選擇視窗；不自行改權限或重送舊fleet queue。
- 待驗/待審：真背景分頁（模擬hidden不能代替）、實體手機、真人盲測樂趣/時長、母語逐句、使用者候選美術/照片/改版選案、學校開學畢展日期。下一輪第一件事：先交主任看09首頁/試玩包與老師/日文畫面，回收具體意見；回查TF-BASE工單回報，有真正Unity來源才做WebGL。對未改runtime不重跑生圖/15遊戲；可接translation_review的P2精確建議與剩餘字型詳頁批次，維持本機審閱。

`;
const original='C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';const old=fs.readFileSync(original,'utf8'),c=old.match(/## C\.[\s\S]*?(?=\r?\n## )/)?.[0];if(hash(c||'')!=='95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680')throw Error('C baseline differs');
const replace=s=>{const start=s.indexOf(heading);if(start<0)throw Error('Current checkpoint missing');const end=s.indexOf('\n## ',start+heading.length);return s.slice(0,start)+block+(end<0?'':s.slice(end+1));};const updated=replace(old);if(hash(updated.match(/## C\.[\s\S]*?(?=\r?\n## )/)?.[0]||'')!==hash(c))throw Error('C changed');fs.writeFileSync(original,updated);
const vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶';const memory=vault+'/專案紀錄/系網漫畫版_AGDComicSite.md';fs.writeFileSync(memory,replace(fs.readFileSync(memory,'utf8')));fs.writeFileSync('holiday-lab/STATUS.md','# 全面試作進度\n\nsource_agent: codex\n\n'+block);
const index=vault+'/05 專案索引.md';let text=fs.readFileSync(index,'utf8');text=text.replace(/^(\| 系網漫畫版 AGDComicSite \|[^\r\n]*? \| )[^\r\n]*$/m,'$12026-10-22：正式英文main1b8322e保留；本機09/8800整合15試作、指南3/2/1＋身分、13師資照對齊、12筆P1日英翻譯。113Node/15模組通關/9指南/27nav/21遮擋pass；ZIP40.6MB及逐檔SHA啟停驗證完成，未發布。TF-BASE WebGL待來源；P2/母語/候選美術及改版選案待審。詳LATEST_HANDOFF與專案紀錄（source_agent: codex） |');fs.writeFileSync(index,text);
console.log('Original handoff, canonical memory, STATUS and project index updated. C SHA '+hash(c)+'; no sync/push.');
