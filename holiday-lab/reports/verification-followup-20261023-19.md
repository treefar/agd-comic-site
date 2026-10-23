# 本機學生作品首頁與策展示範

source_agent: codex，2026-10-23，分支codex/hero-festival-review。

最新入口 http://127.0.0.1:8863/ ；策展示範 /holiday-lab/student-curation.html?lang=zh ；進度 /progress/ 。凍結建置 .measure-student-hero-20261023-02，360檔。

首頁完整學生海報＋署名＋作品連結，節日試作收進同格小入口；獨立策展示範使用同三作品。首頁不載節日生成插畫或生成UI背景，但既有小型favicon仍為生成播放圖示；不宣稱學生作品製作流程零AI或新增公開改編授權。

獨立v2（09-48-25-302Z）9首頁＋9示範＋2嵌入、47PNG、54次字型loaded量測通過，主控read-only及跨收據build SHA核對通過。原01手機孤尾真RED、02首次fontStatus loading被主控拒絕、測試harness真失敗均保留；最後v3測試12/12。發布前技術12yes／0no／1unknown，360檔HTTP與SHA一致；真背景hidden未取得，完整UI gate仍NO。

主報告 holiday-lab/reports/hero-release-20261023/REPORT.md ，有逐條yes／no與實際指令輸出；root/student-verification.json可重核。全部原lab283runtime與UI-polish03 byte相同，沒有改舊遊戲或勞動節。歷史2046/2076不當新版完成率，不產新ZIP。

下一輪先讓使用者看8863與單款示範，再依回饋決定分批替換；C節仍不動、不push／發布／碰main／刪檔，不開Unity或續跑舊巨量工作。儀表板更新與保全結果另見主報告最後追加。

儀表板實際重產34/34、回歸11/11、桌手機＋離線smoke通過；原39項合跑因尚未重產資料而38/39的真失敗保留，重產後受影響11項轉綠。Git index逐byte核316檔與339 staged範圍，無其他未完待辦混入。
