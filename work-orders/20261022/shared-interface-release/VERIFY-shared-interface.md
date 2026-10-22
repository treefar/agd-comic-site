# 英文共用介面發布驗收

日期：2026-10-22。公開站：https://treefar.link/agd-comic-site/?lang=en 。

發布提交 `1b8322e69d84549db220d849afb1aac0fb9d7c2a`，分支 `codex/en-shared-interface`，基底為當時正式站 `56b61b92f595ba503924dbd7b81d5b94a511dd6c`。依本次對話授權，以一般 fast-forward 推上 main；未合併遊戲分支。

## 逐項驗收

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 中英文使用同一套首頁、詳情元件與路由 | yes | `release/results.json`：96 條桌機路由中英 DOM tag/id/class 相同；另含 10 條手機路由，共 212 組 |
| 保留正式站中文資料與樣式 | yes | `node --test tests/en-release.test.cjs tests/shared-language.test.cjs`：8/8；逐檔核對基底中文 JSON SHA-256、原樣式前綴與圖片存在 |
| 新聞、師資、實驗室、作品、招生、影片、戰績詳情保留 | yes | 共用 canonical 資料，不再限制英文新聞前 10 筆或論文前 5 筆；所有 96 條路由實際載入 |
| 導覽、頁尾、按鈕與可及性標籤翻譯 | yes | 導覽 News、頁尾 CONTACT、手機選單、語言切換、作品分類；`final-labels/results.json` 28 組複驗通過 |
| 近期招生名額與作品資訊保留 | yes | 英文名額 46、6 學年 129 件、實習累計 22 人、2011–2026 共 16 年、130+ 件；新增回歸檢查，修正《癒光之音》為遊戲及從聘副教授職級 |
| 測驗、分享與招生導引可操作 | yes | `final-labels/actions.json`：10 組測驗、10 組導引；分享以 mock 攔截，英文文字與英文網址正確，未實際發送 |
| 建置與靜態內容檢查 | yes | `npm run build`、`npm run check:report`；8 個章節、6369 字、head 一致；見 build.log/check.log |
| GitHub Pages 發布成功 | yes | run `39743799524`，build、deploy 均 success；見 deployment.json |
| 線上版本等於驗證建置 | yes | `live-delivery.json`：HTTP200、`app-7MF5K2G6.js` bytes 相同；SHA-256 `f966a21d967755d4656860cc99cbe55135ff473c0ee6d0bb06fc3498512f7c78` |
| 線上中英桌機與手機檢查 | yes | `live/results.json`：首頁、師資、作品集、甄選招生，共 16 組，0 JS／站內 HTTP 錯誤、無頁面水平溢位；語言切換與舊英文入口亦通過 |
| 遊戲未發布 | yes | dist 無 play/ 或 data/play.json；線上兩項資源均 HTTP404；測試驗證無試玩連結 |
| 本次未刪除來源檔案 | yes | git-changes.txt 無 D；建置工具照原流程重產生成目錄 |
| 真手機驗收 | no | 使用 Chromium 390×844 模擬，未操作實體手機 |
| 所有專名英文逐筆重新官方查證 | no | 沿用已有翻譯及來源；人名、片名部分保留中英對照，不能將字典覆蓋率視為專名查證 |
| 在校指南已公開 | no | 依使用者要求另交審閱稿；14 卡、34 來源、八分類、七快捷，48 項工具檢查通過，仍待主任確認 |

## 實際指令輸出摘要

```text
npm run build
Translations: 1838 Static candidates: 13 Unpaired paths: 21
[build] 完成：dist/index.html 128.9 KB、app-7MF5K2G6.js 630.4 KB

node --test tests/en-release.test.cjs tests/shared-language.test.cjs
tests 8 / pass 8 / fail 0

npm run check:report
[check] 通過：8 個章節、6369 字、head 標記一致、bundle app-7MF5K2G6.js

node scripts/shared-language-smoke.cjs
PASS 212 page/viewport/language checks; missing fragments 102

# 最後只修正翻譯資料後，對受影響頁面再跑桌機與手機
QA_ONLY=#/works/all,#/parents/guide,#/guide/start,#/quiz/start,#/admission/selection,#/stats/international,#/stats/honors
PASS 28 page/viewport/language checks; missing fragments 40

node scripts/shared-language-actions.cjs
PASS: 10 quiz results, mocked English share, 10 admissions outcomes; errors=0

git push origin HEAD:main
56b61b9..1b8322e HEAD -> main

gh run watch 39743799524 --repo treefar/agd-comic-site --interval 10 --exit-status
build success; deploy success

QA_URL=https://treefar.link/agd-comic-site/
QA_ONLY=#hero,#/faculty/tengshuyuan,#/works/all,#/admission/selection
PASS 16 page/viewport/language checks; missing fragments 37
```

`missing fragments` 是「沒有整句字典、改走片語組合」的原文清單，不等於未翻譯字數；例如「播放＋片名」「年份＋作品類型」。完整 canonical 資料的字典缺漏為 0。13 個靜態候選是來源中的中文網址、mailto 等字串；21 個未配對位置由人工字典補齊新增年份內容。人名與片名可能保留中文對照。

212 組全站檢查針對共用程式版本；最後修正字典及同義英文 JSON 後，重跑 8 項回歸、28 組受影響頁面、20 組操作與 16 組正式站檢查。沒有把前一次全站結果冒充最後一次全站重跑。既有 duplicate color 建置警告保留。

測試所用 Playwright：`PLAYWRIGHT_MODULE=C:/agywork/agd-site-codex/node_modules/playwright`。QA_OUTPUT 指向本報告同層各子目錄。建置與測試執行目錄 `C:/agywork/agd-en-publish`；完整逐頁結果與命令輸出均附在本資料夾。
