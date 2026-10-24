# 學生作品海報改為漫畫頁框滿版

2026-10-24；source_agent: codex；分支codex/full-frame-posters24。本機 http://127.0.0.1:8894/?lang=zh ，英日改lang=en／ja，儀表板/progress/。沒有push、發布、main修改、刪檔或C節執行。

海報改為整個「畫出來，動起來」頁框的背景，標題、招生操作、抽選與署名在前景，手機也是同一頁框滿版。使用CSS cover按框比例裁切顯示，原檔八件SHA保持；不是另畫、修圖或改作品原件。「看完整作品」與停格後的背景連結均保留。

產品只改student-work-draw.jsx／css，抽選模型、目錄、人名、翻譯、其他網站與頁底學生策展保持。所有節日繼續凍結，沒有啟Unity或生成素材。

| 條件 | yes/no | 實際證據 |
| --- | --- | --- |
| 修前確實不是滿版 | yes | browser-red.json：頁框1221×565，海報約230×164，fullFrame=false |
| 三語桌面1440／手機390海報與頁框四邊一致 | yes | verified-*.json，六組14條共84yes，幾何差小於1px、cover、圖已載入 |
| 標題、原招生按鈕、資訊帶與重點泡泡互不遮擋／無橫溢 | yes | 同六組量測與full-*.png；保留原漫畫前景 |
| 重複抽選仍減速停格 | yes | 第一候選觀察目標div轉a會卸載，repeat-red.json第二次直接settled；改觀察穩定swd-surface，repeat-green.json為drawing，repeat-result.json停格且不同結果。8893是中途失敗候選，不作最新成果 |
| 靜態／Enter／作品連結／離屏暫停及回頂恢復 | yes | static.json、route-r2.json（初次route.json網址正確但文字仍Loading；複驗載入後作者正確，原false保留）、offscreen.json、resume.json |
| 模型回歸通過 | yes | node --test tests/student-work-draw.test.cjs；model-r2-command.json，10pass／0fail、stderr空、exit0。不是以模型測試取代新DOM／觀察器的實際檢查 |
| 最新建置與HTTP正常 | yes | node scripts/build.mjs --local-review --out=.measure-full-frame-posters-20261024-02；build-r2-command.json exit0；app-3RVTPKHI.js、79檔，HTTP12項200與SHA相符 |
| 八海報原檔、目錄與原署名、原四dirty＋R0及凍結檔保持 | yes | 本finalize.cjs與finalize-r2-command.json（初次彙整因Loading快照exit1，補讀後exit0），1680其他SHA來源／320保全檔／策展三檔保持 |
| 最新8894沒有Console例外 | yes | console.json，只按8894來源核，歷史8889失敗不冒充新錯誤或刪除 |
| 新獨立代理、真手機、全站六項缺件及完整WCAG已通過 | no | 本次只做主控排版與互動窄驗，原限制維持，沒有升格為全站通過 |

每份*-command.json保存實際command、cwd、stdout、stderr、exit_code。桌面／手機截圖含實際操作後捲動位置，不把它們都說成首屏；最終開給使用者的首頁另回scrollY0。新儀表板與交接保存有各自的原始命令收據。

重啟：node scripts/serve-local-review.cjs --site=.measure-full-frame-posters-20261024-02 --dashboard=holiday-lab/dashboard/out --port=8894
