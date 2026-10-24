# 原漫畫首頁：學生作品抽選本機試作

2026-10-24；source_agent: codex；分支 `codex/student-work-draw24`。最新本機 <http://127.0.0.1:8892/?lang=zh>，英文 `/?lang=en`，日文 `/?lang=ja`，儀表板 `/progress/`。只供本機審閱，沒有 push、發布、修改 main、刪檔或執行 C 節。

## 使用方式與成果

集中線中央保留完整、淡色的學生作品預覽。按「抽一件作品」後以350、400、500、650、800ms間隔換圖，2.7秒停格，再點海報或「看完整作品」進入該作品頁。預覽每1.8秒換圖；可暫停、立即停格、按 Escape 停格或勾靜態模式，靜態抽選直接出結果。相鄰兩次結果不同，不作機率或抽獎用途承諾。

八件皆取自現有網站：小颯的 Clip Studio Paint 得獎作品與七件2026作品成果。原圖、原姓名與指導老師逐筆保留；各語言操作翻譯，專有作品名稱與人名不另造別名。日文作品名稱保留原名。手機將抽選放主標下，桌面放中央。原版漫畫背景、集中導覽、右側快捷、中英日、在校指南與招生後／頁尾前的既有學生策展入口保持。

沒有新增或調整節日遊戲、沒有使用生成管線。僅確認本次八件圖的既有資料與位元組，不能宣稱全站素材已完成來源認證。使用者另詢問的《一揆》已辨識並留「校園冒險參考.md」，只有概念評估。

## 逐條驗收

| 可判定條件 | yes／no | 實際證據 |
| --- | --- | --- |
| 新功能具可回歸測試，抽選／停止／減動態／離屏／清理計時器正確 | yes | `node --test tests/student-work-draw.test.cjs`；green-model-r2-command.json，10 pass／0 fail，stdout含十組代表輸出，stderr空，exit0 |
| 真正重現並修正瀏覽器計時器問題 | yes | 8889實際Illegal invocation見browser-red.json；native-timer-red-command.json為9pass／1fail、exit1；改保留global receiver後上述10測試exit0。8889不得作交付版 |
| 最新建置可用 | yes | `node scripts/build.mjs --local-review --out=.measure-student-work-draw-20261024-04`；build-r4-command.json，exit0；結果app-635DGZZW.js、79檔（含三策展原件） |
| 中英日桌面1440／手機390與中文1180／1181邊界不互壓、無橫溢 | yes | 八組case-*.json，每組10個有效條件，共80yes；實際Chrome，不是實體手機驗收。手機操作可能捲至主標下的抽選區 |
| 完整海報、署名、作品名稱、目的連結正確 | yes | 六組主語言情境及兩邊界均檢；routes.json八件逐頁查作者與老師；英文、日文另實際點「看完整作品」，clicked-route-en／ja.json |
| 十次實際英文抽選均有效且不連續重複 | yes | ten-live-draws.json，10／10，靜態模式實測；另Node十組代表性隨機輸出通過 |
| 暫停／手動靜態／Enter／Escape／立即停格可用 | yes | begin-*.json、static-keyboard.json、escape-stop.json、click-stop.json；停止後timer idle |
| 實際離屏停止輪播 | yes | offscreen.json：英文1440，scrollY11776、元件bottom負值、timer idle。沒有以同輪尚未捲動的值冒充證據 |
| HTTP與原圖SHA相符，新候選沒有Console例外 | yes | `node holiday-lab/reports/student-work-draw-20261024/verify-final.cjs`；final-check-command.json exit0、stderr空；http.json 12項200與SHA；console.json只有8889歷史錯誤，8892 error0 |
| 其他最新網站資料、教師原圖、凍結遊戲及原有dirty保持 | yes | 同命令：360其他來源、320保全檔、策展三原件、八海報SHA及main refs保持；catalog-proof.json保留逐筆來源 |
| 系統層減動態／真背景分頁／閃爍量測／完整WCAG均實機通過 | no | 手動靜態及離屏有實測；模型涵蓋減動態與背景條件，但本輪未變更OS設定、未測真背景分頁、未做儀器閃爍與完整WCAG驗證 |
| 新獨立代理或全站逐頁驗收完成 | no | 本次由主控做新功能窄驗；沒有把前版代理結果升格為本版全站驗收 |
| 全站六項既有缺件已解除 | no | 完整缺字、正式處室外文、當期規章、全站素材來源、WebGL、實體手機／母語審閱限制維持 |

原始命令的完整command、cwd、stdout、stderr、exit_code都存於對應 `*-command.json`；網頁操作保存觀察值、語言、寬度及截圖。回歸測試與產品同批版控。本頁截圖僅是主控畫面檢查，審閱通過仍待使用者對話確認。

## 重啟

在 `C:/agywork/agd-holiday-prototypes` 執行：

```text
node scripts/serve-local-review.cjs --site=.measure-student-work-draw-20261024-04 --dashboard=holiday-lab/dashboard/out --port=8892
```

8889是已保留的失敗候選，8890／8891是中途候選；8888及更早版保留但不是本次最新成果。儀表板檢查結果另存dashboard-verify-command.json，交接保存及C節雜湊另存handoff-command.json；不把這些後續紀錄當功能驗證。
